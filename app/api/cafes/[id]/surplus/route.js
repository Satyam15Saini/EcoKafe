import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import SurplusFood from "../../../../../models/SurplusFood";
import Cafe from "../../../../../models/Cafe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all surplus foods for a cafe
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const surplusFoods = await SurplusFood.find({ cafeId: id })
      .populate("cafeId", "cafeName")
      .sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: surplusFoods },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create surplus food item
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "owner") {
      return NextResponse.json(
        { success: false, message: "Only cafe owners can add surplus food" },
        { status: 403 }
      );
    }
    
    await connectToDatabase();
    const { id } = params;
    
    // Verify cafe ownership
    const cafe = await Cafe.findById(id);
    if (!cafe || cafe.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only add food to your own cafe" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const {
      itemName,
      description,
      category,
      quantityAvailable,
      originalPrice,
      discountedPrice,
      isOrganic,
      isLocallySourced,
      allergens,
      availableFrom,
      availableUntil
    } = body;
    
    if (!itemName || !quantityAvailable || !originalPrice || !discountedPrice) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }
    
    const discountPercentage = Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
    
    const newSurplusFood = await SurplusFood.create({
      cafeId: id,
      ownerId: session.user.id,
      itemName,
      description,
      category: category || "Vegetarian",
      quantityAvailable,
      originalPrice,
      discountedPrice,
      discountPercentage,
      isOrganic: isOrganic || false,
      isLocallySourced: isLocallySourced || false,
      allergens: allergens || [],
      availableFrom: availableFrom || new Date(),
      availableUntil: availableUntil || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
      status: "Available"
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Surplus food added successfully", 
        data: newSurplusFood 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
