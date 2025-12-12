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
                  placeholder: 'substring' ,
                   argument_explanation: 'Pattern to look for in the string. Can be single character or longer string'
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
              placeholder: 'Find what',
               argument_explanation: 'Pattern to look for in the string. Can be single character or longer string'
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
              placeholder: 'Find what',
               argument_explanation: 'Pattern to look for in the string. Can be single character or longer string'
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
              placeholder: 'Find what' ,
               argument_explanation: 'Pattern to look for in the string. Can be single character or longer string'
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
              placeholder: 'prefix',
               argument_explanation: 'String must start with this exact sequence of characters'
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
              placeholder: 'suffix',
              argument_explanation: 'String must end with this exact sequence of characters'
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
              placeholder: 'Count what',
              argument_explanation: 'Pattern to count occurrences of in the string'
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
                description: 'Split string into list using whitespace as delimiter',
                operation: (str) => JSON.stringify(str.trim().split(/\s+/)),
                args: [{
                  name: 'separator',
                  type: 'text',
                  placeholder: 'separator',
                  argument_explanation: 'If provided, splits on this separator instead of whitespace'
                }]
              },
              {
                name: 'rsplit',
                format: 'dot',
                description: 'Split string into list using whitespace as delimiter',
                operation: (str, sep, maxsplit) => JSON.stringify(str.trim().split(/\s+/)),
                args: [{
                  name: 'separator',
                  type: 'text',
                  placeholder: 'separator',
                  argument_explanation: 'If provided, splits on this separator instead of whitespace'
                }, {
                  name: 'maxsplit',
                  type: 'number',
                  placeholder: 'maxs',
                  argument_explanation: 'Maximum number of splits to perform from the right. -1 means no limit'
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
              placeholder: 'separator',
              argument_explanation:'Character or sub-string at the first occurense of which the string will be split.'
            }]
          },
          {
            name: 'rpartition',
            format: 'dot',
            description: 'Partition from right',
            operation: (str, sep='.') => {
              if (!sep) throw new Error('ValueError: empty separator');
              const idx = str.lastIndexOf(sep);
              return JSON.stringify([
                idx === -1 ? '' : str.slice(0, idx),
                idx === -1 ? '' : sep,
                idx === -1 ? str : str.slice(idx + sep.length)
              ]);
            },
            args: [{
              name: 'separator',
              type: 'text',
              default: '.',
              placeholder: 'separator',
              argument_explanation: 'Last separator occurrence to split on. Returns: [before_separator, separator, after_separator]. If not found: ["", "", original_string]'
            }]
          },
      
        ]
       },
       format: {
        label: 'Format',
        operations: [
            {
                name: 'strip',
                format: 'dot',
                description: 'Remove leading/trailing chars',
                operation: (str, chars=' ') => {
                  const regex = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g');
                  return str.replace(regex, '');
                },
                args: [{
                  name: 'chars',
                  type: 'text',
                  default: ' ',
                  placeholder: 'chars',
                  argument_explanation: 'Characters to remove from both ends. If not specified, removes whitespace'
                }]
              },
              {
                name: 'lstrip',
                format: 'dot',
                description: 'Remove leading chars',
                operation: (str, chars=' ') => {
                  const regex = new RegExp(`^[${chars}]+`);
                  return str.replace(regex, '');
                },
                args: [{
                  name: 'chars',
                  type: 'text',
                  default: ' ',
                  placeholder: 'chars',
                  argument_explanation: 'Characters to remove from start. If not specified, removes whitespace'
                }]
               },
               {
                name: 'rstrip',
                format: 'dot',
                description: 'Remove trailing chars',
                operation: (str, chars=' ') => {
                  const regex = new RegExp(`[${chars}]+$`);
                  return str.replace(regex, '');
                },
                args: [{
                  name: 'chars', 
                  type: 'text',
                  default: ' ',
                  placeholder: 'chars',
                  argument_explanation: 'Characters to remove from end. If not specified, removes whitespace'
                }]
               },
        //        {
        //         name: 'ljust',
        //         format: 'dot', 
        //         description: 'Left justify string',
        //         operation: (str, width, fillchar=' ') => {
        //           const padding = Math.max(0, width - str.length);
        //           return str + fillchar.repeat(padding);
        //         },
        //         args: [{
        //           name: 'width',
        //           type: 'number',
        //           default: '20',
        //           placeholder: 'width',
        //           argument_explanation: 'Total length of output string after padding'
        //         },
        //         {
        //           name: 'fillchar',
        //           type: 'text', 
        //           default: ' ',
        //           placeholder: 'fillchar', 
        //           argument_explanation: 'Character to pad empty space. Must be exactly one character'
        //         }]
        //        },
        //   {
        //     name: 'rjust',
        //     format: 'dot',
        //     description: 'Right justify string',
        //     operation: (str, width, fillchar=' ') => {
        //         const padding = Math.max(0, width - str.length);
        //         return fillchar.repeat(padding) + str;
        //       },
        //     args: [{
        //       name: 'width',
        //       type: 'number',
        //       default: '20',
        //       placeholder: 'width',
        //       argument_explanation: 'Total length of output string after padding'
        //     },
        //     {
        //       name: 'fillchar',
        //       type: 'text',
        //       default: ' ',
        //       placeholder: 'fillchar',
        //       argument_explanation: 'Character to pad empty space. Must be exactly one character'
        //     }]
        //   },

        {
            name: 'ljust',
            format: 'dot',
            description: 'Left justify string',
            operation: (str, width, fillchar=' ') => str + fillchar.repeat(width - str.length).replaceAll(' ',''),
            args: [{
              name: 'width',
              type: 'number',
              default: '20',
              placeholder: 'width', 
              argument_explanation: 'Total length of output string after padding'
            },
            {
              name: 'fillchar',
              type: 'text',
              default: ' ',
              placeholder: 'fillchar',
              argument_explanation: 'Character to pad empty space. Must be exactly one character'
            }]
           },
           
           {
            name: 'rjust',
            format: 'dot',
            description: 'Right justify string',
            operation: (str, width, fillchar=' ') => fillchar.repeat(Math.max(0, width - str.length)).replaceAll(' ','') + str,
            args: [{
              name: 'width',
              type: 'number',
              default: '20',
              placeholder: 'width',
              argument_explanation: 'Total length of output string after padding'
            },
            {
              name: 'fillchar',
              type: 'text',
              default: ' ',
              placeholder: 'fillchar',
              argument_explanation: 'Character to pad empty space. Must be exactly one character'
            }]
           },
          {
            name: 'center',
            format: 'dot',
            description: 'Center string',
            operation: (str, width, fillchar=' ') => {
              const padding = width - str.length;
              const padLeft = Math.floor(padding/2);
              const padRight = padding - padLeft;
              return fillchar.repeat(padLeft).replaceAll(' ','') + str + fillchar.repeat(padRight).replaceAll(' ','');
            },
            args: [{
              name: 'width',
              type: 'number',
              default: '20',
              placeholder: 'width',
              argument_explanation: 'Total length of output string after padding'
            },
            {
              name: 'fillchar',
              type: 'text',
              default: ' ',
              placeholder: 'fillchar',
              argument_explanation: 'Character to pad empty space. Must be exactly one character'
            }]
          },
          {
            name: 'zfill',
            format: 'dot',
            description: 'Pad with zeros on left',
            operation: (str, width) => str.padStart(width, '0'),
            args: [{
              name: 'width',
              type: 'number',
              default: '10',
              placeholder: 'width',
              argument_explanation: 'Total length of output string after padding with zeros'
            }]
          },
        //   {
        //     name: 'format',
        //     format: 'dot',
        //     description: 'Format string with values',
        //     operation: (str, values) => str.replace(/\{([^}]+)\}/g, (_, key) => values[key]),
        //     args: [{
        //       name: 'values',
        //       type: 'text',
        //       default: '{"name":"World"}',
        //       placeholder: 'JSON values',
        //       argument_explanation: 'JSON object with values to insert into placeholders like {name}'
        //     }]
        //   }
        ]
       }

    };










      //   {
        //     name: 'ljust',
        //     format: 'dot',
        //     description: 'Left-justify string to width specified',
        //     operation: (str, width, fillchar=' ') => str.padEnd(width, fillchar),
        //     args: [{
        //       name: 'width',
        //       type: 'number',
        //       default: '20',
        //       placeholder: 'width',
        //       argument_explanation: 'Length of output string. Original string plus padding to reach this length.'
        //     },
        //     {
        //       name: 'fillchar', 
        //       type: 'text',
        //       default: ' ',
        //       placeholder: 'fillchar',
        //       argument_explanation: 'Character to pad empty space with. Must be exactly one character long.'
        //     }]
        //    }
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
  