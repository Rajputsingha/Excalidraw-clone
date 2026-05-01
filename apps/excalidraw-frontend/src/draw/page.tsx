//import { Shapes } from "lucide-react";
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
export async function initDraw(canvas :HTMLCanvasElement,roomId:string, socket:WebSocket){
    const ctx=canvas.getContext("2d"); // get the canvas context

    const  existingShapes: Shape[]=await getExistingShape(roomId);  // hit the backend  respondse for get the all  existing shape 

    if(!ctx){
        return
    }

  socket.onmessage=(event)=>{
     const message= JSON.parse(event.data);
        if(message.type=='chart'){
            const parseData=JSON.parse(message.message);
            // Handle both {shape: {...}} and direct shape object
            const shape = parseData.shape || parseData;
            existingShapes.push(shape); // we push the golabl array
            clearCanvas(existingShapes,canvas,ctx); // clearcanvas is render function it will rerender all the sape  in screen

        }
    }
 

clearCanvas(existingShapes,canvas,ctx);

     let clicked=false;
     let startX=0;
     let startY=0;

     canvas.addEventListener("mousedown",(e)=>{
        clicked=true;
        const rect = canvas.getBoundingClientRect();
        startX=e.clientX - rect.left;
        startY=e.clientY - rect.top;
     })
     canvas.addEventListener("mouseup",(e)=>{ // when mouse up mouse uppar kar ke chor diya 
        if(!clicked) return;  // clicked false 
        clicked=false;
            const width = e.clientX - startX;
        const height = e.clientY - startY;
       // @ts-expect-error: Known issue with legacy API definitions
        const selectedTool = window.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: startX + radius,
                centerY: startY + radius,
            }
        }

        if (!shape) {
            return;
        }

        existingShapes.push(shape); // we push a new shape of existing array


        socket.send(JSON.stringify({ // let everuone know ki mene te shape bana li hai app v bana lo
            type:"chart",
            message:  JSON.stringify(shape),
            roomId

        }))
  
     })

     canvas.addEventListener("mousemove",(e)=>{ // mousemove the mouseup
        if(clicked){ // if clicked
        const width = e.clientX - startX;
        const height = e.clientY - startY;
            clearCanvas(existingShapes,canvas,ctx); // we render all  the existing shape by clear canvas
            ctx.strokeStyle="rgba(255,255,255)";
            ctx.strokeRect(startX,startY,width,height);// render the rectangle wehere you start whre we end 
              // @ts-expect-error: Known issue with legacy API definitions
             const selectedTool = window.selectedTool;
            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);   
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();                
            }
        }
        })

}

function clearCanvas(existingShapes:Shape[], canvas: HTMLCanvasElement ,ctx:CanvasRenderingContext2D){
ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="rgba(0,0,0)";
 ctx.fillRect(0,0,canvas.width,canvas.height);

existingShapes.forEach((shape)=>{
if(shape.type==='rect'){
 ctx.strokeStyle="rgba(255,255,255)";
ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
               
}
})
}

async function getExistingShape(roomId:string){
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