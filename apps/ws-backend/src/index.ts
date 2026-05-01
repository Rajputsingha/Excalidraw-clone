import "dotenv/config";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-comman/config";
import { prismaClient } from "@repo/db/Db";

const wss = new WebSocketServer({ port: 4000 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId || null;
  } catch {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return;

  const query = new URLSearchParams(url.split("?")[1]);
  const token = query.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({ userId, rooms: [], ws });

  ws.on("message", async (data) => {
    const msg = JSON.parse(data.toString());

   
    if (msg.type === "join_room") {
      const user = users.find((u) => u.ws === ws);
      if (user) user.rooms.push(String(msg.roomId));
    }

    // LEAVE ROOM
    if (msg.type === "leave_room") {
      const user = users.find((u) => u.ws === ws);
      if (user) {
        user.rooms = user.rooms.filter((r) => r !== String(msg.roomId));
      }
    }

   
    if (msg.type === "chart") {
      const roomId = msg.roomId;
      const message = msg.message;

      if (!roomId) return;

      // SAVE TO DB — SIMPLE AND CORRECT
      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        },
      });

      // BROADCAST TO OTHER USERS
      users.forEach((user) => {
        if (user.rooms.includes(String(roomId))) {
          user.ws.send(
            JSON.stringify({
              type: "chart",
              message,
              roomId,
            })
          );
        }
      });
    }
  });
});


