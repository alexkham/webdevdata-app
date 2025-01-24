export const pythonData = {
    case: {
        label: 'Case',
        operations: [
          {
            name: 'upper',
            format: 'dot',
            description: 'Convert to uppercase',
            operation: str => str.toUpperCase()
          },
          {
            name: 'lower', 
            format: 'dot',
            description: 'Convert to lowercase',
            operation: str => str.toLowerCase()
          },
          {
            name: 'capitalize',
            format: 'dot', 
            description: 'First letter capital',
            operation: str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
          },
          {
            name: 'title',
            format: 'dot',
            description: 'Title Case',
            operation: str => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
          },
          {
            name: 'swapcase',
            format: 'dot',
            description: 'Swap case of letters',
            operation: str => str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
          },
          {
            name: 'casefold',
            format: 'dot',
            description: 'Strong lowercase conversion',
            operation: str => str.toLowerCase()
          }
        ]
       },
       search: {
        label: 'Search',
        operations: [
            {
                name: 'find',
                format: 'dot',
                description: 'Find substring (returns -1 if not found)',
                operation: (str, sub) => str.indexOf(sub),
                args: [{
                  name: 'substring',
                  type: 'text',
                  default: 'a',
                  placeholder: 'substring' 
                }]
               },
          {
            name: 'rfind', 
            format: 'dot',
            description: 'Find last substring occurrence',
            operation: (str, sub) => str.lastIndexOf(sub),
            args: [{
              name: 'substring',
              type: 'text',
              default: 'a',
              placeholder: 'Find what'
            }]
          },
          {
            name: 'index',
            format: 'dot',
            description: 'Find substring (raises ValueError)',
            operation: (str, sub) => {
              const idx = str.indexOf(sub);
              if(idx === -1) throw new Error('ValueError: substring not found');
              return idx;
            },
            args: [{
              name: 'substring',
              type: 'text',
              default: 'a',
              placeholder: 'Find what'
            }]
          },
          {
            name: 'rindex',
            format: 'dot', 
            description: 'Find last substring (raises ValueError)',
            operation: (str, sub) => {
              const idx = str.lastIndexOf(sub);
              if(idx === -1) throw new Error('ValueError: substring not found');
              return idx;
            },
            args: [{
              name: 'substring',
              type: 'text',
              default: 'a',
              placeholder: 'Find what' 
            }]
          },
          {
            name: 'startswith',
            format: 'dot',
            description: 'Starts with prefix?',
            operation: (str, prefix) => JSON.stringify(str.startsWith(prefix)), // Add JSON.stringify
            args: [{
              name: 'prefix',
              type: 'text',
              default: 'Hello',
              placeholder: 'prefix'
            }]
           },
           {
            name: 'endswith', 
            format: 'dot',
            description: 'Ends with suffix?',
            operation: (str, suffix) => JSON.stringify(str.endsWith(suffix)), // Add JSON.stringify
            args: [{
              name: 'suffix',
              type: 'text',
              default: '!', 
              placeholder: 'suffix'
            }]
           },
          {
            name: 'count',
            format: 'dot',
            description: 'Count occurrences',
            operation: (str, sub) => (str.match(new RegExp(sub, 'g')) || []).length,
            args: [{
              name: 'substring',
              type: 'text',
              default: 'a',
              placeholder: 'Count what'
            }]
          }
        ]
       },

       split: {
        label: 'Split & Join',
        operations: [
          {
            name: 'split',
            format: 'dot',
            description: 'Split string into list', 
            operation: (str, sep=' ') => JSON.stringify(str.split(sep)),
            args: [{
              name: 'separator',
              type: 'text',
              placeholder: 'separator'
            }]
          },
          {
            name: 'rsplit',
            format: 'dot', 
            description: 'Split string from right',
            operation: (str, sep=' ') => JSON.stringify(str.split(sep).reverse()),
            args: [{
              name: 'separator',
              type: 'text',
              placeholder: 'separator'
            }]
          },
          {
            name: 'splitlines',
            format: 'dot',
            description: 'Split string at line breaks',
            operation: str => JSON.stringify(str.split(/\r?\n/))
          },
          {
            name: 'partition',
            format: 'dot', 
            description: 'Partition by separator',
            operation: (str, sep) => {
              sep = sep || ' ';
              const parts = str.split(sep, 2);
              return JSON.stringify([
                parts[0],
                parts.length > 1 ? sep : '',  
                parts.length > 1 ? parts[1] : ''
              ]);
            },
            args: [{
              name: 'separator',
              type: 'text',
              default: ',',
              placeholder: 'separator'
            }]
          },
        //   {
        //     name: 'rpartition',
        //     format: 'dot',
        //     description: 'Partition from right',
        //     operation: (str, sep) => {
        //       const idx = str.lastIndexOf(sep);
        //       return JSON.stringify([
        //         idx === -1 ? '' : str.slice(0, idx),
        //         idx === -1 ? '' : sep,
        //         idx === -1 ? str : str.slice(idx + sep.length)
        //       ]);
        //     },
        //     args: [{
        //       name: 'separator',
        //       type: 'text',
        //       placeholder: 'separator'
        //     }]
        //   },

        
        //   {
        //     name: 'join',
        //     format: 'dot',
        //     description: 'Join list with separator',
        //     operation: (str, sep='') => str.split('').join(sep),
        //     args: [{
        //       name: 'separator',
        //       type: 'text',
        //       placeholder: 'separator'
        //     }]
        //   }
        ]
       }

    };











    // basic: {
    //   label: 'Basic',
    //   operations: [
    //     {
    //       name: 'len',
    //       format: 'function',
    //       description: 'Length of string',
    //       operation: str => str.length
    //     },
    //     {
    //       name: 'str',
    //       format: 'function', 
    //       description: 'Create string from object',
    //       operation: str => String(str)
    //     },
       
    //   ]
    // },
    // case: {
    //   label: 'Case',
    //   operations: [
    //     {
    //       name: 'upper',
    //       format: 'dot',
    //       description: 'Convert to uppercase',
    //       operation: str => str.toUpperCase()
    //     },
    //     {
    //       name: 'lower',
    //       format: 'dot',
    //       description: 'Convert to lowercase',
    //       operation: str => str.toLowerCase()
    //     },
    //     {
    //       name: 'capitalize',
    //       format: 'dot',
    //       description: 'First letter capital',
    //       operation: str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    //     },
    //     {
    //       name: 'title',
    //       format: 'dot',
    //       description: 'Title Case',
    //       operation: str => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    //     },
    //     {
    //       name: 'swapcase',
    //       format: 'dot',
    //       description: 'Swap case of letters',
    //       operation: str => str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
    //     }
    //   ]
    // },
    // modify: {
    //   label: 'Modify',
    //   operations: [
    //     {
    //       name: 'strip',
    //       format: 'dot',
    //       description: 'Remove leading/trailing chars',
    //       operation: str => str.trim(),
    //       args: [{
    //         name: 'chars',
    //         type: 'text',
    //         default: ' ',
    //         placeholder: 'Characters to strip'
    //       }]
    //     },
    //     {
    //       name: 'rstrip',
    //       format: 'dot',
    //       description: 'Remove trailing chars',
    //       operation: str => str.trimEnd(),
    //       args: [{
    //         name: 'chars',
    //         type: 'text',
    //         default: ' ',
    //         placeholder: 'Characters to strip'
    //       }]
    //     },
    //     {
    //       name: 'lstrip',
    //       format: 'dot',
    //       description: 'Remove leading chars',
    //       operation: str => str.trimStart(),
    //       args: [{
    //         name: 'chars',
    //         type: 'text',
    //         default: ' ',
    //         placeholder: 'Characters to strip'
    //       }]
    //     },
    //     {
    //       name: 'ljust',
    //       format: 'dot',
    //       description: 'Left-justify string',
    //       operation: (str, width, fillchar=' ') => str.padEnd(width, fillchar),
    //       args: [
    //         {
    //           name: 'width',
    //           type: 'number',
    //           default: '20',
    //           placeholder: 'Width'
    //         },
    //         {
    //           name: 'fillchar',
    //           type: 'text',
    //           default: ' ',
    //           placeholder: 'Fill character'
    //         }
    //       ]
    //     },
    //     {
    //       name: 'rjust',
    //       format: 'dot',
    //       description: 'Right-justify string',
    //       operation: (str, width, fillchar=' ') => str.padStart(width, fillchar),
    //       args: [
    //         {
    //           name: 'width',
    //           type: 'number',
    //           default: '20',
    //           placeholder: 'Width'
    //         },
    //         {
    //           name: 'fillchar',
    //           type: 'text',
    //           default: ' ',
    //           placeholder: 'Fill character'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // search: {
    //   label: 'Search',
    //   operations: [
    //     {
    //       name: 'find',
    //       format: 'dot',
    //       description: 'Find substring (returns -1 if not found)',
    //       operation: (str, sub) => str.indexOf(sub),
    //       args: [{
    //         name: 'substring',
    //         type: 'text',
    //         default: 'a',
    //         placeholder: 'Find what'
    //       }]
    //     },
    //     {
    //         name: 'index',
    //         format: 'dot',
    //         description: 'Find substring (raises ValueError)',
    //         operation: (str, sub) => {  // Here's the problem
    //           const idx = str.indexOf(sub);
    //           if(idx === -1) throw new Error('ValueError: substring not found');
    //           return idx;
    //         },
    //         args: [{
    //           name: 'substring',
    //           type: 'text',
    //           default: 'a',
    //           placeholder: 'Find what'
    //         }]
    //       },
    //     {
    //       name: 'count',
    //       format: 'dot',
    //       description: 'Count non-overlapping occurrences',
    //       operation: (str, sub) => (str.match(new RegExp(sub, 'g')) || []).length,
    //       args: [{
    //         name: 'substring',
    //         type: 'text',
    //         default: 'a',
    //         placeholder: 'Count what'
    //       }]
    //     }
    //   ]
    // },
    // split: {
    //   label: 'Split & Join',
    //   operations: [
    //     {
    //       name: 'split',
    //       format: 'dot',
    //       description: 'Split by separator',
    //       operation: (str, sep=' ') => JSON.stringify(str.split(sep)),
    //       args: [{
    //         name: 'separator',
    //         type: 'text',
    //         default: ' ',
    //         placeholder: 'Split by'
    //       }]
    //     },
    //     {
    //       name: 'rsplit',
    //       format: 'dot',
    //       description: 'Split from right by separator',
    //       operation: (str, sep=' ') => JSON.stringify(str.split(sep).reverse()),
    //       args: [{
    //         name: 'separator',
    //         type: 'text',
    //         default: ' ',
    //         placeholder: 'Split by'
    //       }]
    //     },
    //     {
    //       name: 'partition',
    //       format: 'dot',
    //       description: 'Partition by separator',
    //       operation: (str, sep) => {
    //         const parts = str.split(sep, 2);
    //         return JSON.stringify([
    //           parts[0], 
    //           parts.length > 1 ? sep : '', 
    //           parts.length > 1 ? parts[1] : ''
    //         ]);
    //       },
    //       args: [{
    //         name: 'separator',
    //         type: 'text',
    //         default: ' ',
    //         placeholder: 'Split by'
    //       }]
    //     }
    //   ]
    // },
    // check: {
    //   label: 'Check',
    //   operations: [
    //     {
    //       name: 'startswith',
    //       format: 'dot',
    //       description: 'Starts with prefix?',
    //       operation: (str, prefix) => str.startsWith(prefix),
    //       args: [{
    //         name: 'prefix',
    //         type: 'text',
    //         default: 'Hello',
    //         placeholder: 'Prefix'
    //       }]
    //     },
    //     {
    //       name: 'endswith',
    //       format: 'dot',
    //       description: 'Ends with suffix?',
    //       operation: (str, suffix) => str.endsWith(suffix),
    //       args: [{
    //         name: 'suffix',
    //         type: 'text',
    //         default: '!',
    //         placeholder: 'Suffix'
    //       }]
    //     },
    //     {
    //       name: 'isalpha',
    //       format: 'dot',
    //       description: 'Only letters?',
    //       operation: str => /^[a-zA-Z]+$/.test(str)
    //     },
    //     {
    //       name: 'isdigit',
    //       format: 'dot',
    //       description: 'Only digits?',
    //       operation: str => /^\d+$/.test(str)
    //     },
    //     {
    //       name: 'isspace',
    //       format: 'dot',
    //       description: 'Only whitespace?',
    //       operation: str => /^\s+$/.test(str)
    //     },
    //     {
    //       name: 'islower',
    //       format: 'dot',
    //       description: 'Only lowercase?',
    //       operation: str => str === str.toLowerCase() && str !== str.toUpperCase()
    //     },
    //     {
    //       name: 'isupper',
    //       format: 'dot',
    //       description: 'Only uppercase?',
    //       operation: str => str === str.toUpperCase() && str !== str.toLowerCase()
    //     }
    //   ]
    // }
  