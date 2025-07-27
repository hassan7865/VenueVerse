import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../lib/Url";
import toast from "react-hot-toast";

const Signup = ({ userState }) => {
  const { isNewUser, setIsNewUser } = userState;
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", formData);
      toast.success(res.data.message || "Signed up successfully");
      setTimeout(() => {
        setIsNewUser(!isNewUser);
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", { required: true })}
          type="text"
          placeholder="Username"
          className="form_input"
        />
        {errors.username && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="form_input mt-5"
        />
        {errors.email && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        <input
          {...register("phone", { required: true })}
          type="text"
          placeholder="Phone"
          className="form_input mt-5"
        />
        {errors.phone && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="form_input mt-5"
        />
        {errors.password && (
          <span className="text-red-700 font-semibold text-sm mb-2 mt-1">
            This field is required
          </span>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn bg-brand-blue text-white mt-5 rounded-md w-full hover:bg-brand-blue/[.90]"
        >
          {loading ? "Loading..." : "Create an account"}
        </button>
      </form>
    </>
  );
};

export default Signup;
