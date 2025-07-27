import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";
import toast from "react-hot-toast";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const onSubmit = async (formData) => {
    setloading(true);
    try {
      const res = await api.post("/auth/signin", formData);

      const user = res.data;

      UserProfile.SetUserData(user);
      toast.success("Signed in successfully!");
      navigate("/home");
    } catch (error) {
      let message = "Network error, please try again";

      if (error.response) {
        message = error.response.data?.message || "Authentication failed";
      } else if (error.request) {
        message = "No response from server";
      }

      toast.error(message);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default SignIn;
