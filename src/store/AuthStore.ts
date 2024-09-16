import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { UserModel } from "../models/UserModel";

type AuthState = {
    isAuthenticated: boolean;
    token?: string;
    user?: UserModel;
    setToken: (token: string) => void;
    login: (userData: UserModel) => void;
    logout: () => void;
};


const authStore: StateCreator<
  AuthState,
//   [['zustand/devtools', never], ['zustand/persist', unknown]],
  [['zustand/devtools', never]],
  [],
  AuthState
> = 
(set) => ({
    isAuthenticated: false,
    token: localStorage.getItem('token') ?? undefined,
    user: undefined,

    setToken: (token) => {
        localStorage.setItem('token', token);
        set(() => ({ token }))
    },

    login: (userData) => {
        set(() => ({ isAuthenticated: true, user: userData }))
    },

    logout: () => {
        set({ isAuthenticated: false, token: undefined, user: undefined });
        localStorage.removeItem('token');
    }
})


export const useAuthStore = create<AuthState>()(
    devtools(
        // persist(
            authStore,
        //     { name: 'authStore' }
        // )
    )
)

