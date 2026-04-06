import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Cafe from "../../../models/Cafe";
import SurplusFood from "../../../models/SurplusFood";
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const {
      userPreference = "",
      budget = 1000,
      dietary = [],
      city = "",
      allergies = ""
    } = body;

    // Validate city input
    if (!city || city.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: "Please provide a city name"
        },
        { status: 400 }
      );
    }

    // Fetch all available cafes matching the city
    let query = { isActive: true };
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const cafes = await Cafe.find(query).limit(20);
    const surplusFoods = await SurplusFood.find({ 
      status: "Available",
      discountedPrice: { $lte: budget }
    }).populate("cafeId").limit(50);

    if (cafes.length === 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: `No cafes found in ${city}. Try a different city!`,
          recommendations: [] 
        },
        { status: 200 }
      );
    }

    // Prepare cafe information for Gemini
    const cafeInfo = cafes.map(cafe => ({
      _id: cafe._id.toString(),
      name: cafe.cafeName,
      city: cafe.city,
      cuisineTypes: cafe.cuisineType || [],
      ecoRating: cafe.ecoRating || 0,
      address: cafe.address,
      openingTime: cafe.openingTime,
      closingTime: cafe.closingTime,
      surplusFoods: surplusFoods
        .filter(f => f.cafeId._id.toString() === cafe._id.toString())
        .map(f => ({
          name: f.itemName,
          category: f.category,
          price: f.discountedPrice,
          originalPrice: f.originalPrice,
          discount: f.discountPercentage,
          isOrganic: f.isOrganic,
          isLocallySourced: f.isLocallySourced
        }))
    })).filter(c => c.surplusFoods.length > 0 || c.ecoRating > 0);

    let recommendations = [];

    // Try to use Gemini API if available
    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
You are an AI assistant for EcoKafe, a platform that connects sustainable cafes with eco-conscious users.

User Preferences:
- Budget: ₹${budget}
- Dietary Preferences: ${dietary.length > 0 ? dietary.join(", ") : "No specific preferences"}
- City: ${city}
- Special Interest: ${userPreference || "Best sustainable options"}
- Allergies: ${allergies || "None"}

Available Cafes and their surplus food:
${JSON.stringify(cafeInfo, null, 2)}

Please analyze the cafes and surplus food items above and provide the TOP 3 BEST RECOMMENDATIONS for this user. 

For each recommendation, explain:
1. Why this cafe/food is perfect for them
2. The savings they'll get
3. Eco-friendly factors
4. Key features

Format your response as a JSON array with this structure:
[
  {
    "cafeName": "Cafe Name",
    "cafeId": "cafe_id_from_above",
    "reason": "Why this is perfect for you",
    "savings": "X₹ savings (Y% discount)",
    "ecoFactor": "Why it's eco-friendly",
    "specialtyItems": ["Item 1", "Item 2"],
    "matchScore": "85",
    "averagePrice": "250",
    "rating": "4.5"
  }
]

IMPORTANT: Return ONLY valid JSON, no extra text or markdown.`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the JSON response
        try {
          const jsonMatch = responseText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            recommendations = JSON.parse(jsonMatch[0]);
          } else {
            recommendations = JSON.parse(responseText);
          }
        } catch (parseError) {
          console.warn("Error parsing Gemini response, using fallback");
          recommendations = generateFallbackRecommendations(cafeInfo);
        }
      } catch (geminiError) {
        console.warn("Gemini API error, using fallback recommendations:", geminiError.message);
        recommendations = generateFallbackRecommendations(cafeInfo);
      }
    } else {
      // Use fallback recommendations if Gemini API is not available
      recommendations = generateFallbackRecommendations(cafeInfo);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Found ${recommendations.length} great recommendations for you in ${city}!`,
        recommendations
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to fetch recommendations. Please try again."
      },
      { status: 500 }
    );
  }
}

// Fallback function to generate basic recommendations
function generateFallbackRecommendations(cafeInfo) {
  return cafeInfo
    .sort((a, b) => b.ecoRating - a.ecoRating)
    .slice(0, 3)
    .map((cafe, index) => ({
      cafeName: cafe.name,
      cafeId: cafe._id,
      reason: `${cafe.name} is a highly sustainable cafe offering ${cafe.cuisineTypes.join(", ")} options with excellent eco-friendly practices.`,
      savings: `Save up to ${Math.min(50, cafe.surplusFoods[0]?.discount || 30)}% on surplus food items`,
      ecoFactor: `Committed to sustainability with an eco rating of ${cafe.ecoRating}/10. Supports local sourcing and waste reduction.`,
      specialtyItems: cafe.surplusFoods.slice(0, 3).map(f => f.name),
      matchScore: 85 - (index * 5),
      averagePrice: Math.round(cafe.surplusFoods.reduce((sum, f) => sum + f.price, 0) / Math.max(1, cafe.surplusFoods.length)),
      rating: (4.5 - (index * 0.1)).toFixed(1)
    }));
}
