"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  type?: React.HTMLInputTypeAttribute;
  placeholder: string;

  buttonText: string;
  onButtonClick: () => void;
};

export default function InputWithButton({
  value,
  onChange,
  type = "text",
  placeholder,
  buttonText,
  onButtonClick,
}: Props) {
  return (
    <div className="relative w-[353px]">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-[353px] h-[56px]
          px-4 pr-24
          rounded-xl border border-[#966E4F]
          text-base text-[#333333] placeholder:text-[#767676]
          bg-white
          outline-none focus:border-[#AD8E76] focus:ring-1 focus:ring-[#AD8E76]
          transition
        "
      />

      <button
        type="button"
        onClick={onButtonClick}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          h-[32px] px-3
          rounded-full
          bg-[#8B6A4E]
          text-xs text-white
          hover:bg-[#7A5C43]
          transition
        "
      >
        {buttonText}
      </button>
    </div>
  );
}
