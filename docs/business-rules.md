### Business rules

1. **Un apartamento = un voto por encuesta**: La tabla `Voto` tiene índice único en `(apartamentoId, encuestaId)` para garantizar que cada apartamento vote solo una vez por pregunta.

2. **Un representante por apartamento en asamblea**: La tabla `ParticipanteAsamblea` tiene índice único en `(asambleaId, apartamentoId)` para que solo un representante vote por apartamento.

3. **Una persona por cédula por cliente**: La tabla `Persona` tiene restricción única en `(cedula, clienteId)` para evitar duplicados.

4. **Apartamento único por torre y número**: La tabla `Apartamento` tiene restricción única en `(numero, torre, clienteId)`.