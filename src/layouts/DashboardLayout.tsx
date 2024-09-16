import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";


export default function DashboardLayout() {
        // const drawerWidth = 240;

    return (
        <Box sx={{ 
            width: '100vw', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end'
        }}>
            <Header />
            {/* <ChatsDrawer 
                mobileOpen={mobileOpen} 
                setMobileOpen={setMobileOpen}
                bgcolor={blueGrey[100]}
            /> */}
            <Toolbar/>
            <Box 
                sx={{ 
                    p: 1, 
                    width: '100%',
                    height: '100%',
                    overflow: 'auto'
                }}
            >
                <Outlet/>
            </Box>

        </Box>
);
}