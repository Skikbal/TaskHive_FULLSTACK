import React, { useState } from "react";
import "./Login.css";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import PasswordInput from "../../components/PasswordInput.jsx";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [disable, setDisable] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setDisable(true);
  };
  return (
    <div className="login_only">
      <OnboardLayout
        title={"Hello! Welcome Back!"}
        desc={"Login to your account"}
      >
        <form className=" login-form" onSubmit={handleLogin}>
          <div className="mb-4 mt-[35px]">
            <label className="dark-H head-4 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="body-N"
              name="email"
              type="email"
              placeholder="write your email here"
              value={values.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4 mt-[16px]">
            <div className="flex justify-between">
              <label className="dark-H head-4 mb-2 " htmlFor="password">
                Password
              </label>
              <p
                className="body-S green-M cursor-pointer"
                role="button"
                // onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>
            <PasswordInput
              name="password"
              value={values.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            disabled={disable}
            className="green-bg-H body-L light-L py-[8px] px-[39px] login-button cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </OnboardLayout>
    </div>
  );
};

export default Login;
