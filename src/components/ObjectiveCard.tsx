import ProgressBar from "./ProgressBar";

interface ObjectiveCardProps {
  objective: {
    id: number;
    title: string;
  };
  keyResults: any[];
  onNewKeyResult: (objectiveId: number) => void;
  onDelete: () => Promise<void>;
  onUpdateProgress: (krId: number, progress: number) => Promise<void>;
  onDeleteKeyResult: (krId: number) => Promise<void>;
  onEditKeyResult: (kr: any) => void;
}

export default function ObjectiveCard({
  objective,
  keyResults,
  onNewKeyResult,
  onDelete,
  onUpdateProgress,
  onDeleteKeyResult,
  onEditKeyResult,
}: ObjectiveCardProps) {
  // Calcular progresso do resultado-chave baseado nas entregas
  const calculateKeyResultProgress = (deliveries: any[]) => {
    if (!deliveries || deliveries.length === 0) return 0;
    const totalValue = deliveries.reduce((sum, d) => sum + d.value, 0);
    return Math.min(100, totalValue); // Garante que não passe de 100%
  };

  // Calcular progresso geral do objetivo baseado nos resultados-chave
  const calculateObjectiveProgress = () => {
    if (!keyResults || keyResults.length === 0) return 0;

    const totalProgress = keyResults.reduce((sum, kr) => {
      const krProgress = calculateKeyResultProgress(kr.deliveries);
      const weight = 100 / keyResults.length;
      return sum + (krProgress * weight) / 100;
    }, 0);

    return Math.round(totalProgress);
  };

  const handleAddKeyResult = () => {
    onNewKeyResult(objective.id); // Passar o ID do objetivo
  };

  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-3">
      <div className="card shadow-sm p-3 m-1 bg-body rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="fs-5">{objective.title}</h1>
          <button
            onClick={onDelete}
            className="btn btn-link text-danger p-0"
            title="Excluir objetivo"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
        <ProgressBar progress={calculateObjectiveProgress()} />
        <div className="container-fluid">
          <div className="d-flex justify-content-between mt-3 mb-3 ms-0">
            <div className="broken-line p-1 col-3 col-md-3 col-sm-4 col-lg-4 col-xl-4  mb-2"></div>
            <span style={{ fontSize: 15 }}>Resultados-Chave</span>
            <div className="broken-line p-1 col-3 col-md-3 col-sm-4 col-lg-4 col-xl-4  mb-2"></div>
          </div>
        </div>
        {/* Linha estilo "ponte quebrada" */}
        <div className="">
          {/* Renderizando os keyResults */}
          <div className="container-fluid">
            {keyResults.map((kr: any) => (
              <div key={kr.id} className="key-results-container">
                <div className="d-flex justify-content-between align-items-center">
                  <h1 className="fs-6">{kr.title}</h1>
                  <div className="d-flex gap-2">
                    <span
                      className="form-control-plaintext text-end"
                      style={{ width: "80px" }}
                    >
                      {calculateKeyResultProgress(kr.deliveries)}%
                    </span>
                    <button
                      onClick={() => onDeleteKeyResult(kr.id)}
                      className="btn btn-link text-danger p-0"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="">
                  <div className="d-flex align-items-center">
                    <ProgressBar
                      progress={calculateKeyResultProgress(kr.deliveries)}
                    />
                    <div className="">
                      <button
                        type="button"
                        className="btn btn-light btn-sm ms-2"
                        onClick={() => onEditKeyResult(kr)}
                        data-bs-toggle="modal"
                        data-bs-target="#modalNewKeyResult"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </div>
                  </div>
                  {/* Exibição das entregas */}
                  <div className="mt-2">
                    {kr.deliveries.map((dl: any, index: any) => (
                      <div
                        key={index}
                        className="text-secondary fs-6 d-flex justify-content-between align-items-center py-1"
                      >
                        <div className="flex-grow-1">{dl.description}</div>
                        <div className="badge bg-light text-dark ms-2">
                          {dl.value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button
          className="defaul-text fs-5 m-1 border-0 bg-transparent"
          onClick={handleAddKeyResult}
          data-bs-toggle="modal"
          data-bs-target="#modalNewKeyResult"
        >
          <i className="bi bi-plus"></i> Adicionar Resultado-Chave
        </button>
      </div>
    </div>
  );
}
