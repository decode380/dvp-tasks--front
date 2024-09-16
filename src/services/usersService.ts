import { CreateUserInputs } from "../components/UserCreateDialog";
import { EditUserInputs } from "../components/UserEditDialog";
import { CustomAxiosRequestConfig, useAxios } from "../hooks/useAxios";
import { PaginatedWrapper } from "../models/PaginatedWrapper";
import { RespWrapper } from "../models/RespWrapper";
import { UserModel } from "../models/UserModel";

export default function useUsersService() {
    const axiosApp = useAxios();


    const createUser = async(newUserInputs: CreateUserInputs) => {
        return await axiosApp.post<RespWrapper<UserModel>>(`/User/CreateUser`, 
            { ...newUserInputs },
            { useAuth: true, errorMessage: 'El email ya se encuentra registrado' } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data)
    }

    const getAllUsers = async(pageNumber: number = 1, pageSize: number = 10) => {
        return await axiosApp.get<RespWrapper<PaginatedWrapper<UserModel>>>(
            `/User/GetUsers`, 
            { 
                useAuth: true,
                params: {
                    pageNumber: pageNumber,
                    pageSize
                }

            } as CustomAxiosRequestConfig,
        ).then(resp => resp.data.data);
    }

    const updateUser = async(newUserInputs: EditUserInputs, user: UserModel) => {
        return await axiosApp.put<RespWrapper<UserModel>>(`/User/UpdateUser/${user.userId}`, 
            { ...newUserInputs, id: user.userId },
            { useAuth: true } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data)
    }

    const deleteUser = async(userId: number) => {
        return await axiosApp.delete<RespWrapper<number>>(`/User/DeleteUser/${userId}`, 
            { useAuth: true } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data)
    }

    return {
        getAllUsers,
        updateUser,
        deleteUser,
        createUser
    }
}