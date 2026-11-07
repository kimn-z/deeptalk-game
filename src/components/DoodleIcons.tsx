import React from 'react';

interface DoodleIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export const DoodleIcon: React.FC<DoodleIconProps> = ({
  name,
  className = 'w-6 h-6',
  strokeWidth = 2.2,
}) => {
  switch (name) {
    case 'heart':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand drawn wobbly heart */}
          <path d="M12 20.3C7.5 17.5 3.2 13.9 3.5 9.2C3.7 6 6.1 3.8 9.2 4.2C10.8 4.4 12 5.5 12 5.5C12 5.5 13.2 4.4 14.8 4.2C17.9 3.8 20.3 6 20.5 9.2C20.8 13.9 16.5 17.5 12 20.3Z" />
        </svg>
      );
    case 'star':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Hand drawn sketched star */}
          <path d="M12 2.5L14.7 8.3L21.2 9.1L16.4 13.6L17.7 20.1L12 16.9L6.3 20.1L7.6 13.6L2.8 9.1L9.3 8.3L12 2.5Z" />
          <path d="M11.5 5.5L13.5 10L18.5 10.5" strokeOpacity="0.4" />
        </svg>
      );
    case 'coffee':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M18 8H5C4.4 8 4 8.5 4.1 9.1L5.3 18.2C5.5 19.8 6.9 21 8.5 21H14.5C16.1 21 17.5 19.8 17.7 18.2L18.9 9.1C19 8.5 18.6 8 18 8Z" />
          <path d="M18 10H19.5C20.9 10 22 11.1 22 12.5C22 13.9 20.9 15 19.5 15H17.5" />
          {/* Steam doodles */}
          <path d="M8 3C7.5 4 8.5 5 8 6" />
          <path d="M12 2.5C11.5 3.8 12.5 4.8 12 6" />
          <path d="M15.5 3C15 4 16 5 15.5 6" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 3C12 7.5 10 9.5 5.5 12C10 14.5 12 16.5 12 21C12 16.5 14 14.5 18.5 12C14 9.5 12 7.5 12 3Z" />
          <circle cx="19" cy="5" r="1.5" fill="currentColor" />
          <circle cx="5" cy="19" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'cloud':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6.5 18.5H17.5C19.7 18.5 21.5 16.7 21.5 14.5C21.5 12.4 19.9 10.7 17.8 10.5C17.3 7.4 14.7 5 11.5 5C8.8 5 6.5 6.7 5.7 9.2C3.6 9.6 2 11.4 2 13.6C2 16.3 4 18.5 6.5 18.5Z" />
        </svg>
      );
    case 'key':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="8" cy="8" r="4.5" />
          <path d="M11.5 11.5L20.5 20.5" />
          <path d="M17 17L19 15" />
          <path d="M19 19L21 17" />
        </svg>
      );
    case 'moon':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M20.5 14.5C19.3 18.2 15.4 20.8 11 20.5C6.3 20.2 2.5 16.4 2.2 11.7C1.9 7.3 4.5 3.4 8.2 2.2C7.3 4.2 7.5 6.6 8.7 8.5C10.3 11 13.2 12.3 16.2 11.8C17.6 13 19.1 13.9 20.5 14.5Z" />
        </svg>
      );
    case 'letter':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="M3.5 7L12 13L20.5 7" />
          <path d="M10.8 11.2L12 12.3L13.2 11.2" strokeWidth={3} />
        </svg>
      );
    case 'flame':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2.5C12 2.5 7.5 7.5 7.5 13C7.5 16.5 9.5 19.5 12 19.5C14.5 19.5 16.5 16.5 16.5 13C16.5 7.5 12 2.5 12 2.5Z" />
          <path d="M12 11C12 11 10.5 13 10.5 15C10.5 16.2 11.2 17 12 17C12.8 17 13.5 16.2 13.5 15C13.5 13 12 11 12 11Z" />
        </svg>
      );
    case 'gift':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect x="4" y="9" width="16" height="12" rx="1.5" />
          <rect x="3" y="5.5" width="18" height="3.5" rx="1" />
          <path d="M12 5.5V21" />
          <path d="M12 5.5C10.5 3.5 8 3.5 7.5 4.5C7 5.5 8.5 5.5 12 5.5Z" />
          <path d="M12 5.5C13.5 3.5 16 3.5 16.5 4.5C17 5.5 15.5 5.5 12 5.5Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};

/** Cute doodle arrow pointing to something */
export const DoodleArrow: React.FC<{ className?: string; direction?: 'right' | 'left' | 'down' | 'curved' }> = ({
  className = 'w-8 h-8',
  direction = 'right',
}) => {
  return (
    <svg
      viewBox="0 0 50 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        transform: direction === 'left' ? 'scaleX(-1)' : direction === 'down' ? 'rotate(90deg)' : undefined,
      }}
    >
      <path d="M5 16C16 14 30 15 43 14" />
      <path d="M35 8L44 14L34 22" />
    </svg>
  );
};

/** Doodle squiggly underline */
export const DoodleUnderline: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-3',
  color = '#FF9EAA',
}) => {
  return (
    <svg
      viewBox="0 0 120 12"
      fill="none"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      className={className}
      preserveAspectRatio="none"
    >
      <path d="M3 7C22 2 45 10 68 6C85 3 103 9 117 5" />
    </svg>
  );
};
