import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface BioEnergyCardProps {
    userName?: string;
    isLocked?: boolean;
    unlockDays?: number;
}

export const BioEnergyCard: React.FC<BioEnergyCardProps> = ({ 
    userName = "Member Name", 
    isLocked = false,
    unlockDays = 0
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="relative w-full max-w-md mx-auto perspective-1000 h-[260px] md:h-[300px] cursor-pointer group"
             onClick={() => setIsFlipped(!isFlipped)}>
            
            {/* Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-[2rem] border border-white/10 transition-all duration-500 group-hover:bg-black/30">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 mb-4 shadow-xl">
                        <Icon icon="solar:lock-bold" width={32} />
                    </div>
                    <p className="text-white font-black uppercase tracking-widest text-xs">Unlocks In {unlockDays} Days</p>
                </div>
            )}

            <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* FRONT SIDE */}
                <div className={`absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20 ${isLocked ? 'grayscale opacity-50' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-500 to-teal-700" />
                    
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />

                    <div className="relative h-full w-full p-6 md:p-8 flex flex-col justify-between text-white">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h4 className="font-serif italic text-2xl md:text-3xl leading-none drop-shadow-md">Power Of</h4>
                                <h4 className="font-serif italic text-3xl md:text-4xl leading-none -mt-1 drop-shadow-md">Nature</h4>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="h-10 w-10 md:h-12 md:w-12 bg-emerald-400 rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                                    <Icon icon="solar:snow-bold" width={28} className="text-white" />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-tighter mt-1 opacity-80">BIO ENERGY</span>
                            </div>
                        </div>

                        {/* Center Graphic */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 transition-transform group-hover:scale-110 duration-700">
                             <div className="relative">
                                <Icon icon="solar:heart-bold" width={80} className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="solar:stethoscope-bold" width={40} className="text-white/80 translate-y-2" />
                                </div>
                             </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end border-t border-white/20 pt-4">
                            <div className="space-y-1">
                                <p className="text-[8px] opacity-70 font-black uppercase tracking-widest leading-none">This is Bio Energy FIR, Anti-Radiation</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Negative ION Card</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Icon icon="solar:verified-check-bold" width={24} className="text-white/90" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div className={`absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20 rotateY-180 ${isLocked ? 'grayscale opacity-50' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black" />
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                    <div className="relative h-full w-full p-6 md:p-8 flex flex-col justify-between text-white">
                        {/* Header */}
                        <div className="flex justify-center border-b border-white/10 pb-3">
                            <h4 className="font-serif italic text-xl md:text-2xl text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Live Healthy and Happily</h4>
                        </div>

                        <div className="flex gap-4 items-center flex-1 py-4">
                            {/* Human Silhouette */}
                            <div className="relative shrink-0 flex items-center justify-center">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
                                <Icon icon="healthicons:body-outline" width={80} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                {/* Scanning Lines */}
                                <motion.div 
                                    className="absolute left-0 right-0 h-0.5 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,1)]"
                                    animate={{ top: ['20%', '80%', '20%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* Details List */}
                            <div className="flex-1 space-y-1 md:space-y-1.5 overflow-hidden">
                                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 leading-tight">
                                    Nano-tech processing eliminates impure Infrared Rays, retaining pure FIR wave lengths for human needs.
                                </p>
                                <div className="space-y-1">
                                    <p className="text-[7px] md:text-[8px] font-black text-cyan-500 uppercase tracking-widest border-b border-cyan-900/50 pb-0.5 w-fit">Functions & Use:</p>
                                    {[
                                        'Improves body micro-circulation',
                                        'Helps in recovering from fatigue',
                                        'Removes the body odour',
                                        'Energizes the feet (beside socks)',
                                        'Relief from pain (near wound)',
                                        'Improves sleep (beside pillow)'
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <div className="h-1 w-1 bg-cyan-400 rounded-full" />
                                            <span className="text-[7px] md:text-[8px] font-medium text-gray-300 truncate">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end border-t border-white/10 pt-3">
                            <div className="space-y-0.5">
                                <p className="text-[7px] opacity-60 font-black uppercase">Verified Holder</p>
                                <p className="text-[10px] font-black uppercase text-white truncate max-w-[120px]">{userName}</p>
                            </div>
                            <div className="text-[8px] font-mono text-cyan-500/80 tracking-tighter">BFE-ENERGY-VERIFIED</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CSS for 3D flip since Tailwind doesn't have all by default */}
            <style dangerouslySetInnerHTML={{ __html: `
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotateY-180 { transform: rotateY(180deg); }
            `}} />
        </div>
    );
};
