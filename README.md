# プロジェクト概要

このテンプレートは、株式会社ファストコーディングが開発したGulpベースのフロントエンド開発環境です。npm（Node.jsパッケージマネージャー）でインストール・管理されるGulpとそのプラグインを使用しています。安定版のNode.js 20.***以上が必要です。

## セットアップ

### 依存関係のインストール

以下のコマンドを実行してください：

```sh
npm install
```

### 開発モードの開始

ファイルをビルドして本番環境用に準備し、`dist`フォルダに出力します。
また、デフォルトのWebブラウザが自動的に起動し、現在のコーディングを表示し、`src`フォルダの変更を監視します。
画像の最適化とLintチェックも実行されます。

```sh
npm run dev
```

### 本番ビルド

ファイルをビルドして本番環境用に準備し、`dist`フォルダに出力します。
画像の最適化とLintチェックも実行されます。

```sh
npm run build
```

## 画像の最適化

開発完了後や、画像ファイルを再度圧縮したい場合に使用してください：

```sh
npm run imagemin
```

**注意**: 画像の最適化には`gulp-imagemin`プラグインとその関連プラグイン（mozjpeg、pngquant、svgo、optipng、gifsicle）を使用しています。

### WEBP形式への変換

画像（jpg、png）をWEBP形式に変換する場合：

```sh
npm run imagewebp
```

## Lintチェック

開発完了後や、Lintの問題を再度チェックしたい場合に使用してください：

```sh
npm run lint
```

可能な限り自動的にLintの問題を修正する場合：

```sh
npm run lint:fix
```

## ファイルの最適化設定

### HTMLファイルの最適化

HTMLファイルを最適化するには、`gulpfile.js/config/index.mjs`ファイルの`html: {...}`ブロック内の`minify: false`オプションを`true`に変更してください：

```sh
html: {
  ...
  options: {
    minify: true
  }
},
```

### CSSファイルの最適化

CSSファイルを最適化するには、`gulpfile.js/config/index.mjs`ファイルの`css: {...}`ブロック内の`minify: false`オプションを`true`に変更してください：

```sh
css: {
  ...
  options: {
    minify: true
  }
},
```

### JavaScriptファイルの最適化

JavaScriptファイルを最適化するには、`gulpfile.js/config/index.mjs`ファイルの`js: {...}`ブロック内の`minify: false`オプションを`true`に変更してください：

```sh
js: {
  ...
  options: {
    minify: true
  }
},
```

## TypeScriptの使用

TypeScriptを使用する場合は、`gulpfile.js/config/index.mjs`ファイルで以下のように指定してください：

```sh
{
  useTypescript: true
}
```
