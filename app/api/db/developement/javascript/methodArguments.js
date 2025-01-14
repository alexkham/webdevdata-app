export const methodArguments = {
    'concat': 1, 'copyWithin': 3, 'entries': 0, 'every': 1, 'fill': 3,
    'filter': 1, 'find': 1, 'findIndex': 1, 'flat': 1, 'flatMap': 1,
    'forEach': 1, 'includes': 1, 'indexOf': 1, 'join': 1, 'keys': 0,
    'lastIndexOf': 1, 'map': 1, 'pop': 0, 'push': 1, 'reduce': 1,
    'reduceRight': 1, 'reverse': 0, 'shift': 0, 'slice': 2, 'some': 1,
    'sort': 1, 'splice': 2, 'toLocaleString': 0, 'toString': 0, 'unshift': 1,
    'at': 1, 'values': 0, 'length': 0, // Length is a property, not a method, included for completeness
    // Methods below are not typical array methods, but included for exhaustive coverage
    'constructor': 0, 'isArray': 1, 'from': 1, 'of': 1, 'toStringTag': 0,
};
