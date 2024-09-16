import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';

import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import './App.css';
import { router } from './router/AppRouter';
import { usePersistLoginHandler } from './services/persistLoginHandler';

function App() {

  const {handlePersistLogin} = usePersistLoginHandler();
  const theme = createTheme({
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
  });
  
  useEffect(() => {
    handlePersistLogin();
  }, [handlePersistLogin]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
          <CssBaseline/>
        <RouterProvider router={router}/>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
