**Idea App unidad Residencial \- Relaciones**

Este documento sirve de aproximación a lo que se quiere lograr, a modo de guía/referencia, por lo que puede cambiar si se requiere.  
---

# **0\. Relaciones Destacadas**

Aquí tienes las **relaciones traducidas a frases simples**, como normalmente se explican en lenguaje natural cuando se describe un modelo de datos:

---

### **1\. Relación Persona – Apartamento**

* **Una persona puede estar asociada a uno o varios apartamentos.**  
* **Un apartamento puede tener una o varias personas asociadas.**  
* La relación entre ambos se gestiona mediante **PERSONA\_APARTAMENTO**.

(O visto desde la tabla intermedia)

* **Una persona puede tener varios registros en PERSONA\_APARTAMENTO.**  
* **Cada registro de PERSONA\_APARTAMENTO pertenece a un solo apartamento.**

---

### **2\. Relación Asamblea – Encuesta – Opción – Voto**

* **Una asamblea puede tener varias encuestas.**  
* **Una encuesta pertenece a una sola asamblea.**  
* **Una encuesta puede tener varias opciones de respuesta.**  
* **Cada opción de respuesta pertenece a una sola encuesta.**  
* **Una opción de respuesta puede recibir varios votos.**  
* **Cada voto corresponde a una sola opción de respuesta.**

**Consideraciones:**

* **Un apartamento solo puede votar una vez por pregunta. Es decir, 1 voto por apartamento por encuesta.**

---

### **3\. Relación Persona – Participante de Asamblea**

* **Una persona puede participar en varias asambleas.**  
* **Una asamblea puede tener varios participantes.**

(O visto desde la tabla intermedia)

* **Una persona puede tener varios registros en PARTICIPANTE\_ASAMBLEA.**  
* **Cada registro de PARTICIPANTE\_ASAMBLEA pertenece a una sola asamblea.**

**Consideraciones:**

* **Un solo representante por apartamento en la asamblea.**

---

### **4\. Relación Apartamento – PQRS**

* **Un apartamento puede tener varias PQRS registradas.**  
* **Cada PQRS pertenece a un solo apartamento.**