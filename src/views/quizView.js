import confetti from 'canvas-confetti';
import { HSK_VOCABULARY } from '../data/hskData.js';
import { speakChinese, playSound } from '../utils/speech.js';

export function renderQuizView(container) {
  let questions = [];
  let currentQIndex = 0;
  let score = 0;
  let answered = false;
  let userSelected = null;
  let quizLevel = 'all';

  function generateQuiz() {
    score = 0;
    currentQIndex = 0;
    answered = false;
    userSelected = null;

    let pool = HSK_VOCABULARY;
    if (quizLevel !== 'all') {
      pool = HSK_VOCABULARY.filter(v => v.level.toString() === quizLevel);
    }
    if (pool.length < 4) pool = HSK_VOCABULARY;

    // Trộn ngẫu nhiên và chọn 10 câu hỏi
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, pool.length));

    questions = selected.map((item, idx) => {
      // 3 loại câu hỏi: 
      // 1. Cho Chữ Hán -> Chọn Nghĩa tiếng Việt
      // 2. Cho Pinyin & Nghĩa -> Chọn Chữ Hán đúng
      // 3. Nghe phát âm -> Chọn Từ đúng
      const types = ['hanzi_to_meaning', 'pinyin_to_hanzi', 'listening'];
      const qType = types[idx % types.length];

      // Lấy 3 đáp án sai từ pool
      const wrongPool = pool.filter(v => v.id !== item.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const allChoices = [...wrongPool, item].sort(() => 0.5 - Math.random());

      return {
        type: qType,
        target: item,
        choices: allChoices
      };
    });
  }

  generateQuiz();

  function renderQuizInterface() {
    if (currentQIndex >= questions.length) {
      // Màn hình kết quả tổng kết
      const percentage = Math.round((score / questions.length) * 100);
      if (percentage >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      container.innerHTML = `
        <div class="quiz-page animate-fade-in">
          <div class="quiz-result-card glass-panel text-center">
            <div class="result-trophy">${percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪'}</div>
            <h2 class="result-title">Hoàn Thành Đấu Trường Trắc Nghiệm!</h2>
            <p class="result-subtitle">Kết quả kiểm tra của bạn</p>

            <div class="result-score-circle">
              <span class="score-number">${score} / ${questions.length}</span>
              <span class="score-percent">(${percentage}%)</span>
            </div>

            <div class="result-feedback">
              ${percentage >= 90 ? 'Xuất sắc! Bạn có phản xạ mặt chữ và phiên âm cực kỳ nhạy bén.' :
                percentage >= 70 ? 'Rất tốt! Bạn đã nắm vững hầu hết các từ vựng cốt lõi.' :
                'Cần cố gắng thêm! Hãy xem lại Flashcard và nghe lại bảng Pinyin để củng cố nhé.'}
            </div>

            <div class="result-actions">
              <button id="btnRestartQuiz" class="btn-primary-action">
                <span>🔄</span> Thử thách lại bài mới
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btnRestartQuiz').addEventListener('click', () => {
        playSound('click');
        generateQuiz();
        renderQuizInterface();
      });
      return;
    }

    const currentQ = questions[currentQIndex];
    const qNum = currentQIndex + 1;
    const totalQ = questions.length;

    container.innerHTML = `
      <div class="quiz-page animate-fade-in">
        <div class="page-header">
          <h1 class="page-title">Đấu Trường Trắc Nghiệm Phản Xạ HSK</h1>
          <p class="page-subtitle">Kiểm tra khả năng nhận diện chữ Hán, Pinyin và phản xạ nghe hiểu tức thì</p>
        </div>

        <div class="quiz-card-wrapper">
          <div class="quiz-progress-bar-wrap">
            <div class="quiz-meta-info">
              <span>Câu hỏi <strong>${qNum}</strong> / ${totalQ}</span>
              <span>Điểm hiện tại: <strong>${score}</strong></span>
            </div>
            <div class="quiz-track">
              <div class="quiz-fill" style="width: ${(qNum / totalQ) * 100}%"></div>
            </div>
          </div>

          <div class="quiz-main-card glass-panel">
            <div class="quiz-prompt-box">
              ${currentQ.type === 'hanzi_to_meaning' ? `
                <span class="q-type-badge">Nhận diện mặt chữ</span>
                <div class="q-hanzi-display">${currentQ.target.hanzi}</div>
                <div class="q-pinyin-display">${currentQ.target.pinyin} (Âm Hán-Việt: ${currentQ.target.hanViet})</div>
                <p class="q-question-text">Từ trên có ý nghĩa là gì?</p>
              ` : currentQ.type === 'pinyin_to_hanzi' ? `
                <span class="q-type-badge">Phiên âm & Nghĩa</span>
                <div class="q-pinyin-display-lg">${currentQ.target.pinyin}</div>
                <div class="q-meaning-hint">"${currentQ.target.meaning}" (Hán-Việt: ${currentQ.target.hanViet})</div>
                <p class="q-question-text">Chữ Hán nào dưới đây tương ứng?</p>
              ` : `
                <span class="q-type-badge">Luyện phản xạ nghe</span>
                <div class="q-audio-center">
                  <button id="btnPlayListeningAudio" class="btn-audio-huge" title="Bấm để nghe">
                    <span>🔊</span> Bấm Để Nghe Lại
                  </button>
                </div>
                <p class="q-question-text">Bạn vừa nghe thấy từ tiếng Trung nào?</p>
              `}
            </div>

            <!-- Choice Options -->
            <div class="quiz-choices-grid">
              ${currentQ.choices.map((ch, idx) => {
                let choiceText = '';
                if (currentQ.type === 'hanzi_to_meaning') {
                  choiceText = ch.meaning;
                } else {
                  choiceText = `${ch.hanzi} (${ch.pinyin})`;
                }

                return `
                  <button class="choice-btn" data-choice-id="${ch.id}" ${answered ? 'disabled' : ''}>
                    <span class="choice-letter">${['A', 'B', 'C', 'D'][idx]}</span>
                    <span class="choice-content">${choiceText}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Feedback section -->
            <div id="quizFeedbackBox" class="quiz-feedback-box hidden">
              <!-- Dynamically shown after answering -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Tự động phát âm thanh nếu là câu hỏi nghe
    if (currentQ.type === 'listening') {
      setTimeout(() => {
        speakChinese(currentQ.target.hanzi);
      }, 300);

      const listenBtn = container.querySelector('#btnPlayListeningAudio');
      if (listenBtn) {
        listenBtn.addEventListener('click', () => {
          speakChinese(currentQ.target.hanzi);
        });
      }
    }

    // Xử lý chọn đáp án
    const choiceBtns = container.querySelectorAll('.choice-btn');
    const feedbackBox = container.querySelector('#quizFeedbackBox');

    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const selectedId = parseInt(btn.dataset.choiceId, 10);
        const isCorrect = selectedId === currentQ.target.id;

        if (isCorrect) {
          score++;
          playSound('correct');
          btn.classList.add('correct');
        } else {
          playSound('wrong');
          btn.classList.add('wrong');
          // Highlight nút đúng
          choiceBtns.forEach(b => {
            if (parseInt(b.dataset.choiceId, 10) === currentQ.target.id) {
              b.classList.add('correct');
            }
          });
        }

        // Hiện giải thích chi tiết
        feedbackBox.classList.remove('hidden');
        feedbackBox.innerHTML = `
          <div class="feedback-inner ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
            <div class="fb-status">${isCorrect ? '✅ Chính xác!' : '❌ Chưa chính xác!'}</div>
            <div class="fb-detail">
              <strong>${currentQ.target.hanzi}</strong> (${currentQ.target.pinyin}) - Hán-Việt: <em>${currentQ.target.hanViet}</em> ➔ Nghĩa: <strong>${currentQ.target.meaning}</strong>
            </div>
            <div class="fb-example">
              <strong>Ví dụ:</strong> ${currentQ.target.exampleZh} (${currentQ.target.exampleVi})
            </div>
            <button id="btnNextQuestion" class="btn-next-q">
              <span>${currentQIndex === totalQ - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span> ➔
            </button>
          </div>
        `;

        container.querySelector('#btnNextQuestion').addEventListener('click', () => {
          playSound('click');
          currentQIndex++;
          answered = false;
          renderQuizInterface();
        });
      });
    });
  }

  renderQuizInterface();
}
