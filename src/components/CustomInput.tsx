import React from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";

interface CustomInputProps {
  control: Control<any>; // Generalized to support dynamic schemas
  name: FieldPath<any>; // Allows for dynamic field paths
  label: string;
  placeholder?: string;
  as?: "input" | "select"; // Add `as` prop for conditional rendering
  options?: { label: string; value: string }[]; // Options for select dropdown
}

const CustomInput: React.FC<CustomInputProps> = ({
  control,
  name,
  label,
  placeholder,
  as = "input", // Default to input
  options = [],
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <FormLabel className="text-[14px] leading-[20px] w-full max-w-[280px] font-medium text-gray-200">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              {as === "select" ? (
                <select {...field} className="form-select">
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder={placeholder}
                  className="text-[16px] placeholder:text-[16px] leading-[24px] rounded-lg border border-gray-300 text-white placeholder:text-gray-500"
                  type={name === "password" ? "password" : "text"}
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage className="text-[12px] leading-[16px] text-red-500 mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
