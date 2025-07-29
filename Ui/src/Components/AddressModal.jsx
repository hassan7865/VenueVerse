import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import toast from "react-hot-toast";
import { CartContext } from "../context/cart";
import { loadStripe } from "@stripe/stripe-js";

const ShippingAddressDialog = ({ isOpen, onClose, initialValues }) => {
  const { cart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const handleCheckout = async (shippingAddress) => {
    try {
      const payload = cart.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.amount || 1,
      }));

      const response = await api.post("/order/create-checkout-session", {
        items: payload,
        shippingAddress,
      });

      const stripe = await loadStripe(
       import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout. Please try again.");
    }
  };
  // Reset form when opening or when initialValues change
  useEffect(() => {
    if (isOpen) {
      reset({
        street: initialValues?.street || "",
        city: initialValues?.city || "",
        state: initialValues?.state || "",
        postalCode: initialValues?.postalCode || "",
      });
    }
  }, [isOpen, initialValues, reset]);

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    const currentUser = UserProfile.GetUserData();

    try {
      const response = await api.put(`/user/${currentUser._id}`, {
        shippingAddress: data,
      });

      // Show success notification
      toast.success("Redirecting to Payement");
      UserProfile.UpdateUserData({ shippingAddress: data });
      handleCheckout(data).then(() => {
        isLoading(false);
      });
    } catch (err) {
      console.error("Error updating shipping address:", err);
      toast.error(
        err.response?.data?.message || "Failed to update shipping address"
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Shipping Address
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="space-y-4"
                >
                  {/* Street Address */}
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Street Address*
                    </label>
                    <input
                      id="street"
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        errors.street
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      {...register("street", {
                        required: "Street address is required",
                      })}
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City*
                      </label>
                      <input
                        id="city"
                        disabled={isLoading}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                          errors.city
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                        {...register("city", { required: "City is required" })}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State/Province*
                      </label>
                      <input
                        id="state"
                        disabled={isLoading}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                          errors.state
                            ? "border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                        {...register("state", {
                          required: "State is required",
                        })}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Postal Code*
                    </label>
                    <input
                      id="postalCode"
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      {...register("postalCode", {
                        required: "Postal code is required",
                      })}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Save Address"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShippingAddressDialog;
