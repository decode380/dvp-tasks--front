import { jwtDecode, JwtPayload } from "jwt-decode";
import { CustomAxiosRequestConfig, useAxios } from "../hooks/useAxios";
import { RespWrapper } from "../models/RespWrapper";
import { UserModel } from "../models/UserModel";
import { LoginInputs } from "../pages/LoginPage";


interface EmailJwtPayload extends JwtPayload {
  email: string;
}

export default function useAuthService () {
    const axiosApp = useAxios();

    const loginUser = async(data: LoginInputs) => {
        return axiosApp.post<RespWrapper<string>>(
            '/Auth/Login', data, 
            {errorMessage: 'Usuario o contraseña inválido'} as CustomAxiosRequestConfig
        );
    };

    const getUserFromToken = async (token: string) => {
        const email = jwtDecode<EmailJwtPayload>(token).email;

        return axiosApp.post<RespWrapper<UserModel>>(
          '/User/GetUserByEmail', 
          { email }, 
          { useAuth: true } as CustomAxiosRequestConfig
        );
    };


    return {
        loginUser,
        getUserFromToken
    }
}