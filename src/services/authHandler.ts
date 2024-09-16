import { useAuthStore } from "../store/AuthStore";
import { LoginInputs } from "../pages/LoginPage";
import useAuthService from "./authService";


export function useAuthHandler() {
    const { loginUser, getUserFromToken } = useAuthService();
    const setToken = useAuthStore(store => store.setToken);
    const login = useAuthStore(store => store.login);

    const handleLogin = async (data: LoginInputs) => {
        const tokenResp = await loginUser(data);

        if (tokenResp.status === 200) {
            const token = tokenResp.data.data;
            setToken(token);
            setTimeout(async() => {
                const dataResp = await getUserFromToken(token);
                
                if (dataResp.status === 200) {
                    login(dataResp.data.data);
                }
            }, 100);

        }
    };

    return { handleLogin }
}