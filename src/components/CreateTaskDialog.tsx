import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useTasksService from "../services/tasksService";
import { useTasksStore } from "../store/TasksStore";

interface TaskCreateDialogType {
    open: boolean,
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

export type CreateTaskInputs = {
    name: string,
    userEmail: string;
    stateId: string;
}

export default function TaskCreateDialog(props: TaskCreateDialogType){
    const { register, handleSubmit, formState: {errors}, control } = useForm<CreateTaskInputs>();
    
    const { createTask } = useTasksService();
    const createTaskAction = useTasksStore(store => store.createTask);

    const onSubmit: SubmitHandler<CreateTaskInputs> = (data) => {
        createTaskAction(createTask, data);
    }

    return(
        <Dialog open={props.open} component={'form'} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Crear tarea</DialogTitle>
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
                        {...register('userEmail', {
                            required: {value: true, message: 'El email es requerido'},
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "No contiene un formato de correo válido",
                            },
                        })}
                        label="Email usuario"
                        variant="outlined"
                        error={!!errors.userEmail}
                        helperText={!!errors.userEmail && errors.userEmail?.message}
                    />
                    <Controller
                        name="stateId"
                        control={control}
                        rules={{ required: { value: true, message: 'El rol es requerido' } }}
                        render={({field}) => (
                            <FormControl fullWidth
                                error={!!errors.stateId}
                            >
                                <InputLabel id="role-label">Estado</InputLabel>
                                <Select
                                    label="Estado"
                                    labelId="role-label"
                                    variant="outlined"
                                    {...field}
                                >
                                    <MenuItem value={''}><em>Seleccionar</em></MenuItem>
                                    <MenuItem value={'PENDING'}>Pendiente</MenuItem>
                                    <MenuItem value={'IN_PROGRESS'}>En proceso</MenuItem>
                                    <MenuItem value={'COMPLETED'}>Completado</MenuItem>
                                </Select>
                                { !!errors.stateId && <FormHelperText> {errors.stateId.message} </FormHelperText>}
                                
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


