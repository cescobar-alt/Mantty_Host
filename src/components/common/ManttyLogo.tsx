import React from 'react';
import { HousePlus } from 'lucide-react';

interface ManttyLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | number;
}

/**
 * ManttyLogo Component
 * Based on the official design: A green rounded square (squircle) 
 * contenting the Lucide HousePlus icon in white.
 */
export const ManttyLogo: React.FC<ManttyLogoProps> = ({ className = '', size = 'md' }) => {
    // Sizing and rounding proportions to match the official brand asset
    const sizeClasses = {
        sm: 'w-8 h-8 rounded-[10px]',
        md: 'w-10 h-10 rounded-[12px]',
        lg: 'w-16 h-16 rounded-[22px]',
        xl: 'w-24 h-24 rounded-[32px]'
    };

    // Icon sizing relative to its container
    const iconSizes = {
        sm: 18,
        md: 22,
        lg: 38,
        xl: 56
    };

    const dimensionClass = typeof size === 'string' ? sizeClasses[size as keyof typeof sizeClasses] : '';
    const iconSize = typeof size === 'string' ? iconSizes[size as keyof typeof iconSizes] : (size as number) * 0.6;
    const style = typeof size === 'number' ? { width: size, height: size, borderRadius: size * 0.3 } : {};

    return (
        <div
            className={`mantty-gradient flex items-center justify-center shrink-0 shadow-lg shadow-mantty-primary/10 ${dimensionClass} ${className}`}
            style={style}
        >
            <HousePlus
                size={iconSize}
                color="white"
                strokeWidth={2.4}
            />
        </div>
    );
};
