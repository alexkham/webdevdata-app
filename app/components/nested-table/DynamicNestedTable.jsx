import React from 'react'
import './NestedTable.css'

function DynamicNestedTable({main, rows}) {
  return (
  //  <div className='outer-container'>
  <table className="my-table">
  <tbody><tr>
      <td>{main}</td>
      <td>
        <table className='my-table'>
          <tbody>
            {rows.map((row,index)=>{
                return <tr key={index}><td>{row?row:'None'}</td></tr>
                
                    
            })}
            
          </tbody></table>
      </td>
    </tr>
  </tbody>
  </table>

  //  </div>
  )
}

export default DynamicNestedTable