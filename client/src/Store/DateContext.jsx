import { useContext, createContext, useState } from "react";

const DateContext = createContext();

export const useDate = () => useContext(DateContext);

export const DateContextProvider = ({ children }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setselectedMonth] = useState(new Date().getMonth() + 1);
    return (
        <DateContext.Provider value={{selectedYear, selectedMonth, setselectedMonth, setSelectedYear}}>
            {children}
        </DateContext.Provider>
    )
}