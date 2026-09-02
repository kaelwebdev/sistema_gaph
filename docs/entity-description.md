### Entity Description

| Entity | Description | Main Attributes |
|--------|-------------|-----------------|
| **Condominium** | Residential unit or complex | `id`, `name` |
| **Apartment** | Housing unit | `number`, `tower`, `level`, `status` (PROPIO/ARRIENDO/VACIO) |
| **Person** | Resident or owner | `name`, `idNumber`, `phone`, `email` |
| **PersonApartment** | Person-Apartment relationship | `role` (PROPIETARIO/APODERADO/RESIDENTE), `isActive` |
| **Assembly** | Owners meeting | `title`, `date`, `status` (ABIERTA/CERRADA) |
| **AssemblyParticipant** | Registered participant in assembly | `type` (PROPIETARIO/APODERADO) |
| **Survey** | Poll in an assembly | `question`, `type` (BINARIA/MULTIPLE), `status` (ACTIVA/CERRADA) |
| **SurveyOption** | Response option | `text`, `order` |
| **Vote** | Registered vote | Unique by (apartment, survey) |
| **Announcement** | Published announcement | `title`, `content`, `publishedAt` |
| **PQRSRequest** | Petition/Complaint/Claim/Suggestion | `type`, `subject`, `description`, `status` |
| **User** | Administrator user | `name`, `email`, `password`, `role` (USER/ADMIN) |
| **Account** | OAuth/credentials account | Authentication provider |
| **Session** | Active session | Session token with expiration |

### Enums (Allowed values)

| Enum | Values |
|------|--------|
| **ApartmentStatus** | `PROPIO`, `ARRIENDO`, `VACIO` |
| **PersonRole** | `PROPIETARIO`, `APODERADO`, `RESIDENTE` |
| **AssemblyStatus** | `ABIERTA`, `CERRADA` |
| **ParticipantType** | `PROPIETARIO`, `APODERADO` |
| **SurveyStatus** | `ACTIVA`, `CERRADA` |
| **SurveyType** | `BINARIA`, `MULTIPLE` |
| **PQRSType** | `PREGUNTA`, `QUEJA`, `RECLAMO`, `SUGERENCIA` |
| **PQRSStatus** | `PENDIENTE`, `RESUELTO`, `RECHAZADO`, `SIN_LEER` |
| **Role** | `USER`, `ADMIN` |
