import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gota de sangue */}
          <path
            d="M20 4C20 4 8 16 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 16 20 4 20 4Z"
            fill="#EF4444"
          />
          {/* Coração interno */}
          <path
            d="M20 27.5C20 27.5 13.5 22 13.5 17.5C13.5 15.015 15.515 13 18 13C19.105 13 20 13.895 20 13.895C20 13.895 20.895 13 22 13C24.485 13 26.5 15.015 26.5 17.5C26.5 22 20 27.5 20 27.5Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
