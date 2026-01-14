import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { adminAPI, type Transaction } from "../lib/api";
import { ListTodo } from "lucide-react";

export function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "completed" | "failed">(
    "pending"
  );

  useEffect(() => {
    if (profile && !(profile as any).isAdmin) {
      navigate("/dashboard");
    }
  }, [profile, navigate]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getWithdrawals({ status: filter });
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this withdrawal?")) return;
    try {
      await adminAPI.approveWithdrawal(id);
      await fetchWithdrawals();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to approve withdrawal");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason (optional):");
    if (reason === null) return;
    try {
      await adminAPI.rejectWithdrawal(id, reason);
      await fetchWithdrawals();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to reject withdrawal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <div className="mb-6 flex gap-4">
          <Link
            to="/admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
          >
            Withdrawals
          </Link>
          <Link
            to="/admin/tasks"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center gap-2"
          >
            <ListTodo className="h-4 w-4" />
            Task Management
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Withdrawal Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage withdrawal requests
            </p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-md ${
                  filter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-md ${
                  filter === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("failed")}
                className={`px-4 py-2 rounded-md ${
                  filter === "failed"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Failed
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No {filter} withdrawals found
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {filter === "pending" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id as string}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(withdrawal.user as any)?.email ||
                          (withdrawal.user as any)?._id ||
                          withdrawal.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {withdrawal.withdrawalDetails?.method || "upi"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          Account:{" "}
                          {withdrawal.withdrawalDetails?.account || "N/A"}
                        </div>
                        {withdrawal.withdrawalDetails?.transactionId && (
                          <div>
                            Txn: {withdrawal.withdrawalDetails.transactionId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {withdrawal.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{withdrawal.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          withdrawal.createdAt as string
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            withdrawal.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : withdrawal.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                        {(withdrawal as any).rejectionReason && (
                          <div className="text-xs text-red-600 mt-1">
                            {(withdrawal as any).rejectionReason}
                          </div>
                        )}
                      </td>
                      {filter === "pending" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleApprove(withdrawal._id!)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal._id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
