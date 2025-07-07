"use client"
import "@/i18n";
import { useTranslation } from "react-i18next";

export default function LanguageButton() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        if (lng === 'en') {
            i18n.changeLanguage(lng);
            localStorage.setItem('i18nextLng', 'en');
        } else {
            localStorage.setItem('i18nextLng', lng);
            i18n.changeLanguage(lng);
        }        
    };

    return (
        <div className="relative top-4 right-4 min-w-[100px] p-2 z-50">
            <button
                onClick={() => changeLanguage('en')}
                className="text-sm mr-2 cursor-pointer"
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('fr')}
                className="text-sm  cursor-pointer"
            >
                FR
            </button>
        </div>
    );
}