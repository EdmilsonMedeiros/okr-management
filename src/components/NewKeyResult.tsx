import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface Delivery {
  description: string;
  value: number;
}

interface NewKeyResultProps {
  objectiveId: number | null;
  keyResultToEdit?: {
    id: number;
    title: string;
    deliveries: Delivery[];
  } | null;
  onSave: (data: { title: string; deliveries: Delivery[] }) => Promise<void>;
}

export function NewKeyResult({
  objectiveId,
  keyResultToEdit,
  onSave,
}: NewKeyResultProps) {
  const [keyResult, setKeyResult] = useState("");
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { description: "", value: 0 },
  ]);
  const [modalInstance, setModalInstance] = useState<any>(null);

  // Inicializar o modal quando o componente montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initModal = async () => {
        const Modal = (await import("bootstrap")).Modal;
        const modalElement = document.getElementById("modalNewKeyResult");
        if (modalElement) {
          const instance = new Modal(modalElement);
          setModalInstance(instance);
        }
      };
      initModal();
    }
  }, []);

  // Carregar dados para edição
  useEffect(() => {
    if (keyResultToEdit) {
      setKeyResult(keyResultToEdit.title);
      setDeliveries(keyResultToEdit.deliveries);
    } else {
      setKeyResult("");
      setDeliveries([{ description: "", value: 0 }]);
    }
  }, [keyResultToEdit]);

  function handleAddDelivery() {
    setDeliveries([...deliveries, { description: "", value: 0 }]);
  }

  function handleRemoveDelivery(index: number) {
    setDeliveries(deliveries.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!objectiveId) {
      console.error("Nenhum objetivo selecionado");
      return;
    }

    try {
      await onSave({
        title: keyResult,
        deliveries,
      });

      setKeyResult("");
      setDeliveries([{ description: "", value: 0 }]);

      if (modalInstance) {
        modalInstance.hide();
        const backdrop = document.querySelector(".modal-backdrop");
        backdrop?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
      }
    } catch (error) {
      console.error("Erro ao salvar resultado-chave:", error);
    }
  }

  return (
    <div className="modal fade" id="modalNewKeyResult" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-none">
            <h5 className="modal-title">Criar Novo Resultado-Chave</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="keyResultInput" className="form-label">
                Resultado-Chave
              </label>
              <input
                type="text"
                id="keyResultInput"
                placeholder="Digite o Resultado-Chave"
                className="form-control"
                value={keyResult}
                onChange={(e) => setKeyResult(e.target.value)}
              />
            </div>

            {deliveries.map((delivery, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex gap-2 align-items-end">
                  <div className="flex-grow-1">
                    <label
                      htmlFor={`deliveryInput${index}`}
                      className="form-label"
                    >
                      Entrega {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`deliveryInput${index}`}
                      placeholder="Digite a entrega"
                      className="form-control"
                      value={delivery.description}
                      onChange={(e) => {
                        const newDeliveries = [...deliveries];
                        newDeliveries[index].description = e.target.value;
                        setDeliveries(newDeliveries);
                      }}
                    />
                  </div>
                  <div style={{ width: "120px" }}>
                    <label
                      htmlFor={`valueInput${index}`}
                      className="form-label"
                    >
                      Valor (%)
                    </label>
                    <input
                      type="number"
                      id={`valueInput${index}`}
                      placeholder="Valor"
                      className="form-control"
                      value={delivery.value}
                      onChange={(e) => {
                        const newDeliveries = [...deliveries];
                        newDeliveries[index].value = Number(e.target.value);
                        setDeliveries(newDeliveries);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 mb-2"
                    onClick={() => handleRemoveDelivery(index)}
                    title="Remover entrega"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddDelivery}
              className="btn btn-link text-decoration-none p-0"
            >
              + Adicionar Entrega
            </button>
          </div>

          <div className="modal-footer border-none">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
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
