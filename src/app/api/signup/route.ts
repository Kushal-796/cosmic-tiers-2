import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "cosmicTiers";

export async function POST(req: NextRequest) {
  if (!uri) {
    return NextResponse.json({ error: "MongoDB URI not set" }, { status: 500 });
  }
  const body = await req.json();
  if (!body.plan) body.plan = "free";
  let client: MongoClient | undefined;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("signups");
    const result = await collection.insertOne(body);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save signup", details: String(err) }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
