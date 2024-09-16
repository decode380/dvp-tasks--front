
export interface RespWrapper<T>{
    succeeded: boolean;
    message: string;
    errors: string[];
    data: T;
}