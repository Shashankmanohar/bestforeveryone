import React, { useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface UserIDCardInlineProps {
  user: {
    fullname: string;
    username: string;
    id: string;
    referralCode: string;
    createdAt?: string;
    verified?: boolean;
    status?: string;
  };
}

export const UserIDCardInline: React.FC<UserIDCardInlineProps> = ({ user }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCard = (ctx: CanvasRenderingContext2D) => {
    const width = 1000;
    const height = 630;
    const padding = 60;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#111827'); // gray-900
    gradient.addColorStop(1, '#1f2937'); // gray-800
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 40);
    ctx.fill();

    // Subtle Pattern/Overlay
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < width; i += 40) {
      for (let j = 0; j < height; j += 40) {
        ctx.beginPath();
        ctx.arc(i, j, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Header Glow
    const headerGlow = ctx.createRadialGradient(width / 2, 0, 0, width / 2, 0, 400);
    headerGlow.addColorStop(0, 'rgba(59, 130, 246, 0.15)'); // blue-500
    headerGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = headerGlow;
    ctx.fillRect(0, 0, width, 400);

    // Business Name / Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('BEST FOR EVERYONE', padding, padding + 20);
    
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillStyle = '#9ca3af'; // gray-400
    ctx.fillText('PERSONAL IDENTITY CARD', padding, padding + 55);

    // Profile Section
    const avatarSize = 180;
    const avatarX = padding;
    const avatarY = 160;

    // Avatar Background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Initials
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 72px Inter, sans-serif';
    ctx.textAlign = 'center';
    const initials = user.fullname?.split(' ').map(n => n[0]).join('') || 'U';
    ctx.fillText(initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 25);
    ctx.textAlign = 'left';

    // User Info
    const infoX = avatarX + avatarSize + 50;
    const infoY = avatarY + 30;

    // Full Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillText(user.fullname.toUpperCase(), infoX, infoY + 15);

    // Username
    ctx.fillStyle = '#60a5fa'; // blue-400
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`@${user.username}`, infoX, infoY + 55);

    // Verified Badge
    if (user.verified) {
      ctx.fillStyle = '#10b981'; // emerald-500
      ctx.beginPath();
      ctx.roundRect(infoX, infoY + 75, 140, 34, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('VERIFIED', infoX + 35, infoY + 97);
    }

    // Grid lines for details
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, 380);
    ctx.lineTo(width - padding, 380);
    ctx.stroke();

    // Details Grid
    const gridY = 440;
    const col1X = padding;
    const col2X = width / 2;

    const drawDetail = (label: string, value: string, x: number, y: number, color?: string) => {
      ctx.fillStyle = '#9ca3af'; // gray-400
      ctx.font = '500 18px Inter, sans-serif';
      ctx.fillText(label.toUpperCase(), x, y);
      
      ctx.fillStyle = color || '#ffffff';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText(value, x, y + 35);
    };

    drawDetail('User ID', user.id, col1X, gridY);
    drawDetail('Referral Code', user.referralCode, col2X, gridY);
    drawDetail('Joined Date', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', col1X, gridY + 90);
    drawDetail('Status', user.status || 'Active', col2X, gridY + 90, user.status === 'blocked' ? '#ef4444' : '#ffffff');

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = 'italic 16px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('www.bestforeveryone.com', width - padding, height - 30);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawCard(ctx);
      }
    }
  }, [user]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ID_CARD_${user.username}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="aspect-[1000/630] w-full relative group">
        <canvas
          ref={canvasRef}
          width={1000}
          height={630}
          className="w-full h-full rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 object-contain bg-gray-900"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-3xl pointer-events-none">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-gray-900 text-sm font-bold shadow-lg">
            <Icon icon="solar:camera-bold" width={18} />
            ID Card Preview
          </div>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 click-scale transition-all"
      >
        <Icon icon="solar:download-bold" width={20} />
        Download ID Card
      </button>
    </div>
  );
};
