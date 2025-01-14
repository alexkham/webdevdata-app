export const title="permutations"
export const code=`
// Function to check if two strings are permutations of each other
int strings_are_permutation(char a[], char b[]) {
    // Step 1: Initialize counter arrays for each alphabet letter to zero
    int a_counters[26] = {0}, b_counters[26] = {0}, result = 1; 
    
    // Step 2: Count frequency of each character in string a
    int i = 0;
    while (a[i] != '\0') { // Continue until the end of string a is reached
        a_counters[a[i] - 'a']++; // Increment the counter at the index corresponding to the character
        i++; // Move to the next character
    }

    // Reset index for string b counting
    i = 0;
    // Step 3: Count frequency of each character in string b
    while (b[i] != '\0') { // Continue until the end of string b is reached
        b_counters[b[i] - 'a']++; // Increment the counter at the index corresponding to the character
        i++; // Move to the next character
    }

    // Step 4: Compare the frequency of each character in a_counters and b_counters
    for (i = 0; i < 26; i++) { // Iterate over each letter of the alphabet
        if (a_counters[i] != b_counters[i]) { // If the count of any character doesn't match
            // Print the character and its frequency in both strings
            printf("Problem: character %c in a: %d vs b: %d\n", 'a' + i, a_counters[i], b_counters[i]);
            result = 0; // Indicate that strings are not permutations of each other
        }
    }

    // Step 5: Return the result
    return result; // 1 if strings are permutations, 0 otherwise
}

`

// export const mermaid=`
// graph TD
//     Start([Start]) --> InitCounters[Initialize Count Arrays]
//     InitCounters --> CountA[Count characters in string A]
//     CountA --> CountB[Count characters in string B]
//     CountB --> Compare[Compare Counters]
//     Compare --> Match{Do counts match for all?}
//     Match -->|Yes| EndTrue([End - True])
//     Match -->|No| Print[Print discrepancies]
//     Print --> EndFalse([End - False])

// `

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
The way the code checks if two strings are permutations of each other is based on the principle that two strings are permutations if they have the same character frequencies. Here's a step-by-step explanation of how it does this:
&nbsp;

&nbsp;
1. The function uses two arrays "a_counters" and "b_counters" to count the frequency of each letter in the strings "a" and "b", respectively. Each array has 26 elements corresponding to the 26 letters of the English alphabet.

&nbsp;

2. The function then iterates over the first string "a". For each character "a[i]", it finds the corresponding index for the letter by subtracting the ASCII value of 'a' from the ASCII value of the character. This effectively maps 'a' to index 0, 'b' to index 1, and so on, up to 'z' at index 25.

&nbsp;

3. At each iteration, the function increments the value at the index of "a_counters" corresponding to the letter. This is done with "a_counters[a[i] - 'a']++". As a result, "a_counters" will contain the frequency of each letter in the string "a".

&nbsp;

4. The same process is repeated for the second string "b" using "b_counters".

&nbsp;

5. After populating "a_counters" and "b_counters", the function compares the frequencies recorded in these arrays. It iterates over each element of the counters using a for loop that goes from 0 to 25.

&nbsp;

6. Within the for loop, if the function finds a frequency in "a_counters" that does not match the corresponding frequency in "b_counters" (i.e., "a_counters[i] != b_counters[i]"), it means the strings cannot be permutations of each other. It prints out the character (reconstituted by adding 'a' to the index "i"), and its counts in both strings, then sets "result" to "0".

&nbsp;

7. Finally, the function returns the value of "result". If "result" is still "1" at the end of the function, it means no discrepancies were found, and the strings are permutations of each other. If "result" is "0", it indicates that there was at least one character with a mismatched frequency, and therefore, the strings are not permutations.

&nbsp;

This algorithm assumes that the input strings contain only lowercase alphabetic characters ('a' through 'z'). If there are other characters or uppercase letters, the function would not work correctly without modification.

`