import React ,{useRef} from 'react';
import './selectComponent.css'
import jsonData from '../../db/operations.json'; // Import the JSON data

const SymbolSelect=React.forwardRef(({categoryId,selectedOperation, onOperationChange},ref)=>{
  const symbols = {};
  const abbreviations={};
 

  // Find the category with category_id 1
  const category = jsonData.categories.find(category => category.category_id === categoryId);

  // Extract symbols for operations in the category
  if (category) {
    category.operations.forEach(operation => {
      symbols[operation.name] = operation.symbol;
      abbreviations[operation.name]=operation.abbreviation;
    });
  }

  return (
    <div className='select-operation'>
      <label className={`label`}>Select  Operation:</label>
      <br></br>
      <select
      className={`select`}
      value={selectedOperation} // Set the value based on the prop
      onChange={onOperationChange} // Handle changes using the prop function
        >
        {Object.keys(symbols).map((operationName, index) => (
          <option key={index} value={abbreviations[operationName]}>
            {symbols[operationName]}
          </option>
        ))}
      </select>
      
    </div>
  );
})

export default SymbolSelect;
