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

# Prime Numbers: An In-Depth Look with Examples

Prime numbers are the building blocks of the integers, fascinating mathematicians for their unique properties and the pivotal role they play in various mathematical fields. Below is a structured overview focusing on definitions, methods, and special types of primes, supplemented with examples.

## What Are Prime Numbers?

- **Definition**: A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.
- **Examples**: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...

## Identifying Prime Numbers

- **Small Numbers**: Check divisibility by integers up to the square root of the number.
  - *Example*: To check if 29 is prime, we only need to test divisibility by numbers up to √29 (which is about 5.4). Since 29 is not divisible by 2, 3, or 5, it is prime.
- **Sieve of Eratosthenes**:
  1. List numbers from 2 to your limit.
  2. Mark multiples of 2, then 3, 5, and so on up to the square root of the limit.
  3. Unmarked numbers are primes.
  - *Example*: Finding primes up to 10, we mark multiples of 2 (4, 6, 8, 10), then 3 (6, 9), leaving 2, 3, 5, 7 as primes.
- **Miller-Rabin Test** (probabilistic):
  - Useful for large numbers, providing a high probability that a number is prime.
  - *Example*: Not easily illustrated due to its complexity but is exceptionally efficient for large numbers.

## Prime Number Theorem

- Describes the asymptotic distribution of primes, showing that primes become less frequent as numbers increase but there are infinitely many.
- **Formula**: The number of primes less than \(n\) is approximately \(\frac{n}{\ln(n)}\).

## Special Types of Prime Numbers

- **Mersenne Primes**: Of the form \(2^p - 1\).
  - *Example*: \(2^3 - 1 = 7\).
- **Fermat Primes**: Of the form \(2^{2^n} + 1\).
  - *Example*: \(2^{2^2} + 1 = 17\).
- **Twin Primes**: Pairs of primes that are two units apart.
  - *Examples*: (3, 5), (11, 13), (17, 19).

## Applications of Prime Numbers

- **Cryptography**: RSA encryption relies on the difficulty of factoring large primes.
- **Number Theory**: The Fundamental Theorem of Arithmetic, stating every integer greater than 1 is either a prime or a product of primes in a unique way.

## Open Questions and Conjectures

- **Riemann Hypothesis**: Relates the distribution of prime numbers to the zeros of the Riemann zeta function.
- **Twin Prime Conjecture**: Suggests there are infinitely many pairs of twin primes.

## Conclusion

Prime numbers are a central topic in mathematics, offering a rich field of study from basic arithmetic to advanced number theory and cryptography. Through examples and structured explanations, we gain insight into their properties, methods of identification, special cases, and their indispensable role in mathematics and beyond. As we explore primes, we not only delve into the heart of mathematical inquiry but also encounter the beauty and mystery that fuel the pursuit of knowledge in this ancient and ever-evolving discipline.



`