export const typeExplanations = {
    // Core types
    void: 'Type that indicates no return value',
    char: 'Integer type for storing single characters (1 byte, -128 to 127)',
    'unsigned char': 'Integer type for single characters (1 byte, 0 to 255)',
    short: 'Small integer type (2 bytes, -32,768 to 32,767)', 
    'unsigned short': 'Small integer type (2 bytes, 0 to 65,535)',
    int: 'Integer type (typically 4 bytes, -2,147,483,648 to 2,147,483,647)',
    'unsigned int': 'Integer type (typically 4 bytes, 0 to 4,294,967,295)',
    long: 'Large integer type (4 or 8 bytes platform dependent)',
    'unsigned long': 'Large integer type (4 or 8 bytes, non-negative values)',
    float: 'Single-precision floating point (±3.4E±38, ~7 decimal digits)',
    double: 'Double-precision floating point (±1.7E±308, ~15 decimal digits)',
   
    // Memory/size types  
    'size_t': 'Platform-specific unsigned type for array indices and memory sizes.',
    'const time_t *': 'A pointer to a constant `time_t` object, representing time as the number of seconds since the epoch (00:00:00 UTC, January 1, 1970). The data it points to cannot be modified.',

    'ssize_t': 'Signed version of size_t, can represent -1 for errors',
    'nl_catd': 'A data type representing a message catalog descriptor, used to identify and access message catalogs in functions like `catopen`, `catgets`, and `catclose`.',

    'ptrdiff_t': 'Type to represent pointer subtractions and array differences',
    'div_t': 'A structure type returned by the `div` function, containing two members: `quot` (the quotient) and `rem` (the remainder) of an integer division.',

    'wint_t': 'An integer type capable of storing any wide character value or the special value WEOF, used in wide-character input/output functions.',
    'fpos_t': 'A data type capable of representing a file position, including any additional state information required to uniquely identify a location within a file. Typically used with functions like `fgetpos` and `fsetpos`.'
,
'wctype_t': 'A data type used to represent a character classification descriptor. This descriptor is used with functions like `iswctype` to test wide characters against specific character classes.'
,
'...': 'Represents a variable number of arguments in a function. Used in functions like `printf` or `fprintf` to accept additional parameters beyond those explicitly declared.'
,

   
    // Pointer types
    'void *': 'New Generic pointer that can point to any data type',
    "T": "Represents a placeholder for a specific type (e.g., `int`, `double`, `char *`) used in variadic functions with macros like `va_arg`. The actual type must match the argument being accessed.",
"va_list": "A data type used to hold information about variable arguments passed to a variadic function. It is initialized with `va_start`, used with `va_arg`, and cleaned up with `va_end`."
,
    "wctrans_t": "A data type representing a character mapping descriptor used for wide-character transformations. It is typically obtained using the `wctrans` function to specify transformations like `tolower` or `toupper` for wide characters."
,
    "time64_t": "A 64-bit integer type representing the number of seconds since the epoch (00:00:00 UTC, January 1, 1970). Used for systems requiring extended date ranges beyond the limitations of 32-bit `time_t`.",
"time64_t *": "A pointer to a `time64_t` object, used to store or retrieve 64-bit timestamps. Commonly passed to functions handling 64-bit time values, allowing indirect modification."
,
    "char **": "A pointer to a pointer to a null-terminated string. Commonly used in functions like `strtol` and `strtok_r` to store the address of the first invalid character or to maintain state across function calls."
,
    "_Decimal32": "A decimal floating-point type that occupies 32 bits. Supports base-10 arithmetic with 7 decimal digits of precision.",
    "_Decimal64": "A decimal floating-point type that occupies 64 bits. Supports base-10 arithmetic with 16 decimal digits of precision.",
    "_Decimal128": "A decimal floating-point type that occupies 128 bits. Supports base-10 arithmetic with 34 decimal digits of precision."
,
    "void (*)(int)": "A pointer to a function that takes an `int` as an argument and returns no value. Commonly used for signal handlers that process signals like `SIGINT` or `SIGTERM`."
,
    "regmatch_t *": "A pointer to an array of `regmatch_t` structures, where each structure represents a match with fields for the starting and ending positions of the substring matched by a regular expression."
,
    "const regex_t *": "A pointer to a constant `regex_t` structure representing a compiled regular expression. The `const` qualifier ensures the structure cannot be modified through this pointer."
,
    "regex_t *": "A pointer to a `regex_t` structure used for storing a compiled regular expression. This structure is required by POSIX regex functions like `regcomp`, `regexec`, and `regfree`."
,
    "unsigned int *": "A pointer to an unsigned integer, allowing indirect access to a variable that holds non-negative values (0 to 4,294,967,295 on most platforms). Commonly used for updating or referencing data without copying it."
,
    "wchar_t": "A data type used to represent wide characters, typically supporting larger character sets such as Unicode. Its size is platform-dependent but is often 2 or 4 bytes."
,
    "long double": "A floating-point type with extended precision, typically larger than `double` and used for high-precision arithmetic. The size and precision depend on the platform but are often 80 or 128 bits."
,
    "mbstate_t *": "A pointer to an `mbstate_t` object that represents the current shift state for multibyte to wide character conversions. This pointer allows modification of the state during the conversion process."
,
    "const char **": "A pointer to a pointer to a constant multibyte string. The inner pointer may be updated by functions to point to the next unprocessed character, but the string data itself cannot be modified."
,
    "const mbstate_t *": "A pointer to a constant `mbstate_t` object representing the current shift state for multibyte to wide character conversions. The pointed-to state cannot be modified through this pointer."
,
    "jmp_buf": "A data type used by the `setjmp` and `longjmp` functions to store information about the program’s environment, including the stack, register states, and instruction pointer, allowing for non-local jumps in program execution."
,
    "struct lconv": "A structure type containing locale-specific information, such as decimal point, thousands separator, and currency symbols.",
"struct lconv *": "A pointer to a `struct lconv`, used to access locale-specific information returned by functions like `localeconv`."
,
    "ldiv_t": "A structure type returned by the `ldiv` function, containing two members: `quot` (the quotient) and `rem` (the remainder) of a long integer division.",
"long int": "Integer type typically larger than `int`, used for storing large numeric values (platform-dependent size, commonly 4 or 8 bytes)."
,
    'const wchar_t *': 'A pointer to a read-only wide-character string, where each character is of type `wchar_t`. Used for representing text in wide-character encoding to support extended character sets, such as Unicode. The string is null-terminated, with the terminator being a `wchar_t` with value 0.'
,
    
    'wchar_t *': 'A pointer to a wide-character string, where each element is of type `wchar_t`. Used for representing text in wide-character encoding to support extended character sets.'
,
    'void (*)(void)': 'Pointer to a function that takes no arguments and returns no value',

    'char *': 'String pointer (array of characters)',
    'struct tm *': 'A pointer to a `struct tm`, which represents a broken-down calendar time. The structure contains fields such as year, month, day, hour, minute, and second for representing human-readable time.'
,
    'fpos_t *': 'A pointer to an `fpos_t` object, used to store or set a file position in functions like `fgetpos` and `fsetpos`. It allows the file position to be manipulated and reused.'
,
'const fpos_t *': 'A pointer to a constant `fpos_t` object, used to store or set a file position. The `const` qualifier ensures that the pointed-to position cannot be modified through this pointer.'
,
    'const char *': 'Pointer to read-only string',
    'FILE *': 'Pointer to FILE structure for file operations',
    'void**': 'Pointer to a pointer (used for dynamic memory allocation)',
    'int *': 'A pointer to an integer, allowing indirect access to a variable of type `int`. Used to read or modify the value stored at the memory address it points to.'
,

    'const void *': 'A pointer to a constant memory location of unspecified type. The pointed-to data cannot be modified through this pointer.',
    'int (*)(const void *, const void *)': 'Pointer to a function that takes two constant void pointers as arguments and returns an integer, typically used to compare two elements.',


    'const struct tm *': 'Pointer to a constant `struct tm`, which represents broken-down time values including year, month, day, hour, minute, and second.',
   
    // Special types
    'time_t': 'Integer type for timestamps (seconds since epoch)',
    'clock_t': 'Integer type for CPU time measurements',
    'off_t': 'Integer type for file offsets and sizes'
   };