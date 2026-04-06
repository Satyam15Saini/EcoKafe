import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../lib/mongodb";
import SurplusFood from "../../../../../../models/SurplusFood";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

// PUT - Update surplus food item
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    const { id, foodId } = params;
    
    const food = await SurplusFood.findById(foodId);
    
    if (!food) {
      return NextResponse.json(
        { success: false, message: "Food item not found" },
        { status: 404 }
      );
    }
    
    if (food.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only update your own surplus food items" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    
    const allowedFields = [
      "itemName",
      "description",
      "category",
      "quantityAvailable",
      "originalPrice",
      "discountedPrice",
      "isOrganic",
      "isLocallySourced",
      "allergens",
      "availableFrom",
      "availableUntil",
      "status"
    ];
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        food[field] = body[field];
      }
    });
    
    // Recalculate discount percentage if prices changed
    if (body.originalPrice || body.discountedPrice) {
      const originalPrice = body.originalPrice || food.originalPrice;
      const discountedPrice = body.discountedPrice || food.discountedPrice;
      food.discountPercentage = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }
    
    food.updatedAt = new Date();
    await food.save();
    
    return NextResponse.json(
      { success: true, message: "Food item updated successfully", data: food },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete surplus food item
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    const { id, foodId } = params;
    
    const food = await SurplusFood.findById(foodId);
    
    if (!food) {
      return NextResponse.json(
        { success: false, message: "Food item not found" },
        { status: 404 }
      );
    }
    
    if (food.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own surplus food items" },
        { status: 403 }
      );
    }
    
    await SurplusFood.findByIdAndDelete(foodId);
    
    return NextResponse.json(
      { success: true, message: "Food item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
