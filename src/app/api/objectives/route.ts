import { NextResponse } from "next/server";
import { getDb } from "@/database/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const db = await getDb();

  let query = `
    SELECT 
      o.*, 
      COALESCE(json_group_array(
        CASE WHEN kr.id IS NULL THEN NULL ELSE
          json_object(
            'id', kr.id,
            'title', kr.title,
            'progress', kr.progress,
            'deliveries', (
              SELECT json_group_array(
                json_object(
                  'id', d.id,
                  'description', d.description,
                  'value', d.value
                )
              )
              FROM deliveries d
              WHERE d.key_result_id = kr.id
            )
          )
        END
      ), '[]') as keyResultsObject
    FROM objectives o
    LEFT JOIN key_results kr ON kr.objective_id = o.id
  `;

  const params = [];
  if (startDate || endDate) {
    query += " WHERE 1=1";
    if (startDate) {
      query += " AND o.created_at >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND o.created_at <= ?";
      params.push(endDate);
    }
  }

  query += " GROUP BY o.id ORDER BY o.created_at DESC";

  const objectives = await db.all(query, params);

  // Parse the JSON string into an array for each objective
  const parsedObjectives = objectives.map((obj) => ({
    ...obj,
    keyResultsObject: JSON.parse(obj.keyResultsObject).filter(
      (kr) => kr !== null
    ),
  }));

  return NextResponse.json(parsedObjectives);
}

export async function POST(request: Request) {
  const db = await getDb();
  const { title } = await request.json();

  const result = await db.run(
    "INSERT INTO objectives (title) VALUES (?)",
    title
  );

  return NextResponse.json({ id: result.lastID, title });
}
