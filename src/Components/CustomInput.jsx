import React, { useState } from "react";
import { Label } from "@/Components/ui/Label";
import { Input } from "@/Components/ui/Input";

export default function CustomInput({
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
      <Input
        type={type}
        disabled={disabled}
        {...register(name, rules)}
      />
      {errors?.[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
}