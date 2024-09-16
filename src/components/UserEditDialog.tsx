import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserModel } from "../models/UserModel";
import useUsersService from "../services/usersService";
import { useUserStore } from "../store/UserStore";

interface UserEditDialogType {
    open: boolean,
    userData?: UserModel,
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

export type EditUserInputs = {
    name: string,
    password: string,
}


export default function UserEditDialog(props: UserEditDialogType){
    const userData = React.useMemo(() => props.userData, [props.userData]);

    const { register, handleSubmit, formState: {errors}, setValue } = useForm<EditUserInputs>();
    const { updateUser } = useUsersService();
    const updateUserAction = useUserStore(store => store.updateUser);

    const onSubmit: SubmitHandler<EditUserInputs> = (data) => {
        if (userData) {
            updateUserAction(updateUser, data, userData);
            props.setModalOpen(false);
        }
    }

    useEffect(() => {
        if (userData) {
            setValue('name', userData.name);
            setValue('password', '');
        }
    }, [userData]);


    return (
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
                        {...register('password', {
                            minLength: {value: 4, message: 'Debe contener al menos 4 caracteres'},
                            maxLength: {value: 20, message: 'Máximo 20 caracteres'},
                        })}
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        error={!!errors.password}
                        helperText={!!errors.password && errors.password?.message}
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

    )
}