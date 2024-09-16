import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useUsersService from "../services/usersService";
import { useUserStore } from "../store/UserStore";

interface UserCreateDialogType {
    open: boolean,
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

export type CreateUserInputs = {
    name: string,
    password: string,
    roleId: string;
    email: string;
}

export default function UserCreateDialog(props: UserCreateDialogType){
    const { register, handleSubmit, formState: {errors}, control } = useForm<CreateUserInputs>();
    
    const { createUser } = useUsersService();
    const createUserAction = useUserStore(store => store.createUser);

    const onSubmit: SubmitHandler<CreateUserInputs> = (data) => {
        createUserAction(createUser, data);
    }

    return(
        <Dialog open={props.open} component={'form'} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{padding: 2}}>
                    <TextField fullWidth
                        {...register('name', {
                            required: {value: true, message: 'El nombre es requerido'},
                            minLength: {value: 4, message: 'Debe contener al menos 4 caracteres'},
                            maxLength: {value: 40, message: 'Máximo 40 caracteres'},
                        })}
                        label="Nombre"
                        variant="outlined"
                        error={!!errors.name}
                        helperText={!!errors.name && errors.name?.message}
                    />
                    <TextField fullWidth
                        {...register('email', {
                            required: {value: true, message: 'El email es requerido'},
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "No contiene un formato de correo válido",
                            },
                        })}
                        label="Email"
                        variant="outlined"
                        error={!!errors.email}
                        helperText={!!errors.email && errors.email?.message}
                    />
                    <TextField fullWidth
                        {...register('password', {
                            required: {value: true, message: 'La contraseña es requerida'},
                            minLength: {value: 4, message: 'Debe contener al menos 4 caracteres'},
                            maxLength: {value: 20, message: 'Máximo 20 caracteres'},
                        })}
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        error={!!errors.password}
                        helperText={!!errors.password && errors.password?.message}
                    />
                    <Controller
                        name="roleId"
                        control={control}
                        rules={{ required: { value: true, message: 'El rol es requerido' } }}
                        render={({field}) => (
                            <FormControl fullWidth
                                error={!!errors.roleId}
                            >
                                <InputLabel id="role-label">Rol</InputLabel>
                                <Select
                                    label="Rol"
                                    labelId="role-label"
                                    variant="outlined"
                                    {...field}
                                >
                                    <MenuItem value={''}><em>Seleccionar</em></MenuItem>
                                    <MenuItem value={'SUPERVISOR'}>Supervisor</MenuItem>
                                    <MenuItem value={'EMPLOYEE'}>Empleado</MenuItem>
                                </Select>
                                { !!errors.roleId && <FormHelperText> {errors.roleId.message} </FormHelperText>}
                                
                            </FormControl>
                        )}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => props.setModalOpen(false)} color="secondary">
                    Cancelar
                </Button>
                <Button type="submit" color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}


