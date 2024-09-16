import { UserModel } from "./UserModel";

export interface TaskModel {
    taskId: number;
    user: UserModel;
    name: string;
    state: StateModel;
}

export interface StateModel {
    stateId: string;
    name: string;
}