import { CartProvider } from "./context/cartContext";
import "./globals.css";

export const metadata = {
  title: "Teeku Masi's Cloud Kitchen",
  description: "Your favorite homemade meals, delivered fresh and tasty!",
  icons: {
    icon: "/teeku-masi-logo.png",
    shortcut: "/teeku-masi-logo.png",
    apple: "/teeku-masi-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
