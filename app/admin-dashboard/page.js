"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { auth, db } from "../utils/firebase";

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Check if the user is an admin by querying Firestore
        const adminQuery = query(
          collection(db, "admins"),
          where("email", "==", authUser.email) // Match admin by email
        );
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          setAdmin({
            ...authUser,
            adminCode: adminData.code,
            name: adminData.firstName + " " + adminData.lastName,
          });
          setUser(null); // Ensure user state is cleared
        } else {
          // If not an admin, treat as a normal user
          setUser(authUser);
          setAdmin(null); // Ensure admin state is cleared
        }
      } else {
        setUser(null);
        setAdmin(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (admin) {
      setAdminName(admin.name); // Set admin name when it's available
      setLoading(false);
    }
  }, [admin]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, {adminName}</h1>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Delivery List Card */}
          <Link href="/fetch-deliveries" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Delivery List</h3>
              </div>
              <p className="text-gray-600 mt-2">
                View and manage all deliveries for the selected date
              </p>
            </div>
          </Link>

          {/* Update Menu Card */}
          <Link href="/update-menu" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Update Order Menu</h3>
              </div>
              <p className="text-gray-600 mt-2">
                Manage menu items and update availability.
              </p>
            </div>
          </Link>

          {/* Add Menu Item Card */}
          <Link href="/add-menu-item" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Add Menu Items</h3>
              </div>
              <p className="text-gray-600 mt-2">
                Add new items to your order menu to attract more customers.
              </p>
            </div>
          </Link>

          {/* Manage Inventory Card */}
          <Link href="/manage-inventory" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Manage Inventory</h3>
              </div>
              <p className="text-gray-600 mt-2">
                Update inventory daily for smooth kitchen operations.
              </p>
            </div>
          </Link>

          {/* Manage Orders Card */}
          <Link href="/manage-orders" passHref>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Manage Orders</h3>
              </div>
              <p className="text-gray-600 mt-2">
                Track and update status for all customer orders.
              </p>
            </div>
          </Link>

          {/* Add more feature cards as needed */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
