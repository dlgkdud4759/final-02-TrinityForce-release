import React from "react";

type Props = {
  title: string;        // 큰 문장 (예: "아직 교환 내역이 없어요.")
  description?: string; // 작은 문장 (예: "첫 번째 교환을 시작해보세요!")
  className?: string;
};

export default function EmptyState({ title, description, className = "" }: Props) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        "min-h-[60vh]",
        className,
      ].join(" ")}
    >
      <p className="text-xl font-bold text-gray-dark">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-medium">{description}</p>
      )}
    </div>
  );
}
