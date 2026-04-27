/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Input({ alignItems, justifyContent, flexDirection, gap, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <label
        className={`block text-black-700 ${props.labelClass || "font-medium"}`}
      >
        {props.label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : props.type}
          autoComplete={props.autoComplete ?? "off"}
          className={`${props.className} ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            style={{ zIndex: 10 }}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
      {props.error && (
        <p className="text-red-500 text-[10px] mt-1 font-medium">{props.error}</p>
      )}
    </div>
  );
}

export default Input;
