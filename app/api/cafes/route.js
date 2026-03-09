import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Cafe from "../../../models/Cafe";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Database se saare cafes nikal kar laao
    const cafes = await Cafe.find({});
    
    return NextResponse.json(cafes, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Error fetching cafes" }, { status: 500 });
  }
}