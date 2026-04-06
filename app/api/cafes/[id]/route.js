import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import Cafe from "../../../../models/Cafe";
import SurplusFood from "../../../../models/SurplusFood";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const cafe = await Cafe.findById(id).populate("ownerId", "username email");
    
    if (!cafe) {
      return NextResponse.json(
        { success: false, message: "Cafe not found" },
        { status: 404 }
      );
    }
    
    // Get surplus food items for this cafe
    const surplusFoods = await SurplusFood.find({ 
      cafeId: id,
      status: "Available"
    });
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          cafe,
          surplusFoods
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update cafe details
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
    const { id } = params;
    const cafe = await Cafe.findById(id);
    
    if (!cafe) {
      return NextResponse.json(
        { success: false, message: "Cafe not found" },
        { status: 404 }
      );
    }
    
    // Check if user is the cafe owner
    if (cafe.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only update your own cafe" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    
    // Update allowed fields only
    const allowedFields = [
      "cafeName",
      "email",
      "phone",
      "address",
      "city",
      "pincode",
      "description",
      "cuisineType",
      "ecoRating",
      "openingTime",
      "closingTime",
      "totalTables",
      "availableTables",
      "website",
      "instagramHandle"
    ];
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        cafe[field] = body[field];
      }
    });
    
    cafe.updatedAt = new Date();
    await cafe.save();
    
    return NextResponse.json(
      { success: true, message: "Cafe updated successfully", data: cafe },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete cafe
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
    const { id } = params;
    const cafe = await Cafe.findById(id);
    
    if (!cafe) {
      return NextResponse.json(
        { success: false, message: "Cafe not found" },
        { status: 404 }
      );
    }
    
    if (cafe.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own cafe" },
        { status: 403 }
      );
    }
    
    await Cafe.findByIdAndDelete(id);
    
    return NextResponse.json(
      { success: true, message: "Cafe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
