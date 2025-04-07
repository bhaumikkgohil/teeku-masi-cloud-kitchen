"use client";
import { doc, getDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <OrderConfirmation />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-6 max-w-4xl mx-auto w-full animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const docRef = doc(db, "subscriptions", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = docSnap.data();
          setOrder(orderData);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6 max-w-4xl mx-auto w-full"
      >
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Order Confirmed!
              </h1>
              <p className="text-xl text-gray-600">
                Thank you for choosing Teeku Masi's Tiffin Service
              </p>
              <p className="text-gray-500 mt-2">Order ID: {orderId}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Order Summary
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subscription Type:</span>
                <span className="font-medium">{order.subscriptionType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-green-600">
                  CAD ${order.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%):</span>
                <span className="font-medium">
                  CAD ${(order.price * 0.05).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg border-t pt-4 mt-4">
                <span className="font-semibold">Amount Paid:</span>
                <span className="font-bold text-green-600">
                  CAD ${(order.price * 1.05).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              Delivery Information
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Delivery Address
                </h3>
                <p className="font-medium">{order.addressLine1}</p>
                <p className="text-gray-600">
                  {order.city}, {order.province} {order.zipcode}
                </p>
                <p className="text-gray-600">{order.cityQuarter}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Delivery Schedule
                </h3>
                <p className="font-medium">
                  {order.subscriptionType === "Weekly"
                    ? "5 weekdays + 1 FREE Saturday"
                    : "20 weekdays + 4 FREE Saturdays"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Start Date
                  </h3>
                  <p className="font-medium">{order.startDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    End Date
                  </h3>
                  <p className="font-medium">{order.endDate}</p>
                </div>
              </div>

              {order.mealPreferences && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Meal Preferences
                  </h3>
                  <p className="font-medium">{order.mealPreferences}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-green-50 rounded-xl p-6 inline-block">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What's Next?
            </h3>
            <p className="text-gray-600 mb-4">
              You'll receive a confirmation email with your order details
              shortly.
            </p>
            <p className="text-gray-600">
              Our team will contact you to confirm your delivery schedule.
            </p>
          </div>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}
