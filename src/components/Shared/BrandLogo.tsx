import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
  tone?: 'default' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  linkToHome = true,
}) => {
  const height = size === 'sm' ? 44 : size === 'lg' ? 72 : 56;

  const logoContent = (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <img
        src="/images/budget-meat-shop-logo.png"
        alt="Budget Meat Shop"
        height={height}
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain"
      />
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default BrandLogo;
