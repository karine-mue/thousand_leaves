# 視線対策
vroidで作成した3Dモデルをvrchatへ入れた時に視線が動きすぎるのを抑制する
※各種ツールの準備はできている前提

## バージョン情報
以下の組み合わせで検証済み（2025/3/17時点）
- vroid studio: 2.1.4
- VRChat Creator Companion: 2.4.1
- Unity Editor: 2022.3.22.f1

注意点は以下2点
- VCCにVRC Avatar Descriptorをインストールすること
- VCC対応のUnity Editorは常に少々古い、対応のUnityを入れること

## vroidからvcc経由でvrchatへ入れる方法
基本的な入れ方は以下の通り
今回メモっておきたいのは5の調整内の視線調整
1. vroid studioでアバターを作成しVRM0.0形式でエクスポートする
2. VRChat Creator Companion(VCC)でプロジェクトを作成する
3. デフォルトでは下の方にあるAsset窓にexportしたVRMファイルをドラッグ&ドロップ
4. 上部のVRM0タブ > Duplicate and Convert for VRChat でVRChat用assetを作成
5. 調整
6. 上部タブ VRChat SDK > Show Control Panel でpush用のcontrolパネルを出す
7. 諸々入力してBuild

## 視線調整
duplicateで作成したassetを選択すると右にInspectorが出る
その中の VRC Avatar Descriptor で設定する
VRC Avatar Descriptorが無い場合はVCCのmanage projectで入れられてないか反映されていない、プロジェクトを立ち上げなおす

### 視線の高さが異なる問題(View Position)
アバターの高さと視線の高さが合わないことがある
これはView Positionの位置ズレが原因
Viewを開いてView Positionの値を調整する

#### 参考値
身長160cmのモデルの参考値、X=0は固定でYとZを調整する
- X(左右): 0
- Y(高さ): 1.43
- Z(奥行): 0.08

位置マーカとしてグレーの玉が出てくるのでこの玉を眉間の間に持ってくる
マーカの玉が出てこなかったらキャラにめり込んでいるかモードが違う
玉が見えるモードはフレームが見える状態、キャラをクリックしてモード切替
めり込んでいるなら上記奥行を参考に少し大き目にしてみる

### 視線が動きすぎる問題
VRC Avatar Descriptor内の Eye Look で調整する
まずはEnableボタンを押下、すると調整項目が出てくる

### Eye Movements
ここの調整が肝
今回は「何もない時はあまりきょろきょろせず、近くに人が来たら見るようにしたい」
1. Calm←→Excited
目の動きの激しさ
Calmに近いほど目の動きの頻度は減少、反対にExcitedに近づけるほど目の動きの頻度が高くなる
基本は左(Calm)寄りでよい
2. Shy←→Confident
どのくらい視線を固定するか
Shy過ぎると人を見ないので今回は中央にセット

### Transforms
絶対に目を動かしたくない！ならこの項目でEye Boneを削除して空欄にしてしまえば極論動かなくなる

### Rotation States
目を動かす幅
Eye Movementsが頻度なのに対してこれは一度に動く範囲と考えると良い
Eye MovementsはそのままでもこのRotation Statesの値を小さくすることでだいぶ自然になる

#### 参考値
| 項目 | X | Y | Z |
|------------------|------|------|---|
| Looking Straight | 0    | 0    | 0 |
| Looking Up       | -1.5 | 0    | 0 |
| Looking Down     | 1.5  | 0    | 0 |
| Looking Left     | 0    | -1.5 | 0 |
| Looking Right    | 0    | 1.5  | 0 |

## 参考サイト
先達に感謝
- [VRoid製VRMアバターをVRChatで使えるようにする方法（2024年版）](https://note.com/unsoluble_sugar/n/n4546b5eaf00f)
- [「【VRChat】アバターの目線の位置を調整する方法」うたのんWEB3.0ライフ](https://utanoblog.net/category5/viewposition.htm)
