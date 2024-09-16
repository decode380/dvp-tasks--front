import React from "react"
import { useAuthStore } from "../store/AuthStore"
import { Navigate } from "react-router-dom";

interface ProtectRouteRoleBasedTypes {
    children: React.ReactNode,
    validRole: string,
    navigateTo: string
}

export default function ProtectRouteRoleBased ({children, validRole, navigateTo}: ProtectRouteRoleBasedTypes) {
    const userRole = useAuthStore(store => store.user?.role.roleId);


    if (userRole == validRole) return children;
    else return <Navigate to={navigateTo}/>
}