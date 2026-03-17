# silent hill archives - sistema de gestion

proyecto integrador de gestion de datos para archivos de silent hill, desarrollado con el stack pern (postgresql, express, react, node.js).

## funcionalidades
- autenticacion segura: registro e inicio de sesion con cifrado de contraseñas mediante bcrypt.
- gestion de personajes: crud completo para el registro de supervivientes.
- base de datos de criaturas: registro detallado de amenazas detectadas.
- interfaz tematica: diseño inmersivo basado en la estetica de silent hill.

## tecnologias utilizadas
- frontend: react, tailwind css, react router.
- backend: node.js, express.
- base de datos: postgresql.
- seguridad: bcrypt, cors.

## instalacion y configuracion
1. clona el repositorio.
2. en la carpeta /server:
   - ejecuta npm install.
   - configura tus credenciales de base de datos en index.js.
   - inicia con node index.js.
3. en la carpeta raiz (frontend):
   - ejecuta npm install.
   - inicia con npm run dev.