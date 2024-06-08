const explanations = {
    '0000': `In Python, when slicing a list, the step parameter determines the interval between elements in the slice.
     A step of 0, however, is not allowed and will raise a 'ValueError'. 
     This is because a step of 0 would imply a non-progressing slice, meaning no movement through the list, which is illogical for the operation. 
     Therefore, setting the step to 0 in list slicing is an invalid operation and will immediately result in an error, preventing any slicing from occurring.
     In such case it does not even matter what other indices like start and stop are set to.`,
    1111: `Start index {{start}} (defaults to 0 if omitted)
  Stop index {{stop}} (defaults to length of the array if omitted)
  Step {{step}} (defaults to 1 if omitted)
  
  In this case, when the start index is omitted, it defaults to 0, which means the slicing will start from the beginning of the array. The stop index is also omitted, so it defaults to the length of the array ({{dataLength}}), indicating that the slicing will continue until the end of the array. The step value is positive (defaults to 1 if omitted), which means the slicing will move forward through the array.
  
  Since the start index (0) is smaller than the stop index {{dataLength}}, and the step is positive, the slicing will include all elements from the beginning to the end of the array. The resulting array will be a copy of the original array, as no elements are skipped or excluded.
  
  For example, if the original array is {{dataArray}}, the slicing will start at index 0 and continue until index {{lastIndex}} (the last index), with a step of 1. The resulting array will be {{dataArray}}, which is identical to the original array.`,
  
 
  1112: `Start index is omitted (defaults to -1, which represents the last element of the list)
Stop index is omitted (defaults to -({{dataLength}}), which represents one step before the first element of the list)
Step  is {{step}}

In this case, the step value is {{step}}. A negative step means that the list will be sliced in reverse order, starting from the end of the list and moving towards the beginning.

When the start and stop indices are omitted in a reverse order slicing:

- The start index defaults to -1, representing the last element of the list in Python's negative indexing notation.

- The stop index defaults to -{{dataLength}}, representing one step before the first element of the list in Python's negative indexing notation.

Since the default start index (-1) is greater than the default stop index (-{{dataLength}}), and the step is negative, the slicing will include all elements from the end of the list up to, but not including, the element at the default stop index. The resulting list will be a reversed version of the entire original list.

For example, if the original list is {{dataArray}}, the slicing will start at index -1 (last element) and continue until it reaches the element one step before index -{{dataLength}} (one step before the first element), effectively reversing the order of all elements. The resulting list will be a reversed version of {{dataArray}}.

To summarize:
- Both start and stop indices are omitted.
- Step is {{step}}, indicating reverse order slicing.
- Start index defaults to -1 (last element).
- Stop index defaults to -({{dataLength}}) (one step before the first element).
- The resulting list will be a reversed version of the entire original list.`,
2111: `Start index {{start}}
Stop index {{stop}} (defaults to {{dataLength}} if omitted)
Step {{step}} (defaults to 1 if omitted)

In this case, the start index is explicitly provided as {{start}}, indicating the position from where the slicing should begin. Since the start index is a positive number, it represents the offset from the beginning of the list.

The stop index is omitted, so it defaults to {{dataLength}}, which is the length of the list. This means that the slicing will continue until the end of the list.

The step value is also omitted, which means it defaults to 1. A positive step value indicates that the slicing will move forward through the list, selecting elements in the original order.

Since the start index ({{start}}) is non-negative and smaller than the default stop index ({{dataLength}}), and the step is positive, the slicing will include elements from the specified start index up to, but not including, the last element of the list.

For example, if the original list is {{dataArray}}, and the start index is {{start}}, the slicing will start at index {{start}} and continue until the end of the list, selecting elements in the original order. The resulting list will be a sublist of {{dataArray}} starting from index {{start}} until the last element.

To summarize:
- The start index is explicitly provided as {{start}}, indicating the starting position for slicing.
- The stop index is omitted and defaults to {{dataLength}}, meaning the slicing will continue until the end of the list.
- The step is omitted and defaults to 1, indicating forward movement through the list.
- The resulting list will be a sublist of the original list, starting from the specified start index and continuing until the last element.`,
1211: `Start index is omitted (defaults to 0)
Stop index {{stop}}
Step {{step}} (defaults to 1 if omitted)

In this case, the start index is omitted, so it defaults to 0. This means that the slicing will start from the beginning of the list.

The stop index is explicitly provided as {{stop}}. Since the stop index is a positive number, it represents the position at which the slicing should stop (exclusive). The element at the stop index will not be included in the resulting list.

The step value is omitted, which means it defaults to 1. A positive step value indicates that the slicing will move forward through the list, selecting elements in the original order.

Since the default start index (0) is smaller than the specified stop index ({{stop}}), and the step is positive, the slicing will include elements from the beginning of the list up to, but not including, the element at the specified stop index.

For example, if the original list is {{dataArray}}, and the stop index is {{stop}}, the slicing will start at index 0 (first element) and continue until it reaches the element at index {{stop}} (exclusive). The resulting list will be a sublist of {{dataArray}} starting from the first element up to, but not including, the element at index {{stop}}.

To summarize:
- The start index is omitted and defaults to 0, indicating that the slicing starts from the beginning of the list.
- The stop index is explicitly provided as {{stop}}, specifying the position at which the slicing should stop (exclusive).
- The step is omitted and defaults to 1, indicating forward movement through the list.
- The resulting list will be a sublist of the original list, starting from the first element and continuing up to, but not including, the element at the specified stop index.`,
2231: `Start index {{start}}
Stop index {{stop}}
Step {{step}}-(defaults to 1 if ommited)

In this case, the start index is explicitly provided as {{start}}, indicating the position from where the slicing should begin. Since the start index is a positive number, it represents the offset from the beginning of the list.

The stop index is also explicitly provided as {{stop}}. Since the stop index is a negative number, it represents the position from the end of the list at which the slicing should stop (inclusive). The element at the stop index will be included in the resulting list.

The step value is {{step}}. A positive step value indicates that the slicing will move forward through the list, selecting elements in the original order.

To determine the effective stop index, we need to calculate the positive equivalent of the negative stop index. In Python's negative indexing notation, -1 represents the last element of the list, -2 represents the second-to-last element, and so on. Therefore, the effective stop index can be calculated as {{dataLength}} + {{stop}}.

Since the start index ({{start}}) is smaller than the effective stop index ({{dataLength}} + {{stop}}), and the step is positive, the slicing will include elements from the specified start index up to, and including, the element at the effective stop index.

For example, if the original list is {{dataArray}}, the start index is {{start}}, and the stop index is {{stop}}, the slicing will start at index {{start}} and continue until it reaches the element at the effective stop index ({{dataLength}} + {{stop}}), which is the element {{-stop}} positions from the end of the list. The resulting list will be a sublist of {{dataArray}} starting from index {{start}} up to, and including, the element at the effective stop index.

To summarize:
- The start index is explicitly provided as {{start}}, indicating the starting position for slicing.
- The stop index is explicitly provided as {{stop}}, representing the position from the end of the list at which the slicing should stop (inclusive).
- The step is {{step}}, indicating forward movement through the list.
- The effective stop index is calculated as {{dataLength}} + {{stop}}, representing the positive equivalent of the negative stop index.
- The resulting list will be a sublist of the original list, starting from the specified start index and continuing up to, and including, the element at the effective stop index.`,
2211: `Start index {{start}}
Stop index {{stop}}
Step {{step}} (defaults to 1 if omitted)

In this case, both the start index and the stop index are explicitly provided as {{start}} and {{stop}}, respectively. Since both indices are positive numbers, they represent the positions from the beginning of the list.

The start index {{start}} indicates the position from where the slicing should begin (inclusive). The stop index {{stop}} indicates the position at which the slicing should stop (exclusive). The element at the stop index will not be included in the resulting list.

The step value is omitted, which means it defaults to 1. A positive step value indicates that the slicing will move forward through the list, selecting elements in the original order.

Since the start index ({{start}}) is smaller than the stop index ({{stop}}), and the step is positive, the slicing will include elements from the specified start index up to, but not including, the element at the specified stop index.

For example, if the original list is {{dataArray}}, the start index is {{start}}, and the stop index is {{stop}}, the slicing will start at index {{start}} and continue until it reaches the element at index {{stop}} (exclusive). The resulting list will be a sublist of {{dataArray}} starting from index {{start}} up to, but not including, the element at index {{stop}}.

To summarize:
- The start index is explicitly provided as {{start}}, indicating the starting position for slicing (inclusive).
- The stop index is explicitly provided as {{stop}}, indicating the position at which the slicing should stop (exclusive).
- The step is omitted and defaults to 1, indicating forward movement through the list.
- The resulting list will be a sublist of the original list, starting from the specified start index and continuing up to, but not including, the element at the specified stop index.`,
  };
  
  export default explanations;