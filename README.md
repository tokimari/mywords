# Dash用Docsetで英単語録

英語がからきし駄目なので、勉強用に英単語録を日報で配信し続けています。

ついでにDash用ドックセットにしたくて作りました。Dash内で<code>mw:</code>で検索できます。

著作権的にやばいとあれなので更新はしません。

[Github - tokimari](https://github.com/tokimari "GitHub - tokimari")

追加の仕方：

1. HTMLに書く
2. <code>$ cd mywords.docset/Contents/Resources/</code>
3. <code>$ sqlite3 .docset/Contents/</code>
4. <code>INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('name', 'type', 'path');</code>
