import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Booking from "../../../models/Booking";
import SurplusFood from "../../../models/SurplusFood";
import Cafe from "../../../models/Cafe";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all bookings for a user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const bookings = await Booking.find({ userId: session.user.id })
      .populate("cafeId", "cafeName address")
      .populate("surplusFoodId", "itemName")
      .sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    const body = await req.json();
    
    const {
      cafeId,
      bookingType,
      numberOfPeople,
      numberOfTables,
      bookingDate,
      bookingTime,
      surplusFoodId,
      quantityClaimed
    } = body;
    
    if (!cafeId || !bookingType) {
      return NextResponse.json(
        { success: false, message: "Please provide cafeId and bookingType" },
        { status: 400 }
      );
    }
    
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) {
      return NextResponse.json(
        { success: false, message: "Cafe not found" },
        { status: 404 }
      );
    }
    
    let totalPrice = 0;
    let pointsEarned = 0;
    let foodItemName = null;
    
    if (bookingType === "SurplusFood") {
      if (!surplusFoodId || !quantityClaimed) {
        return NextResponse.json(
          { success: false, message: "Please provide surplusFoodId and quantityClaimed" },
          { status: 400 }
        );
      }
      
      const food = await SurplusFood.findById(surplusFoodId);
      if (!food) {
        return NextResponse.json(
          { success: false, message: "Food item not found" },
          { status: 404 }
        );
      }
      
      if (food.quantityAvailable < quantityClaimed) {
        return NextResponse.json(
          { success: false, message: "Not enough quantity available" },
          { status: 400 }
        );
      }
      
      totalPrice = food.discountedPrice * quantityClaimed;
      // 10% of total price as eco points
      pointsEarned = Math.floor(totalPrice * 0.1);
      foodItemName = food.itemName;
      
      // Update food quantity and status
      food.quantityAvailable -= quantityClaimed;
      food.totalBooked = (food.totalBooked || 0) + quantityClaimed;
      if (food.quantityAvailable === 0) {
        food.status = "Sold Out";
      } else if (food.quantityAvailable < food.quantityAvailable / 2) {
        food.status = "Reserved";
      }
      await food.save();
    } else if (bookingType === "Table") {
      if (!numberOfPeople || !numberOfTables || !bookingDate || !bookingTime) {
        return NextResponse.json(
          { success: false, message: "Please provide all table booking details" },
          { status: 400 }
        );
      }
      
      // Table booking pricing can be customized (currently flat or based on people)
      totalPrice = numberOfTables * 500; // 500 per table (can be customized)
      pointsEarned = 25; // Fixed points for table booking
    }
    
    const newBooking = await Booking.create({
      userId: session.user.id,
      cafeId,
      cafeName: cafe.cafeName,
      bookingType,
      numberOfPeople: bookingType === "Table" ? numberOfPeople : null,
      numberOfTables: bookingType === "Table" ? numberOfTables : null,
      bookingDate: bookingType === "Table" ? bookingDate : null,
      bookingTime: bookingType === "Table" ? bookingTime : null,
      surplusFoodId: bookingType === "SurplusFood" ? surplusFoodId : null,
      foodItemName,
      quantityClaimed: bookingType === "SurplusFood" ? quantityClaimed : null,
      basePrice: totalPrice,
      discountApplied: 0,
      totalPrice,
      pointsEarned,
      status: "Confirmed"
    });
    
    // Add points to user
    const user = await User.findById(session.user.id);
    user.points = (user.points || 350) + pointsEarned;
    await user.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Booking created successfully", 
        data: newBooking,
        pointsEarned
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
