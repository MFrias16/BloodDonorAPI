# Proyecto Mobile Backend

API REST de donantes y solicitudes de donación de sangre. Está escrita en
JavaScript (ES modules), usa Express 5, MongoDB y Zod.

## Configuración

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env`.
3. Configura `MONGO_URL` con tu URI de MongoDB. No compartas ni subas `.env`.
4. Si necesitas, cambia `MONGO_DB`, los nombres de las colecciones o `PORT`.

## Ejecutar

- Desarrollo con reinicio automático: `npm run dev`
- Ejecución normal: `npm start`
- Pruebas: `npm test`

La ruta `GET /` verifica que el servidor esté activo. Las rutas de la API
comienzan con `/api`.

## Endpoints

### Solicitudes de sangre

| Método | Ruta | Acción |
|---|---|---|
| `POST` | `/api/blood-requests` | Crear solicitud |
| `GET` | `/api/blood-requests` | Listar y filtrar solicitudes |
| `GET` | `/api/blood-requests/:id` | Consultar solicitud |
| `PATCH` | `/api/blood-requests/:id` | Actualizar solicitud |
| `DELETE` | `/api/blood-requests/:id` | Eliminar solicitud |
| `GET` | `/api/blood-requests/:id/compatible-donors` | Buscar donantes compatibles |

Una solicitud requiere `patientName`, `bloodType`, `hospital`, `city`,
`distanceKm`, `unitsNeeded`, `isUrgent` y `timeAgo`.

### Donantes

| Método | Ruta | Acción |
|---|---|---|
| `POST` | `/api/donors` | Registrar donante |
| `GET` | `/api/donors` | Listar y filtrar donantes |
| `GET` | `/api/donors/compatible?recipientType=A%2B` | Buscar donantes compatibles |
| `GET` | `/api/donors/:id` | Consultar donante |
| `PATCH` | `/api/donors/:id` | Actualizar donante |
| `DELETE` | `/api/donors/:id` | Eliminar donante |

Un donante requiere `name`, `bloodType`, `city`, `distanceKm`, `isAvailable` y
`phone`. `donationsCount` es opcional y empieza en cero.

Las listas aceptan filtros como `city` y `bloodType`; solicitudes también
aceptan `isUrgent=true|false`, y donantes `isAvailable=true|false`. En la ruta
de compatibilidad se puede indicar `onlyAvailable=false` para incluir donantes
no disponibles y `city` para limitar la búsqueda.

Los tipos sanguíneos admitidos son `O-`, `O+`, `A-`, `A+`, `B-`, `B+`, `AB-`
y `AB+`. Las respuestas son JSON; errores de validación devuelven `400`, los
recursos no encontrados `404` y los errores inesperados `500`.
