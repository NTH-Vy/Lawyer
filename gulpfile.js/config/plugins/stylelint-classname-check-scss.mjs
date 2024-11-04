import stylelint from 'stylelint';
import spelling from 'spelling';
import  * as classDictionary  from '../fcdic-classes.js';
const classChecker = new spelling(classDictionary.default);

const classnameCheckScss = stylelint.createPlugin('plugin/classname-check-scss', () => {
  return (root, result) => {
    root.walkRules(rule => {
      // セレクタからクラス名を抽出する正規表現
      const classNames = rule.selector.match(/\.[a-zA-Z0-9_-]+/g) || [];

      // クラス名を区切り文字で分割し、各単語をチェック
      classNames.forEach(fullClassName => {
        const words = fullClassName.slice(1).split(/[-_]/); // `.`を除いて分割

        words.forEach(word => {
          // 各単語をスペルチェック
          const checked = classChecker.lookup(word);
          if (!checked.found) {
            result.warn(`Unexpected word "${word}" in class name "${fullClassName}"`, {
              node: rule,
              stylelintType: 'invalid-classname-check'
            });
          }
        });
      });
    });
  };
});

export default classnameCheckScss;
