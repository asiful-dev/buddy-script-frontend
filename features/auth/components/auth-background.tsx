'use client';

import Image from 'next/image';

/**
 * Auth Background Component
 * Provides decorative background shapes for auth pages
 */
export default function AuthBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#F0F2F5]">
      <Image
        src="/assests/shape1.svg"
        alt="shape"
        width={200}
        height={200}
        className="absolute top-0 left-0"
      />
      <Image
        src="/assests/shape2.svg"
        alt="shape"
        width={500}
        height={500}
        className="absolute top-0 right-0"
      />
      <Image
        src="/assests/shape3.svg"
        alt="shape"
        width={300}
        height={300}
        className="absolute bottom-0 right-10"
      />
    </div>
  );
}

