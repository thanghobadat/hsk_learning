# 🧠 Project Memory: HSK 3.0 Master

> **Phiên bản:** HSK 3.0 Master (Sơ Cấp: HSK 1 - HSK 2 - HSK 3)  
> **Cập nhật lần cuối:** 27/09/2026  
> **Mục đích file:** Tóm tắt nhanh toàn bộ kiến trúc, dữ liệu, tính năng và trạng thái hiện tại của dự án để tiếp tục phát triển bất kỳ lúc nào mà không cần rà soát lại toàn bộ mã nguồn.

---

## 1. Tổng Quan Dự Án & Công Nghệ

- **Mục tiêu:** Ứng dụng Web học tiếng Trung toàn diện theo chuẩn mới nhất **HSK 3.0** của Bộ Giáo Dục Trung Quốc, lộ trình 8 tháng từ con số 0 đến hết HSK 3.
- **Kiến trúc:** Single Page Application (SPA) không dùng framework nặng, điều hướng bằng Hash Router (`#roadmap`, `#lessons`, `#pinyin`, `#vocab`, `#flashcard`, `#radicals`, `#grammar`, `#quiz`).
- **Tech Stack:**
  - **Core:** HTML5, Vanilla JavaScript (ES Modules).
  - **Styling:** Vanilla CSS hiện đại, Glassmorphism, Theme Sáng/Tối (`data-theme="dark|light"`), Micro-animations. Tuyệt đối không dùng Tailwind.
  - **Thư viện bên thứ 3:** `hanzi-writer` (nhúng CDN cho tính năng mô phỏng thứ tự từng nét viết chữ Hán động & bảng tập viết).
  - **Âm thanh:** Web Speech API (`SpeechSynthesis`) + Fallback Audio phát âm tiếng Trung chuẩn Bắc Kinh (`src/utils/speech.js`).
  - **AI Engine:** Tích hợp Google Gemini API + Local AI Fallback Engine tạo bài tập và giải thích ngữ pháp (`src/utils/aiService.js`).
  - **Build tool:** Vite 6 (`npm run dev`, `npm run build`), cấu hình `vite.config.js` với `base: './'`.
  - **Git Repository:** [https://github.com/thanghobadat/hsk_learning](https://github.com/thanghobadat/hsk_learning) (Branch chính: `main`).

---

## 2. Hệ Thống 8 Phân Hệ Tính Năng Chính

### 📖 1. Hệ Thống Bài Học HSK 3.0 (`#lessons`) - [Tính Năng Trọng Tâm]
Sở hữu bộ chọn cấp độ **Level Selector Switcher** chuyển đổi tức thì giữa 3 cấp độ:
- **🟢 HSK 1:** 20 bài học • 500 từ vựng • 48 điểm ngữ pháp.
- **🔵 HSK 2:** 25 bài học • 775 từ vựng • 81 điểm ngữ pháp mới (bổ ngữ kết quả `完/好/到/见`, câu chữ `把`, so sánh `比`).
- **🟣 HSK 3:** 30 bài học • 960 từ vựng • 81 điểm ngữ pháp mới (bổ ngữ khả năng, câu bị động `被/叫/让`, đàm phán hợp đồng, văn hóa).
- **Tổng cộng:** **75 chuyên đề • 2.235 từ vựng • 210 điểm ngữ pháp**.

**Cấu trúc chuẩn của từng bài học (100% đồng bộ trên cả 75 bài):**
1. **Tab 1: 📚 Từ Vựng Bài Học:**
   - Chữ Hán, Pinyin, Hán - Việt, dịch nghĩa.
   - Nút phát âm audio 🔊.
   - Nút **`✍️ Tập viết`**: Mở modal Hanzi Writer xem hoạt họa viết từng nét theo đúng quy tắc bút thuận và bảng vẽ tay tương tác.
   - Hộp **`💡 Mẹo nhớ nhanh`**: 100% từ vựng đều có chiết tự bộ thủ, phân tích nguồn gốc và câu chuyện liên tưởng ghi nhớ sâu.
   - Câu ví dụ thực tế song ngữ kèm audio.
2. **Tab 2: 📝 Ngữ Pháp Trọng Tâm:** Công thức chuẩn, phân tích cách dùng, lưu ý ngữ cảnh và ví dụ minh họa kèm audio.
3. **Tab 3: 🔄 Ôn Tập Bài Học (3 Mục con):**
   - **Mục 1: 🗂️ Flashcard Từ Vựng 3D:** Lật thẻ 3D 2 mặt, phát âm, xem nét viết, đánh dấu thuộc/chưa thuộc.
   - **Mục 2: ⚡ Bài Tập Phản Xạ:** Chế độ nối cặp siêu tốc (Speed Match Matrix) & Thử thách chớp nhoáng 5 giây (Lightning Reflex).
   - **Mục 3: 🤖 AI Luyện Ngữ Pháp:** Kéo thả ghép thẻ từ thành câu hoàn chỉnh (Sentence Scramble), điền từ vào ngữ cảnh (Cloze Test), tạo bộ đề mới bằng AI và modal Trợ lý AI phân tích ngữ pháp chuyên sâu.

---

### 📅 2. Lộ Trình 8 Tháng (`#roadmap`)
- Phân chia 3 giai đoạn (32 tuần học tập).
- Thống kê mục tiêu thời gian, lượng từ tích lũy, ngữ pháp và chữ Hán cần nắm.
- Nút chuyển nhanh vào 75 bài học HSK 3.0.

### 🔤 3. Bảng Phát Âm Pinyin (`#pinyin`)
- Đầy đủ 23 Thanh mẫu (Initials), 24 Vận mẫu (Finals), 4 Thanh điệu (Tones).
- Bảng ghép âm động tương tác, phát âm bản xứ.
- Bài tập trắc nghiệm nghe chọn âm và phân biệt âm dễ nhầm lẫn.

### 📚 4. Kho Từ Vựng HSK 3.0 (`#vocab`)
- Tra cứu theo chữ Hán, Pinyin hoặc nghĩa tiếng Việt.
- Bộ lọc theo cấp độ (HSK 1, HSK 2, HSK 3) và chủ đề.
- Nghe phát âm từng từ trực tiếp.

### 🎴 5. Trung Tâm Flashcard 3D (`#flashcard`)
- Học từ vựng dạng thẻ nhớ lật 3D toàn diện theo từng chủ đề lớn.
- Phím tắt bàn phím (Space để lật, mũi tên Trái/Phải để chuyển từ).

### ✍️ 6. 50 Bộ Thủ & Luyện Viết (`#radicals`)
- Trọn bộ 50 bộ thủ chữ Hán thông dụng nhất.
- Ý nghĩa, nguồn gốc, số nét, ví dụ các chữ phái sinh.
- Canvas luyện viết chữ và đối chiếu bút thuận.

### 📖 7. Sổ Tay Ngữ Pháp (`#grammar`)
- Sổ tay tổng hợp 48+ điểm ngữ pháp cốt lõi chuẩn HSK 3.0.
- Công thức, giải thích, ví dụ song ngữ và mẹo ghi nhớ cho người Việt.

### 🎮 8. Đấu Trường Quiz (`#quiz`)
- Bài thi trắc nghiệm tổng hợp theo thời gian thực.
- Tính điểm, phân tích đáp án sai và lưu chuỗi học tập (Streak).

---

## 3. Cấu Trúc File & Mã Nguồn Quan Trọng

```text
chinese_learning/
├── index.html                   # Shell ứng dụng, Navigation tabs, Dark/Light toggle
├── package.json                 # Script Vite: "dev", "build", "preview"
├── Memory.md                    # File bộ nhớ này
├── scripts/
│   ├── build_hsk2_full_dataset.mjs  # Generator sinh 25 bài HSK 2 (775 từ, mẹo nhớ, ngữ pháp)
│   └── build_hsk3_full_dataset.mjs  # Generator sinh 30 bài HSK 3 (960 từ, mẹo nhớ, ngữ pháp)
├── src/
│   ├── main.js                  # Điều phối SPA routing, theme, streak counter
│   ├── style.css                # Design system hoàn chỉnh (CSS tokens, components, responsive)
│   ├── data/
│   │   ├── hsk1LessonsData.js   # 20 bài HSK 1 (500 từ có mẹo nhớ, 48 ngữ pháp)
│   │   ├── hsk2LessonsData.js   # 25 bài HSK 2 (775 từ có mẹo nhớ, 81 ngữ pháp)
│   │   ├── hsk3LessonsData.js   # 30 bài HSK 3 (960 từ có mẹo nhớ, 81 ngữ pháp)
│   │   ├── pinyinData.js        # Dữ liệu thanh mẫu, vận mẫu, thanh điệu Pinyin
│   │   ├── radicalsData.js      # Dữ liệu 50 bộ thủ thông dụng
│   │   ├── grammarData.js       # Dữ liệu sổ tay ngữ pháp
│   │   ├── hskData.js           # Từ vựng tổng hợp
│   │   └── roadmapData.js       # Lộ trình 8 tháng
│   ├── views/
│   │   ├── lessonsView.js       # View bài học HSK 1-3, Level Selector, 3 inner tabs
│   │   ├── roadmapView.js       # View lộ trình 8 tháng
│   │   ├── pinyinView.js        # View bảng âm Pinyin
│   │   ├── vocabView.js         # View tra cứu từ vựng
│   │   ├── flashcardView.js     # View trung tâm flashcard
│   │   ├── radicalsView.js      # View 50 bộ thủ & tập viết
│   │   ├── grammarView.js       # View sổ tay ngữ pháp
│   │   └── quizView.js          # View đấu trường trắc nghiệm
│   ├── components/
│   │   ├── strokeModal.js       # Modal HanziWriter vẽ từng nét chữ & tập viết
│   │   ├── lessonFlashcard.js   # Flashcard 3D trong tab Ôn tập bài học
│   │   ├── lessonReflex.js      # Bài tập phản xạ (Speed Match & Lightning 5s)
│   │   └── lessonAIDrills.js    # AI Luyện ngữ pháp (Scramble, Cloze, AI Modal)
│   └── utils/
│       ├── speech.js            # TTS & phát âm audio tiếng Trung
│       └── aiService.js         # Tích hợp Gemini API & Local AI Engine dự phòng
```

---

## 4. Quản Lý Trạng Thái (LocalStorage Keys)

| Key | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `hsk_current_level` | `'hsk1' \| 'hsk2' \| 'hsk3'` | Cấp độ HSK đang chọn ở trang bài học |
| `hsk_hsk1_lesson_id` | String (vd: `'lesson-1'`) | Bài học đang chọn tại HSK 1 |
| `hsk_hsk2_lesson_id` | String (vd: `'hsk2-lesson-1'`) | Bài học đang chọn tại HSK 2 |
| `hsk_hsk3_lesson_id` | String (vd: `'hsk3-lesson-1'`) | Bài học đang chọn tại HSK 3 |
| `hsk_completed_lessons`| Array (JSON) | Danh sách ID các bài đã bấm hoàn thành |
| `hsk_theme` | `'dark' \| 'light'` | Chế độ giao diện Sáng / Tối |
| `hsk_study_streak` | Object | Dữ liệu chuỗi ngày học tập |
| `gemini_api_key` | String | API key Google Gemini (nếu người dùng cấu hình riêng) |

---

## 5. Lệnh Vận Hành Cơ Bản

- **Khởi chạy môi trường phát triển (Dev server):**
  ```bash
  npm run dev
  # Server chạy tại: http://127.0.0.1:5173/
  ```
- **Kiểm tra biên dịch & đóng gói Production:**
  ```bash
  npm run build
  # Xuất bundle tối ưu vào thư mục /dist (đảm bảo 0 lint error)
  ```
- **Cập nhật / Tái tạo dữ liệu HSK 2 hoặc HSK 3:**
  ```bash
  node scripts/build_hsk2_full_dataset.mjs
  node scripts/build_hsk3_full_dataset.mjs
  ```

---

## 6. Ghi Chú Kỹ Thuật & Cập Nhật Gần Nhất
- **Cập nhật 28/09/2026 (Fix bug Phản Xạ & Tối ưu Responsive Đa Thiết Bị - PC, iPhone 15 Pro, iPad):**
  - **Phản xạ chớp nhoáng 5s:** Bổ sung màn hình Sẵn sàng (Ready Screen) tránh auto-start gấp; thêm bộ đếm 3-2-1; bổ sung nút `⏸️ Tạm Dừng` và `⏹️ Thoát`; xây dựng cơ chế `cleanup()` triệt để cho `setInterval` / `setTimeout` / `speechSynthesis` để xóa bỏ hoàn toàn hiện tượng zombie timer loop & spam âm thanh khi chuyển tab hoặc bấm lại.
  - **Tối ưu bài tập trên điện thoại:**
    - Sidebar danh mục bài học trên mobile đã có thanh toggle `📖 Đổi bài`, tự động thu gọn để không chiếm toàn bộ màn hình và không làm kẹt cuộn cảm ứng; tự động cuộn xuống nội dung bài khi chọn bài mới.
    - Bài tập Sắp xếp câu (Scramble) trong Mục 3: chuyển sang Event Delegation trên `pool` và `slot`, hỗ trợ cảm ứng `touch-action: manipulation`, sửa triệt để xung đột sự kiện tile không nhận diện trên mobile.
    - Bộ câu hỏi Trắc nghiệm & Điền từ (Cloze/MC) chuyển thành 1 cột trên màn hình điện thoại (<= 640px) với kích thước nút bấm chuẩn ngón tay (touch target 48px+).
  - **Hệ thống Responsive Toàn Diện Đạt Chuẩn Cao Cấp (Không Thanh Cuộn Ngang / Zero Horizontal Scrollbar):**
    - **Triệt tiêu 100% thanh ngang:** Thiết lập `html, body { overflow-x: hidden !important; max-width: 100vw !important; }`, `*, *::before, *::after { box-sizing: border-box; }`, cùng `max-width: 100%` cho toàn bộ các view và container chính.
    - **iPhone 15 Pro (Viewport 393px × 852px):**
      - Header 2 tầng tiện lợi: Tầng 1 (Logo + Theme + Streak), Tầng 2 (8 Nav tabs cuộn ngang mượt mà với cảm ứng đà `-webkit-overflow-scrolling: touch`, ẩn thanh cuộn).
      - Flashcard 3D: Chuyển cụm nút thao tác thành 2 hàng chuẩn chỉnh (Hàng 1: 3 nút đánh giá Chưa nhớ / Lật thẻ / Đã thuộc chia 3 cột đều; Hàng 2: Thẻ trước / Thẻ sau chia đôi). Ẩn phím tắt desktop trên màn hình cảm ứng.
      - Canvas vẽ chữ Hán & Bộ Thủ (`#radicals`): Khung Mễ Tự Cách co giãn linh hoạt `min(340px, 100%)` với tỉ lệ `aspect-ratio: 1`, nét vẽ căn chỉnh tọa độ chính xác qua scale tỉ lệ DOM, lưới bộ thủ/nét bút tự động chuyển 1 cột.
      - Tra cứu từ vựng (`#vocab`) & Pinyin (`#pinyin`): Thanh công cụ sắp xếp dọc tinh tế, thanh chọn subtab Pinyin trượt ngang, bộ lọc cấp độ tự dàn đều; máy ghép âm (Syllable Lab) xếp dọc 1 cột dễ chọn.
      - Sổ tay ngữ pháp (`#grammar`) & Đấu trường Quiz (`#quiz`): Công thức dài tự ngắt từ (`word-break: break-word; overflow-wrap: break-word`), các nút chọn trắc nghiệm và chữ Hán co giãn linh hoạt bằng hàm `clamp()`.
      - Modal bút thuận HanziWriter: Tự co giãn theo màn hình nhỏ dưới 500px, cụm nút bấm chia 3 cột vừa khít.
    - **iPad & Tablets (768px – 1024px):**
      - Hệ thống lưới chuyển mượt mà sang 2 cột cho kho từ vựng, bài học, bộ thủ, 32 tuần lộ trình, và 3 cột cho Ghép nối (Speed Match).
      - Thanh chọn cấp độ HSK 1-3 và các review subtab dàn đều không bị vỡ hàng.
    - **PC & Màn Hình Lớn (>= 1025px):**
      - Bố cục 3-4 cột rộng rãi thoáng đãng, sidebar bài học ghim cố định bên trái (sticky `top: 80px`), hiệu ứng hover, phím tắt nhanh và thanh điều hướng 1 hàng sang trọng.
- Khi bổ sung tính năng mới cho bài học, luôn kiểm tra hàm `renderInnerContent` trong [src/views/lessonsView.js](file:///d:/AI/chinese_learning/src/views/lessonsView.js) để đảm bảo tương thích đồng thời cả 3 cấp độ `HSK1_LESSONS`, `HSK2_LESSONS`, `HSK3_LESSONS`.
- Utility phát âm nằm ở [src/utils/speech.js](file:///d:/AI/chinese_learning/src/utils/speech.js) (dùng `speakChinese(text)` và `playSound('click'|'correct'|'wrong')`).
- HanziWriter được nạp từ CDN ở file `index.html` hoặc import qua modal [src/components/strokeModal.js](file:///d:/AI/chinese_learning/src/components/strokeModal.js).

