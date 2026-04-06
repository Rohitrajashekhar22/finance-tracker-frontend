import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI, transactionAPI } from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formatDate = (value) => {
    const date = new Date(value);
    return isNaN(date) ? "No date" : date.toLocaleDateString();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, transactionsRes] = await Promise.all([
          dashboardAPI.getSummary(),
          transactionAPI.getAll(),
        ]);

        setSummary(summaryRes.data);
        // Get last 5 transactions
        setRecentTransactions(
          (transactionsRes.data.transactions || []).slice(0, 5)
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Income */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
            <p className="text-green-700 text-sm font-medium mb-3">
              Total Income
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">
                ₹ {summary?.totalIncome?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {/* Total Expense */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition">
            <p className="text-red-700 text-sm font-medium mb-3">
              Total Expense
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-red-600">
                ₹ {summary?.totalExpense?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
            <p className="text-blue-700 text-sm font-medium mb-3">Balance</p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold ${
                  (summary?.balance || 0) >= 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                ₹ {summary?.balance?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h2>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn) => (
                    <tr key={txn._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {txn.userId?.name || txn.userId?.email || "Unknown user"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {txn.category}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            txn.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span
                          className={
                            txn.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {txn.type === "income" ? "+" : "-"}
                          ₹{txn.amount?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(txn.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
