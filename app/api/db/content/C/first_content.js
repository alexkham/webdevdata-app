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
    Start("Begin the reversal process")
    Initialize("Initialize i=0, j=length of string minus one, use c for character storage")
    Check("Check if i is less than j. If yes, continue; if no, end.")
    Swap("Exchange characters at positions i and j using c")
    Increment("Move index i forward by one position")
    Decrement("Move index j backward by one position")
    End("Reversal is complete when i meets or exceeds j")

    Start --> Initialize
    Initialize --> Check
    Check -- Yes --> Swap
    Swap --> Increment
    Increment --> Decrement
    Decrement --> Check
    Check -- No --> End

`

