# GitHub Pages + MkDocs セットアップ手順
- 目的
調べたことが乱雑なまま残っているため後から調べなおす際に時間がかかっている
githubpagesに整理して参照しやすくしたい
markdown形式のきをそのまま貼れるようにする
できるだけ楽したいので自動デプロイにしたい

## 環境 & 前提
- windows11
- wsl2が入っていること
- dockerが使える環境にあること
- githubアカウントを持っていること

## 手順

### 1. リポジトリ作成
gitHubで新しいリポジトリ（例: `sample`）をpublicで作成する
read_meは有っても無くてもよい

### 2. **ローカルにクローンする**
powershell（管理者権限付き）で以下を実行する
```sh
cd {ローカルリポジトリを置きたい場所のパス}
git clone https://github.com/ユーザ名/sample.git
```

### 3. MkDocs + GitHub Actionsのセットアップ
最小構成は以下となる
docs配下のindex.mdが全体のホーム
各ディレクトリ内のindexが個別ページへのナビゲーションとなる

```
E:{親ディレクトリ}
│  mkdocs.yml
│
├─.github
│  └─workflows
│          gh-pages.yml
└─docs
    │  index.md
    │
    └─ {dir}
            index.md
            entry_1.md
            entry_2.md
```

設定ファイルは2種類
- mkdocs.yml
MkDocs用の設定ファイル。構造等を記述する。
記載例は以下
```
site_name: "{サイト名}"
site_url: "https://{ユーザ名}.github.io/{任意名}/"
theme:
  name: "material"
nav:
  - Home: index.md
  - {dir}:
      - 概要: {dir}/index.md
      - entry_1: {dir}/entry_1.md
      - entry_2: {dir}/entry_2.md

```
- .github/workflows/gh-pages.yml
GitHub Actionsでmainが更新された時に自動でgithub pagesへ反映するための設定ファイル
```
name: Deploy MkDocs

on:
  push:
    branches:
      - main  # main にプッシュすると自動デプロイ

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: GitHubリポジトリをチェックアウト
        uses: actions/checkout@v3

      - name: MkDocsをセットアップ
        run: |
          pip install mkdocs-material
          mkdocs build

      - name: GitHub Pagesにデプロイ
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          publish_dir: ./site

```
ただこのままpushしても最初は失敗する
github側でPAT(Personal Access Token)の設定が必要

### 4 ローカルテスト
Docker を使って MkDocs の動作確認を行う。

1. DockerでMkDocsを起動する
    powershellを起動する
    親ディレクトリ(mkdocs.yml)がある場所にcdし、以下のコマンドを実行する
    `docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material`

2. ローカルで確認する
    ブラウザのローカルホストで見る `http://localhost:8000/`
    ページ遷移や変更が反映されるかどうかを見る
    OKならpowershellでctl + cでサーバを停止する

### 5 PAT設定
1. PATを取得する
    GitHubで Settings > Developer settings > Personal access tokens (classic) を開く
    「Generate new token (classic)」をクリック
    以下の権限を付与
    - repo → 「Full control of private repositories」
    - workflow → 「Update GitHub Action workflows」
    「Generate token」ボタンを押す
     表示されたトークンをコピーする（再表示不可なので注意すること、適当な場所にコピペしておくこと）

2. PATを登録する
    GitHubリポジトリの Settings > Secrets and variables > Actions に移動
    「New repository secret」 をクリック
    Name: PERSONAL_ACCESS_TOKEN
    Value: （作成したPATを貼り付け）
    保存（Add secret）をクリック

### 6 GitHub Pagesの有効化
1. githubのリポジトリの設定画面で以下を設定する
    Settings > Pages を開く
    Source を Deploy from a branch に設定
    Branch を gh-pages、フォルダは /(root) にする
    「Save」ボタンをクリック
    数分待って https://{ユーザ名}.github.io/{サイト名}/ にアクセスし表示されていることを確認する
    ※一度表示しているとキャッシュが残っていることがある、表示されない場合はキャッシュクリア (Ctrl + Shift + R)

### 7 自動デプロイのテスト
mdファイルを更新、mainにcommitし反映されていることをweb側から確認する

