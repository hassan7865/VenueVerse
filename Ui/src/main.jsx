import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SidebarProvider } from "./context/sidebar.jsx";
import { CartProvider } from "./context/cart.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </SidebarProvider>
  </StrictMode>
);
