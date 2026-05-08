# Vue Tutorial

Vue.js 公式チュートリアルの各ステップをローカルで実行するためのリポジトリです。

画面ではステップごとのプレビューだけを表示します。解説は各ステップの「公式ドキュメント」リンクから日本語版の公式チュートリアルを参照してください。

## セットアップ

```sh
npm run install:locked
```

`npm` はプロジェクトの `.npmrc` で新規公開パッケージのクールダウンを 7 日に設定しています。公開直後の依存をすぐ使いたい場合は、インストールに失敗することがあります。

`.nvmrc` に実行環境の Node.js バージョンを記載しています。

## 起動

```sh
npm run dev
```

起動後、ブラウザーで次を開きます。

```txt
http://127.0.0.1:5173/
```

特定のステップを直接開く場合は `step` クエリを指定します。

```txt
http://127.0.0.1:5173/?step=10
```

## 進め方

各ステップの変更前コードは `src/tutorial/step-XX/App.vue` にあります。

例:

```txt
src/tutorial/step-10/App.vue
```

子コンポーネントを使うステップでは、同じディレクトリ内の `ChildComp.vue` も編集対象です。

## コマンド

```sh
npm run install:locked  # lockfile に従って依存を安全寄りに導入
npm run audit:deps      # 依存の脆弱性を確認
npm run dev      # 開発サーバーを起動
npm run build    # 本番ビルドを確認
```

## チュートリアルソースの再取り込み

公式日本語ドキュメントのチュートリアルソースを取得済みのディレクトリから再取り込みする場合は、次のコマンドを使います。

```sh
npm run import:tutorial -- /path/to/docs-ja/src/tutorial/src
```
