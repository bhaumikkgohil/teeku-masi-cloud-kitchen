"use client";
import { collection, getDocs } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useCart } from "../context/cartContext";
import { db } from "../utils/firebase";

export default function MenuPage() {
  const [addedItems, setAddedItems] = useState({});
  const [menuCategories, setMenuCategories] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();
  const { cart, setCart } = useCart();

  const categoryOrder = [
    "appetizers",
    "snacks",
    "vegetarian main course",
    "non vegetarian main course",
    "breads",
    "rices",
    "sides",
    "beverages",
  ];

  const categoryDisplayNames = {
    appetizers: "Appetizers",
    snacks: "Snacks",
    "vegetarian main course": "Vegetarian Mains",
    "non vegetarian main course": "Non-Veg Mains",
    breads: "Artisan Breads",
    rices: "Signature Rices",
    sides: "Accompaniments",
    beverages: "Beverages",
  };

  const categoryIcons = {
    appetizers: "🍢",
    snacks: "🍟",
    "vegetarian main course": "🥗",
    "non vegetarian main course": "🍗",
    breads: "🍞",
    rices: "🍚",
    sides: "🥣",
    beverages: "☕",
  };

  useEffect(() => {
    const fetchMenuCategories = async () => {
      try {
        const fetchedCategories = {};
        const categoriesSnapshot = await getDocs(
          collection(db, "menuCategories")
        );

        for (const categoryDoc of categoriesSnapshot.docs) {
          const categoryName = categoryDoc.id;
          const categoryItems = [];
          const itemsSnapshot = await getDocs(
            collection(db, "menuItems", categoryName, "items")
          );

          itemsSnapshot.forEach((itemDoc) => {
            categoryItems.push({
              id: itemDoc.id,
              ...itemDoc.data(),
            });
          });

          fetchedCategories[categoryName] = categoryItems;
          if (!activeCategory && categoryItems.length) {
            setActiveCategory(categoryName);
          }
        }

        setMenuCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching menu categories and items:", error);
      }
    };

    fetchMenuCategories();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(
      () => setAddedItems((prev) => ({ ...prev, [item.id]: false })),
      1500
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Main Content with scroll adjustment */}
      <div className="flex flex-col lg:flex-row pt-16">
        {" "}
        {/* Added pt-16 to push content below navbar */}
        {/* Categories Sidebar - Now with larger text */}
        <aside
          className="w-full lg:w-80 p-4 lg:p-6 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 overflow-y-auto"
          style={{ top: "4rem" }} /* Matches navbar height */
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              {" "}
              {/* Increased from text-xl */}
              Categories
            </h2>
            <ul className="space-y-2">
              {categoryOrder.map(
                (category) =>
                  menuCategories[category] && (
                    <motion.li
                      key={category}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a
                        href={`#${category}`}
                        onClick={() => setActiveCategory(category)}
                        className={`flex items-center p-3 rounded-lg text-base transition-all ${
                          activeCategory === category
                            ? "bg-green-600 text-white font-medium"
                            : "text-gray-700 hover:bg-green-50"
                        }`}
                      >
                        <span className="mr-3 text-lg">
                          {categoryIcons[category]}
                        </span>
                        <span className="truncate">
                          {categoryDisplayNames[category]}
                        </span>
                      </a>
                    </motion.li>
                  )
              )}
            </ul>
          </div>
        </aside>
        {/* Menu Content - Adjusted scroll positioning */}
        <main className="flex-grow p-4 lg:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 text-green-700"
          >
            La Carte
          </motion.h1>

          {categoryOrder.map(
            (category) =>
              menuCategories[category] && (
                <motion.section
                  key={category}
                  id={category}
                  className="mb-12 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl mr-3 text-green-800">
                      {categoryIcons[category]}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {categoryDisplayNames[category]}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {menuCategories[category].map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <span className="font-medium text-green-700 whitespace-nowrap">
                              ${item.price}
                            </span>
                            <motion.button
                              onClick={() => handleAddToCart(item)}
                              className={`relative px-4 py-2 rounded-lg font-medium overflow-hidden ${
                                addedItems[item.id]
                                  ? "bg-green-100 text-green-700"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                              whileTap={{ scale: 0.95 }}
                            >
                              <AnimatePresence mode="wait">
                                {addedItems[item.id] ? (
                                  <motion.span
                                    key="added"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    ✓
                                  </motion.span>
                                ) : (
                                  <motion.span
                                    key="add"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                  >
                                    Add
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
