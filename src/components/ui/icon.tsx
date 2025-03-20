import React from 'react';
import Image from 'next/image';

type IconProps = {
  name: 'logo' | 'app-icon' | 'apple-icon' | 'favicon';
  size?: number;
  className?: string;
};

const iconPaths = {
  'logo': '/assets/images/icon.svg',
  'app-icon': '/assets/images/icon.png',
  'apple-icon': '/assets/images/apple-icon.png',
  'favicon': '/assets/favicons/favicon.ico'
};

export function Icon({ name, size = 24, className = '' }: IconProps) {
  return (
    <Image
      src={iconPaths[name]}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
} 