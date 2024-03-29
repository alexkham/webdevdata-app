import data from './strings.json'

export default function handler(req, res) {
    // Define the entire data set directly within the API route
    // const data = [
    //     {
    //         "function": "charAt()",
    //         "description": "Returns the character at the specified index (position) in a string.",
    //         "parameters": [
    //             {
    //                 "parameter": "index",
    //                 "description": "Optional. The index (position) of the character. Default = 0."
    //             }
    //         ],
    //         "signature": "stringInstance.charAt(index)",
    //         "return": {
    //             "type": "String",
    //             "value": "The character at the specified index."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_charat.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Accessing a specific character",
    //                 "code": "const message = 'Hello';\nconst char = message.charAt(0); // 'H'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "charCodeAt()",
    //         "description": "Returns the Unicode of the character at the specified index in a string.",
    //         "parameters": [
    //             {
    //                 "parameter": "index",
    //                 "description": "Optional. A number representing the index (position) of a character. Default value = 0."
    //             }
    //         ],
    //         "signature": "stringInstance.charCodeAt(index)",
    //         "return": {
    //             "type": "Number",
    //             "value": "The Unicode of the character at the specified index."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_charcodeat.asp",
    //         "return_type": "Number",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Getting Unicode value of character",
    //                 "code": "const message = 'Hello';\nconst code = message.charCodeAt(1); // 101"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "concat()",
    //         "description": "Joins two or more strings and returns a new joined string.",
    //         "parameters": [
    //             {
    //                 "parameter": "string1, string2, ...stringX",
    //                 "description": "Required. The strings to be joined."
    //             }
    //         ],
    //         "signature": "stringInstance.concat(string1, string2, ...stringX)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string containing the concatenated values."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_concat_string.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Concatenating multiple strings",
    //                 "code": "const greeting = 'Hello';\nconst space = ' ';\nconst world = 'World';\nconst message = greeting.concat(space, world); // 'Hello World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "constructor",
    //         "description": "Returns the function that created the String object's prototype.",
    //         "parameters": [],
    //         "signature": "stringInstance.constructor",
    //         "return": {
    //             "type": "Function",
    //             "value": "The String constructor function that created the object's prototype."
    //         },
    //         "action": "Meta-Functions",
    //         "link": "https://www.w3schools.com/jsref/jsref_constructor_string.asp",
    //         "return_type": "Function",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Accessing the constructor of a string object",
    //                 "code": "const message = 'Hello';\nconst constructorName = message.constructor.name; // 'String'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "endsWith()",
    //         "description": "Checks whether a string ends with specified string/characters.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchvalue",
    //                 "description": "Required. The string to search for."
    //             },
    //             {
    //                 "parameter": "length",
    //                 "description": "Optional. The length of the string to search. Default value is the length of the string."
    //             }
    //         ],
    //         "signature": "stringInstance.endsWith(searchvalue, length)",
    //         "return": {
    //             "type": "Boolean",
    //             "value": "True if the string ends with the search value, false otherwise."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_endswith.asp",
    //         "return_type": "Boolean",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Checking if a string ends with a specific substring",
    //                 "code": "const message = 'Hello World';\nconst endsWithWorld = message.endsWith('World'); // true"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "fromCharCode()",
    //         "description": "Converts Unicode values to characters.",
    //         "parameters": [
    //             {
    //                 "parameter": "n1, n2, nX",
    //                 "description": "Required. One or more Unicode values to be converted."
    //             }
    //         ],
    //         "signature": "String.fromCharCode(n1, n2, ...nX)",
    //         "return": {
    //             "type": "String",
    //             "value": "A string created from the specified Unicode values."
    //         },
    //         "action": "Meta-Functions",
    //         "link": "https://www.w3schools.com/jsref/jsref_fromcharcode.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Creating a string from Unicode values",
    //                 "code": "const charString = String.fromCharCode(72, 101, 108, 108, 111); // 'Hello'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "includes()",
    //         "description": "Checks whether a string contains the specified string/characters.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchvalue",
    //                 "description": "Required. The string to search for."
    //             },
    //             {
    //                 "parameter": "start",
    //                 "description": "Optional. The position to start from. Default value is 0."
    //             }
    //         ],
    //         "signature": "stringInstance.includes(searchvalue, start)",
    //         "return": {
    //             "type": "Boolean",
    //             "value": "True if the search string is found anywhere within the given string, false otherwise."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_includes.asp",
    //         "return_type": "Boolean",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Checking if a string contains a specific substring",
    //                 "code": "const message = 'Hello World';\nconst includesHello = message.includes('Hello'); // true"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "indexOf()",
    //         "description": "Returns the position of the first occurrence of a specified value in a string.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchvalue",
    //                 "description": "Required. The string to search for."
    //             },
    //             {
    //                 "parameter": "start",
    //                 "description": "Optional. The position to start from (default is 0)."
    //             }
    //         ],
    //         "signature": "stringInstance.indexOf(searchvalue, start)",
    //         "return": {
    //             "type": "Number",
    //             "value": "The index of the first occurrence of the search value, or -1 if not found."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_indexof.asp",
    //         "return_type": "Number",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Finding the index of a substring",
    //                 "code": "const message = 'Hello World';\nconst index = message.indexOf('World'); // 6"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "lastIndexOf()",
    //         "description": "Returns the position of the last occurrence of a specified value in a string.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchvalue",
    //                 "description": "Required. The string to search for."
    //             },
    //             {
    //                 "parameter": "start",
    //                 "description": "Optional. The position where to start. Default value is string length."
    //             }
    //         ],
    //         "signature": "stringInstance.lastIndexOf(searchvalue, start)",
    //         "return": {
    //             "type": "Number",
    //             "value": "The index of the last occurrence of the search value, or -1 if not found."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_lastindexof.asp",
    //         "return_type": "Number",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Finding the last index of a substring",
    //                 "code": "const message = 'Hello World, World';\nconst lastIndex = message.lastIndexOf('World'); // 13"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "length",
    //         "description": "Returns the length of a string.",
    //         "parameters": [],
    //         "signature": "stringInstance.length",
    //         "return": {
    //             "type": "Number",
    //             "value": "The length of the string."
    //         },
    //         "action": "Property Access",
    //         "link": "https://www.w3schools.com/jsref/jsref_length_string.asp",
    //         "return_type": "Number",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Getting the length of a string",
    //                 "code": "const message = 'Hello';\nconst length = message.length; // 5"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "localeCompare()",
    //         "description": "Compares two strings in the current locale.",
    //         "parameters": [
    //             {
    //                 "parameter": "compareString",
    //                 "description": "Required. The string to compare with."
    //             }
    //         ],
    //         "signature": "stringInstance.localeCompare(compareString)",
    //         "return": {
    //             "type": "Number",
    //             "value": "A number indicating whether the reference string comes before, after, or is the same as the given string in sort order."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_localecompare.asp",
    //         "return_type": "Number",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Comparing two strings in the current locale",
    //                 "code": "const a = 'r\u00e9serv\u00e9';\nconst b = 'reserve';\nconst comparison = a.localeCompare(b); // Positive or negative value based on locale"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "match()",
    //         "description": "Searches a string for a match against a regular expression, and returns the matches.",
    //         "parameters": [
    //             {
    //                 "parameter": "match",
    //                 "description": "Required. The search value. A regular expression (or a string that will be converted to a regular expression)."
    //             }
    //         ],
    //         "signature": "stringInstance.match(match)",
    //         "return": {
    //             "type": "Array",
    //             "value": "An Array containing the matched results or null if no matches are found."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_match.asp",
    //         "return_type": "Array",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Matching a string against a regular expression",
    //                 "code": "const message = 'Hello World';\nconst matches = message.match(/[A-Z]/g); // ['H', 'W']"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "prototype",
    //         "description": "Allows the addition of properties and methods to an object.",
    //         "parameters": [],
    //         "signature": "String.prototype.propertyName",
    //         "return": {
    //             "type": "Various",
    //             "value": "Depends on the property or method being accessed or added."
    //         },
    //         "action": "Meta-Functions",
    //         "link": "https://www.w3schools.com/jsref/jsref_prototype_string.asp",
    //         "return_type": "Various",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Adding a method to the String prototype",
    //                 "code": "String.prototype.sayHello = function() { return 'Hello ' + this; };\nconst name = 'World';\nconst greeting = name.sayHello(); // 'Hello World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "repeat()",
    //         "description": "Returns a new string with a specified number of copies of an existing string.",
    //         "parameters": [
    //             {
    //                 "parameter": "count",
    //                 "description": "Required. The number of times to repeat the string."
    //             }
    //         ],
    //         "signature": "stringInstance.repeat(count)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string containing the specified number of copies of the original string."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_repeat.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Repeating a string a number of times",
    //                 "code": "const echo = 'echo '; \nconst echoes = echo.repeat(3); // 'echo echo echo '"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "replace()",
    //         "description": "Searches a string for a specified value, or a regular expression, and returns a new string where the specified values are replaced.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchValue",
    //                 "description": "Required. The value, or regular expression, that will be searched for in the string."
    //             },
    //             {
    //                 "parameter": "newValue",
    //                 "description": "Required. The value to replace the specified value/regular expression with."
    //             }
    //         ],
    //         "signature": "stringInstance.replace(searchValue, newValue)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string with the specified value(s) replaced."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_replace.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Replacing part of a string",
    //                 "code": "const message = 'Hello World';\nconst newMessage = message.replace('World', 'Mars'); // 'Hello Mars'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "replaceAll()",
    //         "description": "Replaces all occurrences of a specified value, or a regular expression, with a new value.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchValue",
    //                 "description": "Required. The value, or regular expression, to search for."
    //             },
    //             {
    //                 "parameter": "newValue",
    //                 "description": "Required. The new value to replace with. This parameter can be a JavaScript function."
    //             }
    //         ],
    //         "signature": "stringInstance.replaceAll(searchValue, newValue)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string with all occurrences of the specified value replaced."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_string_replaceall.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Replacing all instances of a substring",
    //                 "code": "const message = 'Hello World World';\nconst newMessage = message.replaceAll('World', 'Mars'); // 'Hello Mars Mars'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "search()",
    //         "description": "Searches a string for a specified value, or regular expression, and returns the position of the match.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchValue",
    //                 "description": "Required. The search value. A regular expression (or a string that will be converted to a regular expression)."
    //             }
    //         ],
    //         "signature": "stringInstance.search(searchValue)",
    //         "return": {
    //             "type": "Number",
    //             "value": "The index of the first match between the regular expression and the given string, or -1 if no match was found."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_search.asp",
    //         "return_type": "Number",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Searching within a string using a RegExp",
    //                 "code": "const message = 'Hello World';\nconst index = message.search('World'); // 6"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "slice()",
    //         "description": "Extracts a part of a string and returns a new string.",
    //         "parameters": [
    //             {
    //                 "parameter": "start",
    //                 "description": "Required. The start position. (First character is 0)."
    //             },
    //             {
    //                 "parameter": "end",
    //                 "description": "Optional. The end position (up to, but not including). Default is the length of the string."
    //             }
    //         ],
    //         "signature": "stringInstance.slice(start, end)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string containing the extracted section of the string."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_slice_string.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Extracting a section of a string",
    //                 "code": "const message = 'Hello World';\nconst slice = message.slice(0, 5); // 'Hello'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "split()",
    //         "description": "Splits a string into an array of substrings.",
    //         "parameters": [
    //             {
    //                 "parameter": "separator",
    //                 "description": "Optional. A string or regular expression to use for splitting. If omitted, an array with the original string is returned."
    //             },
    //             {
    //                 "parameter": "limit",
    //                 "description": "Optional. An integer that limits the number of splits. Items after the limit are not included in the array."
    //             }
    //         ],
    //         "signature": "stringInstance.split(separator, limit)",
    //         "return": {
    //             "type": "Array",
    //             "value": "An array of strings, split at each point where the separator occurs in the given string."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_split.asp",
    //         "return_type": "Array",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Splitting a string into an array of substrings",
    //                 "code": "const fruits = 'Apple, Banana, Cherry';\nconst fruitArray = fruits.split(', '); // ['Apple', 'Banana', 'Cherry']"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "startsWith()",
    //         "description": "Checks whether a string starts with specified string/characters.",
    //         "parameters": [
    //             {
    //                 "parameter": "searchValue",
    //                 "description": "Required. The string to search for."
    //             },
    //             {
    //                 "parameter": "start",
    //                 "description": "Optional. The position at which to start the search. Default is 0."
    //             }
    //         ],
    //         "signature": "stringInstance.startsWith(searchValue, start)",
    //         "return": {
    //             "type": "Boolean",
    //             "value": "True if the string starts with the search value, false otherwise."
    //         },
    //         "action": "String Inspection and Searching",
    //         "link": "https://www.w3schools.com/jsref/jsref_startswith.asp",
    //         "return_type": "Boolean",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Checking if a string starts with a specified substring",
    //                 "code": "const message = 'Hello World';\nconst starts = message.startsWith('Hello'); // true"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "substr()",
    //         "description": "Extracts the characters from a string, beginning at a specified start position, and through the specified number of character.",
    //         "parameters": [
    //             {
    //                 "parameter": "start",
    //                 "description": "Required. The start position. First character is at index 0. If start is greater than the string's length, substr() returns an empty string. If start is negative, substr() counts from the end of the string."
    //             },
    //             {
    //                 "parameter": "length",
    //                 "description": "Optional. The number of characters to extract. If omitted, it extracts the rest of the string."
    //             }
    //         ],
    //         "signature": "stringInstance.substr(start, length)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string containing the specified part of the given string."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_substr.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Extracting a substring by start index and length",
    //                 "code": "const message = 'Hello World';\nconst substr = message.substr(6, 5); // 'World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "substring()",
    //         "description": "Extracts the characters from a string, between two specified indices.",
    //         "parameters": [
    //             {
    //                 "parameter": "start",
    //                 "description": "Required. Start position. First character is at index 0."
    //             },
    //             {
    //                 "parameter": "end",
    //                 "description": "Optional. End position (up to, but not including). If omitted, extracts to the end of the string."
    //             }
    //         ],
    //         "signature": "stringInstance.substring(start, end)",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string containing the extracted characters."
    //         },
    //         "action": "String Modification",
    //         "link": "https://www.w3schools.com/jsref/jsref_substring.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Extracting a substring between two indices",
    //                 "code": "const message = 'Hello World';\nconst substring = message.substring(0, 5); // 'Hello'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "toLocaleLowerCase()",
    //         "description": "Converts a string to lowercase letters, according to the host's current locale.",
    //         "parameters": [],
    //         "signature": "stringInstance.toLocaleLowerCase()",
    //         "return": {
    //             "type": "String",
    //             "value": "The calling string value converted to lower case, according to any locale-specific case mappings."
    //         },
    //         "action": "String Case Conversion",
    //         "link": "https://www.w3schools.com/jsref/jsref_tolocalelowercase.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Converting a string to lowercase based on locale",
    //                 "code": "const message = '\u0130stanbul';\nconst lower = message.toLocaleLowerCase('tr-TR'); // 'istanbul'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "toLocaleUpperCase()",
    //         "description": "Converts a string to uppercase letters, according to the host's current locale.",
    //         "parameters": [],
    //         "signature": "stringInstance.toLocaleUpperCase()",
    //         "return": {
    //             "type": "String",
    //             "value": "The calling string value converted to upper case, according to any locale-specific case mappings."
    //         },
    //         "action": "String Case Conversion",
    //         "link": "https://www.w3schools.com/jsref/jsref_tolocaleuppercase.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Converting a string to uppercase based on locale",
    //                 "code": "const message = 'ijs';\nconst upper = message.toLocaleUpperCase('nl-NL'); // 'IJS'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "toLowerCase()",
    //         "description": "Converts a string to lowercase letters.",
    //         "parameters": [],
    //         "signature": "stringInstance.toLowerCase()",
    //         "return": {
    //             "type": "String",
    //             "value": "The calling string value converted to lower case."
    //         },
    //         "action": "String Case Conversion",
    //         "link": "https://www.w3schools.com/jsref/jsref_tolowercase.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Converting a string to lowercase",
    //                 "code": "const message = 'Hello World';\nconst lower = message.toLowerCase(); // 'hello world'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "toString()",
    //         "description": "Returns a string representing the specified object.",
    //         "parameters": [],
    //         "signature": "stringInstance.toString()",
    //         "return": {
    //             "type": "String",
    //             "value": "A string representing the object."
    //         },
    //         "action": "Conversion and Value Retrieval",
    //         "link": "https://www.w3schools.com/jsref/jsref_tostring_string.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Converting a String object to a string",
    //                 "code": "const stringObj = new String('Hello World');\nconst str = stringObj.toString(); // 'Hello World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "toUpperCase()",
    //         "description": "Converts a string to uppercase letters.",
    //         "parameters": [],
    //         "signature": "stringInstance.toUpperCase()",
    //         "return": {
    //             "type": "String",
    //             "value": "The calling string value converted to upper case."
    //         },
    //         "action": "String Case Conversion",
    //         "link": "https://www.w3schools.com/jsref/jsref_touppercase.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Converting a string to uppercase",
    //                 "code": "const message = 'hello world';\nconst upper = message.toUpperCase(); // 'HELLO WORLD'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "trim()",
    //         "description": "Removes whitespace from both ends of a string.",
    //         "parameters": [],
    //         "signature": "stringInstance.trim()",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string representing the calling string stripped of whitespace from both ends."
    //         },
    //         "action": "Whitespace Management",
    //         "link": "https://www.w3schools.com/jsref/jsref_trim_string.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Trimming whitespace from both ends of a string",
    //                 "code": "const message = '   Hello World   ';\nconst trimmed = message.trim(); // 'Hello World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "trimEnd()",
    //         "description": "Removes whitespace from the end of a string.",
    //         "parameters": [],
    //         "signature": "stringInstance.trimEnd()",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string representing the calling string stripped of whitespace from its end."
    //         },
    //         "action": "Whitespace Management",
    //         "link": "https://www.w3schools.com/jsref/jsref_string_trim_end.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Trimming whitespace from the end of a string",
    //                 "code": "const message = 'Hello World   ';\nconst trimmed = message.trimEnd(); // 'Hello World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "trimStart()",
    //         "description": "Removes whitespace from the beginning of a string.",
    //         "parameters": [],
    //         "signature": "stringInstance.trimStart()",
    //         "return": {
    //             "type": "String",
    //             "value": "A new string representing the calling string stripped of whitespace from its beginning."
    //         },
    //         "action": "Whitespace Management",
    //         "link": "https://www.w3schools.com/jsref/jsref_string_trim_start.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Trimming whitespace from the start of a string",
    //                 "code": "const message = '   Hello World';\nconst trimmed = message.trimStart(); // 'Hello World'"
    //             }
    //         ]
    //     },
    //     {
    //         "function": "valueOf()",
    //         "description": "Returns the primitive value of a String object.",
    //         "parameters": [],
    //         "signature": "stringInstance.valueOf()",
    //         "return": {
    //             "type": "String",
    //             "value": "The primitive value of the specified String object."
    //         },
    //         "action": "Conversion and Value Retrieval",
    //         "link": "https://www.w3schools.com/jsref/jsref_valueof_string.asp",
    //         "return_type": "String",
    //         "use_cases": [
    //             {
    //                 "#": 1,
    //                 "title": "Getting the primitive value of a String object",
    //                 "code": "const stringObj = new String('Hello World');\nconst primitiveValue = stringObj.valueOf(); // 'Hello World'"
    //             }
    //         ]
    //     }
    // ]
         // Serve the entire data set as a response to any request to this API route
    res.status(200).json(data);
  }