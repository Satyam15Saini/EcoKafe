import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";
import User from "../../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT - Update booking status (Cancel)
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
    const body = await req.json();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only cancel your own bookings" },
        { status: 403 }
      );
    }

    if (body.status === "Cancelled") {
      booking.status = "Cancelled";
      booking.cancelledAt = new Date();

      // Refund points if booking was cancelled
      if (booking.pointsEarned > 0) {
        const user = await User.findById(session.user.id);
        user.points = Math.max(0, (user.points || 0) - booking.pointsEarned);
        await user.save();
      }
    }

    await booking.save();

    return NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET - Get single booking details
export async function GET(req, { params }) {
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

    const booking = await Booking.findById(id)
      .populate("cafeId", "cafeName address")
      .populate("surplusFoodId", "itemName");

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "You can only view your own bookings" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
