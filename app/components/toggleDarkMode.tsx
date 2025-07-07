'use client'
import { useEffect, useState } from 'react'
import { MdLightMode, MdNightlight } from 'react-icons/md'

export default function ToggleDarkModeButton() {
  const [isDark, setIsDark] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (stored === 'dark' || (!stored && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Apply theme when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <div>
        <button
        onClick={() => setIsDark((prev) => !prev)}
        className="relative top-4 right-4 bg-black dark:bg-[#212121] hover:bg-[#5a5a5a] text-[#ffe97a] border-2 border-[#ffe97a] rounded-full p-2 z-50 cursor-pointer transition duration-500"
        >
        {isDark ? <MdLightMode size="1.5rem" /> : <MdNightlight size="1.5rem" />}
        </button>
    </div>
  )
}
