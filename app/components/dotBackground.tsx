"use client"
import { Fragment, useEffect, useState } from "react";
import usePageSize from "../custom-hooks/usePageSize";

type Dot = { x: number; y: number };

export default function DotBackground() {

    const { width, height } = usePageSize();
    const [bouncingDots, setBouncingDots] = useState<Dot[]>([]); // New dots
    const [prevDots, setPrevDots] = useState<typeof bouncingDots | null>(null); // Old dots
    const [fadeOut, setFadeOut] = useState(false);

    // Grid settings (to match the SVG pattern used below)
    const gridSize = 22;
    const dotOffset = 2;
    const numDots = 25;

    function getRandomSubset<T>(array: T[], count: number): T[] {
        const result: T[] = [];
        const taken = new Set<number>();

        while (result.length < count && result.length < array.length) {
            const index = Math.floor(Math.random() * array.length);
            if (!taken.has(index)) {
                taken.add(index);
                result.push(array[index]);
            }
        }

        return result;
    }

    useEffect(() => {

        if (width === 0 || height === 0) return;

        const updateDots = () => {

            const cols = Math.floor(width / gridSize);
            const rows = Math.floor(height / gridSize);

            const allDots: Dot[] = [];

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    allDots.push({
                        x: x * gridSize + dotOffset,
                        y: y * gridSize + dotOffset,
                    });
                }
            }

            const selected = getRandomSubset(allDots, numDots);
            setPrevDots(bouncingDots);
            setFadeOut(true);

            setTimeout(() => {
                setBouncingDots(selected);
                setFadeOut(false);
                setPrevDots(null);
            }, 500);
        };

        updateDots(); // initial call

        const interval = setInterval(updateDots, 10000);

        return () => clearInterval(interval);

    }, [width, height]);

    return (
        <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="dotGrid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#e6e6e6" />
                </pattern>
            </defs>

            {/* Background */}
            <rect width="100%" height="100%" fill="url(#dotGrid)" />

            {/* Animated Dots */}
            {/* Old Dots */}
            {prevDots && prevDots.map((dot, i) => (
                <Fragment key={`prev-${i}`}>
                    {/* Background dot */}
                    <circle cx={dot.x} cy={dot.y} r="3" className="fill-white dark:fill-[#212121]" style={{ opacity: fadeOut ? 1 : 0, transition: 'opacity 1.5s ease' }} />

                    {/* Animated dot */}
                    <circle cx={dot.x} cy={dot.y} r="2" fill="#bfbfbf" style={{ opacity: fadeOut ? 1 : 0, transition: 'opacity 1.5s ease' }}>
                        <animate
                            attributeName="cy"
                            values={`${dot.y};${dot.y - 10};${dot.y}`}
                            dur="1s"
                            repeatCount="indefinite"
                            begin={`${Math.random() * 2}s`}
                        />
                    </circle>
                </Fragment>
            ))}

            {/* New Dots */}
            {bouncingDots.map((dot, i) => (
                <Fragment key={`new-${i}`}>
                    {/* Background dot */}
                    <circle cx={dot.x} cy={dot.y} r="3" className="fill-white dark:fill-[#212121]" style={{ opacity: prevDots ? 0 : 1, transition: 'opacity 1s ease' }} />

                    {/* Animated dot */}
                    <circle cx={dot.x} cy={dot.y} r="2" fill="#bfbfbf" style={{ opacity: prevDots ? 0 : 1, transition: 'opacity 1s ease' }}>
                        <animate
                            attributeName="cy"
                            values={`${dot.y};${dot.y - 10};${dot.y}`}
                            dur="1s"
                            repeatCount="indefinite"
                            begin={`${Math.random() * 2}s`}
                        />
                    </circle>
                </Fragment>
            ))}
        </svg>
    );
}
