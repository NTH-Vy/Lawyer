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
    // ファイル名を取得して表示
    const fileName = result.root.source.input.from || 'unknown';
    console.log('Spell check plugin is running...:', fileName);

    // Track processed class names to avoid duplicates
    const processedClasses = new Set();

    root.walkRules(rule => {
      
      // 属性セレクタ内のカンマを保護してから分割
      const protectedSelector = rule.selector.replace(/\[[^\]]+\]/g, (match) => {
        return match.replace(/,/g, '___FCGULP-COMMA___');
      });
      
      // 改行を除去してカンマで分割
      const normalizedSelector = protectedSelector.replace(/[\r\n]+/g, ' ').trim();
      const individualSelectors = normalizedSelector.split(',').map(s => s.trim());
      
      // 各セレクタからクラス名を抽出
      const allClassNames = [];
      individualSelectors.forEach(selector => {
        // 保護されたカンマを元に戻す
        const restoredSelector = selector.replace(/___FCGULP-COMMA___/g, ',');

        // より包括的なクラス名抽出の正規表現
        // 1. 通常のクラス名: .class-name
        // 2. 属性セレクタ内のクラス名: [class~="class-name"]
        // 3. ネスト記法: &__element, &--modifier
        // 4. 複合セレクタ: .class-name::before, .class-name:hover
        const classNames = restoredSelector.match(/(?:\.([a-zA-Z0-9_-]+)(?![a-zA-Z0-9_:])|\[class~="([^"]+)"\]|&[a-zA-Z0-9_-]+)/g) || [];
        
        // マッチした結果からクラス名を抽出
        const extractedClassNames = classNames.map(match => {
          // .class-name の形式の場合
          if (match.startsWith('.')) {
            return match;
          }
          // [class~="class-name"] の形式の場合
          if (match.startsWith('[class~="')) {
            return '.' + match.match(/\[class~="([^"]+)"\]/)[1];
          }
          // &__element や &--modifier の形式の場合
          if (match.startsWith('&')) {
            return match; // &のまま返す（後で処理）
          }
          return match;
        });
        
        allClassNames.push(...extractedClassNames);
      });

      allClassNames.forEach(fullClassName => {
        // Skip if already processed
        if (processedClasses.has(fullClassName)) {
          return;
        }
        
        // Mark as processed
        processedClasses.add(fullClassName);

        // Remove the leading dot and split by delimiters
        const words = fullClassName.slice(1).split(/[-_]+/).filter(word => word.length > 0);

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