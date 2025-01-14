import React from 'react';
import './selectComponent.css'

function SelectComponent({ label, myOptions, size }) {
  return (
    <div className='select-container'>
      <label className={"label"}>
        {label}
      </label>
      <select
        className={"select"}
        style={{minWidth:`${size}`}}
      >
        {myOptions?.map((myOption,index) => (
          <option key={index} >
            {myOption.operations.symbol}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectComponent;


{/* <div>
<SelectComponent label="Small select" options={optionsList} size="sm" />
<SelectComponent label="Default select" options={optionsList} size="base" />
<SelectComponent label="Large select" options={optionsList} size="lg" />
</div> */}
