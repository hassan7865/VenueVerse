import React, { useEffect, useLayoutEffect, useState } from "react";
import SignIn from "../Components/Signin";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import Signup from "../Components/Signup";
import UserProfile from "../../UserProfile";

const Login = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();

  const currentUser = UserProfile.GetUserData();

  useEffect(() => {
    if (currentUser && currentUser.email) {
      navigate("/profile");
    }
  }, []);

  return (
    <>
      {currentUser ? (
        <section className="form-section py-20  ">
          <div className="container">
            <p className="text-base md:text-xl text-center text-brand-blue font-heading font-bold ">
              User exist! Redirecting to profile page
            </p>
          </div>
        </section>
      ) : (
        <section className="form-section py-10 md:py-20 ">
          <div className="container ">
            <div className="form-container px-4 sm:px-8 bg-white py-6 pb-8 sm:py-9 sm:pb-12 max-w-lg mx-auto rounded-sm border-[1px] border-brand-blue/50 shadow-brand shadow-brand-blue/40">
              <h1 className="text-left text-brand-blue mb-3 font-medium font-heading text-md sm:text-xl">
                {isNewUser ? "Login" : "Create an account"}
              </h1>
              {isNewUser ? (
                <SignIn />
              ) : (
                <Signup userState={{isNewUser,setIsNewUser}} />
              )}

              <p className="content text-center font-heading text-black mt-4">
                {isNewUser
                  ? "Don’t have an account?"
                  : "Already have an account?"}
                <u
                  className="ml-1 border-brand-blue text-brand-blue cursor-pointer"
                  onClick={() => setIsNewUser(!isNewUser)}
                >
                  {isNewUser ? "Create an account" : "Login"}
                </u>
              </p>
             
            </div>
          </div>
        </section>
      )}
      <>
        <Footer />
      </>
    </>
  );
};

export default Login;
