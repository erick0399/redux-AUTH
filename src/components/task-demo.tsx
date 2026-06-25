'use client'

import { FormEvent, useMemo, useState } from "react";
import styles from "@/app/page.module.css";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addTask,
  clearCompleted,
  setFilter,
  toggleTask,
  removeTask,
  type Filter,
} from "@/lib/features/tasks/tasksSlice";

const filters: Array<{ label: string; value: Filter }> = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Completadas", value: "completed" },
];

export function TaskDemo() {
  const dispatch = useAppDispatch();
  const { items, filter } = useAppSelector((state) => state.tasks);
  const [draft, setDraft] = useState("");

  const filteredTasks = useMemo(() => {
    if (filter === "pending") {
      return items.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return items.filter((task) => task.completed);
    }

    return items;
  }, [filter, items]);

  const completedCount = items.filter((task) => task.completed).length;
  const pendingCount = items.length - completedCount;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedDraft = draft.trim();

    if (!normalizedDraft) {
      return;
    }

    dispatch(addTask(normalizedDraft));
    setDraft("");
  };

  return (
    <section className={styles.board}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Ejemplo con Redux Toolkit</p>
        <h1 className={styles.title}>Lista de tareas con estado global</h1>
        <p className={styles.description}>
          El formulario despacha acciones, la lista lee el estado y los filtros
          cambian la misma fuente de verdad compartida por toda la interfaz.
        </p>

        <div className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <span>Total</span>
            <strong>{items.length}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span>Pendientes</span>
            <strong>{pendingCount}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span>Completadas</span>
            <strong>{completedCount}</strong>
          </article>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="task">
            Nueva tarea
          </label>
          <div className={styles.formRow}>
            <input
              id="task"
              className={styles.input}
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ej. Preparar la clase de Redux"
            />
            <button className={styles.primaryButton} type="submit">
              Agregar
            </button>
          </div>
        </form>

        <div className={styles.toolbar}>
          <div className={styles.filterGroup}>
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  option.value === filter
                    ? styles.filterButtonActive
                    : styles.filterButton
                }
                onClick={() => dispatch(setFilter(option.value))}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => dispatch(clearCompleted())}
          >
            Limpiar completadas
          </button>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.listHeader}>
          <h2>Tareas visibles</h2>
          <span>{filteredTasks.length} elementos</span>
        </div>

        <ul className={styles.taskList}>
          {filteredTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <button
                type="button"
                className={task.completed ? styles.checkDone : styles.check}
                onClick={() => dispatch(toggleTask(task.id))}
                aria-label={`Cambiar estado de ${task.text}`}
              >
                {task.completed ? "✓" : ""}
              </button>

              <div className={styles.taskBody}>
                <p
                  className={
                    task.completed ? styles.taskTextDone : styles.taskText
                  }
                >
                  {task.text}
                </p>
                <span className={styles.taskMeta}>
                  {task.completed ? "Completada" : "Pendiente"}
                </span>
              </div>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => dispatch(removeTask(task.id))}
              >
                Eliminar
              </button>
            </li>
          ))}

          {filteredTasks.length === 0 ? (
            <li className={styles.emptyState}>
              No hay tareas para este filtro.
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
