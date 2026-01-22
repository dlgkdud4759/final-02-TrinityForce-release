"use client";

import React, { useState } from "react";
import { EyeIcon } from "@/app/components/icons/Eye";
import { EyeOffIcon } from "@/app/components/icons/EyeOff";



type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({ value, onChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-[353px]">
      <input
        type={show ? "text" : "password"}
        placeholder="비밀번호"
        value={value}
        onChange={onChange}
        className="
          w-[353px] h-[56px]
          px-4 pr-12
          rounded-xl border border-[#966E4F]
          text-base text-[#333333] placeholder:text-[#767676]
          bg-white
          outline-none focus:border-[#AD8E76] focus:ring-1 focus:ring-[#AD8E76]
          transition
        "
      />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {show ? (
          <EyeIcon className="w-6 h-6"></EyeIcon>
        ) : (
          <EyeOffIcon className="w-6 h-6"></EyeOffIcon>
        )
        }
      </button>
    </div>
  );
}
