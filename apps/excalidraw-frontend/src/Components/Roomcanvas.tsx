import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token =
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzN2YyODkzOS1iMDgxLTQ4Y2ItOTJlZS1mMmVkODgzOGY4MzMiLCJpYXQiOjE3NjQ0NzQ2MzF9.dWfIQnk_6uvut1K8uhkZGB4Vik7h1LH9nmpCoFdd0Cg";;

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

    return () => ws.close(); // <-- cleanup
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
