"use client";

import styles from "@/app/page.module.css";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { TaskDemo } from "@/components/task-demo";
import { FcGoogle } from "react-icons/fc";

export function AuthTaskBoard() {
  const auth = useFirebaseAuth();

  if (auth.isBootstrapping) {
    return (
      <section className={styles.board}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Firebase Auth</p>
          <h1 className={styles.title}>Cargando sesion...</h1>
          <p className={styles.description}>
            Estamos verificando si ya existe una sesion activa en este navegador.
          </p>
        </div>
      </section>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <section className={styles.board}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Firebase Auth</p>
          <h1 className={styles.title}>{auth.title}</h1>
          <p className={styles.description}>{auth.helperText}</p>

          <form className={styles.form} onSubmit={auth.onSubmit}>
            <label className={styles.label} htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={auth.email}
              onChange={auth.onEmailChange}
              placeholder="correo@ejemplo.com"
            />

            <label className={styles.label} htmlFor="password">
              Contrasena
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={auth.password}
              onChange={auth.onPasswordChange}
              placeholder="Minimo 6 caracteres"
            />

            {auth.errorMessage ? (
              <p className={styles.errorMessage}>{auth.errorMessage}</p>
            ) : null}

            <div className={styles.authActions}>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={auth.isSubmitting}
              >
                {auth.isSubmitting ? "Procesando..." : auth.submitLabel}
              </button>

              <button
                type="button"
                className={styles.ghostButton}
                onClick={
                  auth.mode === "login"
                    ? auth.setRegisterMode
                    : auth.setLoginMode
                }
              >
                {auth.toggleLabel}
              </button>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={auth.onGoogleLogin}
                disabled={auth.isSubmitting}
              >
                <FcGoogle />
                Continuar con Google
              </button>
            </div>
          </form>
        </div>

        <div className={styles.panel}>
          <div className={styles.listHeader}>
            <h2>Que queda listo</h2>
            <span>Email y contrasena</span>
          </div>

          <ul className={styles.taskList}>
            <li className={styles.taskItem}>
              <div className={styles.taskBody}>
                <p className={styles.taskText}>
                  El hook se encarga del registro, login, logout y del listener
                  de sesion.
                </p>
                <span className={styles.taskMeta}>
                  Todo el flujo de auth vive fuera de los componentes.
                </span>
              </div>
            </li>
            <li className={styles.taskItem}>
              <div className={styles.taskBody}>
                <p className={styles.taskText}>
                  Firebase se inicializa una sola vez y usa variables
                  `NEXT_PUBLIC_...`.
                </p>
                <span className={styles.taskMeta}>
                  Solo falta conectar las credenciales reales del proyecto.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.authenticatedLayout}>
      <div className={styles.board}>
        <div className={styles.panel}>
          <div className={styles.authHeader}>
            <div>
              <p className={styles.eyebrow}>Sesion activa</p>
              <h1 className={styles.title}>Hola, {auth.currentUser?.email}</h1>
              <p className={styles.description}>
                Tu acceso ya esta gestionado por Firebase Authentication.
              </p>
            </div>

            <button
              type="button"
              className={styles.ghostButton}
              onClick={auth.onLogout}
              disabled={auth.isSubmitting}
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>

      <TaskDemo />
    </section>
  );
}
