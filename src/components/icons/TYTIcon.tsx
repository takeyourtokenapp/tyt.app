import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconName =
  | 'home'
  | 'wallet'
  | 'token'
  | 'marketplace'
  | 'mining'
  | 'staking'
  | 'governance'
  | 'ai'
  | 'security'
  | 'foundation';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconVariant = 'outline' | 'solid';

interface TYTIconProps {
  name: IconName;
  size?: IconSize;
  variant?: IconVariant;
  active?: boolean;
  pulse?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  onClick?: () => void;
}

/**
 * TYT Icon Component
 *
 * Unified icon system for takeyourtoken.app
 * Supports SVG icons with CSS-based animations
 *
 * @example
 * <TYTIcon name="wallet" size="md" active />
 * <TYTIcon name="ai" pulse />
 */
export default function TYTIcon({
  name,
  size = 'md',
  variant = 'outline',
  active = false,
  pulse = false,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  onClick
}: TYTIconProps) {
  const iconClasses = [
    'tyt-icon',
    `tyt-icon--${size}`,
    `tyt-icon--${variant}`,
    active && 'tyt-icon--active',
    pulse && 'tyt-icon--pulse',
    disabled && 'tyt-icon--disabled',
    className
  ].filter(Boolean).join(' ');

  // Map icon names to SVG paths or fallback to lucide-react
  const iconPath = `/assets/icons/navbar/icon-${name}.svg`;

  return (
    <span
      className={iconClasses}
      aria-label={ariaLabel || name}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      <img
        src={iconPath}
        alt={name}
        onError={(e) => {
          // Fallback if SVG not found - show placeholder
          e.currentTarget.style.display = 'none';
        }}
      />
    </span>
  );
}

/**
 * Navbar Icon - Pre-configured for navigation
 */
export function NavbarIcon({
  name,
  active,
  ...props
}: Omit<TYTIconProps, 'size'>) {
  return (
    <TYTIcon
      name={name}
      size="md"
      active={active}
      className="navbar-icon"
      {...props}
    />
  );
}

/**
 * Dashboard Icon - Pre-configured for dashboard cards
 */
export function DashboardIcon({
  name,
  ...props
}: Omit<TYTIconProps, 'size'>) {
  return (
    <TYTIcon
      name={name}
      size="lg"
      className="dashboard-icon"
      {...props}
    />
  );
}
