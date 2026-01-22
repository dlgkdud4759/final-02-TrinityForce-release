import React from "react";

type EmailInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function EmailInput({
  value,
  onChange,
}: EmailInputProps) {
  return (
    <input
      type="email"
      placeholder="example@email.com"
      value={value}
      onChange={onChange}
      className="
        w-[353px] h-[56px]
        px-4
        rounded-xl border border-brown-accent
        text-base text-font-dark placeholder:text-gray-dark
        bg-white
        outline-none focus:border-brown-guide focus:ring-1 focus:ring-brown-guide
        transition
      "
    />
  );
}
