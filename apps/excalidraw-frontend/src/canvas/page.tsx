
import { useParams } from "react-router-dom";
import { RoomCanvas } from "../Components/Roomcanvas";

export default function CanvasPage() {
  const { roomId } = useParams();  // <-- get /canvas/:roomId

  console.log(roomId);

  return <RoomCanvas roomId={roomId!} />;
}