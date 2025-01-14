// import pandas from 'pandas-js';

// export async function processFile(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const content = e.target.result;
//       let df;
//       try {
//         if (file.name.endsWith('.csv')) {
//           df = pandas.readCsv(content);
//         } else if (file.name.endsWith('.json')) {
//           df = pandas.readJson(content);
//         } else {
//           throw new Error('Unsupported file type');
//         }
        
//         const columns = df.columns.toArray();
//         const data = await df.values;
        
//         resolve({ columns, data });
//       } catch (error) {
//         reject(error);
//       }
//     };
//     reader.onerror = reject;
//     reader.readAsText(file);
//   });
// }

// export function removeDuplicates(dataFrame) {
//   const df = new pandas.DataFrame(dataFrame.data, { columns: dataFrame.columns });
//   const newDf = df.dropDuplicates();
//   return {
//     columns: newDf.columns.toArray(),
//     data: newDf.values
//   };
// }

// export function fillNaValues(dataFrame, value) {
//   const df = new pandas.DataFrame(dataFrame.data, { columns: dataFrame.columns });
//   const newDf = df.fillNa(value);
//   return {
//     columns: newDf.columns.toArray(),
//     data: newDf.values
//   };
// }

// export function filterColumn(dataFrame, column, condition) {
//   const df = new pandas.DataFrame(dataFrame.data, { columns: dataFrame.columns });
//   const newDf = df.filter(row => condition(row.get(column)));
//   return {
//     columns: newDf.columns.toArray(),
//     data: newDf.values
//   };
// }

// // You can add more data processing functions here as needed

import { DataFrame, readCsv, readJson } from 'pandas-js';

export async function processFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      try {
        let df;
        if (file.name.endsWith('.csv')) {
          df = pandas.readCsv(content);
        } else if (file.name.endsWith('.json')) {
          df = pandas.readJson(content);
        } else {
          throw new Error('Unsupported file type');
        }
        
        resolve({
          columns: df.columns.toArray(),
          data: await df.values
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function removeDuplicates(dataFrame) {
  const df = new pandas.DataFrame(dataFrame.data, { columns: dataFrame.columns });
  const newDf = df.dropDuplicates();
  return {
    columns: newDf.columns.toArray(),
    data: newDf.values
  };
}

export function fillNaValues(dataFrame, value) {
  const df = new pandas.DataFrame(dataFrame.data, { columns: dataFrame.columns });
  const newDf = df.fillNa(value);
  return {
    columns: newDf.columns.toArray(),
    data: newDf.values
  };
}