## Deployment in Vercel

### Prerrequisitos

- Cuenta en [Vercel](https://vercel.com) (gratuita)
- Proyecto de Supabase configurado
- Repository en GitHub, GitLab o Bitbucket

### Pasos de Despliegue

#### 1. Preparar el proyecto para producción

Antes de desplegar, asegurate de que el proyecto compile correctamente:

```bash
npm run build
```

#### 2. Conectar el repositorio a Vercel

1. Ir a [vercel.com](https://vercel.com) e iniciar sesión
2. Click en **"Add New..."** → **"Project"**
3. Importar el repositorio desde GitHub/GitLab/Bitbucket
4. Configurar el proyecto:
   - **Framework Preset**: Next.js
   - **Build Command**: `npx prisma generate && next build` (o simplemente `next build` si ya generaste el cliente)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

#### 3. Configurar Variables de Entorno

En la configuración del proyecto en Vercel, ir a **"Environment Variables"** y agregar las siguientes variables:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[PROJECT-REF].supabase.co` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Clave pública | Buscala en Supabase → Settings → API |
| `DATABASE_URL` | Connection string de Supabase | Usa el **Transaction Pooler** |
| `DIRECT_URL` | Connection string directa | Necesario para migraciones |

**No** es necesario agregar `SUPABASE_SERVICE_ROLE_KEY` en Vercel.

#### 4. Ejecutar Migraciones en Producción

Vercel no ejecuta migraciones automáticamente. Tenés dos surveyOptions:

**Opción A: Usar Vercel CLI (recomendado)**

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login
vercel login

# Vincular al proyecto
vercel link

# Ejecutar migraciones
vercel env pull .env
npx prisma migrate deploy
```

**Opción B: Ejecutar migraciones desde Supabase**

1. Ir a **SQL Editor** en Supabase
2. Copiar el contenido de `prisma/migrations` y ejecutar

#### 5. Desplegar

1. Click en **"Deploy"** en Vercel
2. Esperar a que compile y despliegue
3. ¡Listo! Tu app estará disponible en `https://tu-proyecto.vercel.app`

### Configuración de Supabase para Producción

#### Habilitar Real-time en la base de datos

Desde la interfaz de supabase se debe habilitar real-time en las tablas: Vote, SurveyOption, Survey
```