import { playSound, speakChinese } from '../utils/speech.js';
import confetti from 'canvas-confetti';

export function renderLessonReflex(container, lesson) {
  let activeMode = 'matching'; // 'matching' | 'lightning'
  let currentModeCleanup = null;

  function cleanupAll() {
    if (typeof currentModeCleanup === 'function') {
      currentModeCleanup();
      currentModeCleanup = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // Attach cleanup hook to container for external tab switchers
  container._cleanup = cleanupAll;

  function render() {
    cleanupAll();

    container.innerHTML = `
      <div class="lesson-reflex-wrapper animate-fade-in">
        <!-- Reflex Mode Switcher -->
        <div class="reflex-mode-switcher glass-panel">
          <button class="btn-reflex-mode ${activeMode === 'matching' ? 'active' : ''}" data-mode="matching">
            <span>⚡</span> Ghép Cặp Siêu Tốc (Speed Match)
          </button>
          <button class="btn-reflex-mode ${activeMode === 'lightning' ? 'active' : ''}" data-mode="lightning">
            <span>⏱️</span> Phản Xạ Chớp Nhoáng (5 Giây)
          </button>
        </div>

        <!-- Mode Content Container -->
        <div id="reflexModeContent" class="reflex-mode-content"></div>
      </div>
    `;

    const modeBtns = container.querySelectorAll('.btn-reflex-mode');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetMode = btn.dataset.mode;
        if (activeMode === targetMode) return; // Tránh bấm lại bị lặp vòng

        playSound('click');
        activeMode = targetMode;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderActiveMode();
      });
    });

    renderActiveMode();
  }

  function renderActiveMode() {
    cleanupAll();
    const contentEl = container.querySelector('#reflexModeContent');
    if (!contentEl) return;

    if (activeMode === 'matching') {
      currentModeCleanup = initSpeedMatch(contentEl, lesson);
    } else {
      currentModeCleanup = initLightningQuiz(contentEl, lesson);
    }
  }

  render();
}

/**
 * CHẾ ĐỘ 1: GHÉP CẶP SIÊU TỐC (Speed Match Matrix)
 */
function initSpeedMatch(container, lesson) {
  const words = [...lesson.words];
  // Chọn 8 từ ngẫu nhiên
  const selectedWords = [...words].sort(() => Math.random() - 0.5).slice(0, 8);

  const cards = [];
  selectedWords.forEach((w, idx) => {
    cards.push({
      id: `hz-${idx}`,
      pairId: idx,
      type: 'hanzi',
      text: w.hanzi,
      subText: w.pinyin,
      audio: w.hanzi
    });
    cards.push({
      id: `vi-${idx}`,
      pairId: idx,
      type: 'meaning',
      text: w.meaning,
      subText: '',
      audio: w.hanzi
    });
  });

  // Xáo trộn thẻ
  const shuffledCards = cards.sort(() => Math.random() - 0.5);

  let selectedFirst = null;
  let selectedSecond = null;
  let matchedPairs = 0;
  let timerInterval = null;
  let shakeTimeout = null;
  let elapsedSeconds = 0;
  let isTimerRunning = false;
  let isLocked = false;
  let combo = 0;

  function cleanup() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (shakeTimeout) {
      clearTimeout(shakeTimeout);
      shakeTimeout = null;
    }
  }

  container.innerHTML = `
    <div class="match-game-container">
      <div class="match-stats-bar glass-panel">
        <div class="match-stat-item">
          <span class="stat-label">Thời gian:</span>
          <span class="stat-value" id="matchTimer">00:00</span>
        </div>
        <div class="match-stat-item">
          <span class="stat-label">Đã ghép:</span>
          <span class="stat-value" id="matchCount">0 / 8 cặp</span>
        </div>
        <div class="match-stat-item">
          <span class="stat-label">Combo:</span>
          <span class="stat-value highlight" id="matchCombo">x0</span>
        </div>
        <button class="btn-lfc-tool" id="btnRestartMatch" style="margin-left: auto;">
          🔄 Vòng mới
        </button>
      </div>

      <div class="match-matrix-grid" id="matrixGrid">
        ${shuffledCards.map(c => `
          <div class="match-tile glass-panel ${c.type}" data-card-id="${c.id}" data-pair-id="${c.pairId}" data-audio="${c.audio}">
            <div class="tile-main">${c.text}</div>
            ${c.subText ? `<div class="tile-sub">${c.subText}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="match-victory-overlay hidden" id="matchVictory">
        <div class="victory-card glass-panel animate-scale-up">
          <div class="victory-icon">🏆</div>
          <h3 class="victory-title">Tuyệt Vời! Phản Xạ Thần Tốc!</h3>
          <p class="victory-desc">Bạn đã hoàn thành ghép 8 cặp từ vựng trong thời gian:</p>
          <div class="victory-time" id="victoryTimeVal">00:00</div>
          <button class="btn-primary" id="btnPlayAgainMatch" style="margin-top: 1rem;">
            ⚡ Tiếp Tục Luyện Vòng Khác
          </button>
        </div>
      </div>
    </div>
  `;

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      if (!container.isConnected) {
        cleanup();
        return;
      }
      elapsedSeconds++;
      const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      const secs = String(elapsedSeconds % 60).padStart(2, '0');
      const timerEl = container.querySelector('#matchTimer');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopTimer() {
    isTimerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // Gắn sự kiện click thẻ
  container.querySelectorAll('.match-tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLocked) return;
      if (tile.classList.contains('matched') || tile.classList.contains('selected')) return;

      startTimer();
      playSound('card_flip');

      // Phát âm nếu là thẻ chữ Hán
      if (tile.classList.contains('hanzi')) {
        speakChinese(tile.dataset.audio);
      }

      tile.classList.add('selected');

      if (!selectedFirst) {
        selectedFirst = tile;
      } else {
        selectedSecond = tile;
        checkMatch();
      }
    });
  });

  function checkMatch() {
    const pair1 = selectedFirst.dataset.pairId;
    const pair2 = selectedSecond.dataset.pairId;

    if (pair1 === pair2) {
      // Đúng cặp!
      playSound('correct');
      combo++;
      updateCombo();

      selectedFirst.classList.remove('selected');
      selectedSecond.classList.remove('selected');
      selectedFirst.classList.add('matched', 'animate-pulse');
      selectedSecond.classList.add('matched', 'animate-pulse');

      matchedPairs++;
      const countEl = container.querySelector('#matchCount');
      if (countEl) countEl.textContent = `${matchedPairs} / 8 cặp`;

      selectedFirst = null;
      selectedSecond = null;

      if (matchedPairs === 8) {
        stopTimer();
        playSound('success');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
        const secs = String(elapsedSeconds % 60).padStart(2, '0');
        const victoryEl = container.querySelector('#matchVictory');
        const timeValEl = container.querySelector('#victoryTimeVal');
        if (victoryEl && timeValEl) {
          timeValEl.textContent = `${mins} phút ${secs} giây`;
          victoryEl.classList.remove('hidden');
        }
      }
    } else {
      // Sai cặp
      playSound('wrong');
      combo = 0;
      updateCombo();
      isLocked = true;

      const card1 = selectedFirst;
      const card2 = selectedSecond;

      card1.classList.add('shake');
      card2.classList.add('shake');

      shakeTimeout = setTimeout(() => {
        if (!container.isConnected) return;
        if (card1) card1.classList.remove('selected', 'shake');
        if (card2) card2.classList.remove('selected', 'shake');
        selectedFirst = null;
        selectedSecond = null;
        isLocked = false;
        shakeTimeout = null;
      }, 700);
    }
  }

  function updateCombo() {
    const comboEl = container.querySelector('#matchCombo');
    if (comboEl) {
      comboEl.textContent = `x${combo}`;
      comboEl.style.color = combo >= 3 ? 'var(--crimson-500)' : 'var(--gold-500)';
    }
  }

  container.querySelector('#btnRestartMatch')?.addEventListener('click', () => {
    cleanup();
    initSpeedMatch(container, lesson);
  });

  container.querySelector('#btnPlayAgainMatch')?.addEventListener('click', () => {
    cleanup();
    initSpeedMatch(container, lesson);
  });

  return cleanup;
}

/**
 * CHẾ ĐỘ 2: PHẢN XẠ CHỚP NHOÁNG (Lightning Reflex Challenge)
 * - Tùy chọn 4 dạng bài: Chữ Hán ➔ Pinyin, Chữ Hán ➔ Nghĩa, Pinyin ➔ Nghĩa, Tổng hợp.
 * - Số lượng câu: words.length * 2 (mỗi từ xuất hiện 2 lần).
 * - Đếm ngược động: Ban đầu 10s, giảm 10% sau mỗi 3 câu đúng (sàn 3.0s).
 * - Hiệu ứng chọn đúng: Viền phát sáng ngọc bích, icon ✓, floating score toast.
 * - Trả lời sai / hết giờ: Dừng lại, highlight đỏ/xanh, hiển thị card ôn tập & nút Tiếp tục (hỗ trợ phím Space / Enter).
 * - Fix viền click button (:focus, :focus-visible).
 * - Bảng thống kê chi tiết: Đúng, Sai, %, Danh sách từ sai kèm audio, nút ôn lại chỉ các từ sai.
 * - Toggle bật/tắt tự động đọc audio.
 */
function initLightningQuiz(container, lesson) {
  const words = [...lesson.words];
  let activeQuizType = localStorage.getItem('hsk_reflex_quiz_type') || 'mixed';
  let autoAudio = localStorage.getItem('hsk_reflex_auto_audio') !== 'false';

  let quizQuestions = [];
  let currentQIdx = 0;
  let score = 0;
  let combo = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let wrongWords = new Map();

  let countdownTimer = null;
  let nextQTimeout = null;
  let count321Interval = null;
  let totalDurationMs = 10000;
  let remainingMs = 10000;
  let startTime = 0;
  let isAnswered = false;
  let isPaused = false;
  let isReviewingError = false;

  function getQuestionDuration(correctAnswers) {
    const step = Math.floor(correctAnswers / 3);
    const sec = Math.max(3.0, 10.0 * Math.pow(0.9, step));
    return {
      sec: parseFloat(sec.toFixed(1)),
      ms: Math.round(sec * 1000)
    };
  }

  function handleGlobalKeydown(e) {
    if (isReviewingError && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      proceedToNextQuestion();
    }
  }

  function cleanup() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    if (nextQTimeout) {
      clearTimeout(nextQTimeout);
      nextQTimeout = null;
    }
    if (count321Interval) {
      clearInterval(count321Interval);
      count321Interval = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    window.removeEventListener('keydown', handleGlobalKeydown);
  }

  window.addEventListener('keydown', handleGlobalKeydown);

  // Sinh bộ câu hỏi (mỗi từ xuất hiện 2 lần)
  function generateQuizQuestions(sourceWords, quizType) {
    if (!sourceWords || sourceWords.length === 0) return [];

    let pool = [];
    sourceWords.forEach(w => {
      pool.push({ word: w });
      pool.push({ word: w });
    });
    pool = pool.sort(() => Math.random() - 0.5);

    const subTypes = ['hanzi_to_pinyin', 'hanzi_to_meaning', 'pinyin_to_meaning'];

    return pool.map((item) => {
      const w = item.word;
      let qType = quizType;
      if (qType === 'mixed') {
        qType = subTypes[Math.floor(Math.random() * subTypes.length)];
      }

      let promptMain = '';
      let promptSub = '';
      let qTypeLabel = '';
      let correctText = '';
      let wrongTexts = [];

      if (qType === 'hanzi_to_pinyin') {
        qTypeLabel = '🔤 Chữ Hán ➔ Pinyin';
        promptMain = w.hanzi;
        promptSub = 'Chọn Pinyin chuẩn xác';
        correctText = w.pinyin;
        wrongTexts = words
          .filter(x => x.hanzi !== w.hanzi && x.pinyin !== w.pinyin)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(x => x.pinyin);
      } else if (qType === 'hanzi_to_meaning') {
        qTypeLabel = '📖 Chữ Hán ➔ Nghĩa';
        promptMain = w.hanzi;
        promptSub = w.pinyin;
        correctText = w.meaning;
        wrongTexts = words
          .filter(x => x.hanzi !== w.hanzi && x.meaning !== w.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(x => x.meaning);
      } else {
        qTypeLabel = '🎧 Pinyin ➔ Nghĩa';
        promptMain = w.pinyin;
        promptSub = 'Nhận diện Pinyin chọn nghĩa';
        correctText = w.meaning;
        wrongTexts = words
          .filter(x => x.hanzi !== w.hanzi && x.meaning !== w.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(x => x.meaning);
      }

      // Bổ sung đáp án nhiễu nếu bài học có quá ít từ
      while (wrongTexts.length < 3) {
        wrongTexts.push(qType === 'hanzi_to_pinyin' ? 'tā' : 'Từ vựng khác');
      }

      const choices = [...wrongTexts, correctText].sort(() => Math.random() - 0.5);
      const correctIdx = choices.indexOf(correctText);

      return {
        word: w,
        qType,
        qTypeLabel,
        promptMain,
        promptSub,
        choices,
        correctIdx
      };
    });
  }

  // 1. MÀN HÌNH SẴN SÀNG (READY SCREEN)
  function renderReadyScreen() {
    cleanup();
    window.addEventListener('keydown', handleGlobalKeydown);

    const totalQuestionsCount = words.length * 2;

    container.innerHTML = `
      <div class="lightning-ready-card glass-panel animate-scale-up">
        <div class="ready-badge">⏱️ THỬ THÁCH PHẢN XẠ TỐC ĐỘ CAO</div>
        <h2 class="ready-title">Phản Xạ Chớp Nhoáng</h2>
        <p class="ready-desc">
          Kích hoạt khả năng kết nối tức thì giữa <strong>Mặt chữ ↔ Pinyin ↔ Ngữ nghĩa</strong>. Đồng hồ sẽ tăng tốc độ theo từng câu đúng!
        </p>

        <!-- Bộ chọn dạng bài tập -->
        <div class="lightning-quiz-type-selector">
          <div class="quiz-type-label">
            <span>🎯</span> Chọn Dạng Bài Tập:
          </div>
          <div class="quiz-type-grid">
            <button class="btn-quiz-type ${activeQuizType === 'mixed' ? 'active' : ''}" data-type="mixed">
              <span class="qt-badge">Khuyên Dùng</span>
              <div class="qt-title">🎲 Tổng Hợp</div>
              <div class="qt-desc">Xáo trộn ngẫu nhiên cả 3 dạng rèn luyện phản xạ đa giác quan</div>
            </button>
            <button class="btn-quiz-type ${activeQuizType === 'hanzi_to_meaning' ? 'active' : ''}" data-type="hanzi_to_meaning">
              <div class="qt-title">📖 Chữ Hán ➔ Nghĩa</div>
              <div class="qt-desc">Nhìn mặt chữ Hán, phản xạ chọn ngay ngữ nghĩa tiếng Việt</div>
            </button>
            <button class="btn-quiz-type ${activeQuizType === 'hanzi_to_pinyin' ? 'active' : ''}" data-type="hanzi_to_pinyin">
              <div class="qt-title">🔤 Chữ Hán ➔ Pinyin</div>
              <div class="qt-desc">Nhìn mặt chữ Hán, phản xạ chọn chuẩn xác phiên âm Pinyin</div>
            </button>
            <button class="btn-quiz-type ${activeQuizType === 'pinyin_to_meaning' ? 'active' : ''}" data-type="pinyin_to_meaning">
              <div class="qt-title">🎧 Pinyin ➔ Nghĩa</div>
              <div class="qt-desc">Đọc & nghe Pinyin (ẩn chữ Hán), phản xạ ngữ nghĩa tiếng Việt</div>
            </button>
          </div>
        </div>

        <div class="ready-features-grid">
          <div class="feature-item glass-panel">
            <span class="f-icon">📝</span>
            <div class="f-info">
              <strong>${totalQuestionsCount} Câu Hỏi</strong>
              <span>Mỗi từ xuất hiện 2 lần</span>
            </div>
          </div>
          <div class="feature-item glass-panel">
            <span class="f-icon">⏱️</span>
            <div class="f-info">
              <strong>Thời Gian Động</strong>
              <span>Bắt đầu 10s, -10% mỗi 3 câu đúng</span>
            </div>
          </div>
          <div class="feature-item glass-panel">
            <span class="f-icon">⚡</span>
            <div class="f-info">
              <strong>Thưởng Tốc Độ</strong>
              <span>Chọn càng nhanh điểm càng cao</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem; display: flex; justify-content: center;">
          <button class="btn-l-ctrl ${autoAudio ? 'active-audio' : ''}" id="btnToggleAudioReady" style="padding: 0.6rem 1.25rem; font-size: 0.88rem; border-radius: var(--radius-full);">
            ${autoAudio ? '🔊 Tự động phát âm: ĐANG BẬT' : '🔇 Tự động phát âm: ĐANG TẮT'}
          </button>
        </div>

        <div class="ready-action-row">
          <button class="btn-primary-action btn-pulse" id="btnStartLightningChallenge">
            <span>⚡ Bắt Đầu Thử Thách (${totalQuestionsCount} Câu)</span>
          </button>
        </div>
      </div>
    `;

    // Chọn dạng bài tập
    container.querySelectorAll('.btn-quiz-type').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        activeQuizType = btn.dataset.type;
        localStorage.setItem('hsk_reflex_quiz_type', activeQuizType);
        container.querySelectorAll('.btn-quiz-type').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Toggle âm thanh trên ready screen
    container.querySelector('#btnToggleAudioReady')?.addEventListener('click', (e) => {
      playSound('click');
      autoAudio = !autoAudio;
      localStorage.setItem('hsk_reflex_auto_audio', autoAudio);
      const btn = e.currentTarget;
      btn.classList.toggle('active-audio', autoAudio);
      btn.textContent = autoAudio ? '🔊 Tự động phát âm: ĐANG BẬT' : '🔇 Tự động phát âm: ĐANG TẮT';
    });

    container.querySelector('#btnStartLightningChallenge')?.addEventListener('click', () => {
      playSound('click');
      startCountdown321();
    });
  }

  // 2. ĐẾM NGƯỢC 3.. 2.. 1.. GO
  function startCountdown321(customWords = null) {
    cleanup();
    window.addEventListener('keydown', handleGlobalKeydown);
    let count = 3;

    container.innerHTML = `
      <div class="lightning-countdown-overlay glass-panel animate-scale-up">
        <div class="cd-title">Chuẩn bị phản xạ tốc độ...</div>
        <div class="cd-number animate-pulse" id="cdNumberText">${count}</div>
        <div class="cd-hint">Tập trung quan sát và đưa ra lựa chọn nhanh nhất!</div>
      </div>
    `;

    playSound('click');

    count321Interval = setInterval(() => {
      if (!container.isConnected) {
        cleanup();
        return;
      }

      count--;
      const numEl = container.querySelector('#cdNumberText');
      if (count > 0) {
        playSound('click');
        if (numEl) {
          numEl.textContent = count;
          numEl.classList.remove('animate-pulse');
          void numEl.offsetWidth; // trigger reflow
          numEl.classList.add('animate-pulse');
        }
      } else {
        clearInterval(count321Interval);
        count321Interval = null;
        if (numEl) numEl.textContent = 'CHIẾN! 🔥';
        playSound('success');
        setTimeout(() => {
          if (!container.isConnected) return;
          startQuizGame(customWords);
        }, 500);
      }
    }, 850);
  }

  // 3. KHỞI TẠO BỘ ĐỀ VÀ BẮT ĐẦU
  function startQuizGame(customSourceWords = null) {
    cleanup();
    window.addEventListener('keydown', handleGlobalKeydown);

    const source = customSourceWords || words;
    quizQuestions = generateQuizQuestions(source, activeQuizType);
    currentQIdx = 0;
    score = 0;
    combo = 0;
    correctCount = 0;
    wrongCount = 0;
    wrongWords.clear();
    isPaused = false;
    isReviewingError = false;

    renderQuestion();
  }

  // 4. HIỂN THỊ CÂU HỎI
  function renderQuestion() {
    cleanup();
    window.addEventListener('keydown', handleGlobalKeydown);

    if (!container.isConnected) return;

    if (currentQIdx >= quizQuestions.length) {
      renderQuizSummary();
      return;
    }

    isAnswered = false;
    isPaused = false;
    isReviewingError = false;

    const q = quizQuestions[currentQIdx];
    const durationInfo = getQuestionDuration(correctCount);
    totalDurationMs = durationInfo.ms;
    remainingMs = totalDurationMs;

    // Phát âm tự động nếu bật
    if (autoAudio) {
      speakChinese(q.word.hanzi);
    }

    container.innerHTML = `
      <div class="lightning-quiz-container animate-fade-in">
        <!-- Header & Control Bar -->
        <div class="lightning-stats-bar glass-panel">
          <div class="l-stat">
            <span>Câu hỏi:</span>
            <strong>${currentQIdx + 1} / ${quizQuestions.length}</strong>
          </div>
          <div class="l-stat">
            <span>Thời gian:</span>
            <strong class="highlight" id="lDurationLimit">⏱️ ${durationInfo.sec.toFixed(1)}s</strong>
          </div>
          <div class="l-stat">
            <span>Điểm:</span>
            <strong class="highlight" id="lScore">${score}</strong>
          </div>
          <div class="l-stat">
            <span>Combo:</span>
            <strong id="lCombo">x${combo}</strong>
          </div>

          <!-- Controls: Audio Toggle, Pause, Quit -->
          <div class="lightning-ctrl-actions" style="margin-left: auto; display: flex; gap: 0.4rem; align-items: center;">
            <button class="btn-l-ctrl ${autoAudio ? 'active-audio' : ''}" id="btnToggleAudio" title="Bật/Tắt tự động đọc âm">
              ${autoAudio ? '🔊 Đọc: Bật' : '🔇 Đọc: Tắt'}
            </button>
            <button class="btn-l-ctrl" id="btnPauseLightning" title="Tạm dừng hoặc tiếp tục">
              ⏸️ Tạm Dừng
            </button>
            <button class="btn-l-ctrl danger" id="btnQuitLightning" title="Dừng thử thách">
              ⏹️ Thoát
            </button>
          </div>
        </div>

        <!-- Timer Bar -->
        <div class="lightning-timer-wrapper">
          <div class="lightning-timer-fill" id="lTimerFill" style="width: 100%;"></div>
        </div>

        <!-- Question Card -->
        <div class="lightning-card glass-panel" id="lQuestionCard" style="position: relative;">
          <div id="scoreFloatContainer"></div>
          <span class="lightning-qtype-tag">${q.qTypeLabel}</span>
          <div class="lightning-hanzi">${q.promptMain}</div>
          <div class="lightning-pinyin">${q.promptSub}</div>
          <button class="btn-audio-circle-sm" id="btnRepeatAudio" title="Nghe phát âm">🔊</button>
        </div>

        <!-- Choices Grid -->
        <div class="lightning-choices-grid" id="lChoicesGrid">
          ${q.choices.map((ch, idx) => `
            <button class="btn-lightning-choice glass-panel" data-choice-idx="${idx}">
              <span class="choice-tag">${['A', 'B', 'C', 'D'][idx]}</span>
              <span class="choice-text">${ch}</span>
            </button>
          `).join('')}
        </div>

        <!-- Review Container (Khu vực hiển thị câu sai & nút Tiếp Tục) -->
        <div id="reviewContainer"></div>

        <!-- Pause Overlay -->
        <div class="lightning-pause-overlay hidden" id="lPauseOverlay">
          <div class="pause-box glass-panel animate-scale-up">
            <div class="pause-icon">⏸️</div>
            <h3>Đang Tạm Dừng Thử Thách</h3>
            <p>Đồng hồ đếm ngược đã dừng. Hãy sẵn sàng và tiếp tục.</p>
            <div class="pause-btns">
              <button class="btn-primary" id="btnResumeLightning">▶️ Tiếp Tục Chơi</button>
              <button class="btn-ghost-sm" id="btnQuitFromPause" style="margin-top: 0.5rem;">⏹️ Thoát về menu</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Nghe lại phát âm thủ công
    container.querySelector('#btnRepeatAudio')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakChinese(q.word.hanzi);
    });

    // Toggle âm thanh
    container.querySelector('#btnToggleAudio')?.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      autoAudio = !autoAudio;
      localStorage.setItem('hsk_reflex_auto_audio', autoAudio);
      const btn = e.currentTarget;
      btn.classList.toggle('active-audio', autoAudio);
      btn.textContent = autoAudio ? '🔊 Đọc: Bật' : '🔇 Đọc: Tắt';
    });

    // Nút Tạm dừng
    container.querySelector('#btnPauseLightning')?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePause();
    });

    // Nút Thoát
    container.querySelector('#btnQuitLightning')?.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      cleanup();
      renderReadyScreen();
    });

    // Nút Tiếp tục từ overlay
    container.querySelector('#btnResumeLightning')?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePause();
    });

    // Nút Thoát từ overlay
    container.querySelector('#btnQuitFromPause')?.addEventListener('click', (e) => {
      e.stopPropagation();
      cleanup();
      renderReadyScreen();
    });

    // Bắt đầu đếm ngược
    runCountdownTimer();

    // Gắn sự kiện chọn đáp án
    container.querySelectorAll('.btn-lightning-choice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAnswered || isPaused || isReviewingError) return;

        isAnswered = true;
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }

        const chosenIdx = parseInt(btn.dataset.choiceIdx, 10);
        const elapsed = Date.now() - startTime;
        handleAnswer(chosenIdx, q.correctIdx, elapsed, q);
      });
    });
  }

  // Chạy đồng hồ đếm ngược
  function runCountdownTimer() {
    if (countdownTimer) clearInterval(countdownTimer);

    startTime = Date.now();
    const initialRemaining = remainingMs;
    const timerFillEl = container.querySelector('#lTimerFill');

    countdownTimer = setInterval(() => {
      if (!container.isConnected) {
        cleanup();
        return;
      }

      if (isAnswered || isPaused || isReviewingError) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        return;
      }

      const elapsed = Date.now() - startTime;
      remainingMs = Math.max(0, initialRemaining - elapsed);
      const percent = (remainingMs / totalDurationMs) * 100;

      if (timerFillEl) {
        timerFillEl.style.width = `${percent}%`;
        if (percent < 30) {
          timerFillEl.style.background = 'var(--crimson-500)';
        } else if (percent < 60) {
          timerFillEl.style.background = 'var(--gold-500)';
        }
      }

      if (remainingMs <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        const q = quizQuestions[currentQIdx];
        handleAnswerTimeout(q.correctIdx, q);
      }
    }, 40);
  }

  // Tạm dừng / Tiếp tục
  function togglePause() {
    isPaused = !isPaused;
    const pauseOverlay = container.querySelector('#lPauseOverlay');
    const pauseBtn = container.querySelector('#btnPauseLightning');

    if (isPaused) {
      playSound('click');
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
      pauseOverlay?.classList.remove('hidden');
      if (pauseBtn) pauseBtn.textContent = '▶️ Tiếp Tục';
    } else {
      playSound('click');
      pauseOverlay?.classList.add('hidden');
      if (pauseBtn) pauseBtn.textContent = '⏸️ Tạm Dừng';
      runCountdownTimer();
    }
  }

  // Xử lý khi chọn đáp án
  function handleAnswer(chosenIdx, correctIdx, elapsedMs, q) {
    const buttons = container.querySelectorAll('.btn-lightning-choice');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.classList.add('correct');
        const badge = document.createElement('span');
        badge.className = 'choice-feedback-badge success';
        badge.textContent = '✓ Đúng';
        btn.appendChild(badge);
      }
      if (idx === chosenIdx && chosenIdx !== correctIdx) {
        btn.classList.add('wrong');
        const badge = document.createElement('span');
        badge.className = 'choice-feedback-badge wrong';
        badge.textContent = '✗ Sai';
        btn.appendChild(badge);
      }
    });

    if (chosenIdx === correctIdx) {
      // ĐÚNG
      playSound('correct');
      correctCount++;
      combo++;

      // Thưởng tốc độ
      const speedBonus = Math.max(0, Math.round((remainingMs / 1000) * 12));
      const points = 50 + speedBonus + (combo * 15);
      score += points;

      const scoreEl = container.querySelector('#lScore');
      const comboEl = container.querySelector('#lCombo');
      if (scoreEl) scoreEl.textContent = score;
      if (comboEl) comboEl.textContent = `x${combo}`;

      // Toast hiệu ứng điểm bay lên
      const floatContainer = container.querySelector('#scoreFloatContainer');
      if (floatContainer) {
        const toast = document.createElement('div');
        toast.className = 'score-float-toast';
        toast.textContent = `+${points} ⚡`;
        floatContainer.appendChild(toast);
      }

      // Tự động chuyển câu sau 850ms
      nextQTimeout = setTimeout(() => {
        if (!container.isConnected) return;
        currentQIdx++;
        renderQuestion();
      }, 850);
    } else {
      // SAI
      playSound('wrong');
      wrongCount++;
      combo = 0;
      const comboEl = container.querySelector('#lCombo');
      if (comboEl) comboEl.textContent = 'x0';

      // Lưu từ sai
      wrongWords.set(q.word.hanzi, q.word);

      // DỪNG LẠI TẠI CÂU SAI & HIỂN THỊ REVIEW BOX
      showErrorReviewBox(q, false);
    }
  }

  // Xử lý khi hết giờ (Timeout)
  function handleAnswerTimeout(correctIdx, q) {
    isAnswered = true;
    playSound('wrong');
    wrongCount++;
    combo = 0;

    const comboEl = container.querySelector('#lCombo');
    if (comboEl) comboEl.textContent = 'x0';

    // Lưu từ sai
    wrongWords.set(q.word.hanzi, q.word);

    const buttons = container.querySelectorAll('.btn-lightning-choice');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.classList.add('correct');
        const badge = document.createElement('span');
        badge.className = 'choice-feedback-badge success';
        badge.textContent = '✓ Đáp án đúng';
        btn.appendChild(badge);
      }
    });

    // DỪNG LẠI TẠI CÂU SAI DO HẾT GIỜ
    showErrorReviewBox(q, true);
  }

  // Hiển thị hộp ôn tập câu sai và nút Tiếp Tục
  function showErrorReviewBox(q, isTimeout) {
    isReviewingError = true;
    const reviewContainer = container.querySelector('#reviewContainer');
    if (!reviewContainer) return;

    reviewContainer.innerHTML = `
      <div class="lightning-error-review animate-scale-up">
        <div class="review-header">
          <span class="review-badge-error">
            ${isTimeout ? '⏰ Hết 10 giây' : '⚠️ Lựa chọn chưa chính xác'} - Hãy ghi nhớ từ này:
          </span>
          <button class="btn-audio-circle-sm" id="btnReviewAudio" title="Nghe phát âm">🔊</button>
        </div>
        <div class="review-content-box">
          <div class="review-hanzi">${q.word.hanzi}</div>
          <div class="review-details">
            <div class="review-pinyin">${q.word.pinyin}</div>
            <div class="review-meaning">${q.word.meaning}</div>
          </div>
        </div>
        <div class="review-action-row">
          <button class="btn-next-after-wrong" id="btnNextAfterWrong">
            Tiếp Tục ➔ <span style="font-size: 0.78rem; opacity: 0.85;">(Phím Space / Enter)</span>
          </button>
        </div>
      </div>
    `;

    reviewContainer.querySelector('#btnReviewAudio')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakChinese(q.word.hanzi);
    });

    reviewContainer.querySelector('#btnNextAfterWrong')?.addEventListener('click', (e) => {
      e.stopPropagation();
      proceedToNextQuestion();
    });

    // Cuộn nhẹ xuống để thấy rõ hộp ôn tập trên màn hình nhỏ
    reviewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function proceedToNextQuestion() {
    if (!isReviewingError) return;
    playSound('click');
    isReviewingError = false;
    currentQIdx++;
    renderQuestion();
  }

  // 5. MÀN HÌNH TỔNG KẾT
  function renderQuizSummary() {
    cleanup();
    window.addEventListener('keydown', handleGlobalKeydown);

    const totalQ = quizQuestions.length;
    const accuracy = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const wrongWordsArr = Array.from(wrongWords.values());

    let rank = 'Khởi Động Nhẹ Nhàng 🐢';
    let icon = '🌱';
    if (accuracy >= 85 && score >= 800) {
      rank = 'Thần Tốc Bậc Thầy ⚡⚡';
      icon = '🏆';
      playSound('success');
      confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 } });
    } else if (accuracy >= 65) {
      rank = 'Nhanh Nhẹn Xuất Sắc 🏃';
      icon = '🌟';
      playSound('success');
    }

    container.innerHTML = `
      <div class="lightning-summary glass-panel animate-scale-up">
        <div class="summary-icon">${icon}</div>
        <h2 class="summary-title">Hoàn Thành Thử Thách Phản Xạ!</h2>
        <div class="summary-score-badge">${score} Điểm</div>
        <div class="summary-rank-tag">Danh hiệu: <strong>${rank}</strong></div>

        <!-- Ma trận thống kê 4 ô -->
        <div class="summary-stats-matrix">
          <div class="summary-stat-cell">
            <span class="s-val success">${correctCount}</span>
            <span class="s-lbl">Câu đúng</span>
          </div>
          <div class="summary-stat-cell">
            <span class="s-val danger">${wrongCount}</span>
            <span class="s-lbl">Câu sai</span>
          </div>
          <div class="summary-stat-cell">
            <span class="s-val highlight">${accuracy}%</span>
            <span class="s-lbl">Độ chính xác</span>
          </div>
          <div class="summary-stat-cell">
            <span class="s-val">${totalQ}</span>
            <span class="s-lbl">Tổng câu</span>
          </div>
        </div>

        <!-- Danh sách từ đã làm sai cần ôn lại -->
        <div class="wrong-words-section">
          ${wrongWordsArr.length > 0 ? `
            <div class="wrong-words-title">
              <span>⚠️</span> Cần Ôn Lại (${wrongWordsArr.length} từ chưa nhớ):
            </div>
            <div class="wrong-words-grid">
              ${wrongWordsArr.map(w => `
                <div class="wrong-word-card">
                  <div class="wwc-info">
                    <div class="wwc-hanzi">${w.hanzi}</div>
                    <div class="wwc-pinyin">${w.pinyin}</div>
                    <div class="wwc-meaning">${w.meaning}</div>
                  </div>
                  <button class="btn-audio-circle-sm btn-speak-wrong" data-hanzi="${w.hanzi}" title="Nghe phát âm">🔊</button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="margin: 1.5rem 0; color: #34d399; font-weight: 800; font-size: 1.1rem; text-align: center;">
              🎉 Đỉnh cao phản xạ! Bạn không trả lời sai bất kỳ từ nào!
            </div>
          `}
        </div>

        <!-- Cụm nút hành động -->
        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
          ${wrongWordsArr.length > 0 ? `
            <button class="btn-primary" id="btnRetestWrongWords" style="background: linear-gradient(135deg, #ef4444, #f59e0b);">
              🎯 Chỉ Ôn Lại Các Từ Sai (${wrongWordsArr.length} từ)
            </button>
          ` : ''}
          <button class="btn-primary" id="btnRestartAll">
            ⚡ Luyện Lại Cả Bài (${words.length * 2} Câu)
          </button>
          <button class="btn-ghost-sm" id="btnBackToReady" style="padding: 0.75rem 1.25rem;">
            📋 Về Menu Sẵn Sàng
          </button>
        </div>
      </div>
    `;

    // Phát âm các từ sai
    container.querySelectorAll('.btn-speak-wrong').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakChinese(btn.dataset.hanzi);
      });
    });

    // Chỉ ôn lại các từ sai
    container.querySelector('#btnRetestWrongWords')?.addEventListener('click', () => {
      playSound('click');
      startCountdown321(wrongWordsArr);
    });

    // Luyện lại cả bài
    container.querySelector('#btnRestartAll')?.addEventListener('click', () => {
      playSound('click');
      startCountdown321();
    });

    // Về menu sẵn sàng
    container.querySelector('#btnBackToReady')?.addEventListener('click', () => {
      playSound('click');
      renderReadyScreen();
    });
  }

  // Bắt đầu từ Màn hình Sẵn sàng
  renderReadyScreen();

  return cleanup;
}
