export default function handler(req, res) {
    // Define the entire data set directly within the API route
    const data = [
        {
            "function": "new Map()",
            "description": "Creates a new Map object.",
            "parameters": [
                {
                    "parameter": "iterable",
                    "description": "An Array or other iterable object whose elements are key-value pairs (arrays with two elements, e.g. [[ 1, 'one' ],[ 2, 'two' ]]). Each key-value pair is added to the new Map."
                }
            ],
            "signature": "new Map(iterable)",
            "return": {
                "type": "Map object",
                "value": "A new Map object."
            },
            "action": "Creation",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
            "return_type": "Map object",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Creating a new Map",
                    "code": "const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);"
                }
            ]
        },
        {
            "function": "set()",
            "description": "Adds or updates an element with a specified key and value to a Map object.",
            "parameters": [
                {
                    "parameter": "key",
                    "description": "The key of the element to add to the Map object."
                },
                {
                    "parameter": "value",
                    "description": "The value of the element to add to the Map object."
                }
            ],
            "signature": "map.set(key, value)",
            "return": {
                "type": "Map object",
                "value": "The Map object."
            },
            "action": "Update",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set",
            "return_type": "Map object",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Adding or updating an element in the Map",
                    "code": "map.set(4, 'four');"
                }
            ]
        },
        {
            "function": "get()",
            "description": "Returns the value associated to the key, or undefined if there is none.",
            "parameters": [
                {
                    "parameter": "key",
                    "description": "The key of the element to return from the Map object."
                }
            ],
            "signature": "map.get(key)",
            "return": {
                "type": "Any",
                "value": "The element associated with the specified key or undefined if the key can't be found in the Map object."
            },
            "action": "Retrieval",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get",
            "return_type": "Any",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Getting the value for a key in the Map",
                    "code": "map.get(2); // 'two'"
                }
            ]
        },
        {
            "function": "delete()",
            "description": "Removes the specified element from a Map by key.",
            "parameters": [
                {
                    "parameter": "key",
                    "description": "The key of the element to remove from the Map."
                }
            ],
            "signature": "map.delete(key)",
            "return": {
                "type": "Boolean",
                "value": "True if an element in the Map object existed and has been removed, or false if the element does not exist."
            },
            "action": "Deletion",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete",
            "return_type": "Boolean",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Deleting an element from the Map",
                    "code": "map.delete(3); // true"
                }
            ]
        },
        {
            "function": "has()",
            "description": "Returns a boolean indicating whether an element with the specified key exists or not.",
            "parameters": [
                {
                    "parameter": "key",
                    "description": "The key of the element to test for presence in the Map object."
                }
            ],
            "signature": "map.has(key)",
            "return": {
                "type": "Boolean",
                "value": "True if the Map object has an element with the specified key; otherwise false."
            },
            "action": "Query",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has",
            "return_type": "Boolean",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Checking for a key in the Map",
                    "code": "map.has(1); // true"
                }
            ]
        },
        {
            "function": "forEach()",
            "description": "Executes a provided function once per each key/value pair in the Map object, in insertion order.",
            "parameters": [
                {
                    "parameter": "callbackFn",
                    "description": "Function to execute for each element."
                },
                {
                    "parameter": "thisArg",
                    "description": "Value to use as this when executing callback."
                }
            ],
            "signature": "map.forEach(callbackFn[, thisArg])",
            "return": {
                "type": "Undefined",
                "value": "Nothing returned, but callback function is executed for each element."
            },
            "action": "Iteration",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach",
            "return_type": "Undefined",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Executing a function for each element in the Map",
                    "code": "map.forEach((value, key) => console.log(`${key}: ${value}`));"
                }
            ]
        },
        {
            "function": "entries()",
            "description": "Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.",
            "parameters": [],
            "signature": "map.entries()",
            "return": {
                "type": "Iterator",
                "value": "A new Iterator object that contains an array of [key, value] for each element in the Map."
            },
            "action": "Retrieval",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries",
            "return_type": "Iterator",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating through entries of the Map",
                    "code": "for (let [key, value] of map.entries()) console.log(`${key}: ${value}`);"
                }
            ]
        },
        {
            "function": "size",
            "description": "Property that returns the number of elements in a Map object.",
            "parameters": [],
            "signature": "map.size",
            "return": {
                "type": "Number",
                "value": "The number of elements in the Map object."
            },
            "action": "Property",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size",
            "return_type": "Number",
            "use_cases": []
        }
    ]
    
    
         // Serve the entire data set as a response to any request to this API route
    res.status(200).json(data);
  }