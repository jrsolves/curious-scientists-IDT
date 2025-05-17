export default function getIntentModelPath(message = "") {
    const lower = message.toLowerCase();
  
    if (lower.includes("explain") || lower.includes("why")) {
      return "/models/explaining.glb";
    } else if (lower.includes("teach") || lower.includes("lesson")) {
      return "/models/teaching.glb";
    } else if (lower.includes("show") || lower.includes("look")) {
      return "/models/pointing.glb";
    } else {
      return "/models/talking.glb"; // default intent
    }
  }
  