const dataTypes = {
    "core_types": [
      {
        "data_type": "void",
        "size": "0 bytes",
        "range": "N/A",
        "usage": "No return value"
      },
      {
        "data_type": "char",
        "size": "1 byte",
        "range": "-128 to 127",
        "usage": "Single characters"
      },
      {
        "data_type": "unsigned char",
        "size": "1 byte", 
        "range": "0 to 255",
        "usage": "Single characters"
      },
      {
        "data_type": "short",
        "size": "2 bytes",
        "range": "-32,768 to 32,767",
        "usage": "Small integers"
      },
      {
        "data_type": "unsigned short",
        "size": "2 bytes",
        "range": "0 to 65,535",
        "usage": "Small integers"
      },
      {
        "data_type": "int",
        "size": "4 bytes",
        "range": "-2,147,483,648 to 2,147,483,647",
        "usage": "Integer values"
      },
      {
        "data_type": "unsigned int",
        "size": "4 bytes",
        "range": "0 to 4,294,967,295",
        "usage": "Positive integers"
      },
      {
        "data_type": "long",
        "size": "4-8 bytes",
        "range": "Platform dependent",
        "usage": "Large integers"
      },
      {
        "data_type": "unsigned long",
        "size": "4-8 bytes",
        "range": "Non-negative values",
        "usage": "Large positive integers"
      },
      {
        "data_type": "float",
        "size": "4 bytes",
        "range": "±3.4E±38",
        "usage": "Single-precision decimals"
      },
      {
        "data_type": "double",
        "size": "8 bytes",
        "range": "±1.7E±308",
        "usage": "Double-precision decimals"
      },
      {
        "data_type": "long double",
        "size": "80-128 bits",
        "range": "Platform dependent",
        "usage": "Extended precision decimals"
      },
      {
        "data_type": "_Decimal32",
        "size": "32 bits",
        "range": "7 decimal digits",
        "usage": "Base-10 arithmetic"
      },
      {
        "data_type": "_Decimal64",
        "size": "64 bits",
        "range": "16 decimal digits",
        "usage": "Base-10 arithmetic"
      },
      {
        "data_type": "_Decimal128",
        "size": "128 bits",
        "range": "34 decimal digits",
        "usage": "Base-10 arithmetic"
      }
    ],
    "memory_size_types": [
      {
        "data_type": "size_t",
        "size": "Platform specific",
        "range": "Non-negative values",
        "usage": "Array indices/memory sizes"
      },
      {
        "data_type": "ssize_t",
        "size": "Platform specific",
        "range": "Includes negative values",
        "usage": "Signed size operations"
      },
      {
        "data_type": "ptrdiff_t",
        "size": "Platform specific",
        "range": "Signed values",
        "usage": "Pointer arithmetic"
      },
      {
        "data_type": "fpos_t",
        "size": "Implementation defined",
        "range": "File positions",
        "usage": "File positioning"
      },
      {
        "data_type": "div_t",
        "size": "Structure",
        "range": "Quotient and remainder",
        "usage": "Division results"
      },
      {
        "data_type": "ldiv_t",
        "size": "Structure",
        "range": "Long division results",
        "usage": "Long division operations"
      }
    ],
    "pointer_types": [
      {
        "data_type": "void *",
        "size": "4-8 bytes",
        "range": "Any address",
        "usage": "Generic pointer"
      },
      {
        "data_type": "char *",
        "size": "4-8 bytes",
        "range": "Character array address",
        "usage": "String operations"
      },
      {
        "data_type": "const char *",
        "size": "4-8 bytes",
        "range": "Read-only address",
        "usage": "Immutable strings"
      },
      {
        "data_type": "void **",
        "size": "4-8 bytes",
        "range": "Pointer address",
        "usage": "Dynamic allocation"
      },
      {
        "data_type": "int *",
        "size": "4-8 bytes",
        "range": "Integer address",
        "usage": "Integer pointer"
      },
      {
        "data_type": "unsigned int *",
        "size": "4-8 bytes",
        "range": "Unsigned address",
        "usage": "Unsigned integer pointer"
      },
      {
        "data_type": "const void *",
        "size": "4-8 bytes",
        "range": "Read-only address",
        "usage": "Immutable pointer"
      },
      {
        "data_type": "char **",
        "size": "4-8 bytes",
        "range": "String array address",
        "usage": "String array pointer"
      }
    ],
    "special_types": [
      {
        "data_type": "time_t",
        "size": "Usually 8 bytes",
        "range": "Epoch based",
        "usage": "Time representation"
      },
      {
        "data_type": "clock_t",
        "size": "Implementation defined",
        "range": "CPU time units",
        "usage": "CPU time measurement"
      },
      {
        "data_type": "off_t",
        "size": "Platform specific",
        "range": "File sizes",
        "usage": "File offsets"
      },
      {
        "data_type": "wchar_t",
        "size": "2-4 bytes",
        "range": "Wide characters",
        "usage": "Unicode support"
      },
      {
        "data_type": "time64_t",
        "size": "64 bits",
        "range": "Extended epoch",
        "usage": "Extended time storage"
      },
      {
        "data_type": "va_list",
        "size": "Implementation defined",
        "range": "Variable arguments",
        "usage": "Variadic functions"
      },
      {
        "data_type": "FILE *",
        "size": "4-8 bytes",
        "range": "File handle",
        "usage": "File operations"
      }
    ]
  };

  export default dataTypes;