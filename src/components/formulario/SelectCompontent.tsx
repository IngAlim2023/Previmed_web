import { SelectHTMLAttributes } from "react";

type PropsSelect = {
  label: string;
  options: any[];
  required?: boolean;
  errors?: {
    message?: string;
  };
}  & SelectHTMLAttributes<HTMLSelectElement>;

const SelectComponent:React.FC<PropsSelect> = ({ label, options, required = false, errors, ...props }) => {
  return (
  <div className="flex flex-col">
    <label className="text-sm text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      className="border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      {...props}
      >
      <option value="">Seleccione una opción</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {errors && <span className="text-xs text-red-500 mt-1">{errors.message? errors.message : 'Campo obligatorio'}</span>}
  </div>
  )
}

export default SelectComponent
