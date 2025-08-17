import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "cosmicTiers";
  if (!uri) {
    return NextResponse.json({ success: false, message: "Database config error" }, { status: 500 });
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("signups");
    // Try to find user with case-insensitive email
    const user = await collection.findOne({ "account.email": { $regex: `^${email}$`, $options: "i" } });
    // DEBUG: Log found user
    console.log('LOGIN DEBUG: Found user', user);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }
    if (user.account.password !== password) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
    // Optionally set a session/cookie here
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
