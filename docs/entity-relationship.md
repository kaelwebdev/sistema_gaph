## Entity-Relationship
**Relationships expressed in phrases**, respecting the cardinalities from the diagram ( `||` = one, `o{` = zero or many).

### Relationships with Condominium

1. A **Condominium can have zero or many Apartments**.
2. A **Condominium can have zero or many Persons**.
3. A **Condominium can hold zero or many Assemblies**.
4. A **Condominium can publish zero or many Announcements**.
5. A **Condominium can receive zero or many PQRSRequests**.
6. a **Condominium can manage zero or many Users**.

### Relationships with User

7. A **User can have zero or many Accounts**.
8. A **User can have zero or many Sessions**.

### Relationships between Person and Apartment

9. A **Person can inhabit zero or many PersonApartment records**.
10. An **Apartment can have zero or many PersonApartment records**.

*(This represents a many-to-many relationship between Persons and Apartments through PersonApartment.)*

### Relationships with Apartment

11. An **Apartment can represent zero or many AssemblyParticipants**.
12. An **Apartment can cast zero or many Votes**.
13. An **Apartment can register zero or many PQRSRequests**.

### Relationships with Assembly

14. An **Assembly can have zero or many Surveys**.
15. An **Assembly can have zero or many AssemblyParticipants**.

### Relationships with Person in Assembly

16. A **Person can participate in zero or many AssemblyParticipants**.

### Relationships with Survey

17. A **Survey can have zero or many SurveyOptions**.
18. A **Survey can receive zero or many Votes**.

### Relationships with SurveyOption

19. A **SurveyOption can receive zero or many Votes**.

---

💡 **Conceptual Summary**

* **Condominium** is the root entity (residential unit or condo).
* **Apartment** and **Person** are related through **PersonApartment**.
* **Assembly** and **Person** are related through **AssemblyParticipant**.
* **Assembly**, **Survey**, **SurveyOption**, **AssemblyParticipant** and **Vote** are the tables needed for the voting system, which doesn't require login but does require prior registration as a Person and Participant. And when voting, identification data (ID number, Apartment).
* **PQRSRequest** Attention to tenants and owners, without prior registration for ease of use.
* **User, Account and Session** correspond to the authentication system.

---
