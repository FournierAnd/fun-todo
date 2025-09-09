"use client"
import { useState } from "react";
import { MdCheck } from "react-icons/md";

export default function AnimatedTitle() {

    const [showCheckConfettis, setShowCheckConfettis] = useState(false);

    const availableColors = [
        "ffe97a",
        "f7a6c2",
        "33d7d4",
        "b5e28c",
        "ffa970",
        "d1b7e6",
    ];

    const handleMouseEnter = () => {
        setShowCheckConfettis(true);
        setTimeout(() => setShowCheckConfettis(false), 800);
    }

    const confettiCheckmarks = Array.from({ length: 11 });

    return (
        <div className="flex items-center justify-center relative">
            <div className="relative inline-block">
                <h1
                    onMouseEnter={handleMouseEnter}
                    className="text-black dark:text-white text-center text-6xl p-10 bounce-on-hover cursor-pointer select-none"
                >
                    Fun Todo
                </h1>

                {showCheckConfettis && confettiCheckmarks.map((_, i) => {
                    const x = (Math.random() - 0.5) * 350;      // left/right px
                    const y = (Math.random() - 0.5) * -60 - 20; // upward px
                    const r = Math.random() * 360 + 'deg';     // rotation
                    const c = availableColors[(Math.floor(Math.random() * availableColors.length))]; // color

                    return (
                        <div
                            key={i}
                            className="absolute left-1/2 top-[10px] text-[#000] confetti-check"
                            style={{ '--x': `${x}px`, '--y': `${y}px`, '--r': r, } as React.CSSProperties}
                        >
                            <MdCheck size="2rem" style={{ color: `#${c}` }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}