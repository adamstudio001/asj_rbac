import { cn } from "@/lib/utils";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { useState } from "react";

function WhatsappInput({ register, errors }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex-1 min-w-[250px]">
      <Label>Whatsapp No</Label>
      <div className="flex rounded-md shadow-xs">
        <span
          className={cn(
            "inline-flex items-center rounded-l-md border-t-[1.2px] border-l-[1.2px] border-b-[1.2px] bg-background px-3 text-sm text-muted-foreground transition-colors",
            focused ? "border-blue-500 text-black" : "border-black"
          )}
        >
          +62
        </span>

        <Input
          className="-ms-px rounded-s-none shadow-none"
          type="text"
          {...register("whatsapp", {
            required: "Whatsapp is required",
          })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      {errors.whatsapp && (
        <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
      )}
    </div>
  );
}
export default WhatsappInput;