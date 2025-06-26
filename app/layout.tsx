import type { Metadata } from "next";
import { Kalam } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import { TodoProvider } from "./contexts/todoContext";

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
    <html lang="en" className={kalam.className}>
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow px-4">
          <h1 className="text-center text-6xl p-10">Fun Todo</h1>
          <TodoProvider>
            {children}
          </TodoProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
