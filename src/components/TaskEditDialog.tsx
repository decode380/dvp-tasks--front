import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TaskModel } from "../models/TaskModel";
import useTasksService from "../services/tasksService";
import { useTasksStore } from "../store/TasksStore";
import { useAuthStore } from "../store/AuthStore";

interface TaskEditDialogType {
    open: boolean,
    taskData?: TaskModel,
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

export type EditTaskInputs = {
    name: string,
    userEmail: string,
    stateId: string,
}


export default function TaskEditDialog(props: TaskEditDialogType){
    const taskData = React.useMemo(() => props.taskData, [props.taskData]);

    const { register, handleSubmit, formState: {errors}, setValue, control } = useForm<EditTaskInputs>();
    const { updateTaskNameOrAssignation, updateTaskState } = useTasksService();
    const updateTaskAction = useTasksStore(store => store.updateTask);

    const userRole = useAuthStore(store => store.user?.role.roleId);
    const [additionalFeatures, setAdditionalFeatures] = React.useState(false);
    
    React.useEffect(() => {
        if (userRole && userRole == 'ADMIN' || userRole == 'SUPERVISOR') {
            setAdditionalFeatures(true);
        }
    }, [userRole]);


    const onSubmit: SubmitHandler<EditTaskInputs> = (data) => {
        if (taskData) {
            if (userRole == 'ADMIN' || userRole == 'SUPERVISOR') {
                updateTaskAction(updateTaskNameOrAssignation, data, taskData);
            }

            updateTaskAction(updateTaskState, data, taskData);
            props.setModalOpen(false);
        }
    }

    useEffect(() => {
        if (taskData) {
            setValue('name', taskData.name);
            setValue('userEmail', taskData.user.email);
            setValue('stateId', taskData.state.stateId);
        }
    }, [taskData]);


    return (
        <Dialog open={props.open} component={'form'} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Editar tarea</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{padding: 2}}>
                    {
                        additionalFeatures &&
                        <>
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
                                type="userEmail"
                                variant="outlined"
                                error={!!errors.userEmail}
                                helperText={!!errors.userEmail && errors.userEmail?.message}
                            />
                        </>
                    }
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

    )
}