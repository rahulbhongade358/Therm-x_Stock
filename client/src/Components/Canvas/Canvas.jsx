import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Undo2, Redo2, Eraser, Save, Trash2, Pencil } from "lucide-react";

function Canvas({ width = "100%", height = "500px" }) {
  const canvasRef = useRef(null);
  const [isEraser, setIsEraser] = useState(false);

  const undo = () => canvasRef.current.undo();
  const redo = () => canvasRef.current.redo();
  const clear = () => canvasRef.current.clearCanvas();
  const toggleEraser = () => {
    setIsEraser(!isEraser);
    canvasRef.current.eraseMode(!isEraser);
  };

  const saveCanvas = async () => {
    const canvaData = await canvasRef.current.exportImage("png");
    localStorage.setItem("sheetCanvas", canvaData);
    alert("Shape Saved Successfully. You can close this tab now.");
    setTimeout(() => (window.location.href = "/addstocks"), 1000);
  };

  return (
    <div className="relative">
      <ReactSketchCanvas
        ref={canvasRef}
        width={width}
        height={height}
        strokeWidth={isEraser ? 10 : 3}
        strokeColor={isEraser ? "white" : "black"}
        className="border rounded-lg"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={undo}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          title="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          title="Redo"
        >
          <Redo2 size={18} />
        </button>
        <button
          onClick={toggleEraser}
          className={`p-2 rounded ${
            isEraser ? "bg-yellow-400" : "bg-gray-200"
          } hover:bg-yellow-300`}
          title="Eraser Mode"
        >
          {isEraser ? <Pencil size={18} /> : <Eraser size={18} />}
        </button>

        <button
          onClick={clear}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          title="Clear Canvas"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={saveCanvas}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          title="Save"
        >
          <Save size={18} />
        </button>
      </div>
    </div>
  );
}

export default Canvas;
