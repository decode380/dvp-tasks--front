import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import React, { useCallback } from 'react';
import { TaskModel } from '../models/TaskModel';
import useTasksService from '../services/tasksService';
import { useTasksStore } from '../store/TasksStore';
import TaskCreateDialog from './CreateTaskDialog';
import { useAuthStore } from '../store/AuthStore';
import TaskEditDialog from './TaskEditDialog';
import Swal from 'sweetalert2';


export default function TasksTable() {

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const userRole = useAuthStore(store => store.user?.role.roleId);

  const assignTableActions = useCallback((params: GridRowParams<TaskModel>) => {
    const actions = [];
    
    actions.push(
      <GridActionsCellItem
        icon={<EditIcon/>}
        label='Edit'
        onClick={() => onEdit(params.row)}
      />
    );

    if (userRole && userRole == 'ADMIN') {
      actions.push(
        <GridActionsCellItem
          icon={<DeleteIcon/>}
          label='Delete'
          onClick={() => onDelete(params.row.taskId)}
        />
      );
    }

    return actions;
  }, [userRole]);

  const columns: GridColDef<TaskModel>[] = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'user', headerName: 'Asignado a', flex: 1, valueGetter: (_, row) => row.user.email },
    { field: 'state', headerName: 'Estado', flex: 1, valueGetter: (_, row) => row.state.name },
    { field: 'modify', type: 'actions', headerName: 'Modificar', getActions: assignTableActions},
  ];

  const data = useTasksStore(store => store.tasks);
  const rows = React.useMemo(() => data?.data.map(r => ({id: r.taskId, ...r})), [data]);

  const isLoading = useTasksStore(store => store.isLoading);
  
  const getTasks = useTasksStore(store => store.getTasks);
  const { getAllTasks, getMyTasks } = useTasksService();


  const [additionalFeatures, setAdditionalFeatures] = React.useState(false);
  React.useEffect(() => {
      if (userRole && userRole == 'ADMIN' || userRole == 'SUPERVISOR') {
          setAdditionalFeatures(true);
      }
  }, [userRole]);


  const [taskToEdit, setTaskToEdit] = React.useState<TaskModel>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = React.useState<boolean>(false);


  const onEdit = (taskData: TaskModel) => {
    setTaskToEdit(taskData);
    setModalOpen(true);
  }

  const deleteTaskAction = useTasksStore(store => store.deleteTask);
  const { deleteTask } = useTasksService();

  const onDelete = (taskId: number) => {
    Swal.fire({
      title: "Estás seguro?",
      text: "Se eliminará el usuario las tareas asignadas a este permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskAction(deleteTask, taskId);
      }
    });
  }


  React.useEffect(() => {
    if (userRole) {
      if (userRole == 'ADMIN' || userRole == 'SUPERVISOR') {
        getTasks(getAllTasks, paginationModel.page + 1, paginationModel.pageSize);
      } else {
        getTasks(getMyTasks, paginationModel.page + 1, paginationModel.pageSize);
      }
      
    }

  }, [paginationModel]);


  return ( 
    <Box>
      <Typography component={'h1'} variant='h5' align='center'>Lista de tareas</Typography>
      {
        additionalFeatures &&
        <Box 
          display='flex' 
          justifyContent='center' 
          width='100%'
          marginY={2}
        >
          <Button onClick={() => setOpenModalCreate(true)}> Agregar tarea </Button>
        </Box>
      }
      <div style={{ height: 'max-content', maxHeight: '600px' , width: '80%', margin: 'auto' }}>
        <DataGrid
          columns={columns}
          rows={rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={data?.totalRecords ?? 0}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          keepNonExistentRowsSelected
        />
      </div>
      <TaskEditDialog open={modalOpen} setModalOpen={setModalOpen} taskData={taskToEdit}/>
      <TaskCreateDialog open={openModalCreate} setModalOpen={setOpenModalCreate}/>
    </Box>
  )
}