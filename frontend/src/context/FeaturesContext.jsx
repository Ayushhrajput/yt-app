import { createContext, useContext, useState } from "react";

const FeaturesContext = createContext()

export const FeaturesProvider = ({children}) => {

    const [toast , setToast] = useState(false)
    const [items, setItems] = useState(false)
    const [showNav, setShowNav] = useState(true)
    const [bottomBar, setBottomBar] = useState(true)
    return (
        <FeaturesContext.Provider value={{toast , setToast, items, setItems, showNav, setShowNav, bottomBar, setBottomBar}}>
            {children}
        </FeaturesContext.Provider>
    )
}

export const useFeatures = () => {
    return useContext(FeaturesContext)
}