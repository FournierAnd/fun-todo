import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import { TodoProvider } from "./contexts/todoContext";
import DotBackground from "./components/dotBackground";
import AnimatedTitle from "./components/animatedTitle";
import ToggleDarkModeButton from "./components/toggleDarkMode";

const kalam = Kalam({
    subsets: ['latin'],
    weight: ['300', '400', '700'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: "Fun To Do",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${kalam.className}`}>
            <body className="relative flex flex-col min-h-screen m-1 bg-white dark:bg-[#212121] text-black dark:text-white">
                <ToggleDarkModeButton />
                <DotBackground />
                <main className="flex-grow p-4 z-10">
                    <AnimatedTitle />
                    <TodoProvider>
                        {children}
                    </TodoProvider>
                </main>
                <Footer />
            </body>
        </html>
    );
}
