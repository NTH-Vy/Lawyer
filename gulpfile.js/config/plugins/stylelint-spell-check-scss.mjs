import stylelint from 'stylelint';
import spelling from 'spelling';
import  * as spellDictionary  from '../fcdic-spellings.js';
const spellChecker = new spelling(spellDictionary.default);

const spellCheckScss = stylelint.createPlugin('plugin/spell-check-scss', () => {
  return (root, result) => {
    root.walkRules(rule => {
      // セレクタからクラス名を抽出する正規表現
      const classNames = rule.selector.match(/\.[a-zA-Z0-9_-]+/g) || [];

      // クラス名を区切り文字で分割し、各単語をチェック
      classNames.forEach(fullClassName => {
        const words = fullClassName.slice(1).split(/[-_]/); // `.`を除いて分割

        words.forEach(word => {
          // 各単語をスペルチェック
          const checked = spellChecker.lookup(word);
          if (!checked.found) {
            result.warn(`Misspelled word "${word}" in class name "${fullClassName}"`, {
              node: rule,
              stylelintType: 'invalid-spell-check'
            });
          }
        });
      });
    });
  };
});

export default spellCheckScss;
