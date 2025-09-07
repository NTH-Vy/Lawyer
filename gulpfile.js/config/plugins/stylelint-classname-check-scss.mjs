import stylelint from 'stylelint';
import classDictionary from '../fcdic-classes.mjs';

// Create a Set for faster lookup
const classWordsSet = new Set(classDictionary.map(word => word.toLowerCase()));

const classnameCheckScss = stylelint.createPlugin('plugin/classname-check-scss', (isEnabled) => {
  return (root, result) => {
    if (isEnabled == false) return;
    console.log('Class name check plugin is running...');

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
          
          // Check if word exists in our class dictionary
          if (classWordsSet.has(lowerWord)) {
            continue; // Skip if found in dictionary
          }
          
          // If we get here, the word is not in our class dictionary - report it
          stylelint.utils.report({
            ruleName: 'plugin/classname-check-scss',
            result,
            node: rule,
            message: `Unexpected word "${word}" in class name "${fullClassName}"`
          });
        }
      });
    });
  };
});

export default classnameCheckScss;
