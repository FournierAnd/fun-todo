"use client"
import { useEffect, useState } from "react";

export default function usePageSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {

        const handleResize = () => {
            setSize({ width: window.innerWidth, height: document.documentElement.scrollHeight });
            //console.log("width:", window.innerWidth, "height:", document.documentElement.scrollHeight);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}