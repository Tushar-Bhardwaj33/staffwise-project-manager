import React from 'react';
import { Field, ErrorMessage } from "formik";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const Input: React.FC<InputProps> = ({ label, name, type = "text", ...props }) => {
  return (
    <div className="flex flex-col w-full static relative">
      <label 
        htmlFor={name} 
        className="text-[#20beff] text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-white w-fit z-10"
      >
        {label}
      </label>
      <Field
        id={name}
        type={type}
        name={name}
        className="border-[#20beff] px-[10px] py-[11px] text-sm bg-white border-2 rounded-[5px] w-full focus:outline-none placeholder:text-black/25 transition-colors"
        {...props}
      />
      <ErrorMessage name={name} component="p" className="mt-1 text-xs text-red-600" />
    </div>
  );
};
