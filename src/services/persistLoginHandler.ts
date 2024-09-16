import { useCallback } from "react";
import { useAuthStore } from "../store/AuthStore";
import useAuthService from "./authService";

export function usePersistLoginHandler(){
    
    const { getUserFromToken } = useAuthService();
    const user = useAuthStore(store => store.user);
    const token = useAuthStore(store => store.token);
    const login = useAuthStore(store => store.login);

    const handlePersistLogin = useCallback(async() => {
        if (token && !user) {
            const userDataResp = await getUserFromToken(token);
            if (userDataResp.status == 200) {
                login(userDataResp.data.data)
            }
        }
    }, [token, user, getUserFromToken, login])

    return {handlePersistLogin}
}