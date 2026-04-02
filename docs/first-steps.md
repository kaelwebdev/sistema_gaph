## First Steps

### Requisitos Previos
- Node.js 18+
- Cuenta de Supabase (gratuita)

### Instalación

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd sistema-gaph
```

2. Crear proyecto en Supabase:
   - Ir a [supabase.com](https://supabase.com) y crear un proyecto nuevo
   - Obtener las credenciales del proyecto (URL, keys)

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con las credenciales de Supabase
```

4. Configurar el connection string en `.env`:
   - Usar el **Transaction Pooler** de Supabase para producción
   - Usar **Direct Connection** para migraciones

5. Generar el cliente Prisma:
```bash
npx prisma generate
```

6. Aplicar migraciones:
```bash
npx prisma migrate dev
```

7. Instalar Dependencias:
```bash
bun i
```
or
```bash
npm i
```

8. Iniciar el servidor de desarrollo:
```bash
bun dev
```
or
```bash
npm run dev
```

9. Abrir http://localhost:3000