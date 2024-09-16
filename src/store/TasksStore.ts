import { create } from "zustand";
import { PaginatedWrapper } from "../models/PaginatedWrapper"
import { TaskModel } from "../models/TaskModel"
import { CreateTaskInputs } from "../components/CreateTaskDialog";
import { EditTaskInputs } from "../components/TaskEditDialog";

type TasksStore = {
    tasks?: PaginatedWrapper<TaskModel>,
    isLoading: boolean;
    
    getTasks: (
        getAllTasks:(pageNumber: number, pageSize: number) => Promise<PaginatedWrapper<TaskModel>>, 
        pageNumber: number, 
        pageSize: number
    ) => void,

    updateTask: (
        updateTask: (newTaskInputs: EditTaskInputs, task: TaskModel ) => Promise<TaskModel>,
        taskInputs: EditTaskInputs,
        task: TaskModel
    ) => void,

    deleteTask: (
        deleteTask: (taskId: number) => Promise<number>,
        taskId: number
    ) => void,

    createTask: (
        createTask: (userId: CreateTaskInputs) => Promise<TaskModel>,
        newTask: CreateTaskInputs
    ) => void,

    reset: () => void
}

const initialState  = {
    tasks: undefined,
    isLoading: false,

};

export const useTasksStore = create<TasksStore>()(
    (set, get) => ({
        ...initialState,

        getTasks: async (getAllTasks, pageNumber, pageSize) => {

            set(() => ({ isLoading: true }));
            const data = await getAllTasks(pageNumber, pageSize);
            set(() => ({isLoading: false, tasks: data}));
        },

        createTask: async(createTask, newTask) => {
            await createTask(newTask);
            window.location.reload();
        },

        updateTask: async(updateTask, taskInputs, task) => {
            const newTask = await updateTask(taskInputs, task);
            const currentTaskList = get().tasks?.data;

            const taskToModify = currentTaskList?.find(e => e.taskId == task.taskId);
            taskToModify!.name = newTask.name;
            taskToModify!.state.stateId = newTask.state.stateId;
            taskToModify!.user.userId = newTask.user.userId;

            set(() => ({ tasks: ({...get().tasks, data: currentTaskList} as PaginatedWrapper<TaskModel>) }))
        },

        deleteTask: async(deleteTask, taskId) => {
            await deleteTask(taskId);
            const currentTaskPagination = get().tasks;
            const currentTaskList = currentTaskPagination?.data.filter(e => e.taskId != taskId);
            set(() => ({ tasks: ({...currentTaskPagination, data: currentTaskList, totalRecords: currentTaskPagination!.totalRecords! -1} as PaginatedWrapper<TaskModel>) }))
        },


        reset: () => { set(initialState) },


    })
)