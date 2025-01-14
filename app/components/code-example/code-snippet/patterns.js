// patterns.js
export const patterns = {
    keyword: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,
    type: /\b(bool|size_t|int8_t|uint8_t|int16_t|uint16_t|int32_t|uint32_t|int64_t|uint64_t)\b/g,
    string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
    number: /\b\d+\b|\b0x[0-9a-fA-F]+\b/g,
    comment: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
    preprocessor: /#[a-zA-Z]+/g,
    function: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g,
    operator: /[+\-*/%=<>!&|^~?:]+/g
  };