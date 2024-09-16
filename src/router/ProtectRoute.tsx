import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/AuthStore";
import React from "react";

interface ProtectRouteType {
    children: React.ReactNode;
    isPublic?: boolean;
};

export default function ProtectRoute({ children, isPublic = false}: ProtectRouteType) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if(isPublic) {
        if (isAuthenticated) return <Navigate to={'/dashboard'}/>; 
    } else {
        if (!isAuthenticated) return <Navigate to={'/login'}/>;  
    }

    return children;
}