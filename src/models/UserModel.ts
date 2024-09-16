
export interface UserModel {
    userId: number;
    name: string;
    email: string;
    role: RoleModel;
}

export interface RoleModel {
    name: string;
    roleId: string;
}