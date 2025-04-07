"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useCart } from "../context/cartContext";
import { auth, db } from "../utils/firebase";

export default function ConfirmedOrder() {
  const { cart, clearCart } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { width, height } = useWindowSize(); // get current window size for confetti
  const orderProcessedRef = useRef(false);

  useEffect(() => {
    const processOrder = async () => {
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

        const orderKey = `order_${user.uid}_${cart.length}_${JSON.stringify(
          cart
        )}`;
        if (localStorage.getItem(orderKey) === "completed") {
          router.push("/my-orders");
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

        localStorage.setItem(orderKey, "processing");

        await addDoc(collection(db, "orders"), orderData);
        localStorage.setItem(orderKey, "completed");
        sessionStorage.removeItem("checkoutFormData");

        setOrderId(generatedOrderId);
        setOrderDetails(orderData);
        clearCart();
      } catch (err) {
        console.error("Order creation failed:", err);
        router.push("/menu-checkout");
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [cart, clearCart, router]);

  if (loading || !orderDetails) {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={250}
        recycle={false}
      />
      <Navbar />
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
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
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-700 text-lg">Thank you for your order.</p>
            <p className="text-sm text-gray-500 mt-2">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${orderDetails.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%):</span>
                  <span className="font-medium">
                    ${orderDetails.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg mt-2 font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
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
                  <p className="text-gray-600 text-sm">
                    Your order has been received
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-gray-700">
                  What’s next?
                </h3>
                <p className="text-sm text-gray-600">
                  We’re preparing your order. You’ll receive updates on your
                  order status.
                </p>
              </div>

              <button
                onClick={() => router.push("/my-orders")}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl shadow-md text-lg font-semibold transition"
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
