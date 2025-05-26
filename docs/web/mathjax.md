# MkDocsでTeX数式を表示する方法（MathJax）

MkDocsを使って技術ブログやノートを作成する際、数式を表示したくなることがあります。  
Mathjaxでの表示に意外と苦労したので**Markdown内にTeX記法で数式を記述し、MathJaxを使って正しく表示する方法**を記録しておきます。

---

## 対象

- MkDocs Material を使って静的サイトを構築している
- 数式をMarkdownに埋め込みたい
- 表示されない／文字のまま出てしまうといった問題に困っている

---

## 使用ライブラリと基本方針
調べてみたらKaTeXかMathjaxのどちらかを使うことが多いらしい
KaTexも試してみたものの上手くいかず（未解決）、Mathjaxを試してみることに
結果としてMkDocs Material + MathJax（v3）の組み合わせになりました  
Markdownでは `$...$` でインライン数式、`$$...$$` または `\[...\]` でブロック数式を表現します

---

## 手順概要

1. `mkdocs.yml` にMathJaxのCDNを追加
2. `pymdownx.arithmatex` 拡張機能を有効化
3. `mathjax_config.js` を作成（任意の初期設定）

---

## 1. `mkdocs.yml` に追記

```yaml
extra_javascript:
  - js/mathjax_config.js  # ← 後述のファイルパス
  - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
```

---

## 2. Markdown拡張機能の有効化

```yaml
markdown_extensions:
  - pymdownx.arithmatex:
      inline_syntax: ['$', '$']
      generic: true
```

ポイント：

- `inline_syntax` を `$` にすると `$S_t$` のような書き方が有効になります
- `generic: true` にすることで、`MathJax v3` で必要なクラスを出力できます

---

## 3. MathJax設定ファイルを作成（任意）

`docs/js/mathjax_config.js` というファイルを用意し、以下の内容を記述：

```javascript
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
  }
};
```

> ※これはカスタマイズ可能ですが、基本はこのままでOKです。

---

## 4. 数式の書き方例

### インライン数式

```markdown
モデルの状態 $S_t$ は入力 $I_t$ とノイズ $\epsilon_t$ により変化する。
```

→ 表示例：モデルの状態 $S_t$ は入力 $I_t$ とノイズ $\epsilon_t$ により変化する。

---

### ブロック数式

```markdown
$$
dS_t = f(S_t, I_t) \, dt + \delta(T_t) \cdot \epsilon_t \, dW_t
$$
```

→ 表示例：

$$
dS_t = f(S_t, I_t) \, dt + \delta(T_t) \cdot \epsilon_t \, dW_t
$$

---

## トラブルシューティング

| 症状 | 原因と対策 |
|------|------------|
| `$S_t$` がそのまま表示される | `arithmatex` が未設定 or `inline_syntax` が `$` になっていない |
| 二重にレンダリングされる | `generic: false` のままMathJaxを直接読み込むと競合する場合あり |
| MathJaxが効かない | `mathjax.min.js` の読み込み順に注意（configより後に） |

---

## 補足：Jupyter記法と混同しない

Jupyterでは `$` による数式表記が標準ですが、MkDocsでは `pymdownx.arithmatex` を通じてMathJaxに渡す設定が必要です。

---

## まとめ

MathJaxを使うことで、MkDocsでもTeX数式を埋め込むことができました。
ブログ、ノート、研究メモなどに活用する際の表現力が格段に上がるので、ぜひ試してみてください。

