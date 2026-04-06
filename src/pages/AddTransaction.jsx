import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { transactionAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { role, isAdmin, isAnalyst, isViewer, isAuthenticated } = useAuth();

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Other Income"],
    expense: [
      "Food",
      "Transport",
      "Entertainment",
      "Utilities",
      "Shopping",
      "Health",
      "Education",
      "Other Expense",
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!["admin", "analyst"].includes(role)) {
      navigate("/");
      return;
    }

    if (editId && !isAdmin) {
      navigate("/transactions");
      return;
    }

    if (editId) {
      // Load existing transaction for editing
      const fetchTransaction = async () => {
        try {
          setLoading(true);
          const response = await transactionAPI.getAll();
          const transaction = response.data.transactions.find(
            (t) => t._id === editId
          );
          if (transaction) {
            setFormData({
              amount: transaction.amount,
              type: transaction.type,
              category: transaction.category,
              date: new Date(transaction.date).toISOString().split("T")[0],
              note: transaction.note || "",
            });
          }
        } catch (err) {
          setError("Failed to load transaction");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [editId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));

    // Reset category when type changes
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.amount || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        // Update existing transaction
        await transactionAPI.update(editId, formData);
        setSuccess("Transaction updated successfully!");
      } else {
        // Create new transaction
        await transactionAPI.create(formData);
        setSuccess("Transaction added successfully!");
      }

      setTimeout(() => {
        navigate("/transactions");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {editId ? "Edit Transaction" : "Add New Transaction"}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="0.00"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Select a category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Add any additional details..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? "Saving..." : editId ? "Update" : "Add"} Transaction
              </button>
              <button
                type="button"
                onClick={() => navigate("/transactions")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
