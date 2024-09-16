import { Button, Stack, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { enqueueSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthHandler } from "../services/authHandler";

export type LoginInputs = {
    email: string;
    password: string;
}


export default function LoginPage(){
    const { register, handleSubmit, formState: {errors} } = useForm<LoginInputs>();
    const { handleLogin } = useAuthHandler();

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        try {
            await handleLogin(data);
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Algo salió mal', { style: {background: '#f44336'} });
        }

    };

    return (
        <Stack 
            component='form' 
            onSubmit={handleSubmit(onSubmit)} 
            justifyContent="flex-start" 
            alignItems="center" m={1.5}
        >
            <Stack width="85%" maxWidth="500px" m={1.5}>
                <Stack textAlign="center">
                <Typography variant="h4" fontWeight="bold">
                    Iniciar sesión
                </Typography>
                </Stack>

                <Grid container my={2} spacing={2}>
                    <Grid size={12}>
                        <TextField fullWidth label="Email" 
                            {...register('email', { 
                                required: { value: true, message: 'El correo es requerido' },
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "No contiene un formato de correo válido",
                                },
                            })}
                            error={ !!errors.email }
                            helperText={ !!errors.email && errors.email.message}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField fullWidth label="Contraseña" 
                            {...register('password', { 
                                required: { value: true, message: 'La contraseña es requerida' }, 
                                minLength: { value: 4, message: 'Debe contener al menos 5 caracteres' }, 
                                maxLength: { value: 20, message: 'Debe contener máximo 20 caracteres' } 
                            })}
                            type="password"
                            error={ !!errors.password }
                            helperText={ !!errors.password && errors.password.message}
                        />
                    </Grid>
                </Grid>

                <Stack my={3}>
                    <Button type='submit' variant="contained">Log in</Button>
                </Stack>
            </Stack>
        </Stack>
    );
}