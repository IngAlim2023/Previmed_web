import { InputHTMLAttributes } from "react";

type PropsInput = {
  label: string;
  required?: boolean;
  errors?: {
    message?: string;
  };
} & InputHTMLAttributes<HTMLInputElement>;

const InputComponent:React.FC<PropsInput> = ({ label, required = false, errors, ...props }) => {
  return (
  <div className="flex flex-col">
    <label className="text-sm text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      {...props}
    />
    {errors && <span className="text-xs text-red-500 mt-1">{errors.message? errors.message : 'Campo obligatorio'}</span>}
  </div>
  )
}

export default InputComponent
