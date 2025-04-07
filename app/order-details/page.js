"use client";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { addDoc, collection, db } from "../utils/firebase";

export default function OrderDetailsPage() {
  const [subscriptionType, setSubscriptionType] = useState("");
  const [price, setPrice] = useState(0);
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [mealPreferences, setMealPreferences] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [cityQuarter, setCityQuarter] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const router = useRouter();

  // Function to validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!userName) newErrors.userName = "Name is required";
    if (!userPhone) newErrors.userPhone = "Phone number is required";
    if (!addressLine1) newErrors.addressLine1 = "Address Line 1 is required";
    if (!city) newErrors.city = "City is required";
    if (!province) newErrors.province = "Province is required";
    if (!zipcode) newErrors.zipcode = "Zipcode is required";
    if (!cityQuarter) newErrors.cityQuarter = "City Quarter is required";
    if (!startDate) newErrors.startDate = "Start Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const calculateEndDate = (start, subscriptionType) => {
    if (!start) return "";
    let date = new Date(start);
    let businessDaysCount = 0;
    let daysToAdd = subscriptionType === "monthly" ? 24 : 6; // 24 days for monthly, 6 days for weekly

    while (businessDaysCount < daysToAdd) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0) {
        businessDaysCount++;
      }
    }

    // Format the date as yyyy-MM-dd
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (startDate && subscriptionType) {
      const estimatedEndDate = calculateEndDate(startDate, subscriptionType);
      setEndDate(estimatedEndDate);
    }
  }, [startDate, subscriptionType]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const subscription = sessionStorage.getItem("subscriptionType");
      const subscriptionPrice = sessionStorage.getItem("price");

      if (subscription && subscriptionPrice) {
        setSubscriptionType(subscription);
        setPrice(Number(subscriptionPrice));
      }
    }
  }, [isMounted]);

  const handlePayment = async () => {
    // Validate form before proceeding
    const isValid = validateForm();
    if (!isValid) return; // Stop if validation fails

    try {
      // Get the current user from Firebase Authentication
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in");
        return;
      }

      const orderData = {
        subscriptionType,
        price,
        addressLine1,
        city,
        province,
        zipcode,
        mealPreferences,
        startDate,
        endDate,
        userName,
        userPhone,
        cityQuarter,
        userId: user.uid,
        timestamp: new Date(),
      };

      // Add order data to Firestore collection and get the document reference
      const docRef = await addDoc(collection(db, "subscriptions"), orderData);

      // Redirect to the order confirmation page with the order ID
      router.push(`/order-confirmation?orderId=${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (!isMounted) return null;

  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (input.length <= 3) {
      input = input.replace(/(\d{3})(\d{0,})/, "$1-$2");
    } else if (input.length <= 6) {
      input = input.replace(/(\d{3})(\d{3})(\d{0,})/, "$1-$2-$3");
    } else {
      input = input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    setUserPhone(input);
  };

  const extraTiffins = subscriptionType === "Weekly" ? "One" : "Four";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Order
              </h2>
              <p className="text-gray-500 mb-6">
                Secure checkout powered by Teeku Masi's
              </p>

              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    1
                  </span>
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {errors.userName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.userName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {errors.userPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.userPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    2
                  </span>
                  Shipping Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province *
                      </label>
                      <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                      {errors.province && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.province}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.zipcode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Neighborhood *
                      </label>
                      <select
                        value={cityQuarter}
                        onChange={(e) => setCityQuarter(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      >
                        <option value="">Select your area</option>
                        <option value="Downtown">Downtown</option>
                        <option value="NE">NE</option>
                        <option value="NW">NW</option>
                        <option value="SE">SE</option>
                        <option value="SW">SW</option>
                      </select>
                      {errors.cityQuarter && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cityQuarter}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Preferences */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    3
                  </span>
                  Delivery Preferences
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {startDate && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800">
                        <strong>Delivery Schedule:</strong>{" "}
                        {subscriptionType === "Weekly"
                          ? "5 weekdays + 1 FREE Saturday"
                          : "20 weekdays + 4 FREE Saturdays"}
                      </p>
                      <p className="text-green-800 mt-1">
                        <strong>Estimated End Date:</strong> {endDate}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Preferences (Optional)
                    </label>
                    <textarea
                      value={mealPreferences}
                      onChange={(e) => setMealPreferences(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-5/12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {subscriptionType === "Weekly" ? "Weekly" : "Monthly"}{" "}
                    Subscription
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {subscriptionType === "Weekly"
                        ? "5 weekdays + 1 FREE Saturday"
                        : "20 weekdays + 4 FREE Saturdays"}
                    </span>
                    <span className="font-bold">CAD${price}</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">CAD${price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">
                      CAD${(price * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-green-600">
                      CAD${(price * 1.05).toFixed(2)}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={handlePayment}
                  disabled={Object.keys(errors).length > 0}
                  whileHover={{
                    scale: Object.keys(errors).length > 0 ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: Object.keys(errors).length > 0 ? 1 : 0.98,
                  }}
                  className={`w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all ${
                    Object.keys(errors).length > 0
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Complete Payment
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
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.button>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Secure SSL Encryption</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
