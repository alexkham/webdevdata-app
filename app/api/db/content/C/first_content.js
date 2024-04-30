export const code=
`
#include <string.h>

/* Reverses string s[] in place */
void reverse(char s[]) {
    int c, i, j;
    for (i = 0, j = strlen(s) - 1; i < j; i++, j--) {
        c = s[i];
        s[i] = s[j];
        s[j] = c;
    }
}

`

export const mermaid=`
flowchart TD
    Start("Start Reversal")
    Initialize("Initialize i, j, c")
    Check("Condition: i < j?")
    Swap("Swap s[i] and s[j]")
    Increment("Increment i by 1")
    Decrement("Decrement j by 1")
    End("End Reversal")

    Start --> Initialize
    Initialize --> Check
    Check -- Yes --> Swap
    Swap --> Increment
    Increment --> Decrement
    Decrement --> Check
    Check -- No --> End

`

export const markdown=`
### Detailed Explanation of the "reverse" Function
&nbsp;

This function is designed to reverse a string array "s[]" in place. The reversal is achieved by swapping characters from both ends of the string and moving towards the middle. Here's a breakdown of how the function operates:

&nbsp;

1. **Function Signature**
   - "void reverse(char s[])": The function "reverse" takes a single argument, "s[]", which is a character array or string.
&nbsp;
&nbsp;



&nbsp;
&nbsp;



2. **Variable Initialization**
   - "int c, i, j;": Three variables are declared at the beginning of the function.
       - "c" is used as a temporary storage for character swapping.
       - "i" is initialized to 0, starting at the beginning of the string.
       - "j" is initialized to strlen(s) - 1, which points to the last character of the string.
&nbsp;

 
&nbsp;    

3. **Swapping Logic**
   - A "for" loop is set up with the condition "i < j", which continues as long as the starting index is less than the ending index.
       - "c = s[i]": The character at the current start index is stored in "c".
       - "s[i] = s[j]": The character at the current end index is moved to the current start index.
       - "s[j] = c": The character originally at the start index (now stored in "c") is moved to the current end index.
       &nbsp;

 
       &nbsp;    
4. **Loop Operation**
   - The loop increments "i" and decrements "j" with each iteration ("i++" and "j--"), effectively moving the indices towards the center of the string.
   - This process continues until "i" and "j" meet or cross each other, ensuring that all characters in the string are swapped with their counterpart from the other end.
   &nbsp;

 
   &nbsp;    
5. **End of Function**
   - The function completes once the loop exits, at which point the string "s[]" has been completely reversed in place.
&nbsp;

 
&nbsp;    
6. **Function Usage**
   - To use this function, a user needs to provide a mutable string array. The function will reverse the characters of this string without returning any value, as the operation modifies the original string directly.

`