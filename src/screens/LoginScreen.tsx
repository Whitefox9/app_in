interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-hero">
          <div className="brand-mark">
            <span>App-In</span>
          </div>
          <span className="app-kicker">DEMO INSTITUCIONAL</span>
          <h1 id="login-title">Fácil Instructores</h1>
          <p>Gestión móvil de fichas, asistencia, agenda y seguimiento operativo.</p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
          <div className="login-form-heading">
            <h2>Acceso institucional</h2>
            <p>Ingresa con tu usuario o usa el acceso demo.</p>
          </div>
          <label>
            Usuario
            <input type="text" defaultValue="instructor.demo" autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input type="password" defaultValue="demo2026" autoComplete="current-password" />
          </label>
          <button type="submit" className="primary">
            Ingresar
          </button>
        </form>

        <button type="button" className="text-button" onClick={onLogin}>
          Usar acceso demo
        </button>
        <div className="locked-role">
          <span aria-hidden="true">▣</span>
          <div>
            <strong>Coordinador</strong>
            <small>Disponible en próxima versión</small>
          </div>
        </div>
        <p className="login-version">Versión demo · Fácil Instructores</p>
      </section>
    </div>
  )
}
