import { NextResponse } from "next/server";
import { getDb } from "@/database/db";

// Atualizar progresso do resultado-chave
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; krId: string } }
) {
  const db = await getDb();
  const { id, krId } = await params;
  const { progress } = await request.json();

  // Atualizar o progresso do key result
  await db.run(
    "UPDATE key_results SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [progress, krId]
  );

  // Recalcular e atualizar o progresso do objetivo
  const objective = await db.get(
    `
    SELECT 
      AVG(kr.progress) as avg_progress
    FROM key_results kr
    WHERE kr.objective_id = ?
  `,
    id
  );

  await db.run(
    "UPDATE objectives SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [Math.round(objective.avg_progress || 0), id]
  );

  return NextResponse.json({ success: true });
}

// Excluir resultado-chave
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; krId: string } }
) {
  const db = await getDb();
  const { krId } = await params;

  await db.run("DELETE FROM key_results WHERE id = ?", krId);
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; krId: string } }
) {
  const db = await getDb();
  const { krId } = await params;
  const { title, deliveries } = await request.json();

  // Atualizar o key result
  await db.run(
    "UPDATE key_results SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [title, krId]
  );

  // Deletar entregas antigas
  await db.run("DELETE FROM deliveries WHERE key_result_id = ?", krId);

  // Inserir novas entregas
  for (const delivery of deliveries) {
    await db.run(
      "INSERT INTO deliveries (description, value, key_result_id) VALUES (?, ?, ?)",
      [delivery.description, delivery.value, krId]
    );
  }

  return NextResponse.json({ success: true });
}
