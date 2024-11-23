## SPOTI-FRIENDS
Aplicación web creada con React que permite la interacción social a través de listas de reproducción y música. Sigue los pasos a continuación para descargar, ejecutar y entender el proyecto.

### Descarga del repositorio

1. Crea un directorio en tu sistema para alojar el proyecto.

2. Clona el repositorio usando el siguiente comando:
`git clone https://github.com/AxlEnr/Spoti-friends-Web.git`

3. Navega al directorio clonado: `cd Spoti-friends-Web`

### Ejecucion de la aplicacion
Para iniciar la aplicación, asegúrate de tener Node.js instalado y sigue estos pasos:
1. Instala las dependencias necesarias: `npm install`
2. Modificar las variables de entorno de acuerdo a donde prefieras ejecutar el sitio web
3. Inicia el modo de desarrollo con el siguiente comando: `npm run start`

Esto abrirá la aplicación en tu navegador en la dirección asignada en la variable de entorno

- La página se recargará automáticamente con cada cambio que realices.
- Cualquier error de lint se mostrará en la consola.

### Comandos Disponibles
`npm run start`
Inicia la aplicación en modo de desarrollo. La aplicación estará disponible en `http://localhost:3000`

`npm test`
Lanza el ejecutor de pruebas en modo interactivo.

`npm build`
Genera una versión optimizada para producción en la carpeta build.
- Los archivos serán minificados y listos para ser desplegados.
- Incluye nombres de archivo con hashes únicos para el control de versiones.

`npm run eject`
Este comando expone la configuración interna de la aplicación. Úsalo únicamente si necesitas personalizar configuraciones como Webpack, Babel o ESLint.
# Nota: Este es un proceso irreversible. Una vez que ejecutes `eject`, no podrás revertirlo.
