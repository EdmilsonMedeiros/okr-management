import { NextResponse } from "next/server";
import { getDb } from "@/database/db";

// Excluir objetivo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const { id } = await params; // Aguardar resolução dos parâmetros

  await db.run("DELETE FROM objectives WHERE id = ?", id);
  return NextResponse.json({ success: true });
}
