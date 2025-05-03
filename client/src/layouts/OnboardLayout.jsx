import React from "react";
import "./layout.css";
import Logo from "../assets/png/logo.png"
const OnboardLayout = ({ children, title, desc }) => {
  return (
    <div className="layout">
      <div className="layout-inner my-auto">
        <div className="layout-left dark-bg-L">
          <img src={Logo} alt="logo" className="my-auto" />
        </div>
        <div className="layout-right light-bg-L">
          <h1 className="text-3xl font-bold ">{title}</h1>
          <p className="body-L dark-M mt-2">{desc}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardLayout;
