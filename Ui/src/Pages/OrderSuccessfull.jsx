import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/Url";
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { CartContext } from "../context/cart";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      api
        .post("/order/confirm-order", { sessionId })
        .then((res) => {
          setStatus("success");
          clearCart();
          setTimeout(() => {
            navigate("/shop");
          }, 3000);
        })
        .catch((err) => {
          console.error(
            "Order confirmation failed:",
            err.response?.data || err.message
          );
          setStatus("error");
          setError(
            err.response?.data?.message || "Payment verification failed"
          );
        });
    } else {
      setStatus("error");
      setError("No session ID found");
    }
  }, [navigate, searchParams]);

  const iconSize = "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
        {status === "processing" && (
          <>
            <div className="mx-auto mb-4">
              <Loader2 className={`${iconSize} text-blue-500 animate-spin`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Processing Your Payment
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Please wait while we verify your transaction
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4">
              <CheckCircle2 className={`${iconSize} text-green-500`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Thank you for your purchase. Your order is being processed.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span className="animate-pulse">Redirecting to shop</span>
              <ArrowRight className="ml-2 h-4 w-4 animate-bounce" />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4">
              <AlertCircle className={`${iconSize} text-red-500`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Payment Issue
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
            >
              Back to Shop
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
