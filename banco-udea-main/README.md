# Banco UdeA - frontend

Frontend React/Vite del laboratorio de Arquitectura de Software. Consume el backend Spring Boot exclusivamente mediante la ruta relativa `/api`, redirigida por el proxy de Vite a `http://localhost:8080`.

## Ejecución local

1. Inicia MySQL y el backend Spring Boot en el puerto 8080.
2. Instala las dependencias con `npm install`.
3. Inicia el frontend con `npm run dev`.
4. Abre `http://localhost:5173`.

La configuración del proxy está en `vite.config.js` y las llamadas HTTP centralizadas están en `src/services/api.js`.
