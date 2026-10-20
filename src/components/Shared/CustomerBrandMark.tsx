interface CustomerBrandMarkProps {
  className?: string;
}

export default function CustomerBrandMark({ className = '' }: CustomerBrandMarkProps) {
  return (
    <span role="img" aria-label="Budget Meat Shop" className={`inline-flex items-center leading-none ${className}`}>
      <img
        src="/images/budget-meat-shop-logo.png"
        alt="Budget Meat Shop"
        className="h-12 w-auto object-contain"
      />
    </span>
  );
}
