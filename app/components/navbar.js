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
      className="px-5 py-3 flex justify-between bg-gradient-to-r from-gray-100 to-gray-50 items-center shadow-sm sticky top-0 z-50 border-b border-gray-200"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/teeku-masi-logo.png"
          alt="Teeku Masi Logo"
          width={100}
          height={20}
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
        <motion.span
          className="flex items-center justify-center ml-10 text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          whileHover={{
            textShadow: "0px 0px 8px rgba(0,0,0,0.2)",
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
              className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Cart</span>
              <motion.span
                className="bg-white text-black rounded-full px-2 text-sm"
                key={cart.length}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                {cart.length}
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {cartDropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-72 p-4 border border-gray-200 z-20"
                >
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">
                    Your Cart
                  </h3>
                  <ul className="max-h-64 overflow-y-auto">
                    {cart.map((item, i) => (
                      <motion.li
                        key={item.id}
                        variants={cartItemVariants}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-between items-center border-b py-3"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.quantity} x ${item.price}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => removeFromCart(item.id)}
                            className="text-white bg-red-500 hover:bg-red-400 p-2 rounded-md text-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            −
                          </motion.button>
                          <motion.button
                            onClick={() => addToCart(item)}
                            className="text-white bg-green-500 hover:bg-green-400 p-2 rounded-md text-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div
                    className="flex flex-row justify-between items-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-lg font-semibold text-gray-800">
                      Total: $
                      {cart
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                    <motion.button
                      onClick={() => router.push("/menu-checkout")}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Checkout
                    </motion.button>
                  </motion.div>
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
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-lg shadow-md"
                whileHover={{ rotate: 5 }}
              >
                {getInitials(admin.name)}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-3 z-20"
                >
                  <p className="text-gray-800 text-sm font-medium">
                    {admin.name}
                    <span className="text-gray-500"> (Admin)</span>
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Code: {admin.adminCode}
                  </p>
                  <motion.button
                    onClick={handleLogout}
                    className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 rounded-lg text-sm shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
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
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-lg shadow-md"
                whileHover={{ rotate: 5 }}
              >
                {getInitials(user.displayName || user.email)}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-3 z-20"
                >
                  <p className="text-gray-800 text-sm font-medium">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{user.email}</p>
                  <motion.div className="space-y-2 mt-3">
                    <Link
                      href="/my-subscriptions"
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg text-sm shadow-md"
                    >
                      My Subscriptions
                    </Link>
                    <Link
                      href="/my-orders"
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg text-sm shadow-md"
                    >
                      My Orders
                    </Link>
                    <motion.button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 rounded-lg text-sm shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div className="flex space-x-4">
            <Link
              href="/admin-login"
              className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-300"
            >
              Admin
            </Link>
            <Link
              href="/signin"
              className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white py-2 px-4 rounded-full shadow-md transition-all duration-300"
            >
              Sign In
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
