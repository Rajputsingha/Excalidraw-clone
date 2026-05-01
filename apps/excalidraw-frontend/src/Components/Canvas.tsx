import { useEffect,useRef, useState } from "react"
import { initDraw } from "../draw/page";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon,Eraser } from "lucide-react";
import { Game } from "../draw/Game";
import type { Tool } from "../draw/type";
 

export function Canvas({
    roomId,
    socket

}:{
    socket:WebSocket
   roomId:string;

}) {
    
        const canvasRef=useRef<HTMLCanvasElement>(null);
        const [game,setGame]=useState<Game>(); // refrence to our game class 
        const [selectedTool, setSelectedtool]=useState<Tool>("circle")

        useEffect(()=>{
            game?.setTool(selectedTool);
        },[selectedTool,game]);
   useEffect(()=>{
           if (canvasRef.current){
            const g=new Game(canvasRef.current,roomId,socket)
              setGame(g);

                return ()=> {
             g.destroy();
       }
       }
     
       
       }, [roomId, socket]);
    return (
        <div>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      <div>
        <Topbar setSelectedtool={setSelectedtool}selectedTool={selectedTool}/>
      </div>
        </div>
    

    )
}
//  // render big canvas screen

function Topbar({selectedTool,setSelectedtool}:{
    selectedTool:Tool,
   setSelectedtool:(s:Tool) => void
    
}){
    return(
        <div style={{
            position:"fixed",
            top:10,
            left:10
        }}>
            <div className="flex gap-t">
         <IconButton 
          onClick={()=>{
            setSelectedtool("pencil")
         }} 
         activated={selectedTool==="pencil"} 
         icon={<Pencil/>}>
  </IconButton>
         <IconButton 
          onClick={()=>{
            setSelectedtool("rect")
         }} 
         activated={selectedTool==="rect"}
          icon={<RectangleHorizontalIcon/>}>
            
          </IconButton>
          <IconButton onClick={()=>{
            setSelectedtool("circle")
          }} activated={selectedTool==="circle"} icon={<Circle/>}></IconButton>
         <IconButton
  onClick={() => {
    setSelectedtool("eraser");
  }}
  activated={selectedTool === "eraser"}
  icon={<Eraser />}
/>

        </div >
        </div>
    )
}