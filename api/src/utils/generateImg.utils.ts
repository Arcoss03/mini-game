import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.DALLE_API_KEY;
const API_URL = "https://api.openai.com/v1/images/generations";

export const generateAndStoreImage = async (
  prompt: string
): Promise<string> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        prompt,
        n: 1,
        size: "256x256",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // Log the full DALL-E API response for debugging
    console.log({ dalleResponseData: response.data });

    // Check if the image URL exists
    if (
      !response.data.data ||
      !response.data.data[0] ||
      !response.data.data[0].url
    ) {
      throw new Error("Invalid response from DALL-E API");
    }

    // Get the URL of the generated image
    const imageUrl = response.data.data[0].url;

    // Download the image from the provided DALL-E URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(imageResponse.data, "binary");
    const uploadsDir = path.join(process.cwd(), "uploads");
    const imgName = `${uuidv4()}.png`;
    const imagePath = path.join(uploadsDir, imgName);

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.writeFileSync(imagePath, imageBuffer);

    return 'https://uploads.ia-game.online/'+imgName;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate image");
  }
};

export const getPrepromptTheme = () => {
  const prompts = [
    "Photorealistic",
    "Cartoon",
    "Anime",
    "Vintage",
    "Surreal",
    "Abstract",
    "Watercolor",
    "Oil Painting",
    "Cyberpunk",
    "Minimalist",
    "Fantasy",
    "Steampunk",
    "Gothic",
    "Pop Art",
    "Comic Book",
    "Impressionist",
    "Realistic Portrait",
    "3D Render",
    "Noir",
    "Street Art",
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
};
