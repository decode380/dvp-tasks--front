# Aplicación web React + Typescript para Double V Partners

## Patrones y dependencias
- `Material UI` para el maquetado y estilización de la aplicación, siendo casi todos los componentes en base a estos, la aplicación casi no cuenta con etiquetas originales de HTML.
- `Material UI Data Grid` para visualizar la información y orquestar el Server Side Pagination que ya implementa la API.
- `Axios` para implementar la configuración general de las consultas a la API y manejas los middlewares correspondientes para el token y cierre de sesión en caso de que la API responda 401.
- `JWT-decode` para la visualización de la información del token (solo email del usuario) sin verificar la firma, ya que la API ya lo realiza en los enpoints protegidos.
- `Notistack` y `SweetAlert2` para el manejo de notificaciones y mensajes de confirmación.
- `React Hook Form` para la gestión de los formularios.
- `Zustand` para la gestión de estados implementando el patrón `Redux`.