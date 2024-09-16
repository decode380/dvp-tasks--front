import { create } from "zustand";
import { CreateUserInputs } from "../components/UserCreateDialog";
import { EditUserInputs } from "../components/UserEditDialog";
import { PaginatedWrapper } from "../models/PaginatedWrapper";
import { UserModel } from "../models/UserModel";

type UserState = {
    users?: PaginatedWrapper<UserModel>,
    isLoading: boolean,
    getUsers: (
        getAllUsers:(pageNumber: number, pageSize: number) => Promise<PaginatedWrapper<UserModel>>, 
        pageNumber: number, 
        pageSize: number
    ) => void,
    updateUser: (
        updateUser: (newUserInputs: EditUserInputs, user: UserModel ) => Promise<UserModel>,
        userInputs: EditUserInputs,
        user: UserModel
    ) => void,

    deleteUser: (
        deleteUser: (userId: number) => Promise<number>,
        userId: number
    ) => void,

    createUser: (
        createUser: (userId: CreateUserInputs) => Promise<UserModel>,
        newUser: CreateUserInputs
    ) => void,

    reset: () => void
};

const initialState = {
    users: undefined,
    isLoading: false,
}

export const useUserStore = create<UserState>()(
    (set, get) => ({
        ...initialState,
        getUsers: async(getAllUsers, pageNumber, pageSize) => {
            if (get().users?.pageNumber == pageNumber && get().users?.pageSize == pageSize)
                return;

            set(() => ({ isLoading: true }));
            const data = await getAllUsers(pageNumber, pageSize);
            set(() => ({isLoading: false, users: data}));
        },

        updateUser: async(updateUser, userInputs, user) => {
            const newUser = await updateUser(userInputs, user);
            const currentUserList = get().users?.data;

            const userToModify = currentUserList?.find(e => e.userId == user.userId);
            userToModify!.name = newUser.name;

            set(() => ({ users: ({...get().users, data: currentUserList} as PaginatedWrapper<UserModel>) }))
        },

        deleteUser: async(deleteUser, userId) => {
            await deleteUser(userId);
            const currentUserPagination = get().users;
            const currentUserList = currentUserPagination?.data.filter(e => e.userId != userId);
            set(() => ({ users: ({...currentUserPagination, data: currentUserList, totalRecords: currentUserPagination!.totalRecords! -1} as PaginatedWrapper<UserModel>) }))
        },

        createUser: async(createUser, newUser) => {
            await createUser(newUser);
            window.location.reload();
        },

        reset: () => {set(initialState)}
    }), 
);