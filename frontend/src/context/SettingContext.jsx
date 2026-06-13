import { createContext, useContext, useState } from "react";

const SettingContext = createContext()

export const SettingProvider = ({children}) => {

    const [setting, setSetting] = useState(false)
    const [items, setItems] = useState(false)
    const [showNav, setShowNav] = useState(true)
    return (
        <SettingContext.Provider value={{setting, setSetting, items, setItems, showNav, setShowNav}}>
            {children}
        </SettingContext.Provider>
    )
}

export const useSetting = () => {
    return useContext(SettingContext)
}