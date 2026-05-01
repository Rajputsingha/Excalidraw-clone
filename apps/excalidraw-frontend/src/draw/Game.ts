import { getExistingShape } from "./http";
import type { Tool } from "./type";
type Shape ={
    type:"rect";
    x:number;
    y:number;
    width:number;
    height:number;

} | {
    type:"circle";
    centerX:number;
    centerY:number;
    radius:number;

}|{
    type: "pencil";
    color: string;
    lineWidth: number;
   points: { x: number; y: number }[];
    startX: number;
    startY: number;
    endX: number;
    endY: number;

}






export class Game {

    private canvas:HTMLCanvasElement
private ctx: CanvasRenderingContext2D | null = null;
private  existingShapes:Shape[]
private roomId:string;
private clicked:boolean;
private startX=0;
private startY=0; 
private selectedTool:Tool ="circle";
private currentPath: { x: number; y: number }[] = [];

 socket:WebSocket

    constructor(canvas:HTMLCanvasElement, roomId:string, socket:WebSocket){
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        this.existingShapes=[];
        this.roomId=roomId
        this.socket=socket
        this.init();
        this.initHandlers();
        this.clicked=false;
        this.initMouseHandlers();
    

    }

      destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseupHandlers)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }
      setTool(tool: Tool) {
        this.selectedTool = tool;
    }
   async init(){
    this.existingShapes=await getExistingShape( this.roomId)
    this.clearCanvas();

    }
    initHandlers() {
          this.socket.onmessage=(event)=>{
     const message= JSON.parse(event.data);
        if(message.type=='chart'){
            const parseData=JSON.parse(message.message);
            // Handle both {shape: {...}} and direct shape object
           this.existingShapes.push(parseData.shape); // we push the golabl array
           this.clearCanvas(); // clearcanvas is render function it will rerender all the sape  in screen

        }
    }

}
    clearCanvas(){
        const ctx=this.ctx;
        if(!ctx){
            return;
        }
       ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
 ctx.fillStyle="rgba(0,0,0)";
 ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

this.existingShapes.map((shape)=>{
if(shape.type==='rect'){
 ctx.strokeStyle="rgba(255,255,255)";
ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
               
} else if(shape.type==="circle"){
   ctx.beginPath();
 ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);

ctx.stroke();
ctx.closePath();
}
// Add the pencil funtionality

else if (shape.type==="pencil"){
        if (!shape.points || shape.points.length < 2) return;
ctx.strokeStyle = shape.color || "white";
    ctx.lineWidth = shape.lineWidth || 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
   
    ctx.beginPath();
 shape.points.forEach((point, index)=>{
    if(index==0){
        ctx.moveTo(point.x, point.y)
    }else{
        ctx.lineTo(point.x, point.y);
    }
 })
 ctx.stroke();
  

}
})
    }


    mouseDownHandler=(e: MouseEvent)=>{
                const ctx = this.ctx;
    if (!ctx) return;
             this.clicked=true;
      //  const rect = canvas.getBoundingClientRect();
         this.startX=e.clientX //- rect.left;
       this.startY=e.clientY //- rect.top;
    
  if (this.selectedTool === "pencil") {
        // Initialize the pencil path with the first point
        this.currentPath= [{ x: this.startX, y: this.startY }];
        ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
    }

    }

    mouseupHandlers=(e: MouseEvent)=>{
       this.clicked=false;
    const width=e.clientX - this.startX;
        const height=e.clientY - this.startY;
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
 if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: this.currentPath,
        color: "white",
        lineWidth: 2,
        startX: this.startX,
        startY: this.startY,
        endX: e.clientX,
        endY: e.clientY,
      };

      this.currentPath = [];
    }

        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        }

        if (!shape) {
            return;
        }

       this.existingShapes.push(shape); // we push a new shape of existing array


       this.socket.send(JSON.stringify({ // let everuone know ki mene te shape bana li hai app v bana lo
            type:"chart",
            message:  JSON.stringify({
                shape,
            }),

               roomId:this.roomId

        }));


           
    }
  mouseMoveHandler = (e:MouseEvent) => {
     const ctx=this.ctx;
        if(!ctx){
            return;
        }
        // pencil functionlaity
          if (this.selectedTool === "pencil" && this.clicked) {
           this.currentPath.push({ x: e.clientX, y: e.clientY });

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  }
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
              if (this.selectedTool !== "pencil") {
      this.clearCanvas();
    }
     ctx.strokeStyle = "rgba(255, 255, 255)"
            const selectedTool = this.selectedTool;
            console.log(selectedTool)
            if (selectedTool === "rect") {
                ctx.strokeRect(this.startX, this.startY, width, height);   
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();                
            }
        }
    }




    initMouseHandlers(){
        
           this.canvas.addEventListener("mousedown", this.mouseDownHandler)
           this.canvas.addEventListener("mouseup", this.mouseupHandlers)
           this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
     

}
}
