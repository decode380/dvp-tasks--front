import { CreateTaskInputs } from "../components/CreateTaskDialog";
import { EditTaskInputs } from "../components/TaskEditDialog";
import { CustomAxiosRequestConfig, useAxios } from "../hooks/useAxios";
import { PaginatedWrapper } from "../models/PaginatedWrapper";
import { RespWrapper } from "../models/RespWrapper";
import { TaskModel } from "../models/TaskModel";

export default function useTasksService() {
    const axiosApp = useAxios();


    const createTask = async(newTaskInput: CreateTaskInputs) => {
        return await axiosApp.post<RespWrapper<TaskModel>>(`/Task/CreateTask`, 
            { ...newTaskInput },
            { useAuth: true, errorMessage: 'No se encuentra el email' } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data)
    }

    const getAllTasks = async(pageNumber: number = 1, pageSize: number = 10) => {
        return await axiosApp.get<RespWrapper<PaginatedWrapper<TaskModel>>>(
            `/Task/GetAllTasks`, 
            { 
                useAuth: true,
                params: {
                    pageNumber: pageNumber,
                    pageSize
                }

            } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data);
    }


    const getMyTasks = async(pageNumber: number = 1, pageSize: number = 10) => {
        return await axiosApp.get<RespWrapper<PaginatedWrapper<TaskModel>>>(
            `/Task/GetMyTasks`, 
            { 
                useAuth: true,
                params: {
                    pageNumber: pageNumber,
                    pageSize
                }

            } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data);
    }


    const updateTaskNameOrAssignation = async(newTaskInputs: EditTaskInputs, task: TaskModel) => {
        return await axiosApp.put<RespWrapper<TaskModel>>(`/Task/UpdateTaskNameOrAssignation/${task.taskId}`, 
            { taskId: task.taskId, userEmail: newTaskInputs.userEmail, name: newTaskInputs.name },
            { useAuth: true } as CustomAxiosRequestConfig
        )
        .then(resp => resp.data.data)
    }

    const updateTaskState = async(newTaskInputs: EditTaskInputs, task: TaskModel) => {
        return await axiosApp.put<RespWrapper<TaskModel>>(`/Task/UpdateTaskState/${task.taskId}`, 
            { taskId: task.taskId, stateId: newTaskInputs.stateId },
            { useAuth: true } as CustomAxiosRequestConfig
        )
        .then(resp => resp.data.data)
    }

    const deleteTask = async(taskId: number) => {
        return await axiosApp.delete<RespWrapper<number>>(`/Task/DeleteTask/${taskId}`, 
            { useAuth: true } as CustomAxiosRequestConfig
        ).then(resp => resp.data.data)
    }

    return {
        getAllTasks,
        createTask,
        updateTaskNameOrAssignation,
        updateTaskState,
        getMyTasks,
        deleteTask
    }
}