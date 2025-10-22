# Proyecto VetCare - Clean Architecture Migration

Este proyecto es un sistema de gestión veterinaria con backend Node.js + Express + Supabase y frontend React + Vite.

## Estado actual (rama `feat/isa`)

✅ **Backend migrado a Clean Architecture** con los siguientes dominios:
- **Cliente** (entity, usecases, repo, controller, tests)
- **Producto** (entity, usecases, repo, controller, tests)
- **Servicio** (entity, usecases, repo, controller, tests)
- **Mascota** (CRUD completo: entity, usecases, repo, controller, tests)
- **Reserva** (entity, usecases, repo, controller, tests)
- **Carrito** (entity, usecases, repo, controller, tests)

✅ **Tests unitarios**: 24 tests pasando (Jest) para entities y usecases
✅ **Modo mock**: `npm run start:mock` en backend para desarrollo sin credenciales Supabase
✅ **Documentación**: `docs/clean-architecture.md` y `backend/README.md`

### Estructura backend (Clean Architecture)

```
backend/
├── src/
│   ├── entities/        # Objetos de dominio (puros, sin dependencias)
│   ├── usecases/        # Casos de uso (lógica de negocio pura)
│   ├── repositories/    # Implementaciones concretas (Supabase)
│   ├── frameworks/      # Adaptadores mock para tests/desarrollo
│   ├── controllers/     # Adaptadores Express (entrada)
│   ├── lib/             # Clientes externos (Supabase)
│   └── container.js     # Inyección de dependencias (wiring)
├── tests/               # Tests unitarios (Jest)
│   ├── entities/
│   └── usecases/
├── server.js            # Punto de entrada (monta routers)
└── start-mock.js        # Helper para arranque en modo mock
```

## Cómo ejecutar

### Backend (modo normal con Supabase)

```powershell
cd Proyecto_Int/backend
npm install
# Configurar backend/.env con SUPABASE_URL y SUPABASE_SERVICE_KEY
npm start
```

### Backend (modo mock - sin credenciales)

```powershell
cd Proyecto_Int/backend
npm install
npm run start:mock
```

El servidor arrancará en http://localhost:5000

### Tests

```powershell
cd Proyecto_Int/backend
npm test
```

### Frontend

```powershell
cd Proyecto_Int/frontend
npm install
npm run dev
```

El frontend arrancará en http://localhost:5173 (o el puerto que Vite asigne)

## Próximos pasos (opcional)

- Migrar dominios adicionales: historial, chatbot, perfil (actualmente en server.js legacy)
- Refactorizar frontend para separar capas (services, domain, presentation)
- Añadir tests de integración (supertest) para endpoints
- Configurar CI/CD

## Documentación adicional

- `docs/clean-architecture.md`: guía de convenciones y cómo añadir nuevos CRUDs
- `backend/README.md`: comandos rápidos y estructura del backend

## Autores

- Isa (feat/isa branch - Clean Architecture migration)
- Wilson (feat/wilson branch)
