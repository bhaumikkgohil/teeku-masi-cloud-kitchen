"use client";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import { auth, db } from "../utils/firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useCart();

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const cartItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const adminQuery = query(
          collection(db, "admins"),
          where("email", "==", authUser.email)
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          setAdmin({
            ...authUser,
            adminCode: adminData.code,
            name: adminData.firstName + " " + adminData.lastName,
          });
          setUser(null);
        } else {
          setUser(authUser);
          setAdmin(null);
        }
      } else {
        setUser(null);
        setAdmin(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdmin(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-2 flex justify-between bg-white items-center shadow-sm sticky top-0 z-50 border-b border-gray-200"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/teeku-masi-logo.png"
          alt="Teeku Masi Logo"
          width={80}
          height={16}
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
        <motion.span
          className="flex items-center justify-center ml-6 text-3xl font-bold bg-gradient-to-r from-green-900 to-green-800 bg-clip-text text-transparent"
          whileHover={{
            textShadow: "0px 0px 8px rgba(74, 222, 128, 0.2)",
            transition: { duration: 0.3 },
          }}
        >
          Teeku Masi's Tiffin
        </motion.span>
      </motion.div>

      <div className="flex items-center space-x-4">
        {Array.isArray(cart) && cart.length > 0 && (
          <div className="relative">
            <motion.button
              onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(5, 150, 105, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>My Cart</span>
              <motion.span
                className="bg-white text-emerald-600 rounded-full px-2 text-sm font-bold shadow-inner"
                key={cart.length}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{
                  scale: 1,
                  rotate: 10,

                  transition: { type: "spring", bounce: 0.5, velocity: 2 },
                }}
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.6 },
                }}
              >
                {cart.length}
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {cartDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", damping: 20, stiffness: 300 },
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 bg-white text-black shadow-2xl rounded-xl w-80 p-0 overflow-hidden z-50 border border-gray-100"
                  style={{
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.96)",
                  }}
                >
                  {/* Cart Header */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Your Cart
                      </h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                        items
                      </span>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-96 overflow-y-auto">
                    {cart.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: i * 0.05 },
                        }}
                        className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-emerald-600 font-semibold">
                              CAD${item.price}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {item.quantity}{" "}
                              {item.quantity > 1 ? "pieces" : "piece"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                            className="text-white bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 p-1.5 rounded-md text-xs shadow-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </motion.button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                            className="text-white bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 p-1.5 rounded-md text-xs shadow-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cart Footer */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-bold text-emerald-600">
                        CAD$
                        {cart
                          .reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <motion.button
                      onClick={() => router.push("/menu-checkout")}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg relative overflow-hidden"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 5px 15px rgba(5, 150, 105, 0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Proceed to Checkout
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {admin ? (
          <div className="relative">
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shadow-lg relative overflow-hidden"
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.6 },
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"></div>
                {getInitials(admin.name)}
              </motion.div>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", damping: 20, stiffness: 300 },
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-3 z-50"
                >
                  <div className="relative">
                    <div className="absolute -top-1 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200 z-10"></div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 backdrop-blur-lg bg-opacity-90">
                      <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                        <p className="font-bold">{admin.name}</p>
                        <p className="text-xs opacity-90">
                          Admin #{admin.adminCode}
                        </p>
                      </div>

                      <div className="p-2">
                        <motion.button
                          onClick={handleLogout}
                          whileHover={{
                            x: 5,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <span>Sign Out</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : user ? (
          <div className="relative">
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-lg relative overflow-hidden"
                whileHover={{
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.6 },
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)]"></div>
                {getInitials(user.displayName || user.email)}
              </motion.div>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", damping: 20, stiffness: 300 },
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-3 z-50"
                >
                  <div className="relative">
                    <div className="absolute -top-1 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200 z-10"></div>
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 backdrop-blur-lg bg-opacity-90 w-64">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                        <p className="font-bold truncate">
                          {user.displayName || "Welcome Back"}
                        </p>
                        <p className="text-xs opacity-90 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-2 space-y-1">
                        <motion.div
                          whileHover={{
                            x: 5,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                        >
                          <Link
                            href="/my-subscriptions"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-3 text-purple-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            My Subscriptions
                          </Link>
                        </motion.div>

                        <motion.div
                          whileHover={{
                            x: 5,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                        >
                          <Link
                            href="/my-orders"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-3 text-indigo-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            My Orders
                          </Link>
                        </motion.div>

                        <div className="border-t border-gray-200 my-1"></div>

                        <motion.button
                          onClick={handleLogout}
                          whileHover={{
                            x: 5,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div className="flex space-x-4">
            <Link
              href="/admin-login"
              className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <span className="relative z-10 flex items-center">
                Admin Portal
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity"></span>
            </Link>

            <Link
              href="/signin"
              className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <span className="relative z-10 flex items-center">
                Sign In
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 hover:opacity-100 transition-opacity"></span>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
