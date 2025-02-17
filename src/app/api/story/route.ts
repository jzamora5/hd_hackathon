import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { PlaceInfo } from "@/models/placeInfo";
import { RideStats } from "@/models/rideStats";

const generatePromptMessages = (places: PlaceInfo[], riseStats: RideStats) => {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a storyteller. And you will get information about the motorcycle road trip of a person based of the coordinates the rider crossed. Create a short ride story.",
    },
    {
      role: "user",
      content: `### Rider Stats Information: (Only use the ones with actual value)
      - Average Speed: ${riseStats.averageSpeed}
      - Elevation Gain: ${riseStats.elevationGain}
      - Elevation Loss: ${riseStats.elevationLoss}
      - Moving Speed: ${riseStats.movingSpeed}
      - Moving Time: ${riseStats.movingTime}
      - Total Distance: ${riseStats.totalDistance}
      - Total Duration: ${riseStats.totalDuration}

      ### Items Encountered in Order:
      `,
    },
  ];

  places.forEach((place, index) => {
    if (place.loadedType === "place") {
      messages.push({
        role: "user",
        content: `${index + 1}. A place visited by the rider with the name "${
          place.name
        }", address "${place.address}", coordinates: "${
          place.coordinates
        }", and is described by the following descriptors "${
          place.details?.types
        }" 
        }.`,
      });
    } else {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `${
              index + 1
            }. Another place visited by the rider, analyze this image, consider that it is the ${
              place.loadedType === "streetView"
                ? "street view of a place"
                : "satellite view of a coordinate in the earth"
            }:`,
          },
          {
            type: "image_url",
            image_url: {
              url: place.photoUrl as string,
            },
          },
        ],
      });
    }
  });

  return messages;
};

export async function POST(req: NextRequest) {
  const key = process.env.OPEN_AI_API_KEY;

  if (!key) {
    console.error("No Key");

    return NextResponse.json(
      {
        code: 500,
        error: "OPEN_AI_API_KEY is not set in the environment variables",
      },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: key,
  });

  try {
    const body: { places: PlaceInfo[]; rideStats: RideStats } =
      await req.json();
    const { places, rideStats } = body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: generatePromptMessages(places, rideStats),
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ code: 200, reply }, { status: 200 });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json(
      { code: 500, error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
