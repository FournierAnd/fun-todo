"use client"
import "@/i18n";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageButton() {
    const { i18n } = useTranslation();
    const [chosenLanguage, setChosenLanguage] = useState("en");

    useEffect(() => {
        const current = i18n.language || localStorage.getItem("i18nextLng") || "en";
        const normalized = current.startsWith("fr") ? "fr" : "en";
        if (current !== normalized) {
            i18n.changeLanguage(normalized);
            localStorage.setItem("i18nextLng", normalized);
        }
        setChosenLanguage(normalized);
    }, [i18n.language]);

    const changeLanguage = (lng: string) => {
        const normalized = lng.startsWith("fr") ? "fr" : "en";
        i18n.changeLanguage(normalized);
        localStorage.setItem("i18nextLng", normalized);
        setChosenLanguage(normalized);
    };

    return (
        <div className="relative top-4 right-2 min-w-[50px] p-2 z-50">
            {chosenLanguage === "fr" ? (
                <button
                    onClick={() => changeLanguage("en")}
                    className="text-lg underline hover:text-[#33d7d4] cursor-pointer"
                >
                    EN
                </button>
            ) : (
                <button
                    onClick={() => changeLanguage("fr")}
                    className="text-lg underline hover:text-[#33d7d4] cursor-pointer"
                >
                    FR
                </button>
            )}
        </div>
    );
}
