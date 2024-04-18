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

