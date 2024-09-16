import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { UserModel } from '../models/UserModel';
import useUsersService from '../services/usersService';
import { useUserStore } from '../store/UserStore';
import UserEditDialog from './UserEditDialog';
import Swal from 'sweetalert2';
import UserCreateDialog from './UserCreateDialog';


export default function UsersTable() {

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef<UserModel>[] = [
    { field: 'email', headerName: 'Correo', flex: 1 },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'role', headerName: 'Rol', flex: 1, valueGetter: (_, row) => row.role.name },
    { field: 'modify', type: 'actions', headerName: 'Modificar', getActions: (params) => [
      <GridActionsCellItem
        icon={<EditIcon/>}
        label='Edit'
        onClick={() => onEdit(params.row)}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon/>}
        label='Delete'
        onClick={() => onDelete(params.row.userId)}
      />
    ]},
  ];

  const data = useUserStore(store => store.users);
  const rows = React.useMemo(() => data?.data.map(r => ({id: r.userId, ...r})), [data]);

  const isLoading = useUserStore(store => store.isLoading);
  
  const getUsers = useUserStore(store => store.getUsers);
  const { getAllUsers } = useUsersService();

  const [userToEdit, setUserToEdit] = React.useState<UserModel>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = React.useState<boolean>(false);


  const onEdit = (userData: UserModel) => {
    setUserToEdit(userData);
    setModalOpen(true);
  }

  const deleteUsetAction = useUserStore(store => store.deleteUser);
  const { deleteUser } = useUsersService();

  const onDelete = (userId: number) => {
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
        deleteUsetAction(deleteUser, userId);
      }
    });
  }

  React.useEffect(() => {
    getUsers(getAllUsers, paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel]);


  return ( 
    <>
      <Typography component={'h1'} variant='h5' align='center'>Lista de usuarios</Typography>
      <Box 
        display='flex' 
        justifyContent='center' 
        width='100%'
        marginY={2}
      >
        <Button onClick={() => setOpenModalCreate(true)}> Agregar usuario </Button>
      </Box>
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
          disableRowSelectionOnClick
        />
      </div>
      <UserEditDialog open={modalOpen} setModalOpen={setModalOpen} userData={userToEdit}/>
      <UserCreateDialog open={openModalCreate} setModalOpen={setOpenModalCreate}/>
    </>
  )
}