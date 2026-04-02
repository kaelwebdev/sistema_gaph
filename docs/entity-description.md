### Entity Description

| Entidad | Descripción | Atributos Principales |
|---------|-------------|---------------------|
| **Cliente** | Unidad residencial o conjunto | `id`, `nombre` |
| **Apartamento** | Unidad habitacional | `numero`, `torre`, `nivel`, `estado` (PROPIO/ARRIENDO/VACIO) |
| **Persona** | Residente o propietario | `nombre`, `cedula`, `telefono`, `email` |
| **PersonaApartamento** | Relación Persona-Apartamento | `rol` (PROPIETARIO/APODERADO/RESIDENTE), `estadoActivo` |
| **Asamblea** | Junta de propietarios | `titulo`, `fecha`, `estado` (ABIERTA/CERRADA) |
| **ParticipanteAsamblea** | Participante registrado en asamblea | `tipo` (PROPIETARIO/APODERADO) |
| **Encuesta** | Sondeo en una asamblea | `pregunta`, `tipo` (BINARIA/MULTIPLE), `estado` (ACTIVA/CERRADA) |
| **Opcion** | Opción de respuesta | `texto`, `orden` |
| **Voto** | Voto registrado | Único por (apartamento, encuesta) |
| **Comunicado** | Anuncio publicado | `titulo`, `contenido`, `fechaPublicacion` |
| **PQRS** | Petición/Queja/Reclamo/Sugerencia | `tipo`, `asunto`, `descripcion`, `estado` |
| **User** | Usuario administrador | `name`, `email`, `password`, `role` (USER/ADMIN) |
| **Account** | Cuenta OAuth/credenciales | Proveedor de autenticación |
| **Session** | Sesión activa | Token de sesión con expiración |

### Enums (Allowed values)

| Enum | Valores |
|------|---------|
| **EstadoApartamento** | `PROPIO`, `ARRIENDO`, `VACIO` |
| **RolPersona** | `PROPIETARIO`, `APODERADO`, `RESIDENTE` |
| **EstadoAsamblea** | `ABIERTA`, `CERRADA` |
| **TipoParticipante** | `PROPIETARIO`, `APODERADO` |
| **EstadoEncuesta** | `ACTIVA`, `CERRADA` |
| **TipoEncuesta** | `BINARIA`, `MULTIPLE` |
| **TipoPQRS** | `PREGUNTA`, `QUEJA`, `RECLAMO`, `SUGERENCIA` |
| **EstadoPQRS** | `PENDIENTE`, `RESUELTO`, `RECHAZADO`, `SIN_LEER` |
| **Role** | `USER`, `ADMIN` |