import React from "react";
import './GenericTable2.css'
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { capitalizeWords } from "@/utils/functions";



const GenericTable = ({ tableData,styleLeftColumnLikeHeader,headerColor,tableTitle }) => {
    // Check if tableData is available and correctly structured
    if (!tableData || !Array.isArray(tableData.rows) || tableData.rows.length === 0) {
      return <p>No Data Found</p>;
    }
    
    // Extract the column names from the first row for the table header
    const columnHeaders = Object.keys(tableData.rows[0]);
  
    return (
      <div className="table-container"> 
        {/* <h2 className="table-title" >{tableTitle}</h2> */}
        
        <table className={`my-table ${styleLeftColumnLikeHeader ? 'style-left-column' : ''}`}>
          <thead>
            <tr>
              {columnHeaders.map((header, index) => (
                
                <th key={index} style={{backgroundColor:`${headerColor}`}}>{capitalizeWords(header.replace(/_/g, ' '))}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columnHeaders.map((col, colIndex) => {
                  if (col === 'formula') {
                    return <td key={colIndex}><InlineMath math={row[col]} /></td>;
                  } else {
                    if(row[col]!='')
                    return <td key={colIndex}>{row[col]}</td>;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default GenericTable;
  