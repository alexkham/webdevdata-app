// tokenizer.js
import { patterns } from './patterns';

export const tokenize = (code) => {
  const tokens = [];
  let currentPosition = 0;
  let remainingCode = code;

  while (currentPosition < code.length) {
    let match = null;
    let tokenType = null;
    let earliestIndex = Infinity;

    for (const [type, pattern] of Object.entries(patterns)) {
      pattern.lastIndex = 0;
      const currentMatch = pattern.exec(remainingCode);
      if (currentMatch && currentMatch.index < earliestIndex) {
        earliestIndex = currentMatch.index;
        match = currentMatch;
        tokenType = type;
      }
    }

    if (earliestIndex > 0) {
      tokens.push({
        type: 'text',
        content: remainingCode.slice(0, earliestIndex)
      });
      currentPosition += earliestIndex;
    }

    if (match) {
      tokens.push({
        type: tokenType,
        content: match[0]
      });
      currentPosition += match[0].length;
      remainingCode = code.slice(currentPosition);
    } else {
      if (remainingCode) {
        tokens.push({
          type: 'text',
          content: remainingCode
        });
      }
      break;
    }
  }

  return tokens;
};