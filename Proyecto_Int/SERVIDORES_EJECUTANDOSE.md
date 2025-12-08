# 🚀 SERVIDORES EN EJECUCIÓN - PRUEBAS LISTAS

**Fecha:** Diciembre 6, 2025  
**Status:** ✅ AMBOS SERVIDORES ACTIVOS

---

## 📊 ESTADO DE SERVIDORES

### ✅ Frontend - EJECUTÁNDOSE
```
Servidor: Vite Dev Server
URL: http://localhost:5173
Puerto: 5173
Status: ✅ ACTIVO
```

### ✅ Backend - EJECUTÁNDOSE
```
Servidor: Express.js
URL: http://localhost:5000
Puerto: 5000
Status: ✅ ACTIVO
```

---

## 🧪 PRUEBAS DISPONIBLES

### 1. ACCEDER AL SITIO
```
Abre: http://localhost:5173
Deberías ver: Pantalla de inicio o login
```

### 2. REGISTRAR USUARIO (CON ENCRIPTACIÓN BCRYPT)
```
URL: http://localhost:5173/registrar

Datos:
- Nombre: Juan Pérez
- Email: juan@test.com
- Contraseña: Segura123

✅ Comprueba que:
   - Usuario se registra
   - Email se confirma (Supabase)
   - Contraseña está encriptada en BD
   - Se ve el hash $2b$10$... en tabla cliente
```

### 3. VERIFICAR ENCRIPTACIÓN EN BD
```sql
-- Supabase SQL Editor
SELECT 
  nombre_cliente,
  correo_cliente,
  contrasenia,
  salt
FROM cliente
ORDER BY created_at DESC
LIMIT 1;

Resultado esperado:
- nombre_cliente: Juan
- correo_cliente: juan@test.com
- contrasenia: $2b$10$FnG2g5... ← HASH BCRYPT
- salt: $2b$10$FnG2g5... ← SALT
```

### 4. FLUJO COMPLETO DE AUTENTICACIÓN
```
1. Registrar en /registrar
   ↓
2. Confirmar email (check inbox)
   ↓
3. Ir a /bienvenida
   ↓
4. Completar perfil en /completar-perfil
   ↓
5. Dashboard

Verificaciones:
✅ CI único validado
✅ NIT auto-generado
✅ Contraseña encriptada
✅ Rol asignado
```

---

## 🔍 PRUEBAS DE ENCRIPTACIÓN

### En DevTools (F12) - Console
```javascript
// Al registrar, deberías ver:
✅ Usuario creado en auth.users: abc123...
✅ Contraseña encriptada con bcrypt
   Encriptada: $2b$10$FnG2g5...
   Salt: $2b$10$FnG2g5...
✅ Cliente creado exitosamente
```

### En Supabase
```
1. Abre: https://supabase.com/dashboard
2. Proyecto: Tu BD
3. SQL Editor: Ejecuta VERIFICAR_ENCRIPTACION_BCRYPT.sql
4. Verifica que contrasenia es hash (comienza con $2b$10$)
```

---

## 📋 CHECKLIST DE PRUEBA

```
FRONTEND:
[ ] Abre http://localhost:5173
[ ] Página carga sin errores
[ ] DevTools no muestra errores críticos
[ ] CSS se ve correctamente

BACKEND:
[ ] http://localhost:5000 responde
[ ] API endpoints funcionan
[ ] Base de datos se conecta

ENCRIPTACIÓN:
[ ] Registra usuario
[ ] Email confirmado
[ ] Completa perfil
[ ] Verifica hash en BD
[ ] Hash es $2b$10$...

FLUJO COMPLETO:
[ ] Registro → ✅
[ ] Bienvenida → ✅
[ ] Completar Perfil → ✅
[ ] Dashboard → ✅

SEGURIDAD:
[ ] Contraseña encriptada → ✅
[ ] No es texto plano → ✅
[ ] Compañeros ven datos → ✅
[ ] Funciona todo → ✅
```

---

## 🛠️ COMANDOS DISPONIBLES

### Frontend (en terminal)
```bash
# Ya está corriendo
http://localhost:5173

# Para reiniciar:
npm run dev

# Para hacer build:
npm run build
```

### Backend (en terminal)
```bash
# Ya está corriendo
http://localhost:5000

# Para reiniciar:
npm start

# Para usar mock data:
npm run start:mock

# Para tests:
npm test
```

---

## 📊 PRUEBAS DE ENDPOINTS

### GET /api/clientes
```
curl http://localhost:5000/api/clientes
Respuesta: Lista de clientes
```

### POST /api/cliente
```
curl -X POST http://localhost:5000/api/cliente \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test"}'
```

---

## 🔐 VERIFICAR ENCRIPTACIÓN

### Query SQL (Supabase)
```sql
-- VER CONTRASEÑA ENCRIPTADA
SELECT 
  nombre_cliente,
  contrasenia,
  CASE 
    WHEN contrasenia LIKE '%$2b$%' THEN '✅ Bcrypt'
    ELSE '❌ No encriptado'
  END as estado
FROM cliente
ORDER BY created_at DESC
LIMIT 1;

-- Resultado esperado: ✅ Bcrypt
```

---

## ⚠️ SI HAY PROBLEMAS

### Frontend no carga
```
1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores rojo
4. Copia el error
5. Restart: npm run dev
```

### Backend no responde
```
1. Verifica puerto 5000 no está usado
2. npm start nuevamente
3. Verifica conexión a Supabase (.env)
```

### Encriptación no funciona
```
1. Verifica bcryptjs instalado: npm ls bcryptjs
2. Verifica import en Registrar.jsx
3. Verifica DevTools console
4. Comprueba contraseña en BD
```

---

## 📞 DOCUMENTACIÓN PARA REFERENCIA

- 📖 [`COMIENZA_AQUI_BCRYPT.md`](./COMIENZA_AQUI_BCRYPT.md) - Guía inicial
- 🔍 [`VERIFICAR_ENCRIPTACION_BCRYPT.sql`](./VERIFICAR_ENCRIPTACION_BCRYPT.sql) - Consultas SQL
- 📚 [`INDICE_DOCUMENTACION_BCRYPT.md`](./INDICE_DOCUMENTACION_BCRYPT.md) - Todo el índice

---

## ✅ RESUMEN

| Componente | URL | Puerto | Status |
|-----------|-----|--------|--------|
| **Frontend** | http://localhost:5173 | 5173 | ✅ ACTIVO |
| **Backend** | http://localhost:5000 | 5000 | ✅ ACTIVO |
| **BD** | Supabase Cloud | - | ✅ CONECTADA |

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Accede a http://localhost:5173
2. ✅ Registra un usuario
3. ✅ Verifica encriptación en BD
4. ✅ Completa el flujo
5. ✅ Comparte con compañeros

---

**¡SERVIDORES LISTOS PARA PRUEBAS!** 🚀
