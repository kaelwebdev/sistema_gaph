**Idea App Unidad Residencial**

Nombre de la aplicación: Sistema GAPH  
Alcance: 200 apartamentos por cliente. Un cliente es una unidad residencial a la que se le prestara el servicio. El servicio es esta aplicación.  
Tipo de software: SAAS

Este documento sirve de aproximación a lo que se quiere lograr, a modo de guía/referencia, por lo que puede cambiar si se requiere.  
---

# **1\. Descripción del sistema**

El sistema consiste en una **plataforma web para la gestión de asambleas de propiedad horizontal**, que permite a la administración registrar apartamentos y sus responsables, gestionar asambleas, habilitar votaciones digitales en tiempo real y registrar la participación de los propietarios o sus apoderados.

La plataforma permitirá:

* Registrar y administrar los **apartamentos del conjunto residencial**.  
* Gestionar la información de **personas asociadas a cada apartamento** (propietarios, apoderados o residentes).  
* Crear **asambleas** y registrar los **apartamentos participantes**.  
* Crear **encuestas de votación** durante la asamblea.  
* Permitir que los participantes **emitan votos digitales**, garantizando que **cada apartamento solo pueda votar una vez por pregunta**.  
* Visualizar **resultados en tiempo real**.  
* Gestionar **comunicados oficiales** y **PQRS**.  
* Generar **reportes y estadísticas** relacionadas con la participación y votación.

El sistema tendrá dos tipos principales de usuarios:

* **Administrador**: responsable de configurar y gestionar el sistema.  
* **Participante**: persona que representa uno o más apartamentos durante la asamblea.

---

# **2\. Roles del sistema**

## **Administrador**

Responsable de gestionar la información del sistema, configurar las asambleas y supervisar las votaciones.

## **Participante**

Persona autorizada para representar un apartamento durante la asamblea y emitir votos en las encuestas habilitadas.

---

# **3\. Requerimientos funcionales**

## **3.1 Gestión de apartamentos**

El sistema debe permitir al administrador:

* Registrar apartamentos del conjunto residencial.  
* Definir la ubicación del apartamento:  
  * número  
  * torre  
  * nivel  
* Definir el estado del apartamento:  
  * propio  
  * arriendo  
  * vacío  
* Registrar observaciones del apartamento.  
* Registrar el número de habitantes.

El sistema debe garantizar que **no existan dos apartamentos con el mismo número y torre**.

---

## **3.2 Gestión de personas asociadas al apartamento**

El sistema debe permitir al administrador registrar personas y asociarlas a uno o más apartamentos.

Para cada persona se debe registrar:

* nombre completo  
* cédula  
* teléfono  
* email

Cada persona puede estar asociada a un apartamento con uno de los siguientes roles:

* propietario  
* apoderado  
* residente

Cada persona tiene un estado que sirve para saber si es activo o no en su rol. Esto es útil para saber cual es propietario actual entre todos los registrados.

Una misma persona puede estar asociada a **varios apartamentos**.

---

## **3.3 Gestión de asambleas**

El sistema debe permitir al administrador:

* Crear una asamblea.  
* Definir:  
  * título  
  * fecha  
  * estado (abierta o cerrada).

El sistema debe permitir visualizar la lista de asambleas existentes.

---

## **3.4 Registro de participantes de la asamblea**

El sistema debe permitir al administrador registrar los apartamentos que participan en la asamblea.

Para cada participante se debe registrar:

* la asamblea  
* el apartamento representado  
* la persona que lo representa  
* el tipo de participante:  
  * propietario  
  * apoderado

El sistema debe garantizar que:

* **cada apartamento solo pueda tener un representante en la asamblea.**

---

## **3.5 Gestión de encuestas de votación**

El sistema debe permitir al administrador crear encuestas de votación asociadas a una asamblea.

Cada encuesta debe incluir:

* una pregunta  
* un orden de aparición  
* un estado (activa o cerrada)  
* tipo de encuesta (binaria o múltiple)

Cada encuesta debe permitir definir múltiples opciones de respuesta.

Ejemplo:

* Sí  
* No  
* Abstención

El administrador podrá:

* editar encuestas  
* cerrar encuestas  
* eliminar encuestas

---

## **3.6 Votación de participantes**

Los participantes podrán votar en las encuestas activas de la asamblea.

Antes de votar, el participante deberá ingresar:

* cédula  
* número de apartamento  
* torre

El sistema debe validar que:

1. la persona exista en el sistema  
2. la persona esté asociada al apartamento indicado  
3. el apartamento esté registrado como participante en la asamblea

Si la validación es correcta, el sistema permitirá emitir el voto.

El sistema debe garantizar que:

* **cada apartamento solo pueda emitir un voto por encuesta.**

Si una persona representa **varios apartamentos**, podrá votar **una vez por cada apartamento**.

---

## **3.7 Resultados de votación en tiempo real**

El sistema debe mostrar en tiempo real:

* el número de votos por cada opción de respuesta  
* el porcentaje de votos de cada opción  
* el número de apartamentos que han votado

También debe mostrar:

* número de apartamentos registrados en la asamblea  
* número de apartamentos que han votado

---

## **3.8 Control de votaciones**

El administrador podrá:

* cerrar o congelar una encuesta para impedir nuevos votos  
* eliminar o modificar un voto registrado en caso necesario  
* editar encuestas existentes  
* Cambiar el participante de la asamblea por otro en caso de emergencia. (Nota: En este caso los votos realizados se conservan por temas legales y facilidad).

---

## **3.9 Comunicados oficiales**

El sistema debe permitir al administrador publicar comunicados para los residentes.

Cada comunicado debe incluir:

* título  
* contenido  
* fecha de publicación

Los comunicados deben ser visibles para los usuarios del sistema.

---

## **3.10 Sistema PQRS**

El sistema debe permitir a los residentes enviar solicitudes PQRS.

Cada PQRS debe incluir:

* número de apartamento  
* torre  
* tipo:  
  * pregunta  
  * queja  
  * reclamo  
  * sugerencia  
* descripción del caso  
* correo electrónico de contacto

El sistema debe registrar la solicitud en la base de datos y permitir su gestión posterior.

---

## **3.11 Reportes y estadísticas**

El sistema debe permitir al administrador generar reportes como:

* lista de encuestas realizadas en una asamblea  
* porcentaje de votos por opción  
* lista de apartamentos participantes en la asamblea  
* lista de apartamentos cuyo estado es arriendo

Los reportes deben poder exportarse para su análisis.

---

## **3.12 Copias de seguridad**

El sistema debe permitir generar respaldos de la base de datos para evitar pérdida de información.

---

# **4\. Requerimientos de interfaz**

En la página principal del sistema los usuarios podrán acceder a la sección **Asambleas**.

Al seleccionar una asamblea habilitada se mostrará la interfaz de votación, donde:

* se solicitará la identificación del participante  
* se mostrarán las encuestas activas  
* las encuestas aparecerán ordenadas por creación, mostrando primero la más reciente  
* se actualizarán los resultados en tiempo real  
* Siempre visibles los campos de identificación del participante para que pueda cambiar fácilmente en caso de tener que votar con otro apartamento. Por campos de identificación para la votación se refiera a: El campo de texto de la cédula del participante, el dropdown menu para elegir el número de apartamento  y el dropdown menu para elegir el número de torre.  
* Si los datos identificación no coinciden con un participante registrado para dicha asamblea, se mostrará un pequeño mensaje debajo en rojo que diga “No eres un participante”

---

# **5\. Tecnologías recomendadas**

Se propone trabajar con las siguientes tecnologías:

Frontend y backend:

* Next.js (React)

Base de datos:

* PostgreSQL

ORM:

* Prisma (o cualquier otro recomendable)

Opcional para tiempo real:

* Supabase realtime o WebSockets

---

