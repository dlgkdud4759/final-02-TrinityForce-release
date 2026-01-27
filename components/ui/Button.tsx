// app/components/common/Button.tsx
interface ButtonProps {
  text?: string;
}

export default function Button({ text = '등록하기' }: ButtonProps) {
  return (
    <button
      type="button"
      className="w-[90px] h-[38px] bg-[var(--color-brown-guide)] text-[var(--color-font-white)] rounded-lg font-medium hover:bg-[var(--color-brown-accent)] transition-colors"
    >
      {text}
    </button>
  );
}