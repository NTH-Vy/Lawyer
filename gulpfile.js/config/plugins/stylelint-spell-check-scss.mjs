import stylelint from 'stylelint';
import { words } from 'popular-english-words';
import spellDictionary from '../fcdic-spellings.mjs';

// Combine common English words with custom dictionary
let commonWords = words.getAll();

// Create a Set for faster lookup
const customWordsSet = new Set(spellDictionary.map(word => word.toLowerCase()));
const commonWordsSet = new Set(commonWords.map(word => word.toLowerCase()));

// Combine both sets
const allWordsSet = new Set([...commonWordsSet, ...customWordsSet]);
const allWords = Array.from(allWordsSet);

const spellCheckScss = stylelint.createPlugin('plugin/spell-check-scss', (isEnabled) => {
  return (root, result) => {
    if (isEnabled == false) return;
    console.log('Spell check plugin is running...');

    // Track processed class names to avoid duplicates
    const processedClasses = new Set();

    root.walkRules(rule => {
      // Extract class names from selectors (exclude pseudo-classes and pseudo-elements)
      const classNames = rule.selector.match(/\.[a-zA-Z0-9_-]+(?![:(])/g) || [];

      classNames.forEach(fullClassName => {
        // Skip if already processed
        if (processedClasses.has(fullClassName)) {
          return;
        }
        
        // Mark as processed
        processedClasses.add(fullClassName);

        // Remove the leading dot and split by delimiters
        const words = fullClassName.slice(1).split(/[-_]/);

        for (const word of words) {
          // Skip empty words
          if (!word || word.trim() === '') {
            continue;
          }
          
          // Skip numbers only
          if (/^[0-9]+$/.test(word)) {
            continue;
          }
          
          // Skip special characters only
          if (/^[^a-zA-Z0-9]+$/.test(word)) {
            continue;
          }
          
          const lowerWord = word.toLowerCase();
          
          // Check if word exists in our combined dictionary
          if (allWordsSet.has(lowerWord)) {
            continue; // Skip if found in dictionary
          }
          
          // If we get here, the word is not in our dictionary - report it
          stylelint.utils.report({
            ruleName: 'plugin/spell-check-scss',
            result,
            node: rule,
            message: `Wrong spelling "${word}" in class name "${fullClassName}"`
          });
        }
      });
    });
  };
});

export default spellCheckScss;