### Business rules

1. **Un apartment = un vote por encuesta**: La tabla `Vote` tiene índice único en `(apartmentId, encuestaId)` para garantizar que cada apartment vote solo una vez por pregunta.

2. **Un representante por apartment en assemblie**: La tabla `ParticipantAssemblie` tiene índice único en `(assemblieId, apartmentId)` para que solo un representante vote por apartment.

3. **Una person por cédula por cliente**: La tabla `Person` tiene restricción única en `(cedula, clienteId)` para evitar duplicados.

4. **Apartment único por torre y número**: La tabla `Apartment` tiene restricción única en `(numero, torre, clienteId)`.