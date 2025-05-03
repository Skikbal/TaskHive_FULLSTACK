import React from "react";
import OnboardLayout from "../../layouts/OnboardLayout";
import PasswordInput from "../../components/PasswordInput";
const Signup = () => {
  return (
    <div >
      <OnboardLayout
        title={"Hello! Welcome to TaskHive !"}
        desc={"Signup to create an account"}
      >
        <form className=" login-form snap-y ">
          <div className="flex gap-2 mb-4 mt-[35px]">
            <div className="">
              <label className="dark-H head-4 mb-2" htmlFor="email">
                User Name
              </label>
              <input
                className="body-N"
                name="email"
                type="email"
                placeholder="write an username here"
                //   value={values.email}
                //   onChange={handleInputChange}
              />
            </div>
            <div className="">
              <label className="dark-H head-4 mb-2" htmlFor="email">
                Full Name
              </label>
              <input
                className="body-N"
                name="email"
                type="email"
                placeholder="write your full name here"
                //   value={values.email}
                //   onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-4 mt-[16px]">
            <label className="dark-H head-4 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="body-N"
              name="email"
              type="email"
              placeholder="write your email here"
              //   value={values.email}
              //   onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 mt-[16px]">
            <label className="dark-H head-4 mb-2 " htmlFor="password">
              Password
            </label>

            <PasswordInput
              name="password"
              //   value={values.password}
              //   onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 mt-[16px]">
            <label className="dark-H head-4 mb-2 " htmlFor="password">
              Avatar
            </label>

            <input type="file" className="body-N" name="avatar" />
          </div>
        </form>
      </OnboardLayout>
    </div>
  );
};

export default Signup;
