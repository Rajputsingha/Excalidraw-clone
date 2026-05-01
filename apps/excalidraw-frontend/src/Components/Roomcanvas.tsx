import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token =
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTRhNTcwYS02NjdjLTRjYjYtOTgxOC1lNDJkNzJkMTIyN2IiLCJpYXQiOjE3NzYyNjAwOTN9.mZIECCMJTkM9RkN3EmbRoaDCvFIN9LsReQ47EeMaVAY";

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = (event) => {
      console.error("WebSocket closed:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    };

    return () => {
      // In React dev (StrictMode), effects can mount/unmount quickly.
      // Closing while CONNECTING can produce noisy console errors.
      ws.onopen = null;
      ws.onerror = null;
      ws.onclose = null;

      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "cleanup");
      }
    };
  }, [roomId]); // <-- FIXED

  if (!socket) {
    return <div>Connecting to server....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}

// this logic write to connect the websocket server 