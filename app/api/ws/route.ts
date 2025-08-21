import { NextRequest } from "next/server";
import WebSocket from "ws";

let wsClient: WebSocket;

export const GET = async (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return new Response("Unauthorized", { status: 401 });

  // Connect to real WS backend
  wsClient = new WebSocket(`ws://localhost:5000?token=${token}`);

  wsClient.on("open", () => {
    console.log("Proxy WS connected to backend");
  });

  wsClient.on("message", (message) => {
    // You can optionally handle messages or forward them somewhere
    console.log("Received from backend WS:", message.toString());
  });

  wsClient.on("close", () => {
    console.log("Proxy WS disconnected");
  });

  return new Response("WS proxy initialized");
};
