import React from 'react'
import './NestedTable.css'

function NestedTable() {
  return (
   <div>
  <table classname="my-table">
  <tbody><tr>
      <td>Cell</td>
      <td>Nested Table
        <table>
          <tbody><tr>
              <td>Cell 1</td>
            </tr>
            <tr>
              <td>Cell 2</td>
            </tr>
            <tr>
              <td>Cell 3</td>
            </tr>
            <tr>
              <td>Cell 4</td>
            </tr>
          </tbody></table>
      </td>
    </tr>
  </tbody>
  </table>

   </div>
  )
}

export default NestedTable