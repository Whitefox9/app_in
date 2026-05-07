interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark">
          <span>App-In</span>
        </div>
        <span className="app-kicker">DEMO INSTITUCIONAL</span>
        <h1 id="login-title">Fácil Instructores</h1>
        <p>Gestión móvil de fichas, asistencia, agenda y seguimiento operativo.</p>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
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
          Entrar con acceso demo
        </button>
        <div className="locked-role">
          <strong>Coordinador</strong>
          <span>Vista futura bloqueada para esta demo</span>
        </div>
      </section>
    </div>
  )
}
