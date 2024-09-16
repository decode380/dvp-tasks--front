import React, { useState } from "react";

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { useUserStore } from "../../store/UserStore";

interface HeaderType {
    window?: () => Window
}

interface NavItem {
    text: string;
    callback: () => void;
}

const drawerWidth = 240;


export default function Header({window}: HeaderType) {

    const [mobileOpen, setMobileOpen] = useState(false);
    const container = window !== undefined ? () => window().document.body : undefined;
    const navigate = useNavigate();
    const logout = useAuthStore(store => store.logout);

    const resetUsersStore = useUserStore(store => store.reset);

    const userRole = useAuthStore(store => store.user?.role.roleId);
    const userName = useAuthStore(store => store.user?.name);
    const userRoleName = useAuthStore(store => store.user?.role.name);

    const userAndRoleText = React.useMemo(() => {
        return (
            <>
                {userName} <Chip label={userRoleName} color="success"/>
            </>
        );
    }, [userName, userRoleName]);

    const navItems = React.useMemo(() => {
        const items: NavItem[] = []; 

        if (userRole) {
            if (userRole == 'ADMIN') {
                items.push(
                    {
                        text: 'Usuarios',
                        callback: () => {navigate('/dashboard/users')}
                    },
                );
            }
            
            items.push(
                {
                    text: 'Tareas',
                    callback: () => { navigate('/dashboard/tasks') }
                },
                {
                    text: 'Salir',
                    callback: () => { logout(); resetUsersStore(); }
                }
            );
        }
        return items;
    }, [userRole])


    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };


    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                { userAndRoleText }
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton onClick={item.callback} sx={{ textAlign: 'center' }}>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
        </Box>
    );


    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        { userAndRoleText }
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                        <Button key={item.text} onClick={item.callback} sx={{ color: '#fff' }}>
                            {item.text}
                        </Button>
                        ))}
                    </Box>

                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}