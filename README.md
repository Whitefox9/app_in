# Fácil Instructores Mobile

Demo funcional tipo PWA responsive para presentar una aplicación móvil institucional orientada a instructores. Incluye login simulado, dashboard, fichas, detalle de ficha, registro de asistencia, agenda, reportes y perfil.

## Tecnologías

- React
- TypeScript
- Vite
- Datos simulados en `src/data/mockData.ts`
- Estilos responsive en `src/index.css`

## Ejecutar localmente

```bash
npm install
npm run dev
```

Luego abre la URL que entregue Vite, normalmente:

```bash
http://localhost:5173
```

Para probarla como demo móvil, abre esa URL desde el navegador del celular en la misma red o usa las herramientas responsive del navegador.

## Compilar

```bash
npm run build
```

## Flujo demo

- Usuario demo: `instructor.demo`
- Contraseña demo: `demo2026`
- También puedes entrar con el botón `Entrar con acceso demo`.

## Estructura principal

```text
src/
  components/      Componentes reutilizables
  data/            Datos mock de instructor, fichas, aprendices y asistencia
  screens/         Pantallas principales de la app
  utils/           Utilidades de asistencia y formato
  types.ts         Tipos compartidos
```

## Alcance

Esta primera versión está enfocada en el rol Instructor. La vista de Coordinador queda señalada como funcionalidad futura. El registro de asistencia modifica el estado visualmente y guarda los cambios en memoria durante la sesión.
