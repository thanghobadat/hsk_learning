# 🇨🇳 HSK 3.0 Master

Ứng dụng Web toàn diện hỗ trợ tự học tiếng Trung theo chuẩn khảo thí mới nhất **HSK 3.0** của Bộ Giáo Dục Trung Quốc (từ con số 0 đến HSK 3 trong lộ trình 8 tháng).

![HSK 3.0 Master](https://img.shields.io/badge/HSK_3.0-Level_1--3-crimson?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Vanilla_JS_•_Vite_6_•_CSS_Glassmorphism-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Điểm Nổi Bật Của Hệ Thống

### 1. 📖 75 Bài Học Chuẩn HSK 3.0 (Cấp 1, 2 và 3)
- **🟢 HSK 1:** 20 bài học • 500 từ vựng • 48 điểm ngữ pháp.
- **🔵 HSK 2:** 25 bài học • 775 từ vựng • 81 điểm ngữ pháp.
- **🟣 HSK 3:** 30 bài học • 960 từ vựng • 81 điểm ngữ pháp.
- **Tổng cộng:** **75 chuyên đề • 2.235 từ vựng • 210 điểm ngữ pháp**.
- **Tính năng độc quyền trong từng bài học:**
  - ✍️ **Mô phỏng bút thuận động (Hanzi Writer):** Xem hoạt họa viết từng nét chữ Hán chuẩn xác và bảng tập viết tương tác trực tiếp.
  - 💡 **Mẹo nhớ nhanh:** 100% từ vựng có giải nghĩa chiết tự bộ thủ, phân tích nguồn gốc chữ Hán và câu chuyện gợi nhớ sâu.
  - 🔊 **Phát âm chuẩn bản xứ:** Tích hợp Web Speech API với giọng đọc tiếng Trung phổ thông chuẩn Bắc Kinh.

### 2. 🔄 Hệ Thống Ôn Tập Đa Tương Tác
- 🗂️ **Flashcard 3D:** Lật thẻ 2 mặt, phát âm và xem bút thuận ngay trên thẻ.
- ⚡ **Bài tập phản xạ siêu tốc:** Ma trận ghép cặp (Speed Match) và Thử thách chớp nhoáng 5 giây (Lightning Reflex).
- 🤖 **AI Luyện ngữ pháp:** Sắp xếp câu (Sentence Scramble), điền từ vào ngữ cảnh (Cloze Test) và Trợ lý AI giải thích chi tiết.

### 3. 🎯 7 Phân Hệ Học Tập Chuyên Sâu
- 📅 **Lộ trình 8 tháng (`#roadmap`):** 32 tuần học tập với mục tiêu rõ ràng.
- 🔤 **Bảng âm Pinyin tương tác (`#pinyin`):** 23 thanh mẫu, 24 vận mẫu, 4 thanh điệu và bảng ghép âm động.
- 📚 **Kho từ vựng HSK 3.0 (`#vocab`):** Tra cứu từ vựng thông minh theo cấp độ và chủ đề.
- 🎴 **Trung tâm Flashcard 3D (`#flashcard`):** Luyện nhớ theo bộ chủ đề với phím tắt điều hướng nhanh.
- ✍️ **50 Bộ thủ thông dụng (`#radicals`):** Ý nghĩa, chữ phái sinh và canvas luyện viết.
- 📖 **Sổ tay ngữ pháp (`#grammar`):** 48+ điểm ngữ pháp cốt lõi có công thức, giải thích và ví dụ song ngữ.
- 🎮 **Đấu trường Quiz (`#quiz`):** Đề thi trắc nghiệm bấm giờ, tính điểm và duy trì chuỗi học (Streak).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Core:** HTML5, Vanilla JavaScript (ES Modules).
- **Styling:** Vanilla CSS3 hiện đại, Glassmorphism, Chế độ Sáng/Tối (`data-theme="dark|light"`).
- **Thư viện tích hợp:** `hanzi-writer` (bút thuận chữ Hán), `canvas-confetti` (hiệu ứng chúc mừng).
- **Audio Engine:** Web Speech API (`SpeechSynthesis`) + Fallback audio.
- **Build tool:** Vite 6.

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local Development)

### Yêu cầu:
- Node.js (phiên bản 18+ hoặc 20+)
- npm hoặc yarn

### Các bước thực hiện:
```bash
# 1. Clone repository
git clone https://github.com/thanghobadat/hsk_learning.git
cd hsk_learning

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```

Truy cập: `http://localhost:5173` trên trình duyệt.

### Đóng gói cho Production:
```bash
npm run build
```
Mã nguồn sau khi tối ưu sẽ nằm trong thư mục `dist/`.

---

## 📄 License
Phát hành theo giấy phép [MIT](LICENSE).
