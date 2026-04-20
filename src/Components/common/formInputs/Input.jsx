/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

function Input(props) {
  return (
    <div>
      <label
        className={`block text-black-700 ${props.labelClass || "font-medium"}`}
      >
        {props.label}
      </label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        className={`${props.className}`}
        onChange={props.onChange}
        readOnly={props.readOnly}
        autoComplete={props.autoComplete ?? "off"}
      />
      {props.error && (
        <p className="text-red-500 text-[10px] mt-1 font-medium">{props.error}</p>
      )}
    </div>
  );
}

export default Input;
