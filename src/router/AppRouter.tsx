import { createBrowserRouter, Navigate } from "react-router-dom";
import UsersTable from "../components/UsersTable";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import ProtectRoute from "./ProtectRoute";
import TasksTable from "../components/TasksTable";
import ProtectRouteRoleBased from "./ProtectRouteRoleBased";

export const router = createBrowserRouter([
    {
        path: '/dashboard',
        element: <ProtectRoute> <DashboardLayout/> </ProtectRoute>,
        children: [
            {
                path: 'users',
                element: <ProtectRouteRoleBased validRole="ADMIN" navigateTo="/dashboard/tasks"> <UsersTable/></ProtectRouteRoleBased>
            },
            {
                path: 'tasks',
                element: <TasksTable/>
            },
            {
                path: '',
                element: <Navigate to={'/dashboard/tasks'}/>
            }
        ]
    },
    {
        path: '/login',
        element: <ProtectRoute isPublic> <LoginPage/> </ProtectRoute>
    },
    {
        path: '*',
        element: <Navigate to={'/dashboard/users'}/>
    }
]);