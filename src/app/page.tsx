"use client";
import NewObjectiveModal from "@/components/NewObjectiveModal";
import ObjectiveCard from "@/components/ObjectiveCard";
import { NewKeyResult } from "@/components/NewKeyResult";
import { useState, useEffect } from "react";

export default function Home() {
  const [objectives, setObjectives] = useState([]);
  const [isNewKeyResultOpen, setIsNewKeyResultOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(
    null
  );
  const [keyResultToEdit, setKeyResultToEdit] = useState<any>(null);

  useEffect(() => {
    fetchObjectives();
  }, []);

  async function fetchObjectives() {
    // Busca todos os objetivos com base nas datas de início e fim
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await fetch(`/api/objectives?${params}`);
    const data = await response.json();
    setObjectives(data);
  }

  async function handleCreateObjective(title: string) {
    // Cria um novo objetivo
    await fetch("/api/objectives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchObjectives();
  }

  async function handleCreateKeyResult(objectiveId: number, data: any) {
    try {
      // Cria um novo resultado-chave
      await fetch(`/api/objectives/${objectiveId}/key-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchObjectives();
    } catch (error) {
      console.error("Erro ao criar resultado-chave:", error);
    }
  }

  async function handleDeleteObjective(id: number) {
    // Exclui um objetivo
    await fetch(`/api/objectives/${id}`, { method: "DELETE" });
    fetchObjectives();
  }

  async function handleUpdateProgress(
    // Atualiza o progresso de um resultado-chave
    objectiveId: number,
    krId: number,
    progress: number
  ) {
    await fetch(`/api/objectives/${objectiveId}/key-results/${krId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });
    fetchObjectives();
  }

  async function handleDeleteKeyResult(objectiveId: number, krId: number) {
    await fetch(`/api/objectives/${objectiveId}/key-results/${krId}`, {
      method: "DELETE",
    });
    fetchObjectives();
  }

  async function handleUpdateKeyResult(
    // Atualiza um resultado-chave
    objectiveId: number,
    krId: number,
    data: any
  ) {
    try {
      await fetch(`/api/objectives/${objectiveId}/key-results/${krId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchObjectives();
    } catch (error) {
      console.error("Erro ao atualizar resultado-chave:", error);
    }
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card p-3">
            <h6 className="mb-3">Filtros</h6>
            <div className="d-flex gap-3">
              <div>
                <label className="form-label">Data Inicial</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Data Final</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-end">
                <button className="btn btn-primary" onClick={fetchObjectives}>
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="d-flex justify-content-between">
          <h1 className="fs-5">Lista de OKR's</h1>
          <button
            type="button"
            className="btn btn-default default-bg"
            data-bs-toggle={"modal"}
            data-bs-target={"#modalNewObjective"}
          >
            <i className="bi bi-plus text-light"></i>
            <span className="text-light"> Criar objetivo</span>
          </button>
        </div>
      </div>

      <div className="row mb-5">
        {objectives.map((obj: any) => (
          <ObjectiveCard
            key={obj.id}
            objective={obj}
            keyResults={obj.keyResultsObject}
            onNewKeyResult={(objectiveId) => {
              setSelectedObjectiveId(objectiveId);
              setKeyResultToEdit(null);
            }}
            onEditKeyResult={(kr) => {
              setSelectedObjectiveId(obj.id);
              setKeyResultToEdit(kr);
            }}
            onDelete={() => handleDeleteObjective(obj.id)}
            onUpdateProgress={(krId, progress) =>
              handleUpdateProgress(obj.id, krId, progress)
            }
            onDeleteKeyResult={(krId) => handleDeleteKeyResult(obj.id, krId)}
          />
        ))}
      </div>

      <NewObjectiveModal onSave={handleCreateObjective} />

      <NewKeyResult
        objectiveId={selectedObjectiveId}
        keyResultToEdit={keyResultToEdit}
        onSave={async (data) => {
          if (selectedObjectiveId) {
            if (keyResultToEdit) {
              await handleUpdateKeyResult(
                selectedObjectiveId,
                keyResultToEdit.id,
                data
              );
            } else {
              await handleCreateKeyResult(selectedObjectiveId, data);
            }
          }
        }}
      />
    </div>
  );
}
