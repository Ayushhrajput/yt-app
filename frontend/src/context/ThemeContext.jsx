import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";


const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
    const [darkTheme, setDarkTheme] = useState(() => {
        return JSON.parse(localStorage.getItem("theme")?? false)
    })
    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(darkTheme))
    }, [darkTheme])
    
    return (
        <ThemeContext.Provider value={{darkTheme, setDarkTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeContext)
}