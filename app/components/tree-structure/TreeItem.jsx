import React from 'react';
import data from './pandas_operations.json';
import './TreeItem.css';
import Link from 'next/link';

const TreeItem = ({ title, children }) => {
  return (
    <li>
      <details>
        <summary>
          {children && <span className="symbol"></span>}
          {title}
        </summary>
        {Array.isArray(children) ? (
          <ul>
            {children.map((child, index) => (
                <Link href={'https://www.google.com'}>
              <li key={index}>{child}</li>
              </Link>
            ))}
          </ul>
        ) : (
          <ul>
            {children && Object.entries(children).map(([key, value]) => (
              <TreeItem key={key} title={key} children={value} />
            ))}
          </ul>
        )}
      </details>
    </li>
  );
};

const Tree = ({ data }) => {
  return (
    <ul className="tree">
      {data && Object.entries(data).map(([key, value]) => (
        <TreeItem key={key} title={key} children={value} />
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
