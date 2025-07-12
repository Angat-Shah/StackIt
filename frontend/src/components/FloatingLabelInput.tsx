import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingLabelInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

export const FloatingLabelInput = ({ 
  id, 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  placeholder = ""
}: FloatingLabelInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasValue = value.length > 0;
  const shouldFloatLabel = isFocused || hasValue;

  return (
    <div className="relative">
      <Input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder={shouldFloatLabel ? placeholder : ""}
        className="peer h-14 rounded-2xl border-2 border-border bg-background px-4 pt-6 pb-2 text-base transition-all focus:border-primary"
      />
      
      <Label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none text-muted-foreground ${
          shouldFloatLabel
            ? "top-2 text-xs font-medium"
            : "top-1/2 -translate-y-1/2 text-base"
        }`}
      >
        {label}
      </Label>

      {isPassword && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );
};