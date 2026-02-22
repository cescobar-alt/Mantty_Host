# 📊 Informe de Estado del Proyecto — Mantty Host

**Fecha:** 22 de Febrero de 2026  
**Proyecto:** Mantty_Host  
**Supabase ID:** `nccshngyemezihlecmcj`  
**Estado General:** 🟡 En Desarrollo Activo — Requiere Correcciones

---

## 1. 🏗️ Resumen Ejecutivo

Mantty Host es una **PWA (Progressive Web App)** para la gestión de Unidades Habitacionales (UH), construida con **React 19 + Vite 7 + TailwindCSS v4 + Supabase**. El proyecto se encuentra en fase de desarrollo activo con una base funcional sólida pero con **problemas críticos de seguridad en la base de datos** y varias áreas de mejora en la arquitectura.

### Stack Tecnológico
| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + TypeScript | 19.2 / 5.9 |
| Bundler | Vite | 7.3 |
| Estilos | TailwindCSS | 4.2 |
| Backend | Supabase (PostgreSQL 17) | - |
| State Mgmt | TanStack React Query | 5.90 |
| Routing | React Router DOM | 7.13 |
| PWA | vite-plugin-pwa | 1.2 |

### Datos en Producción
| Tabla | Registros |
|-------|-----------|
| profiles | 2 |
| properties | 5 |
| tickets | 2 |
| invitations | 0 |
| notifications | 1 |

---

## 2. ✅ Lo Que Funciona Bien

### 2.1 Build & TypeScript
- ✅ **`tsc --noEmit` pasa sin errores** — El proyecto compila correctamente.
- ✅ Tipos generados para Supabase (`database.types.ts`) están sincronizados con el schema.

### 2.2 Arquitectura Frontend
- ✅ **Lazy loading** implementado para todas las páginas principales.
- ✅ **ErrorBoundary** para manejo de errores.
- ✅ Sistema de **permisos y roles** bien definido en `business-rules.ts` y `permissions.ts`.
- ✅ **Code splitting** configurado en Vite con `manualChunks`.
- ✅ PWA configurada con Service Worker, runtime caching para Supabase API, Google Fonts e imágenes.
- ✅ Sistema de **temas claro/oscuro** funcional.
- ✅ **React Query** para data fetching con cache inteligente.
- ✅ Componentes bien organizados: `components/dashboard/`, `components/layout/`, `pages/`.

### 2.3 Backend Supabase
- ✅ RLS habilitado en **todas las tablas** (profiles, properties, tickets, invitations, notifications).
- ✅ Edge Function `create-uh` desplegada y activa (v9).
- ✅ 16 migraciones aplicadas correctamente.
- ✅ Check constraints para `role`, `plan`, `status`, `priority`.

### 2.4 UX/UI
- ✅ Diseño premium con glassmorphism, gradientes, dark mode.
- ✅ Responsive design con sidebar desktop + bottom navigation mobile.
- ✅ Animaciones y micro-interacciones (fade-in, bounce, hover effects).
- ✅ Vista diferenciada por rol: AdminUH, Residente, Proveedor.

---

## 3. 🔴 Problemas Críticos

### 3.1 🔓 SEGURIDAD — Políticas RLS Abiertas en `tickets`

**SEVERIDAD: CRÍTICA**

La tabla `tickets` tiene políticas RLS que **bypasean completamente** la seguridad:

| Política | Comando | Problema |
|----------|---------|----------|
| `Allow all insert` | INSERT | `WITH CHECK (true)` — **Cualquiera** puede insertar tickets |
| `Allow all update` | UPDATE | `USING (true)` — **Cualquiera** puede modificar tickets |
| `Allow all select` | SELECT | `USING (true)` — **Cualquiera** puede ver todos los tickets |

⚠️ **Esto significa que un usuario anónimo o no autenticado podría crear, ver o modificar tickets arbitrariamente.**

Además, existen **políticas duplicadas** para `authenticated`:
- `Residents can see their own tickets` (SELECT) + `Allow all select` (SELECT) → el `Allow all select` hace innecesaria la primera.
- `Users can update their own tickets` + `Admins can update tickets in their UH` + `Allow all update` → tres políticas UPDATE compiten, y `Allow all update` las hace innecesarias.

### 3.2 🔓 SEGURIDAD — Protección contra Contraseñas Filtradas Deshabilitada

La protección de contraseñas filtradas (HaveIBeenPwned) está **deshabilitada** en la configuración de Auth.

### 3.3 Edge Function `create-uh` con `verify_jwt: false`

La Edge Function `create-uh` tiene `verify_jwt` deshabilitado, lo que permite invocaciones sin token JWT válido. Aunque el código de la función puede tener validación interna, esto es un riesgo.

---

## 4. 🟡 Problemas Importantes

### 4.1 Código Muerto — `AdminPHView.tsx`

El componente `AdminPHView.tsx` (301 líneas) **no es referenciado en ninguna ruta ni componente**. Fue reemplazado por `AdminUHView.tsx` pero no fue eliminado. Contiene:
- Componentes locales duplicados (`MiniStatCard`, `QuickLink`) que ya existen como componentes independientes.
- Datos hardcodeados (124 residentes, 12 proveedores, 92% eficiencia).

### 4.2 Bug en Filtro de Estado — `GestionSolicitudesPage.tsx`

**Línea 73:** Typo en el mapeo de status:
```typescript
t.status === 'en_progreso' ? 'En Orograso' : // ← "Orograso" en lugar de "Progreso"
```
Esto causa que el filtro "En Progreso" **nunca funcione** correctamente.

### 4.3 Desincronización de Tipos — `database.types.ts` vs DB real

El type `tickets` en `database.types.ts` **no incluye** los campos:
- `space_location` (agregado en migración `20260222171210`)
- `external_provider_id` (existe en la DB)

Esto provocará errores de tipo si se usan estos campos con el tipo `Tables<'tickets'>`.

### 4.4 Performance — RLS con `auth.uid()` sin subselect

3 políticas RLS en `tickets` usan `auth.uid()` directamente en lugar de `(select auth.uid())`, lo que causa **re-evaluación por cada fila**:

| Política | Comando |
|----------|---------|
| Users can update their own tickets | UPDATE |
| Admins can update tickets in their UH | UPDATE |
| Residents can see their own tickets | SELECT |

### 4.5 Performance — Políticas Permissivas Múltiples

Las tablas `properties` y `tickets` tienen **múltiples políticas permissivas** para el mismo rol y acción, lo que degrada el rendimiento:
- `properties`: 3 políticas SELECT para `authenticated` y `anon`.
- `tickets`: 2 políticas SELECT y 3 UPDATE para `authenticated`.

### 4.6 Foreign Key sin Índice

`tickets.external_provider_id` tiene un FK constraint pero **no tiene índice**, afectando JOINs y cascadas.

### 4.7 Índices No Utilizados

6 índices creados pero **nunca consultados**:
- `idx_invitations_ph_id`, `idx_invitations_created_by`
- `idx_notifications_ticket_id`
- `idx_properties_admin_id`
- `idx_tickets_created_by`, `idx_tickets_assigned_to`

> **Nota:** Es probable que estos se usen a medida que la app escale. Monitorear antes de eliminar.

---

## 5. 🟠 Mejoras Recomendadas

### 5.1 Arquitectura

| # | Mejora | Prioridad |
|---|--------|-----------|
| A1 | Falta ruta `/dashboard/alerts` — actualmente renderiza `<DashboardHome />` como fallback | Media |
| A2 | No hay página de **Perfil de Usuario** independiente (mencionada en conversación previa) | Media |
| A3 | Los `QuickLink` en el dashboard no tienen `onClick` ni `path` — son botones sin acción | Media |
| A4 | `CommunityWidget` calcula residentes/proveedores desde tickets, no desde una tabla real | Baja |
| A5 | `OperationalStatusWidget` tiene valor hardcodeado (85%) | Baja |
| A6 | No hay sistema de **comentarios** en tickets | Media |
| A7 | No hay manejo de **imágenes/archivos** en tickets (campo `image_url` existe pero sin UI de upload) | Media |

### 5.2 Seguridad

| # | Mejora | Prioridad |
|---|--------|-----------|
| S1 | La tabla `profiles` solo permite `SELECT` del propio perfil — no hay política de `UPDATE` para que el usuario edite su perfil | Alta |
| S2 | No hay política `INSERT` para `notifications` — los triggers/functions de backend necesitarán bypass | Media |
| S3 | La tabla `invitations` usa `(SELECT profiles.role...)` correctamente pero para `{public}` role, lo cual podría ser problemático | Media |

### 5.3 DevOps

| # | Mejora | Prioridad |
|---|--------|-----------|
| D1 | ESLint tiene error de configuración (incompatibilidad typescript-eslint v7 con eslint v10) | Media |
| D2 | No hay tests unitarios ni de integración | Alta |
| D3 | Scripts de debugging (`verify_user.cjs`, `check_columns.cjs`, etc.) están en la raíz y `scripts/` sin organización | Baja |
| D4 | No hay CI/CD pipeline configurado | Media |

---

## 6. 📋 Plan de Acción

### 🔥 Fase 1 — Correcciones Críticas (Inmediato)

#### 1.1 Corregir Políticas RLS de `tickets`
```sql
-- 1. Eliminar políticas inseguras
DROP POLICY IF EXISTS "Allow all insert" ON public.tickets;
DROP POLICY IF EXISTS "Allow all update" ON public.tickets;
DROP POLICY IF EXISTS "Allow all select" ON public.tickets;

-- 2. Crear políticas seguras
CREATE POLICY "Authenticated users can insert tickets"
  ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view tickets in their property"
  ON public.tickets FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM profiles WHERE id = (SELECT auth.uid())
    )
    OR created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = tickets.property_id
      AND properties.admin_id = (SELECT auth.uid())
    )
  );

-- 3. Optimizar políticas UPDATE existentes con (select auth.uid())
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.tickets;
CREATE POLICY "Users can update their own tickets"
  ON public.tickets FOR UPDATE TO authenticated
  USING (created_by = (SELECT auth.uid()))
  WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can update tickets in their UH" ON public.tickets;
CREATE POLICY "Admins can update tickets in their UH"
  ON public.tickets FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tickets.property_id
    AND properties.admin_id = (SELECT auth.uid())
  ));
```

#### 1.2 Habilitar Protección de Contraseñas Filtradas
→ Ir al Dashboard de Supabase > Auth > Providers > Email > Habilitar "Leaked password protection"

#### 1.3 Corregir Typo "En Orograso"
Archivo: `src/pages/GestionSolicitudesPage.tsx`, línea 73.

#### 1.4 Agregar índice faltante
```sql
CREATE INDEX idx_tickets_external_provider_id ON public.tickets(external_provider_id);
```

---

### ⚡ Fase 2 — Estabilización (1-2 semanas)

| # | Tarea | Archivos Afectados |
|---|-------|-------------------|
| 2.1 | Regenerar `database.types.ts` con campos faltantes (`space_location`, `external_provider_id`) | `src/types/database.types.ts` |
| 2.2 | Eliminar `AdminPHView.tsx` (código muerto) | `src/components/dashboard/AdminPHView.tsx` |
| 2.3 | Consolidar políticas RLS de `properties` en una sola política con lógica OR | Migración SQL |
| 2.4 | Habilitar `verify_jwt: true` en Edge Function `create-uh` | Redesplegar función |
| 2.5 | Implementar página de Alertas real (`/dashboard/alerts`) | Nuevo componente |
| 2.6 | Agregar política UPDATE para `profiles` | Migración SQL |
| 2.7 | Conectar QuickLinks a rutas reales | `AdminUHView.tsx` |
| 2.8 | Corregir ESLint config (actualizar `typescript-eslint` a v8+) | `eslint.config.js`, `package.json` |

---

### 🚀 Fase 3 — Funcionalidades (2-4 semanas)

| # | Funcionalidad | Descripción |
|---|--------------|-------------|
| 3.1 | **Sistema de Comentarios** | Tabla `ticket_comments` + UI en `TicketDetailPage` |
| 3.2 | **Upload de Imágenes** | Supabase Storage + campo `image_url` funcional |
| 3.3 | **Gestión de Proveedores** | CRUD para proveedores vinculados a la UH |
| 3.4 | **Reportes/Exportación** | Dashboard de reportes con gráficas (actualmente solo PDF básico) |
| 3.5 | **Invitaciones funcionales** | Completar flujo de invitaciones (tabla existe, UI parcial) |
| 3.6 | **Perfil de Usuario** | Página para editar nombre, contraseña, preferencias |
| 3.7 | **Tests E2E** | Implementar con Playwright/Vitest |
| 3.8 | **CI/CD** | GitHub Actions para build + lint + deploy |

---

## 7. 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Total de archivos `.tsx/.ts` | ~45 |
| Líneas de código (aprox.) | ~4,500 |
| Tablas en DB | 5 |
| Edge Functions | 1 |
| Migraciones | 16 |
| Roles definidos | 4 (superadmin, admin_uh, residente, proveedor) |
| Planes definidos | 3 (basic, plus, max) |
| Advertencias de seguridad Supabase | 3 |
| Advertencias de performance Supabase | 16 |

---

## 8. 🧭 Conclusión

El proyecto Mantty Host tiene una **base sólida** con buenas prácticas en el frontend (lazy loading, code splitting, query caching, PWA). Sin embargo, las **políticas RLS abiertas en `tickets` representan un riesgo de seguridad crítico** que debe ser resuelto inmediatamente antes de exponer la aplicación a usuarios reales.

La prioridad principal debe ser:
1. 🔴 **Cerrar las brechas de seguridad RLS** 
2. 🟡 **Corregir bugs funcionales** (typo filtro, tipos desincronizados)
3. 🟢 **Estabilizar y completar funcionalidades core**

> **Recomendación:** No desplegar a producción con usuarios reales hasta completar la Fase 1 del plan de acción.
