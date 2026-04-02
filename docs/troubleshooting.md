### Troubleshooting

**Error: "Cannot find module '@prisma/client'"**

Asegurate de que el build command incluya `npx prisma generate`:
```
npx prisma generate && next build
```

**Error: "Connection refused"**

Verificá que `DATABASE_URL` use el **Transaction Pooler** (`pooler.supabase.com:6543`), no el puerto 5432.

**Error de autenticación con Supabase**

Verificá que las URL de redirect en Supabase (`Authentication → URL Configuration → Redirect URLs`) incluyan tu dominio de Vercel.