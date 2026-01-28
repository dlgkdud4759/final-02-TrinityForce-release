interface ButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({ text = '등록하기', onClick, className = '' }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[90px] h-[38px] bg-brown-guide text-font-white rounded-lg font-medium transition-colors ${className}`}
    >
      {text}
    </button>
  );
}