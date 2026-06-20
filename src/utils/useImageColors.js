import { useState, useEffect } from 'react';

/**
 * Custom React hook to extract dominant color and text colors from an image source.
 * Uses a small canvas to calculate the average color of the image dynamically.
 * 
 * @param {string} imageSrc - The source path/URL of the image.
 * @param {object} defaultColors - Default colors to fall back on or merge.
 */
export default function useImageColors(imageSrc, defaultColors = {}) {
  const [colors, setColors] = useState({
    primaryText: '#1e293b',
    secondaryText: '#64748b',
    accentColor: '#f97316',
    isDark: false,
    badgeBg: 'rgba(255, 255, 255, 0.8)',
    badgeText: '#475569',
    borderColor: 'rgba(15, 23, 42, 0.05)',
    dominant: 'rgb(255, 255, 255)',
    pastelBg: 'rgb(203, 229, 245)',
    ...defaultColors
  });

  useEffect(() => {
    if (!imageSrc) return;

    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      if (!active) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 24, 24);
        const imgData = ctx.getImageData(0, 0, 24, 24).data;

        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i+1];
          const b = imgData[i+2];
          const a = imgData[i+3];

          // Filter out transparent pixels
          if (a > 30) {
            rSum += r;
            gSum += g;
            bSum += b;
            count++;
          }
        }

        if (count > 0) {
          const r = Math.round(rSum / count);
          const g = Math.round(gSum / count);
          const b = Math.round(bSum / count);

          // Calculate perceived brightness (BT.709 formula)
          const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const isDark = brightness < 140;

          let primaryText, secondaryText, accentColor, badgeBg, badgeText, borderColor;

          if (isDark) {
            // Darker background colors: Use white/light colors
            primaryText = '#ffffff';
            secondaryText = 'rgba(255, 255, 255, 0.75)';
            accentColor = '#fb923c'; // Lighter orange
            badgeBg = 'rgba(255, 255, 255, 0.15)';
            badgeText = '#ffffff';
            borderColor = 'rgba(255, 255, 255, 0.15)';
          } else {
            // Light background colors: Use deep matching tinted shades for optimal contrast
            const tr = Math.max(10, Math.min(30, r - 160));
            const tg = Math.max(10, Math.min(30, g - 160));
            const tb = Math.max(10, Math.min(30, b - 160));
            primaryText = `rgb(${tr}, ${tg}, ${tb})`;

            // Tinted medium colors
            const str = Math.max(40, Math.min(90, r - 100));
            const stg = Math.max(40, Math.min(90, g - 100));
            const stb = Math.max(40, Math.min(90, b - 100));
            secondaryText = `rgb(${str}, ${stg}, ${stb})`;

            accentColor = '#ea580c'; // Slate / Dark orange
            badgeBg = 'rgba(255, 255, 255, 0.75)';
            // Badge text color derived from image tint
            badgeText = `rgb(${Math.max(20, r - 130)}, ${Math.max(20, g - 130)}, ${Math.max(20, b - 130)})`;
            borderColor = 'rgba(15, 23, 42, 0.08)';
          }

          // Generate a soft light pastel background color that complements the dominant color
          const pastelBg = `rgb(${Math.round(r * 0.22 + 255 * 0.78)}, ${Math.round(g * 0.22 + 255 * 0.78)}, ${Math.round(b * 0.22 + 255 * 0.78)})`;

          setColors({
            primaryText,
            secondaryText,
            accentColor,
            isDark,
            badgeBg,
            badgeText,
            borderColor,
            dominant: `rgb(${r}, ${g}, ${b})`,
            pastelBg,
          });
        }
      } catch (err) {
        console.warn('Canvas color extraction failed (falling back to defaults):', err);
      }
    };

    return () => {
      active = false;
    };
  }, [imageSrc]);

  return colors;
}
