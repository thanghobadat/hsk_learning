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
 * CHẾ ĐỘ 2: PHẢN XẠ CHỚP NHOÁNG 5 GIÂY (Lightning Reflex Quiz)
 * - Màn hình Sẵn sàng trước khi chạy.
 * - Cho phép Tạm dừng / Dừng lại bất kỳ lúc nào.
 * - Cleanup an toàn, triệt tiêu hoàn toàn zombie timer & spam audio.
 */
function initLightningQuiz(container, lesson) {
  const words = [...lesson.words];
  let quizWords = [];
  let currentQIdx = 0;
  let score = 0;
  let combo = 0;
  let countdownTimer = null;
  let nextQTimeout = null;
  let count321Interval = null;
  let totalDurationMs = 5000;
  let remainingMs = 5000;
  let startTime = 0;
  let isAnswered = false;
  let isPaused = false;
  let currentCorrectIdx = -1;

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
  }

  // 1. MÀN HÌNH SẴN SÀNG (READY SCREEN)
  function renderReadyScreen() {
    cleanup();

    container.innerHTML = `
      <div class="lightning-ready-card glass-panel animate-scale-up">
        <div class="ready-badge">⏱️ THỬ THÁCH PHẢN XẠ TỐC ĐỘ CAO</div>
        <h2 class="ready-title">Phản Xạ Chớp Nhoáng (5 Giây)</h2>
        <p class="ready-desc">
          Bộ não của bạn sẽ được kích hoạt phản xạ liên tưởng tức thì. Mỗi câu hỏi chỉ có đúng <strong>5 giây</strong> đếm ngược!
        </p>

        <div class="ready-features-grid">
          <div class="feature-item glass-panel">
            <span class="f-icon">⏱️</span>
            <div class="f-info">
              <strong>5 Giây / Câu</strong>
              <span>Đồng hồ đếm ngược tự động</span>
            </div>
          </div>
          <div class="feature-item glass-panel">
            <span class="f-icon">⚡</span>
            <div class="f-info">
              <strong>Thưởng Tốc Độ</strong>
              <span>Chọn càng nhanh, điểm càng cao</span>
            </div>
          </div>
          <div class="feature-item glass-panel">
            <span class="f-icon">🔥</span>
            <div class="f-info">
              <strong>Chuỗi Combo</strong>
              <span>Nhân điểm liên tục khi đúng</span>
            </div>
          </div>
        </div>

        <div class="ready-action-row">
          <button class="btn-primary-action btn-pulse" id="btnStartLightningChallenge">
            <span>⚡ Bắt Đầu Thử Thách (10 Câu)</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btnStartLightningChallenge')?.addEventListener('click', () => {
      playSound('click');
      startCountdown321();
    });
  }

  // 2. ĐẾM NGƯỢC 3.. 2.. 1.. GO
  function startCountdown321() {
    cleanup();
    let count = 3;

    container.innerHTML = `
      <div class="lightning-countdown-overlay glass-panel animate-scale-up">
        <div class="cd-title">Chuẩn bị phản xạ...</div>
        <div class="cd-number animate-pulse" id="cdNumberText">${count}</div>
        <div class="cd-hint">Tập trung nhìn mặt chữ và phiên âm</div>
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
          startQuizGame();
        }, 500);
      }
    }, 850);
  }

  // 3. KHỞI TẠO BỘ ĐỀ VÀ BẮT ĐẦU CÂU HỎI
  function startQuizGame() {
    cleanup();
    quizWords = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    currentQIdx = 0;
    score = 0;
    combo = 0;
    isPaused = false;
    renderQuestion();
  }

  // 4. HIỂN THỊ CÂU HỎI HIỆN TẠI
  function renderQuestion() {
    cleanup();

    if (!container.isConnected) return;

    if (currentQIdx >= quizWords.length) {
      renderQuizSummary();
      return;
    }

    isAnswered = false;
    isPaused = false;
    totalDurationMs = 5000;
    remainingMs = 5000;

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
    currentCorrectIdx = choices.indexOf(word.meaning);

    container.innerHTML = `
      <div class="lightning-quiz-container animate-fade-in">
        <!-- Header & Control Bar -->
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
            <span>Combo:</span>
            <strong id="lCombo">x${combo}</strong>
          </div>

          <!-- Controls: Pause & Quit -->
          <div class="lightning-ctrl-actions" style="margin-left: auto; display: flex; gap: 0.4rem;">
            <button class="btn-l-ctrl" id="btnPauseLightning" title="Tạm dừng hoặc tiếp tục">
              ⏸️ Tạm Dừng
            </button>
            <button class="btn-l-ctrl danger" id="btnQuitLightning" title="Dừng thử thách">
              ⏹️ Thoát
            </button>
          </div>
        </div>

        <!-- 5-Second Timer Bar -->
        <div class="lightning-timer-wrapper">
          <div class="lightning-timer-fill" id="lTimerFill" style="width: 100%;"></div>
        </div>

        <!-- Question Card -->
        <div class="lightning-card glass-panel" id="lQuestionCard">
          <div class="lightning-hanzi">${word.hanzi}</div>
          <div class="lightning-pinyin">${word.pinyin}</div>
          <button class="btn-audio-circle-sm" id="btnRepeatAudio" title="Nghe lại phát âm">🔊</button>
        </div>

        <!-- Choices Grid (Single column on mobile, 2 columns on desktop) -->
        <div class="lightning-choices-grid" id="lChoicesGrid">
          ${choices.map((ch, idx) => `
            <button class="btn-lightning-choice glass-panel" data-choice-idx="${idx}">
              <span class="choice-tag">${['A', 'B', 'C', 'D'][idx]}</span>
              <span class="choice-text">${ch}</span>
            </button>
          `).join('')}
        </div>

        <!-- Pause Overlay (Hidden by default) -->
        <div class="lightning-pause-overlay hidden" id="lPauseOverlay">
          <div class="pause-box glass-panel animate-scale-up">
            <div class="pause-icon">⏸️</div>
            <h3>Đang Tạm Dừng Thử Thách</h3>
            <p>Đồng hồ đếm ngược đã dừng. Sẵn sàng hãy nhấn Tiếp tục.</p>
            <div class="pause-btns">
              <button class="btn-primary" id="btnResumeLightning">▶️ Tiếp Tục Chơi</button>
              <button class="btn-ghost-sm" id="btnQuitFromPause" style="margin-top: 0.5rem;">⏹️ Thoát về menu</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Nghe lại phát âm
    container.querySelector('#btnRepeatAudio')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakChinese(word.hanzi);
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

    // Bắt đầu đếm ngược 5 giây
    runCountdownTimer();

    // Gắn sự kiện chọn đáp án (có stopPropagation và touch support)
    container.querySelectorAll('.btn-lightning-choice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAnswered || isPaused) return;

        isAnswered = true;
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }

        const chosenIdx = parseInt(btn.dataset.choiceIdx, 10);
        const elapsed = Date.now() - startTime;
        handleAnswer(chosenIdx, currentCorrectIdx, elapsed);
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

      if (isAnswered || isPaused) {
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
        handleAnswerTimeout(currentCorrectIdx);
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

  // Xử lý khi người dùng chọn đáp án
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
      // Thưởng tốc độ
      const speedBonus = Math.max(0, Math.round((5000 - elapsedMs) / 50));
      const points = 50 + speedBonus + (combo * 10);
      score += points;

      const scoreEl = container.querySelector('#lScore');
      const comboEl = container.querySelector('#lCombo');
      if (scoreEl) scoreEl.textContent = score;
      if (comboEl) comboEl.textContent = `x${combo}`;
    } else {
      playSound('wrong');
      combo = 0;
      const comboEl = container.querySelector('#lCombo');
      if (comboEl) comboEl.textContent = 'x0';
    }

    // Chuyển câu hỏi kế tiếp một cách an toàn
    nextQTimeout = setTimeout(() => {
      if (!container.isConnected) return;
      currentQIdx++;
      renderQuestion();
    }, 1000);
  }

  // Xử lý khi hết 5 giây (Timeout)
  function handleAnswerTimeout(correctIdx) {
    isAnswered = true;
    playSound('wrong');
    combo = 0;

    const comboEl = container.querySelector('#lCombo');
    if (comboEl) comboEl.textContent = 'x0';

    const buttons = container.querySelectorAll('.btn-lightning-choice');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
    });

    nextQTimeout = setTimeout(() => {
      if (!container.isConnected) return;
      currentQIdx++;
      renderQuestion();
    }, 1200);
  }

  // 5. MÀN HÌNH TỔNG KẾT
  function renderQuizSummary() {
    cleanup();

    let rank = 'Khởi Động Nhẹ Nhàng 🐢';
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

        <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
          <button class="btn-primary" id="btnRestartLightning">
            ⚡ Thử Thách Vòng Mới
          </button>
          <button class="btn-ghost-sm" id="btnBackToReady" style="padding: 0.75rem 1.25rem;">
            📋 Xem Hướng Dẫn
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btnRestartLightning')?.addEventListener('click', () => {
      startCountdown321();
    });

    container.querySelector('#btnBackToReady')?.addEventListener('click', () => {
      renderReadyScreen();
    });
  }

  // Bắt đầu từ Màn hình Sẵn sàng
  renderReadyScreen();

  return cleanup;
}
