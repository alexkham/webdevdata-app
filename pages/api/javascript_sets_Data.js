export default function handler(req, res) {
    // Define the entire data set directly within the API route
    const data = [
        {
            "function": "new Set()",
            "description": "Creates a new Set object.",
            "parameters": [
                {
                    "parameter": "iterable",
                    "description": "Optional. An iterable object to add all of its elements to the new Set. If not specified, the new Set is empty."
                }
            ],
            "signature": "new Set(iterable)",
            "return": {
                "type": "Set object",
                "value": "A new Set object."
            },
            "action": "Creation",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",
            "return_type": "Set object",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Creating a Set from an array",
                    "code": "const mySet = new Set([1, 2, 3, 4, 5]);"
                }
            ]
        },
        {
            "function": "add()",
            "description": "Appends a new element with a specified value to the end of a Set object.",
            "parameters": [
                {
                    "parameter": "value",
                    "description": "The value of the element to add to the Set."
                }
            ],
            "signature": "Set.prototype.add(value)",
            "return": {
                "type": "Set object",
                "value": "The Set object."
            },
            "action": "Modification",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add",
            "return_type": "Set object",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Adding an element to the Set",
                    "code": "mySet.add('hello');"
                }
            ]
        },
        {
            "function": "delete()",
            "description": "Removes the specified element from a Set.",
            "parameters": [
                {
                    "parameter": "value",
                    "description": "The value of the element to remove from the Set."
                }
            ],
            "signature": "Set.prototype.delete(value)",
            "return": {
                "type": "Boolean",
                "value": "True if an element in the Set object has been removed successfully; otherwise false."
            },
            "action": "Modification",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete",
            "return_type": "Boolean",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Deleting an element from the Set",
                    "code": "mySet.delete('hello');"
                }
            ]
        },
        {
            "function": "has()",
            "description": "Returns a boolean indicating whether an element with the specified value exists in a Set object or not.",
            "parameters": [
                {
                    "parameter": "value",
                    "description": "The value to test for presence in the Set."
                }
            ],
            "signature": "Set.prototype.has(value)",
            "return": {
                "type": "Boolean",
                "value": "True if the element exists in the Set; otherwise false."
            },
            "action": "Query",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has",
            "return_type": "Boolean",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Checking for the presence of an element in the Set",
                    "code": "mySet.has(1);"
                }
            ]
        },
        {
            "function": "clear()",
            "description": "Removes all elements from a Set.",
            "parameters": [],
            "signature": "Set.prototype.clear()",
            "return": {
                "type": "Undefined",
                "value": "Nothing returned, but the Set is cleared."
            },
            "action": "Modification",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/clear",
            "return_type": "Undefined",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Clearing all elements from the Set",
                    "code": "mySet.clear();"
                }
            ]
        },
        {
            "function": "forEach()",
            "description": "Executes a provided function once for each value in the Set, in insertion order.",
            "parameters": [
                {
                    "parameter": "callbackFn",
                    "description": "Function to execute for each element, taking three arguments: the element value, the element value again (since Sets have no keys), and the Set being traversed."
                },
                {
                    "parameter": "thisArg",
                    "description": "Value to use as this when executing callback."
                }
            ],
            "signature": "Set.prototype.forEach(callbackFn[, thisArg])",
            "return": {
                "type": "Undefined",
                "value": "Nothing returned, but the callback function is executed for each element."
            },
            "action": "Iteration",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/forEach",
            "return_type": "Undefined",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Executing a function for each element in the Set",
                    "code": "mySet.forEach(function(value) { console.log(value); });"
                }
            ]
        },
        {
            "function": "values()",
            "description": "Returns a new Iterator object that contains the values for each element in the Set object in insertion order.",
            "parameters": [],
            "signature": "Set.prototype.values()",
            "return": {
                "type": "Iterator",
                "value": "A new Iterator object containing the values for each element in the Set."
            },
            "action": "Retrieval",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values",
            "return_type": "Iterator",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating through values of the Set",
                    "code": "const iterator = mySet.values();"
                }
            ]
        },
        {
            "function": "keys()",
            "description": "Alias for .values(). Returns a new Iterator object that contains the values for each element in the Set object in insertion order.",
            "parameters": [],
            "signature": "Set.prototype.keys()",
            "return": {
                "type": "Iterator",
                "value": "A new Iterator object containing the values for each element in the Set."
            },
            "action": "Retrieval",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values",
            "return_type": "Iterator",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating through keys (values) of the Set",
                    "code": "const keyIterator = mySet.keys();"
                }
            ]
        },
        {
            "function": "entries()",
            "description": "Returns a new Iterator object that contains an array of [value, value] for each element in the Set object, in insertion order.",
            "parameters": [],
            "signature": "Set.prototype.entries()",
            "return": {
                "type": "Iterator",
                "value": "A new Iterator object that contains an array of [value, value] for each element."
            },
            "action": "Retrieval",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries",
            "return_type": "Iterator",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Iterating through entries of the Set",
                    "code": "const entries = mySet.entries();"
                }
            ]
        },
        {
            "function": "size",
            "description": "Property that returns the number of elements in a Set object.",
            "parameters": [],
            "signature": "Set.prototype.size",
            "return": {
                "type": "Number",
                "value": "The number of elements in the Set."
            },
            "action": "Property",
            "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/size",
            "return_type": "Number",
            "use_cases": [
                {
                    "#": 1,
                    "title": "Getting the size of the Set",
                    "code": "console.log(mySet.size);"
                }
            ]
        }
    ]
    
         // Serve the entire data set as a response to any request to this API route
    res.status(200).json(data);
  }