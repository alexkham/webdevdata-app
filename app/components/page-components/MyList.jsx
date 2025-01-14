// // // import React from 'react';

// // // const MyList = ({ 
// // //   data, 
// // //   type = 'default',
// // //   boxed,
// // //   compact,
// // //   divided,
// // //   color = 'gray'
// // // }) => {
// // //   const colors = {
// // //     gray: { marker: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
// // //     blue: { marker: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
// // //     green: { marker: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
// // //     red: { marker: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
// // //   };

// // //   const styles = {
// // //     list: {
// // //       listStyle: 'none',
// // //       padding: 0,
// // //       margin: '0.5rem 0'
// // //     },
// // //     item: {
// // //       position: 'relative',
// // //       padding: compact ? '0.25rem 1rem' : '0.5rem 1rem',
// // //       ...(boxed && {
// // //         backgroundColor: colors[color].bg,
// // //         border: `1px solid ${colors[color].border}`,
// // //         borderRadius: '0.375rem',
// // //         margin: '0.25rem 0'
// // //       }),
// // //       ...(divided && !boxed && {
// // //         borderBottom: `1px solid ${colors[color].border}`
// // //       }),
// // //       display: 'flex',
// // //       alignItems: 'center',
// // //       gap: '0.5rem'
// // //     },
// // //     marker: {
// // //       color: colors[color].marker,
// // //       minWidth: type === 'number' ? '1.5rem' : 'auto'
// // //     }
// // //   };

// // //   const getMarker = (index) => {
// // //     switch(type) {
// // //       case 'number': return index + 1 + '.';
// // //       case 'dash': return '—';
// // //       case 'dot': return '•';
// // //       case 'arrow': return '→';
// // //       default: return '';
// // //     }
// // //   };

// // //   const ListTag = type === 'number' ? 'ol' : 'ul';

// // //   return (
// // //     <ListTag style={styles.list}>
// // //       {data.map((item, index) => (
// // //         <li key={index} style={styles.item}>
// // //           {type !== 'default' && 
// // //             <span style={styles.marker}>
// // //               {getMarker(index)}
// // //             </span>
// // //           }
// // //           {item}
// // //         </li>
// // //       ))}
// // //     </ListTag>
// // //   );
// // // };

// // // export default MyList;


// // import React from 'react';


// // /**
// //  * List Component Props:
// //  * 
// //  * @param {Array} data - Required. Array of items to display. Can be:
// //  *   - Array of strings: ['Item 1', 'Item 2']
// //  *   - Array of objects: [{ text: 'Item 1', status: 'done' }]
// //  * 
// //  * @param {string} type - Optional. Defines the marker style. Default: 'default'
// //  *   - 'default': No marker
// //  *   - 'number': Numbered list (1., 2., etc.)
// //  *   - 'dash': Dash marker (—)
// //  *   - 'dot': Bullet point (•)
// //  *   - 'arrow': Arrow marker (→)
// //  * 
// //  * @param {boolean} boxed - Optional. Default: false
// //  *   - true: Adds background color and border to each item
// //  *   - false: Transparent background
// //  * 
// //  * @param {boolean} compact - Optional. Default: false
// //  *   - true: Reduces padding and margins
// //  *   - false: Normal spacing
// //  * 
// //  * @param {boolean} divided - Optional. Default: false
// //  *   - true: Adds divider lines between items
// //  *   - false: No dividers
// //  * 
// //  * @param {string} color - Optional. Color theme. Default: 'gray'
// //  *   - 'gray': Gray theme
// //  *   - 'blue': Blue theme
// //  *   - 'green': Green theme
// //  *   - 'red': Red theme
// //  * 
// //  * @param {string} displayField - Optional. Default: 'text'
// //  *   For object arrays, specifies which field to display
// //  * 
// //  * Examples:
// //  * 
// //  * Basic list:
// //  * <List data={['Item 1', 'Item 2']} />
// //  * 
// //  * Numbered boxed list:
// //  * <List 
// //  *   data={['First', 'Second']}
// //  *   type="number"
// //  *   boxed
// //  *   color="blue"
// //  * />
// //  * 
// //  * List with objects:
// //  * <List 
// //  *   data={[
// //  *     { text: 'Task 1', status: 'done' },
// //  *     { text: 'Task 2', status: 'pending' }
// //  *   ]}
// //  *   displayField="text"
// //  *   type="dot"
// //  * />
// //  */

// // const MyList = ({ 
// //   data, 
// //   type = 'default',
// //   boxed,
// //   compact,
// //   divided,
// //   color = 'gray',
// //   displayField = 'text'  // for object items, which field to display
// // }) => {
// //   const colors = {
// //     gray: { marker: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
// //     blue: { marker: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
// //     green: { marker: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
// //     red: { marker: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
// //   };

// //   const styles = {
// //     list: {
// //       listStyle: 'none',
// //       padding: 0,
// //       margin: '0.5rem 0'
// //     },
// //     item: {
// //       position: 'relative',
// //       padding: compact ? '0.25rem 1rem' : '0.5rem 1rem',
// //       ...(boxed && {
// //         backgroundColor: colors[color].bg,
// //         border: `1px solid ${colors[color].border}`,
// //         borderRadius: '0.375rem',
// //         margin: '0.25rem 0'
// //       }),
// //       ...(divided && !boxed && {
// //         borderBottom: `1px solid ${colors[color].border}`
// //       }),
// //       display: 'flex',
// //       alignItems: 'center',
// //       gap: '0.5rem'
// //     },
// //     marker: {
// //       color: colors[color].marker,
// //       minWidth: type === 'number' ? '1.5rem' : 'auto'
// //     }
// //   };

// //   const getMarker = (index) => {
// //     switch(type) {
// //       case 'number': return index + 1 + '.';
// //       case 'dash': return '—';
// //       case 'dot': return '•';
// //       case 'arrow': return '→';
// //       default: return '';
// //     }
// //   };

// //   const renderItem = (item) => {
// //     if (typeof item === 'string') return item;
// //     if (typeof item === 'object' && item !== null) {
// //       return item[displayField] || JSON.stringify(item);
// //     }
// //     return String(item);
// //   };

// //   const ListTag = type === 'number' ? 'ol' : 'ul';

// //   return (
// //     <ListTag style={styles.list}>
// //       {data.map((item, index) => (
// //         <li key={index} style={styles.item}>
// //           {type !== 'default' && 
// //             <span style={styles.marker}>
// //               {getMarker(index)}
// //             </span>
// //           }
// //           {renderItem(item)}
// //         </li>
// //       ))}
// //     </ListTag>
// //   );
// // };

// // export default MyList;


// import React from 'react';
// import { processContent } from '@/utils/contentProcessor';

// /**
//  * List Component Props:
//  * 
//  * @param {Array} data - Required. Array of items to display. Can be:
//  *   - Array of strings: ['Item 1', 'Item 2']
//  *   - Array of objects: [{ text: 'Item 1', status: 'done' }]
//  *   - Nested arrays: [{ title: 'Category', items: ['Sub 1', 'Sub 2'] }]
//  * 
//  * @param {string} type - Optional. Defines the marker style. Default: 'default'
//  *   - 'default': No marker
//  *   - 'number': Numbered list (1., 2., etc.)
//  *   - 'dash': Dash marker (—)
//  *   - 'dot': Bullet point (•)
//  *   - 'arrow': Arrow marker (→)
//  * 
//  * @param {boolean} boxed - Optional. Default: false
//  *   - true: Adds background color and border to each item
//  *   - false: Transparent background
//  * 
//  * @param {boolean} compact - Optional. Default: false
//  *   - true: Reduces padding and margins
//  *   - false: Normal spacing
//  * 
//  * @param {boolean} divided - Optional. Default: false
//  *   - true: Adds divider lines between items
//  *   - false: No dividers
//  * 
//  * @param {string} color - Optional. Color theme. Default: 'gray'
//  *   - 'gray': Gray theme
//  *   - 'blue': Blue theme
//  *   - 'green': Green theme
//  *   - 'red': Red theme
//  * 
//  * @param {string} displayField - Optional. Default: 'text'
//  *   For object arrays, specifies which field to display
//  */

// const MyList = ({ 
//   data, 
//   type = 'default',
//   boxed,
//   compact,
//   divided,
//   color = 'gray',
//   displayField = 'text'
// }) => {
//   const colors = {
//     gray: { marker: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
//     blue: { marker: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
//     green: { marker: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
//     red: { marker: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
//   };

//   const styles = {
//     list: {
//       listStyle: 'none',
//       padding: 0,
//       margin: '0.5rem 0'
//     },
//     item: {
//       position: 'relative',
//       padding: compact ? '0.25rem 1rem' : '0.5rem 1rem',
//       ...(boxed && {
//         backgroundColor: colors[color].bg,
//         border: `1px solid ${colors[color].border}`,
//         borderRadius: '0.375rem',
//         margin: '0.25rem 0'
//       }),
//       ...(divided && !boxed && {
//         borderBottom: `1px solid ${colors[color].border}`
//       }),
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.5rem'
//     },
//     marker: {
//       color: colors[color].marker,
//       minWidth: type === 'number' ? '1.5rem' : 'auto'
//     },
//     nestedList: {
//       paddingLeft: '1.5rem',
//       width: '100%'
//     }
//   };

//   const getMarker = (index) => {
//     switch(type) {
//       case 'number': return index + 1 + '.';
//       case 'dash': return '—';
//       case 'dot': return '•';
//       case 'arrow': return '→';
//       default: return '';
//     }
//   };

//   const renderItem = (item) => {
//     if (typeof item === 'string') return item;
//     if (typeof item === 'object' && item !== null) {
//       if (item.items && Array.isArray(item.items)) {
//         return (
//           <>
//             <div>{item.title}</div>
//             <div style={styles.nestedList}>
//               <MyList
//                 data={item.items}
//                 type={type}
//                 boxed={boxed}
//                 compact={compact}
//                 divided={divided}
//                 color={color}
//               />
//             </div>
//           </>
//         );
//       }
//       return item[displayField] || JSON.stringify(item);
//     }
//     return String(item);
//   };

//   const ListTag = type === 'number' ? 'ol' : 'ul';

//   return (
//     <ListTag style={styles.list}>
//       {data.map((item, index) => (
//         <li key={index} style={styles.item}>
//           {type !== 'default' && 
//             <span style={styles.marker}>
//               {getMarker(index)}
//             </span>
//           }
//           {renderItem(item)}
//         </li>
//       ))}
//     </ListTag>
//   );
// };

// export default MyList;

import React from 'react';
import { processContent } from '@/utils/contentProcessor';

/**
 * Enhanced List Component Props:
 * 
 * @param {Array} data - Required. Array of items to display. Can be:
 *   - Array of strings: ['Item 1', 'Item 2']
 *   - Array of objects: [{ text: 'Item 1', status: 'done' }]
 *   - Nested arrays: [{ title: 'Category', items: ['Sub 1', 'Sub 2'] }]
 * 
 * @param {string} type - Optional. Defines the marker style. Default: 'default'
 *   - 'default': No marker
 *   - 'number': Numbered list (1., 2., etc.)
 *   - 'dash': Dash marker (—)
 *   - 'dot': Bullet point (•)
 *   - 'arrow': Arrow marker (→)
 * 
 * @param {boolean} boxed - Optional. Default: false
 * @param {boolean} compact - Optional. Default: false
 * @param {boolean} divided - Optional. Default: false
 * @param {string} color - Optional. Color theme. Default: 'gray'
 * @param {string} displayField - Optional. Default: 'text'
 */
const MyList = ({
  data,
  type = 'default',
  boxed = false,
  compact = false,
  divided = false,
  color = 'gray',
  displayField = 'text'
}) => {
  const colors = {
    gray: { marker: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
    blue: { marker: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
    green: { marker: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
    red: { marker: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
    yellow: { marker: '#F59E0B', bg: '#fdfdea', border: '#FEF08A' }
  };

  const styles = {
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '0.5rem 0'
    },
    item: {
      position: 'relative',
      padding: compact ? '0.25rem 1rem' : '0.5rem 1rem',
      ...(boxed && {
        backgroundColor: colors[color].bg,
        border: `1px solid ${colors[color].border}`,
        borderRadius: '0.375rem',
        margin: '0.95rem 0'
      }),
      ...(divided && !boxed && {
        borderBottom: `1px solid ${colors[color].border}`
      }),
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      fontSize:'16px'
    },
    marker: {
      color: colors[color].marker,
      minWidth: type === 'number' ? '1.5rem' : 'auto',
      paddingTop: '0.125rem' // Align marker with first line of text
    },
    content: {
      flex: 1
    },
    nestedList: {
      paddingLeft: '1.5rem',
      width: '100%'
    }
  };

  const getMarker = (index) => {
    switch(type) {
      case 'number': return `${index + 1}.`;
      case 'dash': return '—';
      case 'dot': return '•';
      case 'arrow': return '→';
      default: return '';
    }
  };

  const processItem = (item) => {
    if (typeof item === 'string') {
      return processContent(item);
    }
    
    if (typeof item === 'object' && item !== null) {
      if (item.items && Array.isArray(item.items)) {
        return (
          <>
            {processContent(item.title)}
            <div style={styles.nestedList}>
              <MyList
                data={item.items}
                type={type}
                boxed={boxed}
                compact={compact}
                divided={divided}
                color={color}
                displayField={displayField}
              />
            </div>
          </>
        );
      }
      
      const content = item[displayField] || JSON.stringify(item);
      return processContent(content);
    }
    
    return processContent(String(item));
  };

  const ListTag = type === 'number' ? 'ol' : 'ul';

  return (
    <ListTag style={styles.list}>
      {data.map((item, index) => (
        <li key={index} style={styles.item}>
          {type !== 'default' && (
            <span style={styles.marker}>
              {getMarker(index)}
            </span>
          )}
          <div style={styles.content}>
            {processItem(item)}
          </div>
        </li>
      ))}
    </ListTag>
  );
};

export default MyList;