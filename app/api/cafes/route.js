import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Cafe from "../../../models/Cafe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

// GET all cafes or GET cafe by owner
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");
    const search = searchParams.get("search");
    
    let query = {};
    
    if (ownerId) {
      query.ownerId = ownerId;
    }
    
    if (search) {
      query.$or = [
        { cafeName: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } }
      ];
    }
    
    const cafes = await Cafe.find(query).populate("ownerId", "username email");
    return NextResponse.json({ success: true, data: cafes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new cafe
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "owner") {
      return NextResponse.json(
        { success: false, message: "Only cafe owners can create cafes" },
        { status: 403 }
      );
    }
    
    await connectToDatabase();
    const body = await req.json();
    
    const {
      cafeName,
      email,
      phone,
      address,
      city,
      pincode,
      description,
      cuisineType,
      ecoRating,
      openingTime,
      closingTime,
      totalTables,
      website,
      instagramHandle
    } = body;
    
    if (!cafeName || !email || !phone || !address || !city || !pincode) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }
    
    const newCafe = await Cafe.create({
      ownerId: session.user.id,
      cafeName,
      email,
      phone,
      address,
      city,
      pincode,
      description,
      cuisineType: cuisineType || [],
      ecoRating: ecoRating || 0,
      openingTime,
      closingTime,
      totalTables,
      availableTables: totalTables,
      website,
      instagramHandle,
      isVerified: false,
      isActive: true
    });
    
    return NextResponse.json(
      { success: true, message: "Cafe created successfully", data: newCafe },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
