import axios, { InternalAxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    useAuth?: boolean;
    errorMessage?: string;
}


export function useAxios() {
    const [ axiosInstance ] = useState(() => 
        axios.create({
                baseURL: `${process.env.API_URL}`,
                headers: { "Content-Type": "application/json" },
        })
    );

    const token = useAuthStore(store => store.token);
    const logout = useAuthStore(store => store.logout);


    useEffect(() => {
        let tokenInterceptor: number;
        if (token) {
            
            tokenInterceptor = axiosInstance.interceptors.request.use(function (config: CustomAxiosRequestConfig) {
                if(config.useAuth) config.headers.Authorization = `Bearer ${token}`;
                return config;
            }, 
            // error => Promise.reject(error
            )
        }


        const unauthorizedInterceptor = axiosInstance.interceptors.response.use(null,function (error) {
            let errorMessage = error.config.errorMessage ?? 'Ocurrió un error';

            switch (error.status) {
                case 401:
                    errorMessage = 'Error de autorización';
                    logout();
                    break;
                case 403:
                    errorMessage = 'No tienes acceso a este recurso';
                    break;
            
                default:
                    break;
            }


            enqueueSnackbar(errorMessage, { style: {background: '#f44336'} });

            // return Promise.reject(new Error(error));
            return error;
        });


        return () => {
            axiosInstance.interceptors.request.eject(tokenInterceptor);
            axiosInstance.interceptors.response.eject(unauthorizedInterceptor);
        }
    }, [axiosInstance.interceptors.request, axiosInstance.interceptors.response, logout, token]);

    return axiosInstance;
};