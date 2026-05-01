import axios from "axios";
import { HTTP_BACKEND } from "../config";


type Shape ={
    type:'rect';
    x:number;
    y:number;
    width:number;
    height:number;

} | {
    type:'circle';
    centerX:number;
    centerY:number;
    radius:number;

}
export async function getExistingShape(roomId:string){
  try {
    const res= await  axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages=res.data.messages || [];
    const shapes= messages.map((x:{message:string})=>{ // converting string to object 
        try {
            const messageData = JSON.parse(x.message);
            // Handle both {shape: {...}} and direct shape object
            return messageData.shape || messageData;
        } catch {
            return null;
        }
    }).filter((shape: Shape | null): shape is Shape => shape !== null);
    return shapes;
  } catch (error) {
    console.error("Error fetching shapes:", error);
    return [];
  }
}