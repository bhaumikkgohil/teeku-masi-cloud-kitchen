"use client";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth, db } from "../utils/firebase";

const STATUS_OPTIONS = [
  "Order Placed",
  "Preparing",
  "Packing",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [customStatus, setCustomStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAdminAndFetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/admin-login");
          return;
        }

        // Verify admin status
        const adminQuery = query(
          collection(db, "admins"),
          where("email", "==", user.email)
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (adminSnapshot.empty) {
          setError("Admin privileges required");
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // Query all orders sorted by date (newest first)
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);
        const allOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || null,
          updatedAt: doc.data().updatedAt?.toDate() || null,
        }));

        setOrders(allOrders);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAndFetchOrders();
  }, [router]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "order placed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "packing":
        return "bg-orange-100 text-orange-800";
      case "dispatched":
        return "bg-purple-100 text-purple-800";
      case "out for delivery":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (!isAdmin) {
        setError("Admin privileges required");
        return;
      }

      if (!newStatus) {
        setError("Please select a valid status");
        return;
      }

      // Update in Firestore
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date(),
              }
            : order
        )
      );

      setEditingStatus(null);
      setCustomStatus("");
      setError(null);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update order status");
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const goToAdminDashboard = () => {
    router.push("/admin-dashboard");
  };

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-red-500">
              Access Denied
            </h1>
            <p className="text-lg mb-6">
              You need admin privileges to access this page.
            </p>
            <button
              onClick={goToAdminDashboard}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Orders...</h1>
            <p className="text-lg">Please wait while we fetch all orders.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
            <p className="text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Orders</h1>
            <button
              onClick={goToAdminDashboard}
              className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Admin Dashboard
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No Orders Found</h2>
              <p className="text-gray-600">There are no orders to display.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg shadow-sm overflow-hidden"
                >
                  <div
                    className="bg-gray-50 p-4 border-b flex justify-between items-center cursor-pointer"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div>
                      <h3 className="font-semibold">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)} •{" "}
                        {order.customerDetails?.firstName}{" "}
                        {order.customerDetails?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold">
                        ${order.total?.toFixed(2)}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform ${
                          expandedOrder === order.id ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="mb-6">
                          <h4 className="font-medium mb-3 text-lg border-b pb-2">
                            Customer Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Name</p>
                              <p className="font-medium">
                                {order.customerDetails?.firstName}{" "}
                                {order.customerDetails?.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">
                                {order.customerDetails?.contact?.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">
                                {order.customerDetails?.contact?.email}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-600">Address</p>
                              <p className="font-medium">
                                {order.customerDetails?.address?.line1}
                                {order.customerDetails?.address?.line2 && (
                                  <>, {order.customerDetails?.address?.line2}</>
                                )}
                                <br />
                                {order.customerDetails?.address?.city},{" "}
                                {order.customerDetails?.address?.zipcode}
                              </p>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-medium mb-3 text-lg border-b pb-2">
                          Order Items
                        </h4>
                        <ul className="space-y-3">
                          {order.items?.map((item) => (
                            <li key={item.id} className="flex justify-between">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-600 text-sm ml-2">
                                  x{item.quantity}
                                </span>
                              </div>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-l pl-6">
                        <div className="mb-6">
                          <h4 className="font-medium mb-3 text-lg border-b pb-2">
                            Order Summary
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${order.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax (5%):</span>
                              <span>${order.tax?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                              <span>Total:</span>
                              <span>${order.total?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 text-lg border-b pb-2">
                            Update Status
                          </h4>
                          {editingStatus === order.id ? (
                            <div className="space-y-3">
                              <select
                                className="w-full p-2 border rounded-md"
                                value={customStatus}
                                onChange={(e) =>
                                  setCustomStatus(e.target.value)
                                }
                              >
                                <option value="">Select status</option>
                                {STATUS_OPTIONS.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleStatusChange(order.id, customStatus)
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                  disabled={!customStatus}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingStatus(null);
                                    setCustomStatus("");
                                  }}
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-4">
                              <span
                                className={`px-3 py-1 rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingStatus(order.id);
                                  setCustomStatus(order.status);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
                              >
                                Change
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
