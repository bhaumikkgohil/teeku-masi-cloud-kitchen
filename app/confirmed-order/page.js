"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useCart } from "../context/cartContext";
import { auth, db } from "../utils/firebase";

export default function ConfirmedOrder() {
  const { cart, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const orderProcessedRef = useRef(false); // Using ref for immediate checks

  useEffect(() => {
    // Guard against empty cart
    if (!cart || cart.length === 0) {
      router.push("/menu");
      return;
    }

    const processOrder = async () => {
      // Double-check guard
      if (orderProcessedRef.current) return;
      orderProcessedRef.current = true;

      const formData = sessionStorage.getItem("checkoutFormData");
      if (!formData) {
        router.push("/menu-checkout");
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/signin");
          return;
        }

        // Additional check in localStorage (persists across page reloads)
        const orderKey = `order_${user.uid}_${cart.length}_${JSON.stringify(
          cart
        )}`;
        if (localStorage.getItem(orderKey)) {
          console.log("Order already processed");
          return;
        }

        const parsedFormData = JSON.parse(formData);
        const generatedOrderId = Math.floor(
          10000000 + Math.random() * 90000000
        ).toString();

        const subtotal = cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        const orderData = {
          orderId: generatedOrderId,
          userId: user.uid,
          userEmail: user.email,
          customerDetails: {
            firstName: parsedFormData.firstName,
            lastName: parsedFormData.lastName,
            address: {
              line1: parsedFormData.addressLine1,
              line2: parsedFormData.addressLine2,
              city: parsedFormData.city,
              zipcode: parsedFormData.zipcode,
            },
            contact: {
              phone: parsedFormData.phone,
              email: parsedFormData.email,
            },
          },
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          tax,
          total,
          status: "Order Placed",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        // Mark as processing in localStorage before Firebase operation
        localStorage.setItem(orderKey, "processing");

        const docRef = await addDoc(collection(db, "orders"), orderData);

        // Update localStorage with success status
        localStorage.setItem(orderKey, "completed");

        // Clear session storage
        sessionStorage.removeItem("checkoutFormData");

        setOrderId(generatedOrderId);
        setOrderDetails(orderData);
        clearCart();
      } catch (error) {
        console.error("Order creation failed:", error);
        setError("Failed to create order. Please try again.");
        // Remove the processing flag on failure
        localStorage.removeItem(orderKey);
      } finally {
        setLoading(false);
      }
    };

    processOrder();

    return () => {
      // Cleanup if component unmounts
      orderProcessedRef.current = false;
    };
  }, [cart, router, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Processing Your Order...
            </h1>
            <p className="text-lg">Please wait while we confirm your order.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Order Failed</h1>
            <p className="text-lg">There was an issue processing your order.</p>
            <button
              onClick={() => router.push("/menu")}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Back to Menu
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg">Thank you for your order.</p>
            <p className="text-gray-600 mt-2">Order ID: {orderId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Order Summary
              </h2>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Order Status
              </h2>
              <div className="flex items-center mb-6">
                <div className="bg-green-100 text-green-800 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                </div>
                <div>
                  <h3 className="font-bold text-lg">{orderDetails.status}</h3>
                  <p className="text-gray-600">Your order has been received</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What's next?</h3>
                <p className="text-gray-700">
                  We're preparing your order. You'll receive updates on your
                  order status.
                </p>
              </div>

              <button
                onClick={() => router.push("/my-orders")}
                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg transition"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
