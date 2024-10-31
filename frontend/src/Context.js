import { createContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {// Con children posso accedere a tutti i componenti all'interno del tag
    const [profileData, setProfileData] = useState(null);

    return (
        <Context.Provider value = {{ profileData, setProfileData }}>
            {children}
        </Context.Provider>
    )
} 

export default Context;