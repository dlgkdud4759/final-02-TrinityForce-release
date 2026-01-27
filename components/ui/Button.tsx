interface ButtonProps {
  text?: string;
}

export default function Button({ text = '등록하기' }: ButtonProps) {
  return (
    <button
      type="button"
      className="w-[90px] h-[38px] bg-brown-guide text-font-white rounded-lg font-medium text-brown-accent transition-colors"
    >
      {text}
    </button>
  );
}