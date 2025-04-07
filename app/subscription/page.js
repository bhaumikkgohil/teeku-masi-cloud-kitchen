"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function SubscriptionPage() {
  const [subscriptionType, setSubscriptionType] = useState("");
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubscription = async () => {
    if (!subscriptionType) {
      setError("Please select a subscription type");
      return;
    }

    const subscriptionPrice = subscriptionType === "Weekly" ? 70 : 240;
    setPrice(subscriptionPrice);

    sessionStorage.setItem("subscriptionType", subscriptionType);
    sessionStorage.setItem("price", subscriptionPrice);

    router.push("/order-details");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex flex-col items-center px-6 py-12"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12 max-w-2xl"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Elevate Your Meals
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Fresh, homemade tiffins delivered to your door
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            🎉 Saturday meals are on us!
          </div>
        </motion.div>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Weekly Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="radio"
              name="subscription"
              id="weekly"
              value="Weekly"
              checked={subscriptionType === "Weekly"}
              onChange={(e) => {
                setSubscriptionType(e.target.value);
                setError(null);
              }}
              className="hidden"
            />
            <motion.label
              htmlFor="weekly"
              whileHover={{ y: -5 }}
              className={`block h-full cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all ${
                subscriptionType === "Weekly"
                  ? "ring-4 ring-green-500 ring-opacity-50"
                  : "hover:shadow-xl"
              }`}
            >
              <div className="bg-white h-full flex flex-col">
                <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white">
                  <h3 className="text-2xl font-bold">Weekly Plan</h3>
                  <p className="opacity-90">Perfect for trying us out</p>
                </div>

                <div className="p-6 flex-grow">
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      $70
                    </span>
                    <span className="text-gray-500 ml-2">/week</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>5 weekday meals</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>+1 FREE Saturday meal</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Flexible weekly menu</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Pause or cancel anytime</span>
                    </li>
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <div
                    className={`text-center py-2 rounded-lg font-medium ${
                      subscriptionType === "Weekly"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {subscriptionType === "Weekly" ? "Selected" : "Select Plan"}
                  </div>
                </div>
              </div>
            </motion.label>
          </motion.div>

          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="radio"
              name="subscription"
              id="monthly"
              value="Monthly"
              checked={subscriptionType === "Monthly"}
              onChange={(e) => {
                setSubscriptionType(e.target.value);
                setError(null);
              }}
              className="hidden"
            />
            <motion.label
              htmlFor="monthly"
              whileHover={{ y: -5 }}
              className={`block h-full cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all ${
                subscriptionType === "Monthly"
                  ? "ring-4 ring-green-500 ring-opacity-50"
                  : "hover:shadow-xl"
              }`}
            >
              <div className="bg-white h-full flex flex-col">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">Monthly Plan</h3>
                      <p className="opacity-90">Best value</p>
                    </div>
                    <span className="bg-white text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow">
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      $240
                    </span>
                    <span className="text-gray-500 ml-2">/month</span>
                    <span className="text-sm text-green-600 ml-3 font-medium">
                      (Save $40)
                    </span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>20 weekday meals</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>+4 FREE Saturday meals</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Priority menu requests</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Free delivery</span>
                    </li>
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <div
                    className={`text-center py-2 rounded-lg font-medium ${
                      subscriptionType === "Monthly"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {subscriptionType === "Monthly"
                      ? "Selected"
                      : "Select Plan"}
                  </div>
                </div>
              </div>
            </motion.label>
          </motion.div>
        </div>

        {/* Error and Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleSubscription}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Continue to Payment
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}
