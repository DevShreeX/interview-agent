import dotenv from "dotenv";
dotenv.config();

import { saveBreethEpisode, searchBreethMemory } from "./src/services/breetheMemory.js";

async function testBreethAPI() {
  console.log("Testing Breethe API with key:", process.env.MEMORY_API_KEY ? "Set" : "Not Set");
  
  try {
    console.log("\n--- 1. Testing saveBreethEpisode ---");
    const episodeData = [
      { role: "user", content: "Hello, this is a test from Interview Agent." },
      { role: "assistant", content: "Understood, test recorded." }
    ];
    const saveResult = await saveBreethEpisode(episodeData);
    console.log("Save Result:", saveResult);

    console.log("\n--- 2. Testing searchBreethMemory ---");
    const searchResult = await searchBreethMemory("test", 2);
    console.log("Search Result:", searchResult);

  } catch (error) {
    console.error("Test script failed:", error);
  }
}

testBreethAPI();
