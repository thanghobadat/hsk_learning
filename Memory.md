# 🧠 Project Memory: HSK 3.0 Master

> **Phiên bản:** HSK 3.0 Master (Sơ Cấp: HSK 1 - HSK 2 - HSK 3)  
> **Cập nhật lần cuối:** 29/09/2026  
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
│   ├── build_hsk3_full_dataset.mjs  # Generator sinh 30 bài HSK 3 (960 từ, mẹo nhớ, ngữ pháp)
│   └── build_radical_dict.mjs       # Generator cơ sở dữ liệu tra cứu bộ thủ toàn diện
├── src/
│   ├── main.js                  # Điều phối SPA routing, theme, streak counter
│   ├── style.css                # Design system hoàn chỉnh (CSS tokens, components, responsive)
│   ├── data/
│   │   ├── radicalDict.js       # Từ điển bộ thủ 214 Khang Hy & ánh xạ 1.016 chữ Hán chuẩn xác
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
- **Cập nhật 29/09/2026 (Hệ Thống Phân Tích & Hiển Thị Bộ Thủ Toàn Diện Cho Toàn Bộ Từ Vựng):**
  - **Dữ liệu & Thuật toán tra cứu chuẩn xác:**
    - Xây dựng [src/data/radicalDict.js](file:///d:/AI/chinese_learning/src/data/radicalDict.js) chuẩn hóa 214 Bộ Thủ Khang Hy (kèm biến thể thông dụng) với thông tin Pinyin, âm Hán-Việt, phân loại và giải nghĩa súc tích.
    - Ánh xạ 100% (1.016 / 1.016) chữ Hán độc nhất trong toàn bộ 75 bài học HSK 1, 2, 3 và kho từ vựng tổng hợp.
    - Thuật toán `getRadicalsForWord(hanzi)` tự động phân tích và bóc tách từng chữ cấu thành (ví dụ `你好` ➔ `你` [bộ `亻` Nhân đứng] + `好` [bộ `女` Nữ]; `吃` ➔ `口` Khẩu).
  - **Tích hợp đồng bộ trên 4 phân hệ lớn:**
    - **Tab 1 Bài học (`#lessons`):** Mỗi thẻ từ vựng hiển thị cụm `word-radicals-box` với các pill kính mờ tinh tế phân tích từng chữ.
    - **Kho từ vựng (`#vocab`):** Bổ sung **Bộ Lọc Bộ Thủ** (`🧩 Bộ thủ`) dropdown tự động lọc từ theo bộ thủ xuất hiện nhiều nhất; mở rộng thanh tìm kiếm cho phép tra cứu bằng ký hiệu hoặc tên tiếng Việt của bộ thủ.
    - **Trung tâm Flashcard 3D (`#flashcard` & Ôn tập bài học):** Mặt sau thẻ hiển thị danh sách chi tiết các bộ thủ cấu thành.
    - **Modal Bút thuận & Tập viết (`strokeModal.js`):** Khi chuyển qua lại giữa các chữ trong từ ghép để tập viết, banner tự động cập nhật bộ thủ của chữ đang thao tác.
- **Cập nhật 17/10/2026 (Tối ưu Trải Nghiệm Bài Tập Phản Xạ & Tái Cấu Trúc Toàn Diện Phản Xạ Chớp Nhoáng):**
  - **Ghép Cặp Siêu Tốc (Speed Match):** Đã loại bỏ hoàn toàn hiển thị từ Hán Việt (`hanViet`) trên các thẻ nghĩa tiếng Việt, giúp người học tập trung phản xạ nghĩa trực tiếp.
  - **Phản Xạ Chớp Nhoáng (Lightning Reflex):**
    1. **4 Dạng bài tập chuyên sâu:** Cho phép chọn giữa *Chữ Hán ➔ Pinyin*, *Chữ Hán ➔ Nghĩa*, *Pinyin ➔ Nghĩa* (ẩn chữ Hán), và *Tổng Hợp (kết hợp ngẫu nhiên 3 dạng)*.
    2. **Độ dài bộ đề động ($N \times 2$):** Tự động nhân đôi toàn bộ từ vựng của bài, mỗi từ xuất hiện đúng 2 lần.
    3. **Đếm ngược thời gian thích ứng (Adaptive Dynamic Timer):** Ban đầu 10 giây/câu, cứ sau mỗi 3 câu đúng sẽ giảm 10% thời gian còn lại (sàn tối thiểu 3.0s).
    4. **Nâng cấp hiệu ứng chọn đúng:** Thẻ phát sáng viền ngọc bích Neon Emerald (`box-shadow`), icon tích xanh `✓`, điểm số bay bổng (`+points float toast`).
    5. **Dừng lại khi trả lời sai / hết giờ:** Không tự động nhảy câu; hiển thị thẻ chọn sai màu đỏ, thẻ đáp án đúng màu xanh kèm Hộp ghi nhớ ôn tập từ và nút `Tiếp Tục ➔` (hỗ trợ phím `Space` / `Enter`).
    6. **Khắc phục lỗi viền click:** Loại bỏ outline/border dính lại sau click bằng thuộc tính `outline: none !important;` cho `:focus` & `:focus-visible`.
    7. **Bảng thống kê & Danh sách từ sai (Review Incorrect Words):** Thống kê đúng/sai, độ chính xác %, danh sách các từ đã làm sai kèm audio phát âm, hỗ trợ nút "Chỉ ôn lại các từ sai" để luyện tập lại ngay lập tức.
    8. **Bật/Tắt tự động phát âm:** Bổ sung nút toggle 🔊/🔇 trên thanh điều khiển và màn hình sẵn sàng.
- **Cập nhật 17/10/2026 (Nâng Cấp Phân Hệ Luyện Ngữ Pháp - 5 Dạng Bài Tập & AI Chấm Điểm):**
  - **Bộ Lọc Đa Chọn (Multi-select Checkboxes):** Tích chọn linh hoạt giữa 5 dạng bài (`scramble`, `cloze`, `multiple-choice`, `vi_to_zh`, `pinyin_to_vi`) và nút "Tất cả", lưu trạng thái vào `localStorage`.
  - **Công thức sinh đề ma trận chống trùng lặp:** $\text{Tổng số câu} = X\text{ (dạng)} \times Y\text{ (mẫu ngữ pháp)} \times Z\text{ (từ vựng/mẫu)}$. Cơ chế tracking `usedSentenceHashes` đảm bảo 100% không trùng lặp câu hỏi.
  - **Phản hồi tức thì từng câu (Instant Feedback):** Làm xong câu nào biết ngay kết quả chi tiết của câu đó.
  - **Dạng 4 (Dịch Việt ➔ Viết Tiếng Trung) & Dạng 5 (Nghe Pinyin ➔ Dịch Nghĩa):** Tích hợp hàm `gradeWritingWithAI` (Gemini API + Local Fuzzy Semantic Engine dự phòng) chấm điểm linh hoạt, bỏ qua lỗi dấu câu, chấp nhận từ đồng nghĩa và trật tự hợp lệ.
  - **Sửa dứt điểm lỗi CSS Responsive Mobile:** Chuyển `#aiModalContainer` thành fixed portal độc lập, fix tràn viền `.drill-fb-box`, tối ưu kích thước nút bấm ngón tay trên mobile.
- **Cập nhật 17/10/2026 (Ra Mắt Dạng 6: Studio Luyện Nói Đối Thoại 1-1 Với AI - Kiến Thức Lũy Kế):**
  - **Kiến thức lũy kế (Cumulative Knowledge Engine):** Tự động gom toàn bộ từ vựng và ngữ pháp từ **Bài 1 đến Bài hiện tại** để đưa vào kịch bản giao tiếp đời sống, chống hiện tượng "học trước quên sau".
  - **Toàn quyền thiết lập & Chỉnh sửa kịch bản (Scenario Customization):**
    - Chọn vai: Nhân vật A (Nói trước mở đầu) hoặc Nhân vật B (AI mở đầu, bạn đáp lại).
    - Chọn số câu đối thoại: 4, 6, 8, hoặc 10 câu.
    - Chỉnh sửa kịch bản dạng thẻ (Card list): Câu của bạn hiển thị bằng **Tiếng Việt** làm đề bài phản xạ để bạn nhìn vào đó và tự nói tiếng Trung; câu của AI hiển thị bằng **Tiếng Trung + Pinyin + Dịch**.
    - Nút `[🤖 Cập nhật câu AI theo câu của tôi]`: Tự động thích ứng câu trả lời của AI theo câu tiếng Việt người dùng sửa đổi.
  - **Thực chiến luyện nói & Kiểm soát nhịp độ (Voice Interactive Practice):**
    - Thu âm giọng thật với `MediaRecorder` và nhận diện giọng nói `Web Speech API (zh-CN)`.
    - Hộp hiển thị chữ Hán nhận diện trực tiếp, cho phép sửa nhanh chữ nếu cần hoặc gõ phím bổ trợ (hỗ trợ phím `Enter`).
    - Nút `[👉 Gửi & Mời AI Trả Lời]`: Người dùng chủ động 100% nhịp độ, không bị AI cướp lời.
    - AI phản hồi bằng âm thanh giọng chuẩn bản xứ (`SpeechSynthesis`) + chấm điểm ngữ pháp nhẹ nhàng.
  - **Nghe lại toàn bộ hội thoại & Biên bản song ngữ (Sequential Radio Player & Bilingual Transcript):**
    - Nút `[▶️ Phát Toàn Bộ Hội Thoại]`: Tự động phát tuần tự như radio: **[Giọng thật của bạn] ➔ [Giọng chuẩn AI] ➔ [Giọng thật của bạn]...** kèm hiệu ứng viền sáng chạy theo lượt đang phát.
    - Nút gạt `[👁️ Ẩn/Hiện Tiếng Việt]`: Tùy chỉnh ẩn/hiện dịch nghĩa để người học tự thử thách đọc hiểu thuần tiếng Trung.
    - Transcript chi tiết từng lượt có nút nghe lại giọng thật của bạn và nút nghe giọng mẫu AI để đối chiếu phát âm.
- Khi bổ sung tính năng mới cho bài học, luôn kiểm tra hàm `renderInnerContent` trong [src/views/lessonsView.js](file:///d:/AI/chinese_learning/src/views/lessonsView.js) để đảm bảo tương thích đồng thời cả 3 cấp độ `HSK1_LESSONS`, `HSK2_LESSONS`, `HSK3_LESSONS`.
- Utility phát âm nằm ở [src/utils/speech.js](file:///d:/AI/chinese_learning/src/utils/speech.js) (dùng `speakChinese(text)` và `playSound('click'|'correct'|'wrong')`).
- Utility thu âm micro và nhận diện giọng nói nằm ở [src/utils/voiceService.js](file:///d:/AI/chinese_learning/src/utils/voiceService.js).
- HanziWriter được nạp từ CDN ở file `index.html` hoặc import qua modal [src/components/strokeModal.js](file:///d:/AI/chinese_learning/src/components/strokeModal.js).


