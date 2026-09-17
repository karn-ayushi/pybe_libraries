import React from 'react';

export type CharacterType = 'ayushi' | 'ayush' | string;
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface CharacterAvatarProps {
  character: CharacterType;
  size?: AvatarSize;
  className?: string;
  isSpeaking?: boolean;
  mood?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = 'md',
  className = '',
  isSpeaking = false,
}) => {
  const isAyushi = character.toLowerCase().includes('ayushi') || character.toLowerCase().includes('learner');

  // Dimension mapping
  const sizeClasses: Record<AvatarSize, { box: string; svg: string }> = {
    xs: { box: 'w-6 h-6', svg: 'w-5 h-5' },
    sm: { box: 'w-8 h-8', svg: 'w-7 h-7' },
    md: { box: 'w-11 h-11 sm:w-12 sm:h-12', svg: 'w-10 h-10 sm:w-11 sm:h-11' },
    lg: { box: 'w-14 h-14 sm:w-16 sm:h-16', svg: 'w-12 h-12 sm:w-14 sm:h-14' },
    xl: { box: 'w-20 h-20 sm:w-24 sm:h-24', svg: 'w-18 h-18 sm:w-20 sm:h-20' },
    '2xl': { box: 'w-28 h-28 sm:w-32 sm:h-32', svg: 'w-24 h-24 sm:w-28 sm:h-28' },
  };

  const { box } = sizeClasses[size] || sizeClasses.md;

  if (isAyushi) {
    // Hand-drawn sketch style SVG for Ayushi - Pink aesthetic
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl transition-all duration-300 select-none overflow-hidden ${box} ${
          isSpeaking
            ? 'bg-[#FFF1F2] ring-2 ring-[#EC4899] shadow-sm'
            : 'bg-[#FFF5F7] border border-[#FBCFE8]'
        } ${className}`}
        title="Ayushi"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-contain p-0.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle rose wash background */}
          <circle cx="50" cy="50" r="46" fill="#FFF1F2" />
          <path
            d="M20 88C22 72 32 64 50 64C68 64 78 72 80 88"
            fill="#EC4899"
            fillOpacity="0.85"
            stroke="#2B2118"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Collar/Shirt neckline */}
          <path
            d="M42 66L50 76L58 66"
            stroke="#2B2118"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 76V88"
            stroke="#2B2118"
            strokeWidth="1.8"
            strokeDasharray="2 2"
          />
          {/* Neck */}
          <path
            d="M44 54V64H56V54"
            fill="#F7D3B8"
            stroke="#2B2118"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Back Hair */}
          <path
            d="M25 45C22 55 24 66 28 72C32 72 34 68 35 60"
            fill="#3B2A1E"
            stroke="#2B2118"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M75 45C78 55 76 66 72 72C68 72 66 68 65 60"
            fill="#3B2A1E"
            stroke="#2B2118"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Face */}
          <ellipse
            cx="50"
            cy="44"
            rx="19"
            ry="21"
            fill="#FFE3CD"
            stroke="#2B2118"
            strokeWidth="2.4"
          />
          {/* Hair Front / Wavy Bangs with hand-drawn texture */}
          <path
            d="M29 38C32 25 42 20 50 20C60 20 69 26 71 38C64 30 57 32 50 33C42 34 35 32 29 38Z"
            fill="#3B2A1E"
            stroke="#2B2118"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M30 38C34 44 33 52 35 55"
            stroke="#2B2118"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M70 38C66 44 67 52 65 55"
            stroke="#2B2118"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Cheeks - delicate pink blush */}
          <ellipse cx="38" cy="49" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.65" />
          <ellipse cx="62" cy="49" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.65" />
          {/* Glasses / Frames - stylish hand-drawn wire frames */}
          <circle
            cx="40"
            cy="43"
            r="6.5"
            fill="none"
            stroke="#4A3423"
            strokeWidth="1.8"
          />
          <circle
            cx="60"
            cy="43"
            r="6.5"
            fill="none"
            stroke="#4A3423"
            strokeWidth="1.8"
          />
          {/* Glasses bridge */}
          <path
            d="M46.5 43C48.5 41.5 51.5 41.5 53.5 43"
            stroke="#4A3423"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Eyes behind glasses */}
          <circle cx="40" cy="43" r="1.6" fill="#2B2118" />
          <circle cx="60" cy="43" r="1.6" fill="#2B2118" />
          {/* Eyebrows */}
          <path
            d="M34 35C37 34 42 34 45 36"
            stroke="#2B2118"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M55 36C58 34 63 34 66 35"
            stroke="#2B2118"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Nose */}
          <path
            d="M49 46C50 48 51 49 52 48.5"
            stroke="#2B2118"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Friendly Smile */}
          <path
            d="M44 54C47 57 53 57 56 54"
            stroke="#2B2118"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {isSpeaking && (
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#EC4899] border-2 border-[#FFF1F2]" />
        )}
      </div>
    );
  }

  // Hand-drawn sketch style SVG for Ayush - Orange aesthetic
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl transition-all duration-300 select-none overflow-hidden ${box} ${
        isSpeaking
          ? 'bg-[#FFF7ED] ring-2 ring-[#F97316] shadow-sm'
          : 'bg-[#FFF9F2] border border-[#FED7AA]'
      } ${className}`}
      title="Ayush"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-contain p-0.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle warm orange wash background */}
        <circle cx="50" cy="50" r="46" fill="#FFF7ED" />
        {/* Body / Amber Orange Sweater with hand-drawn hatching */}
        <path
          d="M20 88C22 70 33 63 50 63C67 63 78 70 80 88"
          fill="#F97316"
          fillOpacity="0.9"
          stroke="#1A2634"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Shirt collar under sweater */}
        <path
          d="M40 64L50 74L60 64"
          fill="#FFFFFF"
          stroke="#1A2634"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48 74V88"
          stroke="#1A2634"
          strokeWidth="1.8"
          strokeDasharray="2 2"
        />
        {/* Neck */}
        <path
          d="M43 53V63H57V53"
          fill="#F7D3B8"
          stroke="#1A2634"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Face */}
        <ellipse
          cx="50"
          cy="43"
          rx="18"
          ry="20"
          fill="#FCE0CB"
          stroke="#1A2634"
          strokeWidth="2.4"
        />
        {/* Hair - Neat short side-part with hand-drawn texture */}
        <path
          d="M31 36C30 25 40 18 52 18C64 18 70 23 70 34C68 28 58 26 48 26C38 26 33 30 31 36Z"
          fill="#222B35"
          stroke="#1A2634"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M31 36C33 42 32 46 33 48"
          stroke="#1A2634"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M69 34C67 40 68 45 67 48"
          stroke="#1A2634"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Ears */}
        <path
          d="M32 42C30 42 30 46 32 47"
          stroke="#1A2634"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M68 42C70 42 70 46 68 47"
          stroke="#1A2634"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Eyes - Calm, confident gaze */}
        <ellipse cx="41" cy="42" rx="1.8" ry="2" fill="#1A2634" />
        <ellipse cx="59" cy="42" rx="1.8" ry="2" fill="#1A2634" />
        {/* Subtle eye sparkle */}
        <circle cx="41.5" cy="41.5" r="0.6" fill="#FFFFFF" />
        <circle cx="59.5" cy="41.5" r="0.6" fill="#FFFFFF" />
        {/* Distinctive, thoughtful Eyebrows */}
        <path
          d="M36 36C39 34 44 35 46 36.5"
          stroke="#1A2634"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M54 36.5C56 35 61 34 64 36"
          stroke="#1A2634"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Nose */}
        <path
          d="M50 42V47C50 48 51 48.5 52 48"
          stroke="#1A2634"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Cheerful Guide Smile */}
        <path
          d="M43 53C47 56 53 56 57 53"
          stroke="#1A2634"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Small chin detail */}
        <path
          d="M48 58C49.5 59 50.5 59 52 58"
          stroke="#1A2634"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {isSpeaking && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#F97316] border-2 border-[#FFF7ED]" />
      )}
    </div>
  );
};
