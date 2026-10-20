// Bull head SVG logo component — brand icon for Budget Meat Shop
interface BullLogoProps {
  className?: string;
  size?: number;
}

export default function BullLogo({ className = '', size }: BullLogoProps) {
  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;
  const baseClass = size ? className : `${className || 'h-10 w-10'}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={baseClass}
      style={sizeStyle}
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="32" fill="#064A96" />

      {/* Horns */}
      <path
        d="M12 18 C8 10 16 6 20 14"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 18 C56 10 48 6 44 14"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head shape */}
      <ellipse cx="32" cy="34" rx="16" ry="18" fill="white" />

      {/* Snout */}
      <ellipse cx="32" cy="44" rx="9" ry="6" fill="#064A96" />
      {/* Nostrils */}
      <circle cx="28.5" cy="44" r="2.5" fill="white" />
      <circle cx="35.5" cy="44" r="2.5" fill="white" />

      {/* Eyes */}
      <circle cx="25" cy="31" r="3.5" fill="#064A96" />
      <circle cx="39" cy="31" r="3.5" fill="#064A96" />
      <circle cx="25" cy="31" r="1.5" fill="white" />
      <circle cx="39" cy="31" r="1.5" fill="white" />

      {/* Ears */}
      <ellipse cx="16" cy="30" rx="5" ry="7" fill="white" />
      <ellipse cx="48" cy="30" rx="5" ry="7" fill="white" />
      <ellipse cx="16" cy="30" rx="3" ry="4.5" fill="#E51E2A" />
      <ellipse cx="48" cy="30" rx="3" ry="4.5" fill="#E51E2A" />

      {/* Forehead detail */}
      <path
        d="M24 22 C28 18 36 18 40 22"
        stroke="#064A96"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
