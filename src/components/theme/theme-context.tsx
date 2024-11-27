"use client"

import React, { createContext, useContext, useState } from "react";

const themes = {
  light: {
    background: "bg-[#204F79]",
    text: "text-white",
    background_mobiel: "bg-[#0B2945]",
    button: "text-white hover:bg-[#325484] px-4 py-2 mx-2 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
    fundo: "bg-[#0F2D43]",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-100",
    background_mobiel: "",
    button: "text-white hover:bg-blue-100",
    fundo: "bg-[#0F2D43]",
  },
};

type ThemeName = "light" | "dark";

interface ThemeContextType {
  theme: ThemeName;
  colors: typeof themes[ThemeName];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeName>("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colors: themes[theme], toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
