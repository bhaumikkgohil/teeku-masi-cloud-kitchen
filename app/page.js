"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { auth } from "./utils/firebase";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubscriptionClick = () => {
    if (user) {
      router.push("/subscription");
    } else {
      router.push("/signin");
    }
  };

  const handleMenuClick = () => {
    if (user) {
      router.push("/menu");
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="relative overflow-hidden rounded-xl py-16 px-4 shadow-2xl">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Indian thali with various dishes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-800 opacity-70"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Teeku Masi's Cloud Kitchen
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Authentic Indian home-style meals delivered with care in Canada
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button
                  onClick={handleSubscriptionClick}
                  className="bg-white hover:bg-green-50 text-green-700 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  Start Weekly Tiffin
                </button>
                <button
                  onClick={handleMenuClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  Order A La Carte
                </button>
              </div>

              <div className="text-green-200 text-sm">
                <span className="inline-flex items-center mr-4">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>{" "}
                  100% Vegetarian Options
                </span>
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>{" "}
                  Free Saturday Meal with Tiffin
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Speciality Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our <span className="text-green-600">Signature</span> Dishes
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Baingan Bharta",
                desc: "Smoky roasted eggplant mashed with spices and herbs",
                price: "CAD$15.99",
              },
              {
                name: "Hyderabadi Biryani",
                desc: "Fragrant basmati rice layered with spiced vegetables",
                price: "CAD$17.99",
              },
              {
                name: "Masala Chai",
                desc: "Traditional spiced tea brewed with fresh ginger and cardamom",
                price: "CAD$7.99",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-green-500"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-3">{item.desc}</p>
                <p className="text-green-600 font-bold">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-green-50 rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
            How Our Tiffin Service Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose Your Plan",
                desc: "Select weekly or monthly tiffin subscription",
              },
              {
                step: "2",
                title: "Customize Meals",
                desc: "Tell us your preferences and dietary needs",
              },
              {
                step: "3",
                title: "Enjoy Delivery",
                desc: "Get fresh meals delivered Mon-Sat (Saturday free!)",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tiffin Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our <span className="text-green-600">Tiffin</span> Plans
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Weekly Tiffin",
                price: "CAD$70",
                desc: "5 days (Mon-Fri) + FREE Saturday meal",
                meals: "6 meals total",
                popular: true,
              },
              {
                name: "Monthly Tiffin",
                price: "CAD$280",
                desc: "20 weekdays + 4 FREE Saturday meals",
                meals: "24 meals total",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow relative ${
                  plan.popular ? "border-2 border-green-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-center mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-green-600 text-center mb-2">
                  {plan.price}
                </p>
                <p className="text-gray-600 text-center mb-1">{plan.meals}</p>
                <p className="text-gray-700 text-center mb-6 font-medium">
                  {plan.desc}
                </p>
                <button
                  onClick={handleSubscriptionClick}
                  className={`w-full py-3 rounded-full font-bold ${
                    plan.popular
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6">
            Cancel or pause anytime • Free delivery included
          </p>
        </section>

        {/* Health & Safety */}
        <section className="bg-green-50 rounded-xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-6">
              Our Quality Promise
            </h2>
            <p className="text-gray-700 mb-6">
              At Teeku Masi's, we combine traditional Indian cooking methods
              with modern food safety standards. All our ingredients are freshly
              sourced, and meals are prepared in our certified cloud kitchen
              with the same care as home cooking.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: "🌱", text: "Fresh Ingredients" },
                { icon: "🧑‍🍳", text: "Expert Chefs" },
                { icon: "🚚", text: "Eco-Friendly Packaging" },
                { icon: "⏱️", text: "Timely Delivery" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"
                >
                  <span className="text-xl mr-2">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Taste the Difference of Home Cooking
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our growing family of satisfied customers enjoying authentic
            Indian meals in Canada
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleSubscriptionClick}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              Start Weekly Tiffin
            </button>
            <button
              onClick={handleMenuClick}
              className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-8 rounded-full shadow-lg border border-green-600 transition-all transform hover:scale-105"
            >
              View Full Menu
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
