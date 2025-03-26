# ミニPCを自宅内ファイルサーバにする

余ったミニPCをファイルサーバとして活用したい
メインPCを組んだ結果昨年買ったミニPCが余ってしまった
ミニPCはこれ
[GMKtec N150 12GB+512G(Amazon)](https://www.amazon.co.jp/dp/B0C6T2T4JH/)
十分遊んだので自宅内の共有ファイルサーバとして再利用する

## 環境など

- OS
元々windows11が入っていたがファイルサーバにするにあたりubuntu 24.04.1 LTSを入れなおす
ミニPCに入っているwindowsを使い続けるならクリーンインストールしなおしたほうがよい
今回は後からlinuxを入れなおす想定でいたので入れなおしはしていない

- ディスク
Crucialの500GBの2.5インチSSDをUSBポートを介して外付け

- その他
windowsとlinux両方から見る可能性があるのでsambaを使う
IPは固定、起動時に自動マウントするようにする

## 手順
Ubuntuを入れるところまでは終わっている前提

### 1. Ubuntuサーバの準備
Ubuntuサーバ側の下準備をする
必要なものが無ければaptでインストールしながら進める

#### 1. 固定IPの準備(Netplan)
- 必要な情報を調べる
ubuntuサーバにログインし、 `nmcli device show` でデバイス情報を表示する
必要な情報はインターフェース名、IPアドレス、ゲートウェイ、DNSサーバ

- ネットワーク設定ファイルを編集する
次のコマンドでネットワーク設定ファイルを編集する
`sudo nano /etc/netplan/01-netcfg.yaml`

``` 01-netcfg.yaml
network:
  version: 2
  ethernets:
    {インターフェース名}:
      dhcp4: no
      dhcp6: no
      addresses: 
        - xxx.xxx.xxx.xxx/24
      routes:
        - to: default
          via:xxx.xxx.xxx.xxx
      nameservers:
        addresses
          - aaa.aaa.aaa.aaa
          - bbb.bbb.bbb.bbb
```

- netplanを適用する
`sudo netplan apply`

#### 2. 外部ディスク（HDD/SSDなど）のマウント設定

- デバイス確認
次のコマンドを実行しデバイスを確認する `lsblk`

- パーティションの状態を確認する
    - `sudo fdisk /aaa/bbb`
    - n(新パーティションを作成)
    - p(パーティションタイプをprimaryに設定)
    - セクター範囲はデフォルトでEnter押下
    - w(変更を保存)

- パーティションのフォーマット
次のコマンドを実行する `sudo mkfs ext4 /aaa/bbb`

- マウントポイントを作成する
`sudo mkdir -p /srv/shared`

- 自動マウント設定
/etc/fstabに追記する
`sudo nano /etc/fstab`
↓
`/aaa/bbb /srv/shaerd ext4 defaults 0 2`
↓
`sudo mount -a`

#### 3. Sambaインストール

### 2. ユーザとグループの作成

#### 1. Linux側に共有用グループ・ユーザを作成する

#### 2. Samba用パスワード設定

### 3. 共有ディレクトリの設定

#### 1. 外部ディスク上に共有フォルダ作成

#### 2. 所有者や権限の調整

#### 3. sambaのコンフィグファイルに共有定義を追加

#### 4. Sambaを再起動する

### 4. クライアント側の設定

#### 1. Windows側でSMB1.0を有効化

#### 2. Windows/Linuxクライアントからアクセス確認

#### 3. 自動マウント設定
