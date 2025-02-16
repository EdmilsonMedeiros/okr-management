import { NextResponse } from "next/server";
import { getDb } from "@/database/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const { id } = await params;
  const { title, deliveries } = await request.json();

  // Calcular o progresso inicial baseado nas entregas
  const totalValue = deliveries.reduce(
    (sum: number, d: any) => sum + d.value,
    0
  );
  const initialProgress = Math.min(100, Math.max(0, totalValue)); // Garante que fique entre 0 e 100

  const result = await db.run(
    "INSERT INTO key_results (title, objective_id, progress) VALUES (?, ?, ?)",
    [title, id, initialProgress]
  );

  const keyResultId = result.lastID;

  // Inserir as entregas
  for (const delivery of deliveries) {
    await db.run(
      "INSERT INTO deliveries (description, value, key_result_id) VALUES (?, ?, ?)",
      [delivery.description, delivery.value, keyResultId]
    );
  }

  // Retornar o key result completo
  const keyResult = await db.get(
    `SELECT 
      kr.*,
      json_group_array(
        json_object(
          'id', d.id,
          'description', d.description,
          'value', d.value
        )
      ) as deliveries
    FROM key_results kr
    LEFT JOIN deliveries d ON d.key_result_id = kr.id
    WHERE kr.id = ?
    GROUP BY kr.id`,
    keyResultId
  );

  return NextResponse.json({
    ...keyResult,
    deliveries: JSON.parse(keyResult.deliveries),
  });
}
