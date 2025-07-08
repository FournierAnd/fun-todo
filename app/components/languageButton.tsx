"use client"
import "@/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageButton() {

    const { i18n } = useTranslation();
    const [chosenLanguage, setChosenLanguage] = useState("en");

    const changeLanguage = (lng: string) => {
        if (lng === 'en') {
            i18n.changeLanguage(lng);
            localStorage.setItem("i18nextLng", "en");
            setChosenLanguage("en");
        } else {
            localStorage.setItem("i18nextLng", lng);
            i18n.changeLanguage(lng);
            setChosenLanguage("fr");
        }
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