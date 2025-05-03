import React, { useState } from "react";
import EyesOn from "../assets/svg/eyes-on.svg";
import EyeClose from "../assets/svg/eyes-off.svg";

const PasswordInput = ({ name, value, onChange, disabled }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <div className="flex password-field">
      <input
        type={isShowPassword ? "text" : "password"}
        className="body-N"
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="write your password here"
      />
      <img
        src={isShowPassword ? EyesOn : EyeClose}
        alt="eye"
        onClick={() => {
          setIsShowPassword(!isShowPassword);
        }}
        className="cursor-pointer"
      />
    </div>
  );
};

export default PasswordInput;
