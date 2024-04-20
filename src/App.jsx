import React, {useLayoutEffect, useState } from "react";
import rough from 'roughjs/bundled/rough.esm';

const generator = rough.generator()

function createElement(x1, y1, x2, y2, option) {
  let roughElement;
  if (option === "line") {
    roughElement = generator.line(x1, y1, x2, y2)
  }
  else if (option === "rectangle") {
    roughElement = generator.rectangle(x1, y1, x2-x1, y2-y1)
  }
  return {x1, y1, x2, y2, roughElement}
}

export default function App() {
  const [drawOption, setDrawOption] = useState("line")

  const [elements, setElements] = useState([])
  const [drawing, setDrawing] = useState(false)

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas")
    const context = canvas.getContext("2d")
    context.clearRect(0,0, canvas.width, canvas.height)
    const roughCanvas = rough.canvas(canvas)

    elements.forEach(({roughElement}) => roughCanvas.draw(roughElement))
    
  }, [elements])

  const handleMouseDown = (event) => {
    setDrawing(true)
    
    const {clientX, clientY} = event

    const element = createElement(clientX, clientY, clientX, clientY, drawOption)
    setElements(elements => [...elements, element])
  }

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const {clientX, clientY} = event
    const index = elements.length-1
    const {x1, y1} = elements[index]

    const updatedElement = createElement(x1, y1, clientX, clientY, drawOption)

    const elementsCopy = [...elements]
    elementsCopy[index] = updatedElement
    setElements(elementsCopy)

    console.log(clientX, clientY)
  }
  

  const handleMouseUp = (event) => {
    setDrawing(false)

  }



  return (
    <>
    <input 
      type="radio"
      id="line"
      style={{position: "absolute", zIndex: 1}}
      checked={drawOption === "line"}
      onChange={() => setDrawOption("line")}
    />
    <label htmlFor="line">Line</label>
    <input 
      type="radio"
      id="rectangle"
      style={{position: "absolute", zIndex: 1}}
      checked={drawOption === "rectangle"}
      onChange={() => setDrawOption("rectangle")}
    />
    <label htmlFor="rectangle">Rectangle</label>

      <canvas 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      id="canvas"
      style={{display: "block", position:"absolute",top:0, left:0,zIndex:0}}
      width={window.innerWidth}
      height={window.innerHeight}
      >
      </canvas>
    </>
  )
}