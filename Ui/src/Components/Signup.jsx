import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../lib/Url";
import toast from "react-hot-toast";

const Signup = ({ userState }) => {
  const { isNewUser, setIsNewUser } = userState;
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [formValues, setFormValues] = useState(null); // to store form data
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignupForm = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/otp/sendOTP", { email: data.email });
      toast.success("OTP sent to your email");
      setFormValues(data);
      setOtpStep(true); // move to OTP step
    } catch (error) {
      const message =
        error.response?.data?.Message || error.message || "Failed to send OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !formValues) return;

    setLoading(true);
    try {
      const res = await api.post("/otp/validateOTP", {
        email: formValues.email,
        otp,
      });

      if (res.data.Status) {
        // OTP Validated, now create account
        const signupRes = await api.post("/auth/signup", formValues);
        toast.success(signupRes.data.message || "Account created successfully");
        setTimeout(() => {
          setIsNewUser(!isNewUser);
        }, 1500);
      } else {
        toast.error("OTP validation failed");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!otpStep ? (
        <form onSubmit={handleSubmit(handleSignupForm)}>
          <input
            {...register("username", { required: true })}
            type="text"
            placeholder="Username"
            className="form_input"
          />
          {errors.username && (
            <span className="text-red-700 font-semibold text-sm">This field is required</span>
          )}

          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="form_input mt-5"
          />
          {errors.email && (
            <span className="text-red-700 font-semibold text-sm">This field is required</span>
          )}

          <input
            {...register("phone", { required: true })}
            type="text"
            placeholder="Phone"
            className="form_input mt-5"
          />
          {errors.phone && (
            <span className="text-red-700 font-semibold text-sm">This field is required</span>
          )}

          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="form_input mt-5"
          />
          {errors.password && (
            <span className="text-red-700 font-semibold text-sm">This field is required</span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn bg-brand-blue text-white mt-5 rounded-md w-full hover:bg-brand-blue/[.90]"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="form_input"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn bg-brand-blue text-white mt-5 rounded-md w-full hover:bg-brand-blue/[.90]"
          >
            {loading ? "Verifying..." : "Verify OTP & Create Account"}
          </button>
        </form>
      )}
    </>
  );
};

export default Signup;
