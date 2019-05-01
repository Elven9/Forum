# Software Studio 2019 Spring Midterm Project

## Topic
* Project Name : Forumas
* Key functions (add/delete)
    1. 三種版切換：左邊連結列表
    2. 使用者頁面：右邊 Slider
    3. 個版 List
    4. 發布文章
    
* Other functions (add/delete)
    1. Message 報錯系統
    2. 圖片上傳 Drag and Drop
    3. 使用者大頭貼圖片上傳
    4. 編輯文章 What You See What You Get
    5. Background / Foreground Notification

## Website Detail Description

## Basic **Components**
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Membership Mechanism|20%|Y|
|Firebase Page|5%|Y|
|Database|15%|Y|
|RWD|15%|Y|
|Topic Key Function|15%|Y|

## Advanced Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Third-Party Sign In|2.5%|Y|
|Chrome Notification|5%|Y|
|Use CSS Animation|2.5%|Y|
|Security Report|5%|Y|

# 作品網址：[作品連結](https://software-studio-mid-project.firebaseapp.com/#/)

# Components Description :

## 中間首頁，各版文章列表
首頁文章列表：總共有三個版，分別為泰國版，美食版，Gossip 版，各個版都有自己的測試資料，作為 Demo。
   
- CSS 是採用 grid 實作，借用其精準分配的特性，可以將版面分成固定長度的小方格
- 每個小方塊的大小是在撰寫文章時可以決定，有 1x1, 1x2, 2x2 三種，文章寫完後首頁會自動分配位置
- 每個小方塊點進去進到各個文章單頁
- RWD 實作的部分會根據 width 變化做 grid-template 變化，>1024px ~ 768px 為 6x6，768px ~ 414px 為6x4，<414px 為 6x2

## 左邊連結列表
可以連到各個版的連結列表

- RWD 的部分，< 1024px 時會變成一個可以滑動的方塊，打開選單位置在左上角
- 連結會在螢幕寬度 < 414px 時，改變 style

## 右邊使用者頁面
使用者資訊，分成登入前與登入後：

### 登入前
使用者可以在者裡登入，若沒有帳號可以註冊

- 使用 Email / Password 登入與註冊
- 使用 Google 登入

### 登入後
註冊時每個使用者都會在 DB 中創建屬於使用者自己的資料，資料格式為：

```json
{
  "account": "使用者 Email",
  "avatar": "使用者大頭貼連結，預設為空",
  "avatarLocation": "使用者大頭貼在 storage 中的檔名",
  "userUid": "用來做 DB 權限管理"
}
```

使用者頁面會呈現以下幾個資料：

- 大頭貼，若原本就有可以更換，若沒有則可以上傳
- 使用者名稱，擷取自 Account 在 @ 前的資料
- 登出按鈕
- 使用者曾經發佈過的文章，點擊可以到文章單頁

## 文章發佈頁面

文章編輯與發佈位置

- 每個文章必須要有一張 Cover，用做文章列表中每個文章的背景
- 文章標題，也是必填欄位
- 副標題，選填
- 顯示樣式，選擇在文章列表中單個文章的大小，預設是**1x1**
- 選擇文章分類，預設是**泰國版**
- 文章編輯器，用的是 [froala WYSIWYG](https://www.froala.com/wysiwyg-editor)，儲存文章的方法則是直接使用 Html 格式，文章列表時在加上自定義的 style

## 文章單頁

### 文章內容

顯現文章內容資料，Style 的話是透過 Global 的 CSS 加上去的

### 留言區

直接用 Bootstrap 的元件做到這件事，透過 Listen DB 的資料更動作更新
...

# Other Functions Description(1~10%) :

## Notification Background 實作

這次 Notification 我使用的是 Cloud Message 來實作，觸發時機是在當任何一個使用者發佈新文章時，只要有接受通知的使用者都會接到通知。

實作流程如下：

1. 前端請求使用者接收通知
2. 前端拿到 Token，回傳給後端(透過 cloud function callable **registedToken**)，後端把這個 Token 註冊到 **article** 這個 topic 上，完成 token 註冊
3. 後端加入 DB Event Listner(cloud function)，event 使用種類是 **onUpdate**(原因是因為我在創建文章後會再更新一次新的 cover Url 跟 Content)，觸發 Event 後對 article 這個 topic 發送 Notification，格式如下：

```js
// Raw Data 是 DB 中的資料
let newData = {
  author: rawData.userAccount.split('@')[0],
  title: rawData.title,
  subTitle: rawData.subTitle
}

send({
  data: {
    title: `New Article ${ newData.title } Have Been Released.`,
    body: JSON.stringify(newData), // 只接受 String
  },
  topic: 'articles'
})
```

4. 前端收到 notification 後，分為 Foreground(**onMessage**) / Background(**service worker**)，兩邊整理好後端傳回來的資料(`JSON.parse`)，設定 Notification 後傳出 Notification

## Drag and Drop

讓使用者可以更直觀上傳檔案，並限定只能上傳 image/jpeg, image/png

## 使用者大頭貼上傳
## What You What You Get
## Message 報錯系統

## Security Report (Optional)

Security 分為兩部分，一個是 DB 端的防護，一個是 Storage 端的防護

### DB 端

DB 的資料格式如下：

```
// Article 相關
|-- articles (collection)
|---- 個別文章 (doc)
|------ UserUid (認證用)
...

// User
|-- users (collection)
|---- 個別使用者資料 (doc)
|------ userUid
```

#### Article 操作限制
1. get, list: 不用登入就可以取得
2. create: 需要登入才可以發佈文章(`request.auth != null`)
3. update: 使用者需要登入，是這篇文章的擁有者(`request.auth.uid == resource.data.userUid`)，並且 Update 後沒有更改文章資料中的 UserUid(`request.resource.data.userUid == resource.data.userUid;`)
4. delete: 不允許刪除

#### Article 中 Comment 操作限制
1. read, write: 只要有登入就可以做讀取(`allow read, write: if request.auth != null;`)

#### User
1. get: 需要登入(`request.auth != null`)，並且只能拿到自己的資料
2. list: 需要登入(`request.auth != null`)
3. create: 需要登入(`request.auth != null`)
4. update: 使用者需要登入，是資料的擁有者(`request.auth.uid == resource.data.userUid`)，並且 Update 後沒有更改資料中的 UserUid(`request.resource.data.userUid == resource.data.userUid;`)
5. delete: 不允許刪除

### Storage 端

Storage Path 格式：

```
// User 資料
- user/{user_uid}/{User 大頭貼}

// Article 資料
- articles/{user_uid}/{article_id}/{文章圖片資料}
```

#### User
1. read, write: 只要有登入就可以做讀取(`allow read, write: if request.auth != null;`)

#### Article
1. write: 登入，是資料的擁有者(`allow write: if request.auth != null && request.auth.uid == user_uid;`)
2. read: 都可以讀取
