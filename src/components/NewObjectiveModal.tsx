import React, { useState, useEffect } from "react";

export default function NewObjectiveModal({
  onSave,
}: {
  onSave: (title: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [modalInstance, setModalInstance] = useState<any>(null);

  // Inicializar o modal quando o componente montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initModal = async () => {
        const Modal = (await import("bootstrap")).Modal;
        const modalElement = document.getElementById("modalNewObjective");
        if (modalElement) {
          const instance = new Modal(modalElement);
          setModalInstance(instance);
        }
      };
      initModal();
    }
  }, []);

  async function handleSave() {
    await onSave(title);
    setTitle("");

    if (modalInstance) {
      modalInstance.hide();
      const backdrop = document.querySelector(".modal-backdrop");
      backdrop?.remove();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
    }
  }

  return (
    <div
      className="modal fade"
      id="modalNewObjective"
      aria-labelledby="modalNewObjectiveLabel"
      aria-hidden="true"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-none">
            <h5 className="modal-title" id="modalNewObjectiveLabel">
              Criar Novo Objetivo
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <label htmlFor="objectiveInput" className="form-label">
              Objetivo
            </label>
            <input
              type="text"
              id="objectiveInput"
              className="form-control"
              placeholder="Digite o objetivo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="modal-footer border-none">
            <button
              type="button"
              className="btn btn-default default-bg w-100 text-light"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
