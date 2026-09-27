import { playSound, speakChinese } from '../utils/speech.js';
import confetti from 'canvas-confetti';

export function renderLessonReflex(container, lesson) {
  let activeMode = 'matching'; // 'matching' | 'lightning'

  function render() {
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
        playSound('click');
        activeMode = btn.dataset.mode;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderActiveMode();
      });
    });

    renderActiveMode();
  }

  function renderActiveMode() {
    const contentEl = container.querySelector('#reflexModeContent');
    if (activeMode === 'matching') {
      initSpeedMatch(contentEl, lesson);
    } else {
      initLightningQuiz(contentEl, lesson);
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
      subText: w.hanViet || '',
      audio: w.hanzi
    });
  });

  // Xáo trộn thẻ
  const shuffledCards = cards.sort(() => Math.random() - 0.5);

  let selectedFirst = null;
  let selectedSecond = null;
  let matchedPairs = 0;
  let timerInterval = null;
  let elapsedSeconds = 0;
  let isTimerRunning = false;
  let isLocked = false;
  let combo = 0;

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
      elapsedSeconds++;
      const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      const secs = String(elapsedSeconds % 60).padStart(2, '0');
      const timerEl = container.querySelector('#matchTimer');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopTimer() {
    isTimerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
  }

  // Gắn sự kiện click thẻ
  container.querySelectorAll('.match-tile').forEach(tile => {
    tile.addEventListener('click', () => {
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

      selectedFirst.classList.add('shake');
      selectedSecond.classList.add('shake');

      setTimeout(() => {
        if (selectedFirst) selectedFirst.classList.remove('selected', 'shake');
        if (selectedSecond) selectedSecond.classList.remove('selected', 'shake');
        selectedFirst = null;
        selectedSecond = null;
        isLocked = false;
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
    stopTimer();
    initSpeedMatch(container, lesson);
  });

  container.querySelector('#btnPlayAgainMatch')?.addEventListener('click', () => {
    stopTimer();
    initSpeedMatch(container, lesson);
  });
}

/**
 * CHẾ ĐỘ 2: PHẢN XẠ CHỚP NHOÁNG 5 GIÂY (Lightning Reflex Quiz)
 */
function initLightningQuiz(container, lesson) {
  const words = [...lesson.words];
  // Tạo 10 câu hỏi ngẫu nhiên từ bài
  const quizWords = [...words].sort(() => Math.random() - 0.5).slice(0, 10);

  let currentQIdx = 0;
  let score = 0;
  let combo = 0;
  let countdownTimer = null;
  let timeLeftMs = 5000;
  let isAnswered = false;

  function renderQuestion() {
    if (currentQIdx >= quizWords.length) {
      renderQuizSummary();
      return;
    }

    isAnswered = false;
    timeLeftMs = 5000;
    const word = quizWords[currentQIdx];

    // Phát âm từ vựng
    speakChinese(word.hanzi);

    // 3 phương án sai
    const wrongOptions = words
      .filter(w => w.hanzi !== word.hanzi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);

    const choices = [...wrongOptions, word.meaning].sort(() => Math.random() - 0.5);
    const correctIdx = choices.indexOf(word.meaning);

    container.innerHTML = `
      <div class="lightning-quiz-container">
        <!-- Header -->
        <div class="lightning-stats-bar glass-panel">
          <div class="l-stat">
            <span>Câu hỏi:</span>
            <strong>${currentQIdx + 1} / 10</strong>
          </div>
          <div class="l-stat">
            <span>Điểm:</span>
            <strong class="highlight" id="lScore">${score}</strong>
          </div>
          <div class="l-stat">
            <span>Chuỗi Combo:</span>
            <strong id="lCombo">x${combo}</strong>
          </div>
        </div>

        <!-- 5-Second Timer Bar -->
        <div class="lightning-timer-wrapper">
          <div class="lightning-timer-fill" id="lTimerFill" style="width: 100%;"></div>
        </div>

        <!-- Question Card -->
        <div class="lightning-card glass-panel animate-fade-in">
          <div class="lightning-hanzi">${word.hanzi}</div>
          <div class="lightning-pinyin">${word.pinyin}</div>
          <button class="btn-audio-circle-sm" id="btnRepeatAudio" title="Nghe lại">🔊</button>
        </div>

        <!-- Choices List -->
        <div class="lightning-choices-grid">
          ${choices.map((ch, idx) => `
            <button class="btn-lightning-choice glass-panel" data-choice-idx="${idx}">
              <span class="choice-tag">${['A', 'B', 'C', 'D'][idx]}</span>
              <span class="choice-text">${ch}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btnRepeatAudio')?.addEventListener('click', () => {
      speakChinese(word.hanzi);
    });

    // Bắt đầu đếm ngược 5s
    const timerFillEl = container.querySelector('#lTimerFill');
    const startTime = Date.now();
    const totalDuration = 5000;

    countdownTimer = setInterval(() => {
      if (isAnswered) {
        clearInterval(countdownTimer);
        return;
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalDuration - elapsed);
      const percent = (remaining / totalDuration) * 100;

      if (timerFillEl) {
        timerFillEl.style.width = `${percent}%`;
        if (percent < 30) {
          timerFillEl.style.background = 'var(--crimson-500)';
        }
      }

      if (remaining <= 0) {
        clearInterval(countdownTimer);
        handleAnswerTimeout(correctIdx);
      }
    }, 50);

    // Gắn sự kiện chọn đáp án
    container.querySelectorAll('.btn-lightning-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isAnswered) return;
        isAnswered = true;
        clearInterval(countdownTimer);

        const chosenIdx = parseInt(btn.dataset.choiceIdx, 10);
        const elapsed = Date.now() - startTime;
        handleAnswer(chosenIdx, correctIdx, elapsed);
      });
    });
  }

  function handleAnswer(chosenIdx, correctIdx, elapsedMs) {
    const buttons = container.querySelectorAll('.btn-lightning-choice');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
      if (idx === chosenIdx && chosenIdx !== correctIdx) btn.classList.add('wrong');
    });

    if (chosenIdx === correctIdx) {
      playSound('correct');
      combo++;
      // Thưởng điểm theo tốc độ (nhanh nhất 100 điểm, chậm nhất 50 điểm)
      const speedBonus = Math.max(0, Math.round((5000 - elapsedMs) / 50));
      const points = 50 + speedBonus + (combo * 10);
      score += points;
    } else {
      playSound('wrong');
      combo = 0;
    }

    setTimeout(() => {
      currentQIdx++;
      renderQuestion();
    }, 1000);
  }

  function handleAnswerTimeout(correctIdx) {
    isAnswered = true;
    playSound('wrong');
    combo = 0;

    const buttons = container.querySelectorAll('.btn-lightning-choice');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
    });

    setTimeout(() => {
      currentQIdx++;
      renderQuestion();
    }, 1200);
  }

  function renderQuizSummary() {
    let rank = 'Nhẹ Nhàng 🐢';
    let icon = '🌱';
    if (score >= 1000) {
      rank = 'Thần Tốc Bậc Thầy ⚡⚡';
      icon = '🏆';
      playSound('success');
      confetti({ particleCount: 120, spread: 80 });
    } else if (score >= 600) {
      rank = 'Nhanh Nhẹn Xuất Sắc 🏃';
      icon = '🌟';
      playSound('success');
    }

    container.innerHTML = `
      <div class="lightning-summary glass-panel animate-scale-up">
        <div class="summary-icon">${icon}</div>
        <h3 class="summary-title">Hoàn Thành Thử Thách Phản Xạ!</h3>
        <div class="summary-score-badge">${score} Điểm</div>
        <div class="summary-rank-tag">Danh hiệu: <strong>${rank}</strong></div>
        <button class="btn-primary" id="btnRestartLightning" style="margin-top: 1.5rem;">
          ⚡ Chơi Lại Vòng Khác
        </button>
      </div>
    `;

    container.querySelector('#btnRestartLightning')?.addEventListener('click', () => {
      initLightningQuiz(container, lesson);
    });
  }

  renderQuestion();
}
