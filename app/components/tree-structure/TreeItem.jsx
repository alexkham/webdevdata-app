
// import React from 'react';
// import data from './pandas_operations.json';
// import './TreeItem.css';
// import Link from 'next/link';

// const TreeItem = ({ title, children ,baseUrl }) => {
   

//   return (
//     <li>
//       <details>
//         <summary>
//           {children && <span className="symbol"></span>}
//           {title}
//         </summary>
//         {Array.isArray(children) ? (
//           <ul>
//             {children.map((child, index) => (
//               <li key={index}>
//                 <Link href={`/${baseUrl}/${child.replaceAll(' ','_').toLowerCase()}`}>{child}</Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <ul>
//             {children && Object.entries(children).map(([key, value]) => (
//               <TreeItem key={key} title={key} baseUrl={baseUrl}>
//                 {value}
//               </TreeItem>
//             ))}
//           </ul>
//         )}
//       </details>
//     </li>
//   );
// };

// export const Tree = ({ data ,baseUrl = '' }) => {
//   return (
//     <ul className="tree">
//       {data && Object.entries(data).map(([key, value]) => (
//         <TreeItem key={key} title={key} baseUrl={baseUrl}>
//           {value}
//         </TreeItem>
//       ))}
//     </ul>
//   );
// };

// const TreeStructure = () => {
//   return (
//     <div>
//       <Tree data={data['Pandas Operations']} />
//     </div>
//   );
// };

// export default TreeStructure;
import React from 'react';
import data from './pandas_operations.json';
import './TreeItem.css';
import Link from 'next/link';

const TreeItem = ({ title, children, baseUrl, isRootOpen }) => {
  return (
    <li>
      <details open={isRootOpen}>
        <summary>
          {children && <span className="symbol"></span>}
          {title}
        </summary>
        {Array.isArray(children) ? (
          <ul>
            {children.map((child, index) => (
              <li key={index}>
                {baseUrl.length>0 ?<Link href={`/${baseUrl}/${child.replaceAll(' ','_').toLowerCase()}`}>{child}</Link>:<p>{child}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {children && Object.entries(children).map(([key, value]) => (
              <TreeItem key={key} title={key} baseUrl={baseUrl}>
                {value}
              </TreeItem>
            ))}
          </ul>
        )}
      </details>
    </li>
  );
};

export const Tree = ({ data, baseUrl = '', isRootOpen = false }) => {
  return (
    <ul className="tree">
      {data && Object.entries(data).map(([key, value]) => (
        <TreeItem key={key} title={key} baseUrl={baseUrl} isRootOpen={isRootOpen}>
          {value}
        </TreeItem>
      ))}
    </ul>
  );
};

const TreeStructure = () => {
  return (
    <div>
      <Tree data={data['Pandas Operations']} />
    </div>
  );
};

export default TreeStructure;