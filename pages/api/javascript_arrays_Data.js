export default function handler(req, res) {
    // Define the entire data set directly within the API route
    const data = [
        {
            "function": "at()",
            "link": "https://www.w3schools.com/jsref/jsref_array_at.asp",
            "parameters": [
                {
                    "parameter": "index",
                    "description": "Optional.The index (position) of the array element to be returned.Default is 0.-1 returns the last element."
                }
            ],
            "description": "Returns an indexed element of an array",
            "signature": "array.at(index)",
            "return": {
                "type": "element",
                "value": "Element at the specified index"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "number",
                    "description": "Position in the array to access",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Accessing an element by index",
                    "code": "const numbers = [10, 20, 30];\nconst secondElement = numbers.at(1); // 20"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "single element"
        },
        {
            "function": "concat()",
            "link": "https://www.w3schools.com/jsref/jsref_concat_array.asp",
            "parameters": [
                {
                    "parameter": "array1,...",
                    "description": "Required.The array(s) to be concatenated."
                }
            ],
            "description": "Joins two or more arrays and returns a new array, without changing the existing arrays.",
            "signature": "array.concat(array1, array2, ...)",
            "return": {
                "type": "array",
                "value": "A new array containing the joined elements"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "array",
                    "description": "Arrays to concatenate",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Combining multiple arrays",
                    "code": "const array1 = [1, 2, 3];\nconst array2 = [4, 5, 6];\nconst combinedArray = array1.concat(array2);"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "constructor",
            "link": "https://www.w3schools.com/jsref/jsref_constructor_array.asp",
            "parameters": [],
            "description": "Property of the Array prototype that references the constructor function that created the instance.",
            "signature": "array.constructor",
            "return": {
                "type": "function",
                "value": "Reference to the Array constructor function"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Identifying the constructor of an array",
                    "code": "const array = [1, 2, 3];\nconst isFromConstructor = array.constructor === Array;"
                }
            ],
            "action": "Meta and Prototypical Methods",
            "is_mutating": false,
            "return_type": "function"
        },
        {
            "function": "copyWithin()",
            "link": "https://www.w3schools.com/jsref/jsref_copywithin.asp",
            "parameters": [
                {
                    "parameter": "target",
                    "description": "Required.The index (position) to copy the elements to."
                },
                {
                    "parameter": "start",
                    "description": "Optional.The start index (position). Default is 0."
                },
                {
                    "parameter": "end",
                    "description": "Optional.The end index (position). Default is the array length."
                }
            ],
            "description": "Copies a sequence of array elements within the array.",
            "signature": "array.copyWithin(target, start, end)",
            "return": {
                "type": "array",
                "value": "The modified array"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "number",
                    "description": "Target start index for copying elements",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Copying part of an array within itself",
                    "code": "const array = [1, 2, 3, 4, 5];\narray.copyWithin(0, 3, 4);"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "array"
        },
        {
            "function": "entries()",
            "link": "https://www.w3schools.com/jsref/jsref_entries.asp",
            "parameters": [],
            "description": "Returns a key/value pair Array Iteration Object.",
            "signature": "array.entries()",
            "return": {
                "type": "Array Iterator",
                "value": "New Array iterator object"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating over key/value pairs",
                    "code": "const array = ['a', 'b', 'c'];\nconst iterator = array.entries();"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "Array Iterator"
        },
        {
            "function": "every()",
            "link": "https://www.w3schools.com/jsref/jsref_every.asp",
            "parameters": [
                {
                    "parameter": "function()",
                    "description": "Required.A function to be run for each element in the array."
                },
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. Defaultundefined.A value passed to the function as itsthisvalue."
                }
            ],
            "description": "Checks if every element in an array pass a test.",
            "signature": "array.every(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "boolean",
                "value": "True if every element passes the test, otherwise false"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to test for each element",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Testing all elements in an array",
                    "code": "const array = [1, 30, 39, 29];\nconst isBelowThreshold = currentValue => currentValue < 40;\nconst allBelowThreshold = array.every(isBelowThreshold);"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "boolean"
        },
        {
            "function": "fill()",
            "link": "https://www.w3schools.com/jsref/jsref_fill.asp",
            "parameters": [
                {
                    "parameter": "value",
                    "description": "Required.The value to fill in."
                },
                {
                    "parameter": "start",
                    "description": "Optional.The start index (position).Default is 0."
                },
                {
                    "parameter": "end",
                    "description": "Optional.The stop index (position).Default is array length."
                }
            ],
            "description": "Fill the elements in an array with a static value.",
            "signature": "array.fill(value[, start[, end]])",
            "return": {
                "type": "array",
                "value": "The modified array"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "any",
                    "description": "Value to fill the array with",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Filling an array with a static value",
                    "code": "const array = [1, 2, 3, 4, 5];\narray.fill(0, 2, 4);"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "array"
        },
        {
            "function": "filter()",
            "link": "https://www.w3schools.com/jsref/jsref_filter.asp",
            "parameters": [
                {
                    "parameter": "function()",
                    "description": "Required.A function to run for each array element."
                },
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. DefaultundefinedA value passed to the function as itsthisvalue."
                }
            ],
            "description": "Creates a new array with all elements that pass the test implemented by the provided function.",
            "signature": "array.filter(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "array",
                "value": "A new array with each element that passed the test"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to test each element of the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Filtering an array for specific criteria",
                    "code": "const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];\nconst longWords = words.filter(word => word.length > 6);"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "find()",
            "link": "https://www.w3schools.com/jsref/jsref_find.asp",
            "parameters": [
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. Defaultundefined.A value passed to the function as itsthisvalue."
                }
            ],
            "description": "Returns the value of the first element in the provided array that satisfies the provided testing function.",
            "signature": "array.find(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "element",
                "value": "First element that passes the test; otherwise, undefined"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to execute on each value in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Finding an element in the array",
                    "code": "const array1 = [5, 12, 8, 130, 44];\nconst found = array1.find(element => element > 10);"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "single element"
        },
        {
            "function": "findIndex()",
            "link": "https://www.w3schools.com/jsref/jsref_findindex.asp",
            "parameters": [
                {
                    "parameter": "function()",
                    "description": "Required.A function to be run for each array element."
                },
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. Defaultundefined.A value passed to the function as itsthisvalue."
                }
            ],
            "description": "Returns the index of the first element in the array that satisfies the provided testing function.",
            "signature": "array.findIndex(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "number",
                "value": "Index of the first element that passes the test; otherwise, -1"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to execute on each value in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Finding the index of an element",
                    "code": "const array1 = [5, 12, 8, 130, 44];\nconst isLargeNumber = (element) => element > 13;\nconst index = array1.findIndex(isLargeNumber);"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "index or position"
        },
        {
            "function": "findLast()",
            "link": "https://www.w3schools.com/jsref/jsref_array_findlast.asp",
            "parameters": [
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. Default -undefined.A value passed to the function as it's this value."
                }
            ],
            "description": "Returns the value of the last element in the provided array that satisfies the provided testing function.",
            "signature": "array.findLast(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "element",
                "value": "Last element that passes the test; otherwise, undefined"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to execute on each value in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Finding the last matching element in an array",
                    "code": "const array1 = [5, 12, 8, 130, 44];\nconst found = array1.findLast(element => element > 10);"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "single element"
        },
        {
            "function": "findLastIndex()",
            "link": "https://www.w3schools.com/jsref/jsref_array_findlastindex.asp",
            "parameters": [
                {
                    "parameter": "function()",
                    "description": "Required.A function to be run for each array element."
                },
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. Defaultundefined.A value passed to the function as itsthisvalue."
                }
            ],
            "description": "Returns the index of the last element in the array that satisfies the provided testing function.",
            "signature": "array.findLastIndex(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "number",
                "value": "Index of the last element that passes the test; otherwise, -1"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to execute on each value in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Finding the last index of a matching element",
                    "code": "const array1 = [5, 12, 8, 130, 44];\nconst isLargeNumber = (element) => element > 13;\nconst lastIndex = array1.findLastIndex(isLargeNumber);"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "index or position"
        },
        {
            "function": "flat()",
            "link": "https://www.w3schools.com/jsref/jsref_array_flat.asp",
            "parameters": [
                {
                    "parameter": "depth",
                    "description": "Optional.How deep a nested array should be flattened.Default is 1."
                }
            ],
            "description": "Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.",
            "signature": "array.flat([depth])",
            "return": {
                "type": "array",
                "value": "A new array with the sub-array elements concatenated into it"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "number",
                    "description": "The depth level specifying how deep a nested array structure should be flattened",
                    "default": "1"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Flattening nested arrays",
                    "code": "const array1 = [1, 2, [3, 4]];\nconst flatArray = array1.flat();"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "flatMap()",
            "link": "https://www.w3schools.com/jsref/jsref_array_flatmap.asp",
            "parameters": [
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional.Default valueundefined.A value passed to the function to be used as itsthisvalue."
                }
            ],
            "description": "First maps each element using a mapping function, then flattens the result into a new array.",
            "signature": "array.flatMap(callback(currentValue[, index[, array]])[, thisArg])",
            "return": {
                "type": "array",
                "value": "A new array with each element being the result of the callback function and then flattened"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function that produces an element of the new Array, taking three arguments",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Mapping and flattening an array",
                    "code": "const array1 = [[1], [2], [3], [4]];\nconst flatMapArray = array1.flatMap(x => [x * 2]);"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "forEach()",
            "link": "https://www.w3schools.com/jsref/jsref_foreach.asp",
            "parameters": [
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional. Defaultundefined.A value passed to the function as itsthisvalue."
                }
            ],
            "description": "Executes a provided function once for each array element.",
            "signature": "array.forEach(callback(currentValue [, index [, array]])[, thisArg])",
            "return": {
                "type": "undefined",
                "value": "Undefined"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function to execute on each element",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating over array elements",
                    "code": "const array1 = ['a', 'b', 'c'];\narray1.forEach(element => console.log(element));"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "undefined"
        },
        {
            "function": "from()",
            "link": "https://www.w3schools.com/jsref/jsref_from.asp",
            "parameters": [
                {
                    "parameter": "object",
                    "description": "Required.The object to convert to an array."
                },
                {
                    "parameter": "mapFunction",
                    "description": "Optional.A map function to call on each item."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional.A value to use asthisfor the mapFunction"
                }
            ],
            "description": "Creates a new, shallow-copied Array instance from an array-like or iterable object.",
            "signature": "Array.from(arrayLike[, mapFn[, thisArg]])",
            "return": {
                "type": "array",
                "value": "A new Array instance"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "object",
                    "description": "Array-like or iterable object to convert to an array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Creating an array from a string",
                    "code": "const string = '12345';\nconst arrayFromString = Array.from(string);"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "includes()",
            "link": "https://www.w3schools.com/jsref/jsref_includes_array.asp",
            "parameters": [
                {
                    "parameter": "element",
                    "description": "Required.The value to search for."
                },
                {
                    "parameter": "start",
                    "description": "Optional.Start position. Default is 0."
                }
            ],
            "description": "Determines whether an array includes a certain value among its entries, returning true or false as appropriate.",
            "signature": "array.includes(valueToFind[, fromIndex])",
            "return": {
                "type": "boolean",
                "value": "True if the array includes the value, otherwise false"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "any",
                    "description": "The value to search for",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Checking if an array includes a certain value",
                    "code": "const array1 = [1, 2, 3];\nconst includesTwo = array1.includes(2);"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "boolean"
        },
        {
            "function": "indexOf()",
            "link": "https://www.w3schools.com/jsref/jsref_indexof_array.asp",
            "parameters": [
                {
                    "parameter": "item",
                    "description": "Required.The value to search for."
                }
            ],
            "description": "Returns the first index at which a given element can be found in the array, or -1 if it is not present.",
            "signature": "array.indexOf(searchElement[, fromIndex])",
            "return": {
                "type": "number",
                "value": "The first index of the element in the array; -1 if not found"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "any",
                    "description": "Element to locate in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Finding the index of an element",
                    "code": "const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];\nconst index = beasts.indexOf('bison');"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "index or position"
        },
        {
            "function": "isArray()",
            "link": "https://www.w3schools.com/jsref/jsref_isarray.asp",
            "parameters": [
                {
                    "parameter": "obj",
                    "description": "Required.An object (or any data type) to be tested."
                }
            ],
            "description": "Determines whether the passed value is an Array.",
            "signature": "Array.isArray(obj)",
            "return": {
                "type": "boolean",
                "value": "True if the object is an array, otherwise false"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "object",
                    "description": "The object to be checked",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Checking if a variable is an array",
                    "code": "const array = [1, 2, 3];\nconst isArray = Array.isArray(array);"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "boolean"
        },
        {
            "function": "join()",
            "link": "https://www.w3schools.com/jsref/jsref_join.asp",
            "parameters": [
                {
                    "parameter": "separator",
                    "description": "Optional.The separator to be used.Default is a comma."
                }
            ],
            "description": "Joins all elements of an array into a string.",
            "signature": "array.join([separator])",
            "return": {
                "type": "string",
                "value": "A string with all array elements joined"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "string",
                    "description": "Specifies a separator",
                    "default": "','"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Joining array elements into a string",
                    "code": "const elements = ['Fire', 'Air', 'Water'];\nconst joined = elements.join();"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "string"
        },
        {
            "function": "keys()",
            "link": "https://www.w3schools.com/jsref/jsref_keys.asp",
            "parameters": [],
            "description": "Returns a new Array Iterator object that contains the keys for each index in the array.",
            "signature": "array.keys()",
            "return": {
                "type": "Array Iterator",
                "value": "A new Array iterator"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating over array keys",
                    "code": "const array = ['a', 'b', 'c'];\nconst iterator = array.keys();\nfor (let key of iterator) {\n  console.log(key);\n}"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "Array Iterator"
        },
        {
            "function": "lastIndexOf()",
            "link": "https://www.w3schools.com/jsref/jsref_lastindexof_array.asp",
            "parameters": [
                {
                    "parameter": "item",
                    "description": "Required.The value to search for."
                }
            ],
            "description": "Returns the last index at which a given element can be found in the array, or -1 if it is not present.",
            "signature": "array.lastIndexOf(searchElement[, fromIndex])",
            "return": {
                "type": "number",
                "value": "The last index of the element; -1 if not found"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "any",
                    "description": "Element to locate in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Finding the last occurrence of an element",
                    "code": "const animals = ['Dodo', 'Tiger', 'Penguin', 'Dodo'];\nconst index = animals.lastIndexOf('Dodo');"
                }
            ],
            "action": "Element Access",
            "is_mutating": false,
            "return_type": "index or position"
        },
        {
            "function": "length",
            "link": "https://www.w3schools.com/jsref/jsref_length_array.asp",
            "parameters": [],
            "description": "Property that sets or returns the number of elements in an array.",
            "signature": "array.length",
            "return": {
                "type": "number",
                "value": "The number of elements in the array"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Determining the size of an array",
                    "code": "const fruits = ['Apple', 'Banana', 'Cherry'];\nconst length = fruits.length;"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "number"
        },
        {
            "function": "map()",
            "link": "https://www.w3schools.com/jsref/jsref_map.asp",
            "parameters": [
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array of the current element."
                },
                {
                    "parameter": "thisValue",
                    "description": "Optional.Default valueundefined.A value passed to the function to be used as itsthisvalue."
                }
            ],
            "description": "Creates a new array with the result of calling a provided function on every element in the calling array.",
            "signature": "array.map(callback(currentValue[, index[, array]])[, thisArg])",
            "return": {
                "type": "array",
                "value": "A new array with each element being the result of the callback function"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "Function that produces an element of the new array, taking three arguments",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Creating a new array with doubled values",
                    "code": "const numbers = [1, 4, 9];\nconst doubles = numbers.map(num => num * 2);"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "of()",
            "link": "https://www.w3schools.com/jsref/jsref_array_of.asp",
            "parameters": [],
            "description": "Creates a new Array instance with a variable number of arguments, regardless of number or type of the arguments.",
            "signature": "Array.of(element0[, element1[, ...[, elementN]]])",
            "return": {
                "type": "array",
                "value": "A new Array instance"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Creating an array from given arguments",
                    "code": "const array = Array.of(1, 2, 3);"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "pop()",
            "link": "https://www.w3schools.com/jsref/jsref_pop.asp",
            "parameters": [],
            "description": "Removes the last element from an array and returns that element.",
            "signature": "array.pop()",
            "return": {
                "type": "any",
                "value": "The removed element from the array; undefined if the array is empty"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Removing the last element of an array",
                    "code": "const fruits = ['Apple', 'Banana', 'Mango'];\nconst last = fruits.pop();"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "single element"
        },
        {
            "function": "prototype",
            "link": "https://www.w3schools.com/jsref/jsref_prototype_array.asp",
            "parameters": [],
            "description": "Allows you to add new properties and methods to the Array() object.",
            "signature": "Array.prototype.name = value;",
            "return": {
                "type": "undefined",
                "value": "Undefined"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Extending Array prototype",
                    "code": "Array.prototype.first = function() { return this[0]; };\nconst myArray = [1, 2, 3];\nconst firstElement = myArray.first();"
                }
            ],
            "action": "Meta and Prototypical Methods",
            "is_mutating": false,
            "return_type": "object"
        },
        {
            "function": "push()",
            "link": "https://www.w3schools.com/jsref/jsref_push.asp",
            "parameters": [
                {
                    "parameter": "item1item2..itemX",
                    "description": "The item(s) to add to the array.Minimum one item is required."
                }
            ],
            "description": "Adds one or more elements to the end of an array and returns the new length of the array.",
            "signature": "array.push(element1[, ...[, elementN]])",
            "return": {
                "type": "number",
                "value": "The new length of the array"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "any",
                    "description": "The elements to add to the end of the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Adding elements to an array",
                    "code": "const animals = ['pigs', 'goats', 'sheep'];\nconst count = animals.push('cows');"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "number"
        },
        {
            "function": "reduce()",
            "link": "https://www.w3schools.com/jsref/jsref_reduce.asp",
            "parameters": [
                {
                    "parameter": "function()",
                    "description": "Required.A function to be run for each element in the array."
                },
                {
                    "parameter": "total",
                    "description": "Required.TheinitialValue, or the previously returned value of the function."
                },
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "currentIndex",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array the current element belongs to."
                },
                {
                    "parameter": "initialValue",
                    "description": "Optional.A value to be passed to the function as the initial value."
                }
            ],
            "description": "Executes a reducer function on each element of the array, resulting in a single output value.",
            "signature": "array.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])",
            "return": {
                "type": "any",
                "value": "The value that results from the reduction"
            },
            "arguments": [
                {
                    "#": 1,
                    "type": "function",
                    "description": "A function to execute on each element in the array",
                    "default": "None"
                }
            ],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Summing all elements of an array",
                    "code": "const array1 = [1, 2, 3, 4];\nconst initialValue = 0;\nconst sum = array1.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "single value"
        },
        {
            "function": "reduceRight()",
            "link": "https://www.w3schools.com/jsref/jsref_reduceright.asp",
            "parameters": [
                {
                    "parameter": "function()",
                    "description": "Required.A function to be run for each element in the array."
                },
                {
                    "parameter": "total",
                    "description": "Required.TheinitialValue, or the previously returned value of the function."
                },
                {
                    "parameter": "currentValue",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "currentIndex",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array the element belongs to."
                },
                {
                    "parameter": "initialValue",
                    "description": "Optional.A value to be passed to the function as the initial value"
                }
            ],
            "description": "Applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value.",
            "signature": "array.reduceRight(callback(accumulator, currentValue[, index[, array]])[, initialValue])",
            "return": {
                "type": "any",
                "value": "The value that results from the reduction"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Using reduceRight to flatten an array",
                    "code": "const flattened = [[0, 1], [2, 3], [4, 5]].reduceRight((accumulator, currentValue) => accumulator.concat(currentValue), []);"
                }
            ],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "single value"
        },
        {
            "function": "reverse()",
            "link": "https://www.w3schools.com/jsref/jsref_reverse.asp",
            "parameters": [],
            "description": "Reverses an array in place. The first array element becomes the last, and the last array element becomes the first.",
            "signature": "array.reverse()",
            "return": {
                "type": "array",
                "value": "The reversed array"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Reversing the elements of an array",
                    "code": "const array1 = ['one', 'two', 'three'];\nconst reversed = array1.reverse();"
                }
            ],
            "action": "Sorting and Ordering",
            "is_mutating": true,
            "return_type": "array"
        },
        {
            "function": "shift()",
            "link": "https://www.w3schools.com/jsref/jsref_shift.asp",
            "parameters": [],
            "description": "Removes the first element from an array and returns that removed element.",
            "signature": "array.shift()",
            "return": {
                "type": "any",
                "value": "The removed element from the array; undefined if the array is empty"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Removing the first element from an array",
                    "code": "const array1 = [1, 2, 3];\nconst firstElement = array1.shift();"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "single element"
        },
        {
            "function": "slice()",
            "link": "https://www.w3schools.com/jsref/jsref_slice_array.asp",
            "parameters": [
                {
                    "parameter": "start",
                    "description": "Optional.Start position. Default is 0.Negative numbers select from the end of the array."
                },
                {
                    "parameter": "end",
                    "description": "Optional.End position. Default is last element.Negative numbers select from the end of the array."
                }
            ],
            "description": "Selects a part of an array and returns a new array, without modifying the original array.",
            "signature": "array.slice([begin[, end]])",
            "return": {
                "type": "array",
                "value": "A new array containing the selected elements"
            },
            "arguments": [],
            "use_cases": [],
            "action": "Array Manipulation",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "some()",
            "link": "https://www.w3schools.com/jsref/jsref_some.asp",
            "parameters": [
                {
                    "parameter": "value",
                    "description": "Required.The value of the current element."
                },
                {
                    "parameter": "index",
                    "description": "Optional.The index of the current element."
                },
                {
                    "parameter": "arr",
                    "description": "Optional.The array the current element belongs to."
                },
                {
                    "parameter": "this",
                    "description": "Optional. Default undefined.A value passed to the function to be used as its \"this\" value."
                }
            ],
            "description": "Tests whether at least one element in the array passes the test implemented by the provided function.",
            "signature": "array.some(callback(element[, index[, array]])[, thisArg])",
            "return": {
                "type": "boolean",
                "value": "True if the callback function returns a truthy value for any array element; otherwise, false"
            },
            "arguments": [],
            "use_cases": [],
            "action": "Iteration and Callback Execution",
            "is_mutating": false,
            "return_type": "boolean"
        },
        {
            "function": "sort()",
            "link": "https://www.w3schools.com/jsref/jsref_sort.asp",
            "parameters": [
                {
                    "parameter": "compareFunction",
                    "description": "Optional.A function that defines a sort order. The function should return a negative, zero, or positive value, depending on the  arguments:function(a, b){return a-b}When sort() compares two values, it sends the values to the compare function,  and sorts the values according to the returned (negative, zero, positive) value.Example:The sort function will sort 40 as a value lower than 100.When comparing 40 and 100, sort() calls the function(40,100).The function calculates 40-100, and returns -60 (a negative value)."
                }
            ],
            "description": "Sorts the elements of an array in place and returns the sorted array.",
            "signature": "array.sort([compareFunction])",
            "return": {
                "type": "array",
                "value": "The sorted array"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Sorting numbers in an array",
                    "code": "const numbers = [4, 2, 5, 1, 3];\nnumbers.sort((a, b) => a - b);"
                }
            ],
            "action": "Sorting and Ordering",
            "is_mutating": true,
            "return_type": "array"
        },
        {
            "function": "splice()",
            "link": "https://www.w3schools.com/jsref/jsref_splice.asp",
            "parameters": [
                {
                    "parameter": "index",
                    "description": "Required.The index (position) to add or remove items.A negative value counts from the end of the array."
                },
                {
                    "parameter": "howmany",
                    "description": "Optional.Number of items to be removed."
                },
                {
                    "parameter": "item1, ...,itemX",
                    "description": "Optional.New elements(s) to be added."
                }
            ],
            "description": "Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.",
            "signature": "array.splice(start[, deleteCount[, item1[, item2[, ...]]]])",
            "return": {
                "type": "array",
                "value": "An array containing the deleted elements"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Removing elements from an array",
                    "code": "const months = ['Jan', 'March', 'April', 'June'];\nmonths.splice(1, 0, 'Feb');"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "array"
        },
        {
            "function": "toString()",
            "link": "https://www.w3schools.com/jsref/jsref_tostring_array.asp",
            "parameters": [],
            "description": "Returns a string representing the specified array and its elements.",
            "signature": "array.toString()",
            "return": {
                "type": "string",
                "value": "A string representing the elements of the array"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Converting an array to a string",
                    "code": "const array1 = [1, 2, 'a', '1a'];\narray1.toString();"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "string"
        },
        {
            "function": "unshift()",
            "link": "https://www.w3schools.com/jsref/jsref_unshift.asp",
            "parameters": [
                {
                    "parameter": "item1item2..itemX",
                    "description": "The item(s) to add to the array.Minimum one item is required."
                }
            ],
            "description": "Adds one or more elements to the beginning of an array and returns the new length of the array.",
            "signature": "array.unshift(element1[, ...[, elementN]])",
            "return": {
                "type": "number",
                "value": "The new length of the array"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Adding elements to the beginning of an array",
                    "code": "const array1 = [1, 2, 3];\narray1.unshift(4, 5);"
                }
            ],
            "action": "Array Manipulation",
            "is_mutating": true,
            "return_type": "number"
        },
        {
            "function": "valueOf()",
            "link": "https://www.w3schools.com/jsref/jsref_valueof_array.asp",
            "parameters": [],
            "description": "Returns the primitive value of the specified object.",
            "signature": "array.valueOf()",
            "return": {
                "type": "array",
                "value": "The array itself"
            },
            "arguments": [],
            "use_cases": [
                {
                    "#": 1,
                    "title": "Getting the primitive value of an array",
                    "code": "const array1 = [1, 2, 3];\narray1.valueOf();"
                }
            ],
            "action": "General Utilities",
            "is_mutating": false,
            "return_type": "array"
        },
        {
            "function": "with()",
            "link": "https://www.w3schools.com/jsref/jsref_array_with.asp",
            "parameters": [
                {
                    "parameter": "index",
                    "description": "Required.The index (position) of the item to change.A negative index counts from the end of the array."
                },
                {
                    "parameter": "value",
                    "description": "Required.The new value."
                }
            ],
            "description": "This method does not exist in standard JavaScript and might be a mistake or related to a specific library or framework.",
            "signature": "N/A",
            "return": {
                "type": "N/A",
                "value": "N/A"
            },
            "arguments": [],
            "use_cases": [],
            "action": "Miscellaneous or Unclassified",
            "is_mutating": false,
            "return_type": "undefined"
        }
    ]
    // Serve the entire data set as a response to any request to this API route
    console.log("A[PI")
    res.status(200).json(data);
  }