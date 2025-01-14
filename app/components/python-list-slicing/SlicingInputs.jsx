import React from 'react';
import './MyArrayComponent.css';

function SlicingInputs({ start, stop, step, setStart, setStop, setStep }) {
        const resetIndeces=()=>{
        setStart('');
        setStop('');
        setStep('');
      }
  return (
    <div className='expression'>
      <span className='bracket-title'>List </span><span className='bracket-index'>[</span>
      <div className='index-input-item'>
        <input
          type="number"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className='index-input'
        />
        <label>Start</label>
        <span className='question-mark'>?</span>
        <span className='tooltip-text'>Defines the starting index of the slice (defaults to 0).</span>
      </div>
      :
      <div className='index-input-item'>
        <input
          type="number"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          className='index-input'
        />
        <label>Stop</label>
        <span className='question-mark'>?</span>
        <span className='tooltip-text'>Defines the ending index of the slice, exclusive.</span>
      </div>
      :
      <div className='index-input-item'>
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(e.target.value)}
          className='index-input'
        />
        <label>Step</label>
        <span className='question-mark'>?</span>
        <span className='tooltip-text'>Defines the step count of the slice (defaults to 1).</span>
      </div>
      <span className='bracket-index'>]</span>
      <button onClick={resetIndeces}>Reset Indices</button>
    </div>
  );
}

export default SlicingInputs;
