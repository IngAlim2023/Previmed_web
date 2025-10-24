import { Controller } from "react-hook-form";
import Select from "react-select";

type TypeOptions = {
  value: string | number;
  label: any;
};

interface PropsReactSelect {
  name: string;
  control: any;
  label: string;
  options: TypeOptions[];
  required?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  selectProps?: any;
  mensaje?: string;
}

const ReactSelectComponent: React.FC<PropsReactSelect> = ({
  name,
  control,
  label,
  options,
  required = false,
  placeholder = "Seleccione una opción",
  isClearable = false,
  selectProps,
  mensaje = "Campo obligatorio",
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? mensaje : false }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select<TypeOptions>
              {...field}
              options={options}
              placeholder={placeholder}
              value={options.find((e) => e.value === field.value) || null}
              onChange={(selected) => field.onChange(selected?.value || null)}
              isClearable={isClearable}
              {...selectProps}
            />
            {error && (
              <span className="text-xs text-red-500 mt-1" role="alert">
                {error.message ? error.message : "Campo obligatorio"}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default ReactSelectComponent;
