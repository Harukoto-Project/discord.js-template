# コントリビュートについて

IssueとPull Requestを歓迎します。

## 開発環境

- OS: Windows / macOS / Linux
- 言語: TypeScript
- パッケージマネージャー: pnpm
- Node.js: v24

## 提出前の確認

- `pnpm check` — Prettierの差分がないかを確認します。
- `pnpm run build:tsc` — TypeScriptをコンパイルします。型エラーもここで分かります。
- `pnpm run build:aliases` — `tsconfig.json`のパスエイリアスを、コンパイル後のJavaScriptへ反映します。

## バグ報告

次の情報があると調査しやすくなります。

- 使ったNode.jsのバージョンと、実行したコマンド（`pnpm start`または`pnpm dev`）
- `NODE_ENV`が`development`かどうか
- 再現手順と、実行したコマンドの種類（チャット入力、メッセージのコンテキストメニュー、ユーザーのコンテキストメニュー、オートコンプリート）
- 期待した応答と、実際の応答または無応答
- `logs/latest.log`の該当箇所。Botトークン、`.env`の値、ユーザーIDは伏せてください
- 関係するファイル（`src/app/commands`、`src/app/events`、`locales/ja_jp.yml`）と、設定した`isAdminOnly`、`requiredPermissions`、`ephemeral`
- Developer Portalで有効にしているPrivileged Gateway Intent。このBotは`MessageContent`を要求します
- 起動ログに、グローバルコマンド登録の成功または失敗が出ているか

## セキュリティ上の問題

セキュリティに関わる問題は公開Issueではなく、GitHubのSecurity Advisory(Report a vulnerability)から非公開で報告してください。

## ライセンス

コントリビュートされた内容は、本プロジェクトと同じApache License 2.0で提供されるものとします。
