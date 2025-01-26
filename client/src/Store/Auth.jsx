import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({children}) => {
    const [token, setToken] = useState(Cookies.get('accessToekn'));
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [forceUpdate, setForceUpdate] = useState(false);


    const authorization = `Bearer ${token}`;

    const setTokenInCookies = (generateToken) => {
        setToken(generateToken);
        return Cookies.set("accessToekn", generateToken, {expires: 7});
    }

   

    const isLoggedInuser = !!token;

    const loggedOutUser = () => {
        setToken("");
        setUser("");
        return Cookies.remove("accessToekn");
    }

    const userAuthentication = async() => {
        try {
            setIsLoading(true)
            const response = await fetch(`${BASE_URL}/api/financely/user/getuser`, {
                method: "GET",
                headers: {
                    Authorization: authorization
                }
            })

            const data = await response.json();


            if(response.ok){
                setUser((prevUser) =>
                    JSON.stringify(prevUser) !== JSON.stringify(data.userData) ? data.userData : prevUser
                );
            } else {
                setUser("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        userAuthentication();
    },[forceUpdate]);

    const refreshUser = () => setForceUpdate((prev) => !prev);


    return (
        <AuthContext.Provider value={{
            setTokenInCookies, 
            authorization, 
            isLoading, 
            user, 
            setUser,
            refreshUser,
            isLoggedInuser, 
            loggedOutUser,

        }}>
            {children}
        </AuthContext.Provider>
    )
}