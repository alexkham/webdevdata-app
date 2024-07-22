// import React, { useState } from 'react';

// const GradientDescentSVG = () => {
//   const [currentX, setCurrentX] = useState(4);
//   const [learningRate, setLearningRate] = useState(0.1);
//   const [steps, setSteps] = useState([]);
//   const [showExplanation, setShowExplanation] = useState(false);

//   const width = 600;
//   const height = 400;
//   const scaleX = 50;
//   const scaleY = 20;

//   const func = (x) => x * x + 5 * x + 10;
//   const derivative = (x) => 2 * x + 5;

//   const takeStep = () => {
//     const gradient = derivative(currentX);
//     const newX = currentX - learningRate * gradient;
//     setCurrentX(newX);
//     setSteps(prev => [...prev, { x: currentX, y: func(currentX), newX, newY: func(newX), gradient }]);
//     setShowExplanation(true);
//   };

//   const reset = () => {
//     setCurrentX(4);
//     setSteps([]);
//     setShowExplanation(false);
//   };

//   const mapX = (x) => x * scaleX + width / 2;
//   const mapY = (y) => height - y * scaleY;

//   const points = Array.from({ length: width }, (_, i) => {
//     const x = (i - width / 2) / scaleX;
//     return `${i},${mapY(func(x))}`;
//   }).join(' ');

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Gradient Descent on f(x) = x² + 5x + 10</h2>
//       <div className="mb-4">
//         <button 
//           onClick={takeStep} 
//           className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//         >
//           Take Step
//         </button>
//         <button 
//           onClick={reset} 
//           className="bg-red-500 text-white px-4 py-2 rounded mr-2"
//         >
//           Reset
//         </button>
//         <label className="mr-2">
//           Learning Rate:
//           <input 
//             type="number" 
//             value={learningRate} 
//             onChange={(e) => setLearningRate(Number(e.target.value))}
//             className="ml-2 w-20 border rounded px-2 py-1"
//           />
//         </label>
//       </div>
//       <svg width={width} height={height}>
//         <polyline points={points} fill="none" stroke="blue" strokeWidth="2" />
//         <line x1="0" y1={height - 10} x2={width} y2={height - 10} stroke="black" />
//         <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="black" />
//         {steps.map((step, index) => (
//           <g key={index}>
//             <circle cx={mapX(step.x)} cy={mapY(step.y)} r="5" fill="red" />
//             <line 
//               x1={mapX(step.x)} 
//               y1={mapY(step.y)} 
//               x2={mapX(step.newX)} 
//               y2={mapY(step.newY)} 
//               stroke="green" 
//               strokeWidth="2" 
//             />
//             <line 
//               x1={mapX(step.x)} 
//               y1={mapY(step.y)} 
//               x2={mapX(step.x + 1)} 
//               y2={mapY(step.y + step.gradient)} 
//               stroke="orange" 
//               strokeWidth="2" 
//             />
//           </g>
//         ))}
//         <circle cx={mapX(currentX)} cy={mapY(func(currentX))} r="5" fill="red" />
//         <text x={width - 20} y={height - 20}>x</text>
//         <text x={width / 2 + 10} y="20">y</text>
//       </svg>
//       <div className="mt-4">
//         <p>Current x: {currentX.toFixed(4)}</p>
//         <p>Current y: {func(currentX).toFixed(4)}</p>
//         <p>Current gradient: {derivative(currentX).toFixed(4)}</p>
//       </div>
//       {showExplanation && steps.length > 0 && (
//         <div className="mt-4 p-4 bg-gray-100 rounded">
//           <h3 className="font-bold">Step Explanation:</h3>
//           <p>1. We start at x = {steps[steps.length - 1].x.toFixed(4)}</p>
//           <p>2. The gradient (slope) at this point is {steps[steps.length - 1].gradient.toFixed(4)} (orange line)</p>
//           <p>3. We move in the opposite direction of the gradient</p>
//           <p>4. Step size = gradient * learning rate = {steps[steps.length - 1].gradient.toFixed(4)} * {learningRate} = {(steps[steps.length - 1].gradient * learningRate).toFixed(4)}</p>
//           <p>5. New x = current x - step size = {steps[steps.length - 1].x.toFixed(4)} - {(steps[steps.length - 1].gradient * learningRate).toFixed(4)} = {steps[steps.length - 1].newX.toFixed(4)}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GradientDescentSVG;
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';

const GradientDescentSVG = () => {
  const [currentX, setCurrentX] = useState(4);
  const [learningRate, setLearningRate] = useState(0.1);
  const [steps, setSteps] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [targetError, setTargetError] = useState(0.001);
  const [stepInterval, setStepInterval] = useState(500);

  const width = 600;
  const height = 400;
  const scaleX = 50;
  const scaleY = 20;

  const intervalRef = useRef(null);

  const func = (x) => x * x + 5 * x + 10;
  const derivative = (x) => 2 * x + 5;

  const takeStep = useCallback(() => {
    const gradient = derivative(currentX);
    const newX = currentX - learningRate * gradient;
    setCurrentX(newX);
    setSteps(prev => [...prev, { x: currentX, y: func(currentX), newX, newY: func(newX), gradient }]);
    setShowExplanation(true);
    setStepCount(prev => prev + 1);

    if (Math.abs(gradient) < targetError) {
      setIsRunning(false);
    }
  }, [currentX, learningRate, targetError]);

  const reset = () => {
    setCurrentX(4);
    setSteps([]);
    setShowExplanation(false);
    setStepCount(0);
    setIsRunning(false);
  };

  const toggleRun = () => {
    setIsRunning(prev => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(takeStep, stepInterval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, stepInterval, takeStep]);

  const mapX = (x) => x * scaleX + width / 2;
  const mapY = (y) => height - y * scaleY;

  const points = Array.from({ length: width }, (_, i) => {
    const x = (i - width / 2) / scaleX;
    return `${i},${mapY(func(x))}`;
  }).join(' ');

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gradient Descent on f(x) = x² + 5x + 10</h2>
      <div className="mb-4">
        <button 
          onClick={takeStep} 
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          disabled={isRunning}
        >
          Take Step
        </button>
        <button 
          onClick={toggleRun} 
          className={`${isRunning ? 'bg-yellow-500' : 'bg-green-500'} text-white px-4 py-2 rounded mr-2`}
        >
          {isRunning ? 'Stop' : 'Run'}
        </button>
        <button 
          onClick={reset} 
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Reset
        </button>
        <label className="mr-2">
          Learning Rate:
          <input 
            type="number" 
            value={learningRate} 
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="ml-2 w-20 border rounded px-2 py-1"
            step="0.01"
            min="0"
          />
        </label>
        <label className="mr-2">
          Target Error:
          <input 
            type="number" 
            value={targetError} 
            onChange={(e) => setTargetError(Number(e.target.value))}
            className="ml-2 w-20 border rounded px-2 py-1"
            step="0.0001"
            min="0"
          />
        </label>
        <label className="mr-2">
          Step Interval (ms):
          <input 
            type="number" 
            value={stepInterval} 
            onChange={(e) => setStepInterval(Number(e.target.value))}
            className="ml-2 w-20 border rounded px-2 py-1"
            step="100"
            min="100"
          />
        </label>
      </div>
      <svg width={width} height={height}>
        <polyline points={points} fill="none" stroke="blue" strokeWidth="2" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="black" />
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="black" />
        {steps.map((step, index) => (
          <g key={index}>
            <circle cx={mapX(step.x)} cy={mapY(step.y)} r="5" fill="red" />
            <line 
              x1={mapX(step.x)} 
              y1={mapY(step.y)} 
              x2={mapX(step.newX)} 
              y2={mapY(step.newY)} 
              stroke="green" 
              strokeWidth="2" 
            />
            <line 
              x1={mapX(step.x)} 
              y1={mapY(step.y)} 
              x2={mapX(step.x + 1)} 
              y2={mapY(step.y + step.gradient)} 
              stroke="orange" 
              strokeWidth="2" 
            />
          </g>
        ))}
        <circle cx={mapX(currentX)} cy={mapY(func(currentX))} r="5" fill="red" />
        <text x={width - 20} y={height / 2 + 20}>x</text>
        <text x={width / 2 + 10} y="20">y</text>
      </svg>
      <div className="mt-4">
        <p>Current x: {currentX.toFixed(4)}</p>
        <p>Current y: {func(currentX).toFixed(4)}</p>
        <p>Current gradient: {derivative(currentX).toFixed(4)}</p>
        <p>Step Count: {stepCount}</p>
      </div>
      {showExplanation && steps.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Step Explanation:</h3>
          <p>1. We start at x = {steps[steps.length - 1].x.toFixed(4)}</p>
          <p>2. The gradient (slope) at this point is {steps[steps.length - 1].gradient.toFixed(4)} (orange line)</p>
          <p>3. We move in the opposite direction of the gradient</p>
          <p>4. Step size = gradient * learning rate = {steps[steps.length - 1].gradient.toFixed(4)} * {learningRate} = {(steps[steps.length - 1].gradient * learningRate).toFixed(4)}</p>
          <p>5. New x = current x - step size = {steps[steps.length - 1].x.toFixed(4)} - {(steps[steps.length - 1].gradient * learningRate).toFixed(4)} = {steps[steps.length - 1].newX.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default GradientDescentSVG;