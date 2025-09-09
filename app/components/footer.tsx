"use client"
import "@/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {

    const { t, i18n } = useTranslation();

    const date = String(new Date().getFullYear());

    const [ready, setReady] = useState(false);

    
    useEffect(() => {
        if (i18n.isInitialized) {
            setReady(true);
        } else {
            i18n.on("initialized", () => {
                setReady(true);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!ready) return null;

    return (
        <div className="flex justify-center items-center p-4 text-black dark:text-white z-0">
            © {date} Andréanne Fournier | {t("copyright")}
        </div>
    );
}