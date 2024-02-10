import React from 'react';
import './selectComponent.css'

function SelectComponent2({ label, options, size, handleChange,lookup }) {
  return (
    <div className='select-container'>
      <label className={"label"}>
        {label}
      </label>
      <select
        className={"select"}
        style={{minWidth:`${size}`}}
        onChange={handleChange}
      >
        <option>Select {lookup}</option>
        {options?.map((option,index) => (
          <option key={index} >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectComponent2;


