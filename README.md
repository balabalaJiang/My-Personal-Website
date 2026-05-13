# 江永閎 (un hng) — 個人專案作品集與履歷網站

這是一個專為展示個人履歷、競賽歷程與專案成果所開發的靜態響應式網站 (Static RWD Website)。網站以「模組化資料驅動」為核心概念，將畫面渲染與資料分離，方便未來快速擴充與維護。

🔗 **線上瀏覽 (Live Demo)**: [https://balabalaJiang.github.io/My-Personal-Website/](https://balabalaJiang.github.io/My-Personal-Website/) *(請替換為實際網址)*

---

## ✨ 核心特色 (Features)

*   **動態資料驅動 (Data-Driven)**: 網站的專案、技能與競賽資料皆獨立封裝於 `js/data/` 資料夾中，更新內容無需更動 HTML/CSS 核心架構。
*   **極致效能與原生開發**: 不依賴任何龐大的前端框架 (React/Vue) 或第三方 UI 函式庫，完全以 **Vanilla HTML / CSS / JavaScript** 打造，載入極快。
*   **響應式設計 (RWD)**: 完美適配各種螢幕尺寸，從手機、平板到大螢幕桌機皆有流暢的瀏覽體驗。
*   **現代化微互動 (Micro-interactions)**: 
    *   3D 卡片傾斜視差特效 (Vanilla Tilt)
    *   客製化平滑跟隨游標 (Custom Cursor)
    *   背景漸層呼吸燈動畫與數字動態跳動特效
*   **整合 Google Analytics (GA4)**: 內建 GA4 追蹤碼，可精準追蹤訪客流量、停留時間與瀏覽行為。
*   **開源徽章 API**: 結合 Visitor Badge 實現可視化的即時累積訪客計數器。

---

## 🛠️ 技術棧 (Tech Stack)

*   **前端結構**: HTML5 (Semantic UI)
*   **樣式設計**: CSS3 (CSS Variables, Flexbox, CSS Grid, Keyframes Animation)
*   **互動邏輯**: Vanilla JavaScript (ES6, Intersection Observer, RequestAnimationFrame)
*   **部署環境**: GitHub Pages / Vercel

---

## 📁 專案架構 (Folder Structure)

```text
My-Personal-Website/
├── index.html                # 網站主入口檔案
├── competitions.md           # 履歷資料來源與文檔備份
├── assets/
│   └── images/               # 存放專案截圖、競賽獎狀與大頭照 (p1.jpg, p2.png...)
├── css/
│   └── style.css             # 全站樣式配置、RWD 斷點與動畫特效
└── js/
    ├── main.js               # 核心邏輯、動態渲染函數與互動特效
    └── data/
        ├── competitions.js   # 競賽時間軸資料
        ├── projects.js       # 專案卡片資料
        └── skills.js         # 專業技能與百分比資料
```

---

## 🚀 如何在本地端運行 (Local Development)

由於本專案為純靜態網頁，沒有複雜的編譯與打包過程，您可以透過以下兩種方式輕鬆預覽：

1.  **直接開啟**: 雙擊 `index.html` 即可在瀏覽器中查看。
2.  **使用 Live Server (推薦)**: 若您使用 VS Code，推薦安裝 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 擴充功能，在 `index.html` 上點擊右鍵選擇 `Open with Live Server`，可享受存檔即時更新 (Hot Reload) 的開發體驗。

---

## 📝 如何更新內容 (How to Update Content)

若未來需要新增專案或修改履歷，您**不需要**修改 `index.html`，只需編輯 `js/data/` 下對應的檔案：

*   **新增專案**: 打開 `js/data/projects.js`，按照現有格式在陣列中新增一個物件，並將圖片存入 `assets/images/`。
*   **新增競賽獎狀**: 打開 `js/data/competitions.js`，加入新的時間節點資料，網站會自動根據年份排序並繪製時間軸。
*   **調整技能比例**: 打開 `js/data/skills.js`，修改 `percentage` 的數值，前端的數字跳動動畫將會自動讀取並渲染。

---

## 📄 授權條款 (License)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
