import { createContext, useContext, useState } from "react";

const SettingContext = createContext()

export const SettingProvider = ({children}) => {

    const [setting, setSetting] = useState()
    return (
        <SettingContext.Provider value={{setting, setSetting}}>
            {children}
        </SettingContext.Provider>
    )
}

export const useSetting = () => {
    return useContext(SettingContext)
}