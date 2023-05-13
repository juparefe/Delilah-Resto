# Delilah Resto API
Desarrollo de una API que controla el sistema de pedidos online para un restaurante utilizando el lenguaje JavaScript, haciendo uso del entorno de ejecución Node.js, el framework Express.js y un sistema de bases de datos relacionales con SQL. Desarrollando funcionalidades que permitan realizar altas, bajas, modificaciones y obtención de información sobre una estructura de datos que podría consumir un cliente.

**Lenguajes utilizados:** JavaScript y SQL
**Frameworks o librerias utilizados:** Express.js


## Pasos para ejecucion
### Clonar el repositorio de Github con el proyecto:
- El codigo del proyecto se encuentra alojado en Github 
- Para utilizar este codigo debe clonarse en el repositorio local utilizando el siguiente comando en git: 
```sh
git clone https://github.com/juparefe/Delilah-Resto.git
```
### Intalar:
- Se necesita tener instalado el entorno de ejecución Node.js
- Abrir el codigo con el editor de codigo
- Abrir la consola del editor de código
- Deben instalarse las dependencias del proyecto ejecutando el siguiente comando en la consola: 
```sh
npm i
```
### Configurar la conexion a la base de datos:
- El archivo donde se debe configurar la base de datos se encuentra en la ruta: ```./src/database/actions.js```
- En este archivo se encuentra la siguiente linea de codigo:
```sh
const database = new Sequelize('mysql://root:1234@localhost:3306/delilah_resto');
```
- Deben reemplazarse los datos contenidos en el parentesis, con los propios segun el workbench utilizado (Nombre de usuario:contraseña).
### Iniciar el servidor:
- Se debe iniciar el servidor ejecutando el siguiente comando en la consola: 
```sh
node src/server.js
```
- Para saber que el servidor se inicio correctamente en la consola debe aparecer el mensaje "Servidor corriendo en el puerto 3000"

### Ejecutar los endpoints:
- Si se siguieron los pasos anteriores, la API se esta ejecutando en la direccion: ```http://localhost:3000 ``` y debe observarse el mensaje "Bienvenido"
