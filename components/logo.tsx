import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  className = "h-11 w-auto object-contain",
  width = 144,
  height = 100,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/logoHB.png"
      alt="HappyBirth — Szkoła Rodzenia Online"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
