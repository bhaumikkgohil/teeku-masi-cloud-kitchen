"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { useCart } from "../context/cartContext";

export default function MenuCheckout() {
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipcode: "",
    phone: "",
    email: "",
  });
  const router = useRouter();

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.addressLine1 ||
        !formData.city ||
        !formData.zipcode ||
        !formData.phone ||
        !formData.email
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Store form data in sessionStorage before redirecting
      sessionStorage.setItem("checkoutFormData", JSON.stringify(formData));

      // Redirect to confirmed-order page
      router.push("/confirmed-order");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-full flex-col md:flex-row"
        >
          {/* Left Side: Personal Info */}
          <div className="flex-1 space-y-6 max-h-full overflow-y-auto pr-0 md:pr-6">
            <h3 className="text-lg font-semibold">
              Name <span className="text-red-500">*</span>
            </h3>
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mb-2">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-md"
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-md"
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <h3 className="text-lg font-semibold">
              Address <span className="text-red-500">*</span>
            </h3>
            <div className="flex flex-col space-y-2 mb-2">
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-md"
                required
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2 (Optional)"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-md"
              />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mb-6">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-md"
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  name="zipcode"
                  placeholder="Zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-md"
                  required
                />
              </div>
            </div>

            {/* Contact Section */}
            <h3 className="text-lg font-semibold">
              Contact <span className="text-red-500">*</span>
            </h3>
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mb-6">
              <div className="w-full md:w-1/2">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-md"
                  required
                />
              </div>
              <div className="w-full md:w-1/2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-6">
            <div className="p-6 bg-white rounded-lg shadow-lg sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-lg">
                    <div className="truncate max-w-[60%]">
                      <span>{item.name}</span>
                      <span className="text-sm text-gray-600 ml-1">
                        x{item.quantity}
                      </span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-3 rounded-lg w-full transition"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
