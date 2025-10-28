import React, { useState } from "react";
import { Label } from "@/Components/ui/Label";
import { Textarea } from "@/Components/ui/textarea";

export default function CustomTextArea({
  label,
  name,
  type = "text",
  register,
  errors,
  rules = {},
  disabled = false,
}) {
  return (
    <div className="flex-1 min-w-[250px]">
      <Label>{label}</Label>
      <Textarea
        type={type}
        disabled={disabled}
        {...register(name, rules)}
        // aria-invalid
      />
      {errors?.[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
}