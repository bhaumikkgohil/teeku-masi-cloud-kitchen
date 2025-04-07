"use client";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { db } from "../utils/firebase";

export default function FetchDeliveriesPage() {
  const [date, setDate] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const printRef = useRef();

  const handleFetchDeliveries = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }
    setError("");
    setLoading(true);
    setDeliveries([]);

    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const allDocs = await getDocs(collection(db, "subscriptions"));
      const fetchedDeliveries = allDocs.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (doc) =>
            new Date(doc.startDate) <= new Date(formattedDate) &&
            new Date(doc.endDate) >= new Date(formattedDate)
        );

      // Sort by cityQuarter
      const sortedDeliveries = fetchedDeliveries.sort((a, b) =>
        a.cityQuarter.localeCompare(b.cityQuarter)
      );

      setDeliveries(sortedDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError("Failed to fetch deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToAdminDashboard = () => {
    router.push("/admin-dashboard");
  };

  const handlePrint = () => {
    if (deliveries.length === 0) {
      setError("No deliveries to print");
      return;
    }
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Deliveries for ${date}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .print-date { text-align: right; font-size: 14px; color: #666; }
            @page { size: auto; margin: 5mm; }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Teeku Masi's Tiffin Service</h1>
            <div class="print-date">Printed on: ${new Date().toLocaleDateString()}</div>
          </div>
          <h2>Deliveries for ${date}</h2>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>City Quarter</th>
                <th>Subscription Type</th>
                <th>Address</th>
                <th>Zip Code</th>
              </tr>
            </thead>
            <tbody>
              ${deliveries
                .map(
                  (delivery) => `
                <tr>
                  <td>${delivery.userName || "N/A"}</td>
                  <td>${delivery.cityQuarter || "N/A"}</td>
                  <td>${delivery.subscriptionType || "N/A"}</td>
                  <td>${delivery.addressLine1 || ""}, ${
                    delivery.city || ""
                  }</td>
                  <td>${delivery.zipcode || "N/A"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fetch Deliveries</h1>
          {/* Admin Dashboard Button */}
          <button
            onClick={goToAdminDashboard}
            className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Admin Dashboard
          </button>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/* Fetch Deliveries Button */}
        <button
          onClick={handleFetchDeliveries}
          className="bg-gray-900 hover:bg-gray-600 text-white py-2 px-4 rounded mb-6"
        >
          Fetch Deliveries
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading Indicator */}
        {loading && <p>Loading deliveries...</p>}

        {/* Deliveries Table */}
        {!loading && deliveries.length > 0 && (
          <div ref={printRef}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Deliveries for {date}</h2>
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
              >
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print List
              </button>
            </div>
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">
                    Customer Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    City Quarter
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Subscription Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">Zip Code</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <tr
                    key={delivery.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.userName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.cityQuarter}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.subscriptionType}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.addressLine1}, {delivery.city}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {delivery.zipcode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Deliveries Found */}
        {!loading && deliveries.length === 0 && (
          <p>No deliveries found for the selected date.</p>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
