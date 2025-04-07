"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth, db } from "../utils/firebase";

export default function MySubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [stoppingSubscription, setStoppingSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      // Fetch subscriptions for the current user
      const user = auth.currentUser;
      if (!user) return;

      const subscriptionsQuery = query(
        // Query subscriptions for the current user
        collection(db, "subscriptions"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(subscriptionsQuery);

      const fetchedSubscriptions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubscriptions(fetchedSubscriptions);
      setLoading(false);
    };

    fetchSubscriptions();
  }, []);

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
  };

  const handleStop = (subscription) => {
    setStoppingSubscription(subscription);
  };

  const handleSaveChanges = async (updatedSubscription) => {
    // Save changes to the subscription
    try {
      await updateDoc(
        // Update the subscription in Firestore
        doc(db, "subscriptions", updatedSubscription.id),
        updatedSubscription
      );
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === updatedSubscription.id ? updatedSubscription : sub
        )
      );
      setEditingSubscription(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleCancelSubscription = async () => {
    // Cancel the subscription
    if (stoppingSubscription) {
      try {
        await deleteDoc(doc(db, "subscriptions", stoppingSubscription.id)); // Delete the subscription from Firestore
        setSubscriptions((prev) =>
          prev.filter((sub) => sub.id !== stoppingSubscription.id)
        );
        setStoppingSubscription(null);
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Subscriptions
        </h1>
        <p className="text-gray-600 mb-8">Manage your active meal plans</p>

        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200">
            <div className="text-gray-400 mb-4 text-5xl">🍽️</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No active subscriptions
            </h3>
            <p className="text-gray-500">
              You don't have any active meal subscriptions yet
            </p>
          </div>
        ) : editingSubscription ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Subscription
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChanges(editingSubscription);
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Form fields with premium styling */}
              {[
                {
                  label: "Subscription Type",
                  name: "subscriptionType",
                  type: "text",
                },
                { label: "Start Date", name: "startDate", type: "date" },
                {
                  label: "Meal Preferences",
                  name: "mealPreferences",
                  type: "text",
                },
                { label: "Address", name: "addressLine1", type: "text" },
                { label: "City", name: "city", type: "text" },
                { label: "Neighborhood", name: "cityQuarter", type: "text" },
                { label: "Province", name: "province", type: "text" },
                { label: "Postal Code", name: "zipcode", type: "text" },
                { label: "Your Name", name: "userName", type: "text" },
                { label: "Phone Number", name: "userPhone", type: "text" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={editingSubscription[field.name] || ""}
                    onChange={(e) =>
                      setEditingSubscription({
                        ...editingSubscription,
                        [field.name]: e.target.value,
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              ))}

              <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingSubscription(null)}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : stoppingSubscription ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cancel Subscription
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">
                <strong>Important:</strong> Are you sure you want to cancel this
                subscription?
              </p>
              <p className="text-red-700 mt-1">
                This action cannot be undone, and no refunds will be issued for
                the current billing cycle.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-800 mb-2">
                Subscription Details
              </h3>
              <p>
                <span className="text-gray-600">Type:</span>{" "}
                {stoppingSubscription.subscriptionType}
              </p>
              <p>
                <span className="text-gray-600">Start Date:</span>{" "}
                {stoppingSubscription.startDate}
              </p>
              <p>
                <span className="text-gray-600">End Date:</span>{" "}
                {stoppingSubscription.endDate}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setStoppingSubscription(null)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            subscription.subscriptionType === "Weekly"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        ></span>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {subscription.subscriptionType} Plan
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="font-medium">
                            {subscription.startDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="font-medium">{subscription.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Meals</p>
                          <p className="font-medium">
                            {subscription.subscriptionType === "Weekly"
                              ? "5 + 1 FREE"
                              : "20 + 4 FREE"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="font-medium text-green-600">Active</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStop(subscription)}
                        className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Delivery to:</span>{" "}
                    {subscription.addressLine1}, {subscription.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
