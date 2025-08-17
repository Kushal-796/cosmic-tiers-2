import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(req: Request) {
  // For demo: get user by email from query string (replace with session/cookie in production)
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "cosmicTiers";
  if (!email || !uri) return NextResponse.json({ success: false });
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection("signups").findOne({ "account.email": { $regex: `^${email}$`, $options: "i" } });
    if (!user) return NextResponse.json({ success: false });
    return NextResponse.json({ success: true, user });
  } finally {
    await client.close();
  }
}
