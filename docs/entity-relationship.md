## Entity-relationship
**Relaciones del diagrama expresadas en frases**, respetando las cardinalidades del diagrama ( `||` = uno, `o{` = cero o muchos ).

### Relaciones con Cliente

1. Un **Cliente puede tener cero o muchos Apartamentos**.
2. Un **Cliente puede tener cero o muchas Personas**.
3. Un **Cliente puede celebrar cero o muchas Asambleas**.
4. Un **Cliente puede publicar cero o muchos Comunicados**.
5. Un **Cliente puede recibir cero o muchas PQRS**.
6. Un **Cliente puede administrar cero o muchos Usuarios**.

### Relaciones con User

7. Un **Usuario puede tener cero o muchas Cuentas (Account)**.
8. Un **Usuario puede tener cero o muchas Sesiones**.

### Relaciones entre Persona y Apartamento

9. Una **Persona puede habitar cero o muchos registros de Persona_Apartamento**.
10. Un **Apartamento puede tener cero o muchos registros de Persona_Apartamento**.

*(Esto representa una relación muchos a muchos entre Personas y Apartamentos a través de Persona_Apartamento).*

### Relaciones con Apartamento

11. Un **Apartamento puede representar cero o muchos Participantes de Asamblea**.
12. Un **Apartamento puede emitir cero o muchos Votos**.
13. Un **Apartamento puede registrar cero o muchas PQRS**.

### Relaciones con Asamblea

14. Una **Asamblea puede tener cero o muchas Encuestas**.
15. Una **Asamblea puede tener cero o muchos Participantes de Asamblea**.

### Relaciones con Persona en Asamblea

16. Una **Persona puede participar en cero o muchos Participantes de Asamblea**.

### Relaciones con Encuesta

17. Una **Encuesta puede tener cero o muchas Opciones**.
18. Una **Encuesta puede recibir cero o muchos Votos**.

### Relaciones con Opcion

19. Una **Opción puede recibir cero o muchos Votos**.

---

💡 **Resumen conceptual del modelado de datos**

* **Cliente** es la entidad raíz (Unidad residencial o condominio).
* **Apartamento** y **Persona** se relacionan mediante **PersonaApartamento**.
* **Asamblea** y **Persona** se relacionan mediante **ParticipanteAsamblea**.
* **Asamblea**,  **Encuesta**, **Opcion**, **ParticipanteAsamblea** y **Voto**, tablas necesarias para el sistema de votacion, que no requerie login pero si registro previo como Persona y Participante. Y al momento de votar datos de identifacion (Cedula, Apartamento).
* **PQRS** Atencion a los arrendatarios y propietarios, sin asociar registro previo para mayor facilidad.
* **User, Account y Session** corresponden al sistema de autenticación.

---

