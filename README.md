# Laboratorio N.º 1 - Arquitectura de Software

Aplicación web académica que simula operaciones bancarias mediante un frontend en React, una API REST en Spring Boot y persistencia en MySQL.

## Descripción

El proyecto integra el frontend desarrollado para el laboratorio con la API REST del backend suministrado como base. La comunicación general es:

```text
Frontend React → API REST → Backend Spring Boot → MySQL
```

Desde la interfaz se pueden consultar, crear, actualizar y eliminar clientes, realizar transferencias y revisar el historial de movimientos de una cuenta.

## Arquitectura

```text
React
  ↓
Axios
  ↓
Spring Boot REST Controller
  ↓
Service
  ↓
Repository
  ↓
JPA
  ↓
MySQL
```

- **React** presenta la interfaz y gestiona la navegación de la aplicación.
- **Axios** envía las solicitudes HTTP desde el frontend a la API.
- **REST Controller** expone los endpoints y recibe las solicitudes.
- **Service** contiene la lógica de clientes y transferencias.
- **Repository** permite consultar y guardar entidades.
- **JPA** realiza el mapeo y la persistencia de datos en **MySQL**.

## Tecnologías utilizadas

### Backend

- Java 17
- Spring Boot 3.5.11
- Spring Web
- Spring Data JPA
- Jakarta Validation
- MapStruct 1.5.5.Final
- Lombok 1.18.30
- Jackson Databind 2.15.0
- Maven y Maven Wrapper

### Frontend

- React 19
- React DOM 19
- React Router DOM 7.18.3
- Axios 1.20.0
- Vite 8.2.2
- Tailwind CSS 4.3.3
- Lucide React 1.16.0

### Base de datos

- MySQL mediante MySQL Connector/J
- JPA/Hibernate para la persistencia

## Estructura del proyecto

```text
lab12026/
├── lab12026p/             # Backend Spring Boot
│   ├── src/main/java/     # Controllers, services, repositories, entidades, DTO y mappers
│   ├── src/main/resources/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
└── lab12026p-frontend/    # Frontend React/Vite
    ├── src/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Funcionalidades

### Funcionalidades principales del laboratorio

- Consultar clientes.
- Realizar transferencias entre cuentas.
- Consultar el histórico de transacciones por cliente, a partir de su número de cuenta.

### Funcionalidades adicionales implementadas

- Crear clientes.
- Actualizar clientes.
- Eliminar clientes.

Las operaciones de actualización y eliminación se implementaron como funcionalidades opcionales adicionales al backend base del laboratorio.

## Endpoints

Los siguientes endpoints están definidos en los controladores del backend:

### Clientes

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/customers` | Obtiene todos los clientes. |
| `GET` | `/api/customers/{id}` | Obtiene un cliente por su identificador. |
| `POST` | `/api/customers` | Crea un cliente. |
| `PUT` | `/api/customers/{id}` | Actualiza un cliente existente. |
| `DELETE` | `/api/customers/{id}` | Elimina un cliente. |

### Transacciones

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/api/transactions` | Realiza y registra una transferencia. |
| `GET` | `/api/transactions/{accountNumber}` | Consulta los movimientos asociados a una cuenta. |

## Requisitos

- Java 17
- Node.js y npm
- MySQL
- Maven no necesita instalarse globalmente, porque el backend incluye Maven Wrapper.

## Configuración de MySQL

1. Inicie el servidor MySQL.
2. Cree la base de datos configurada por el backend:

```sql
CREATE DATABASE lab12026p;
```

3. Antes de ejecutar Spring Boot, configure la variable de entorno `DB_PASSWORD` con la contraseña de su instalación local de MySQL. No comparta ni publique esa credencial.

En PowerShell, defina la variable únicamente para la terminal actual:

```powershell
$env:DB_PASSWORD = "tu_contraseña"
```

La conexión configurada utiliza MySQL en `localhost:3306` y la base de datos `lab12026p`. La propiedad `spring.jpa.hibernate.ddl-auto=update` permite que Hibernate cree o actualice automáticamente las tablas al iniciar Spring Boot.

## Ejecutar backend

Desde la carpeta raíz del proyecto, abra PowerShell y ejecute:

```powershell
cd .\lab12026p
$env:DB_PASSWORD = "tu_contraseña"
.\mvnw.cmd spring-boot:run
```

El backend quedará disponible en `http://localhost:8080`.

## Ejecutar frontend

En otra terminal de PowerShell, desde la carpeta raíz del proyecto, ejecute:

```powershell
cd .\lab12026p-frontend
npm install
npm run dev
```

Vite normalmente mostrará el frontend en `http://localhost:5173`. Si ese puerto no está disponible, abra la URL indicada por Vite en la terminal. Durante el desarrollo, el proxy configurado envía las solicitudes `/api` al backend en el puerto `8080`.

## Orden correcto de ejecución

1. Iniciar MySQL.
2. Crear o verificar la base de datos `lab12026p` y las credenciales locales.
3. Ejecutar el backend Spring Boot.
4. Ejecutar el frontend React/Vite en otra terminal.
5. Abrir en el navegador la URL mostrada por Vite.

## Uso básico

1. Crear dos clientes con cuentas diferentes.
2. Consultar los clientes registrados.
3. Realizar una transferencia entre sus cuentas.
4. Consultar nuevamente los clientes para revisar los saldos.
5. Consultar el historial de una de las cuentas.
6. Editar los datos de un cliente.
7. Crear un cliente adicional y eliminarlo para probar la operación de borrado.

## Funcionalidades opcionales implementadas

- `PUT /api/customers/{id}` permite actualizar los datos de un cliente existente.
- `DELETE /api/customers/{id}` permite eliminar un cliente existente.

Estas dos operaciones fueron incorporadas adicionalmente para ampliar la gestión de clientes del laboratorio.

## Consideraciones

- MySQL debe estar ejecutándose antes de iniciar el backend.
- El frontend necesita que el backend esté activo para completar las operaciones.
- Las credenciales de MySQL dependen de cada instalación local.
- `npm install` debe ejecutarse después de clonar el proyecto para instalar las dependencias del frontend.
