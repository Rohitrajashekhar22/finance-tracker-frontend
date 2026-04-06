import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transactionAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const { isAdmin, isAnalyst, role } = useAuth();
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

    fetchTransactions();
  }, [navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await transactionAPI.getAll();
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionAPI.delete(id);
      setTransactions(transactions.filter((t) => t._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction");
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/add?edit=${id}`);
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
          {(isAnalyst || isAdmin) && (
            <button
              onClick={() => navigate("/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              + Add Transaction
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Transactions Grid */}
        {transactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((txn) => (
              <div
                key={txn._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-t-4 border-blue-500"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-1">
                      {txn.userId?.name || txn.userId?.email || "Unknown user"}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">
                      {txn.category}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(txn.date)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      txn.type === "income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {txn.type.toUpperCase()}
                  </span>
                </div>

                {/* Amount */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <span
                    className={`text-2xl font-bold ${
                      txn.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.type === "income" ? "+" : "-"}₹
                    {txn.amount?.toFixed(2) || "0.00"}
                  </span>
                </div>

                {/* Note */}
                {txn.note && (
                  <p className="text-sm text-gray-600 mb-4 italic">
                    "{txn.note}"
                  </p>
                )}

                {/* Actions */}
                {isAdmin && (
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => handleEdit(txn._id)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                    {deleteConfirm === txn._id ? (
                      <>
                        <button
                          onClick={() => handleDelete(txn._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(txn._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">📭 No transactions found</p>
            {(role === "analyst" || role === "admin") && (
              <button
                onClick={() => navigate("/add")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Create Your First Transaction
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
