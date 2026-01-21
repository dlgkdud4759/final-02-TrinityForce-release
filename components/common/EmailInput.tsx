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
        rounded-xl border border-[#966E4F]
        text-base text-[#333333] placeholder:text-[#767676]
        bg-white
        outline-none focus:border-[#AD8E76] focus:ring-1 focus:ring-[#AD8E76]
        transition
      "
    />
  );
}
