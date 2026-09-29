// Component Modal Hướng Dẫn Bút Thuận & Luyện Viết Từng Nét Chữ Hán
import HanziWriter from 'hanzi-writer';
import { speakChinese, playSound } from '../utils/speech.js';
import { getRadicalsForWord } from '../data/radicalDict.js';

let modalElement = null;
let currentWriter = null;
let currentWord = null;
let charactersList = [];
let currentCharIndex = 0;
let currentMode = 'animate'; // 'animate' | 'quiz'
let showOutline = true;
let currentSpeed = 1;
let currentStrokeIndex = 0;
let totalStrokes = 0;

function ensureModalContainer() {
  if (modalElement) return modalElement;

  modalElement = document.createElement('div');
  modalElement.id = 'strokeOrderModal';
  modalElement.className = 'stroke-modal-overlay hidden';

  modalElement.innerHTML = `
    <div class="stroke-modal-backdrop"></div>
    <div class="stroke-modal-dialog glass-panel animate-scale-up" role="dialog" aria-modal="true">
      <div class="stroke-modal-header">
        <div class="stroke-modal-title-group">
          <span class="stroke-modal-badge">✍️ Bút Thuận & Tập Viết</span>
          <h2 class="stroke-modal-title" id="strokeModalHeading">Tập Viết Chữ Hán</h2>
        </div>
        <button id="btnCloseStrokeModal" class="btn-close-modal" title="Đóng bảng">✕</button>
      </div>

      <!-- Banner thông tin từ vựng -->
      <div class="stroke-word-banner">
        <div class="stroke-word-info">
          <div class="stroke-word-main">
            <span class="stroke-word-hanzi" id="strokeWordHanzi">--</span>
            <span class="stroke-word-pinyin" id="strokeWordPinyin">--</span>
          </div>
          <div class="stroke-word-meta">
            <span class="stroke-word-hanviet" id="strokeWordHanViet">--</span>
            <span class="stroke-word-divider">•</span>
            <span class="stroke-word-meaning" id="strokeWordMeaning">--</span>
          </div>
        </div>
        <button id="btnSpeakStrokeWord" class="btn-audio-circle-sm" title="Nghe phát âm từ này">
          <span>🔊</span>
        </button>
      </div>

      <!-- Thanh chọn chữ cái nếu là từ ghép -->
      <div class="stroke-char-selector" id="strokeCharSelector">
        <!-- Render dynamically -->
      </div>

      <!-- Banner thông tin bộ thủ của chữ đang chọn -->
      <div class="stroke-char-radical-banner" id="strokeCharRadicalBanner">
        <!-- Render dynamically -->
      </div>

      <!-- Khung vẽ ô Mễ Tự Cách (米字格) -->
      <div class="stroke-stage-wrap">
        <div class="stroke-mizige-box" id="strokeMizigeBox">
          <div class="mizige-grid-lines">
            <div class="mizige-line-h"></div>
            <div class="mizige-line-v"></div>
            <div class="mizige-line-d1"></div>
            <div class="mizige-line-d2"></div>
          </div>
          <div id="hanziWriterTarget" class="hanzi-writer-canvas"></div>
        </div>
      </div>

      <!-- Trạng thái tiến độ & phản hồi viết -->
      <div class="stroke-status-panel">
        <div class="stroke-status-left">
          <span class="stroke-status-icon" id="strokeStatusIcon">ℹ️</span>
          <span class="stroke-status-msg" id="strokeStatusMsg">Đang chuẩn bị hiển thị nét...</span>
        </div>
        <span class="stroke-count-pill" id="strokeCountPill">0 / 0 nét</span>
      </div>

      <!-- Chế độ: Xem nét mẫu vs Tự luyện viết -->
      <div class="stroke-mode-tabs">
        <button class="stroke-mode-tab-btn active" id="btnModeAnimate">
          <span>▶️</span> Xem Hoạt Ảnh Nét
        </button>
        <button class="stroke-mode-tab-btn" id="btnModeQuiz">
          <span>✏️</span> Tự Viết Thử (Chấm Điểm)
        </button>
      </div>

      <!-- Các nút điều khiển -->
      <div class="stroke-controls-bar">
        <div class="stroke-btn-group">
          <button id="btnReplayStroke" class="stroke-tool-btn" title="Phát lại từ đầu">
            <span>🔄</span> Phát lại
          </button>
          <button id="btnStepStroke" class="stroke-tool-btn" title="Xem tiếp nét kế tiếp">
            <span>⏭️</span> Từng nét
          </button>
          <button id="btnToggleOutline" class="stroke-tool-btn" title="Bật/Tắt nét mờ">
            <span>👁️</span> Nét mờ: Bật
          </button>
        </div>

        <div class="stroke-speed-group">
          <span class="speed-label">Tốc độ:</span>
          <button class="speed-btn" data-speed="0.6">0.6x</button>
          <button class="speed-btn active" data-speed="1.0">1.0x</button>
          <button class="speed-btn" data-speed="1.5">1.5x</button>
        </div>
      </div>

      <!-- Nút chuyển sang chữ tiếp theo nếu là từ ghép -->
      <div class="stroke-next-action-wrap hidden" id="strokeNextWrap">
        <button id="btnNextCharInWord" class="btn-primary-action" style="width: 100%;">
          <span>Chuyển sang chữ tiếp theo</span> ➔
        </button>
      </div>

      <!-- Mẹo quy tắc bút thuận -->
      <div class="stroke-rules-tip">
        <strong>💡 Quy tắc bút thuận cần nhớ:</strong> Ngang trước sổ sau • Phẩy trước mác sau • Trên trước dưới sau • Ngoài trước trong sau • Vào trước đóng sau.
      </div>
    </div>
  `;

  document.body.appendChild(modalElement);
  setupModalEvents();
  return modalElement;
}

function setupModalEvents() {
  const backdrop = modalElement.querySelector('.stroke-modal-backdrop');
  const btnClose = modalElement.querySelector('#btnCloseStrokeModal');
  const btnSpeak = modalElement.querySelector('#btnSpeakStrokeWord');
  const btnModeAnimate = modalElement.querySelector('#btnModeAnimate');
  const btnModeQuiz = modalElement.querySelector('#btnModeQuiz');
  const btnReplay = modalElement.querySelector('#btnReplayStroke');
  const btnStep = modalElement.querySelector('#btnStepStroke');
  const btnToggleOutline = modalElement.querySelector('#btnToggleOutline');
  const speedBtns = modalElement.querySelectorAll('.speed-btn');
  const btnNextChar = modalElement.querySelector('#btnNextCharInWord');

  function close() {
    modalElement.classList.add('hidden');
    if (currentWriter) {
      currentWriter.cancelQuiz();
    }
  }

  backdrop.addEventListener('click', close);
  btnClose.addEventListener('click', close);

  // Esc key đóng modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalElement.classList.contains('hidden')) {
      close();
    }
  });

  btnSpeak.addEventListener('click', () => {
    if (currentWord) {
      speakChinese(currentWord.hanzi);
    }
  });

  btnModeAnimate.addEventListener('click', () => {
    playSound('click');
    setMode('animate');
  });

  btnModeQuiz.addEventListener('click', () => {
    playSound('click');
    setMode('quiz');
  });

  btnReplay.addEventListener('click', () => {
    playSound('click');
    if (currentMode === 'animate') {
      runAnimation();
    } else {
      startQuiz();
    }
  });

  btnStep.addEventListener('click', () => {
    playSound('click');
    stepNextStroke();
  });

  btnToggleOutline.addEventListener('click', () => {
    playSound('click');
    showOutline = !showOutline;
    btnToggleOutline.innerHTML = `<span>👁️</span> Nét mờ: ${showOutline ? 'Bật' : 'Tắt'}`;
    if (currentWriter) {
      if (showOutline) {
        currentWriter.showOutline();
      } else {
        currentWriter.hideOutline();
      }
    }
  });

  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSpeed = parseFloat(btn.dataset.speed);
      if (currentWriter) {
        currentWriter._options.strokeAnimationSpeed = currentSpeed;
        if (currentMode === 'animate') {
          runAnimation();
        }
      }
    });
  });

  btnNextChar.addEventListener('click', () => {
    if (currentCharIndex < charactersList.length - 1) {
      playSound('click');
      selectCharacter(currentCharIndex + 1);
    }
  });
}

function setMode(mode) {
  currentMode = mode;
  const btnModeAnimate = modalElement.querySelector('#btnModeAnimate');
  const btnModeQuiz = modalElement.querySelector('#btnModeQuiz');
  const btnStep = modalElement.querySelector('#btnStepStroke');

  if (mode === 'animate') {
    btnModeAnimate.classList.add('active');
    btnModeQuiz.classList.remove('active');
    btnStep.style.display = 'inline-flex';
    runAnimation();
  } else {
    btnModeQuiz.classList.add('active');
    btnModeAnimate.classList.remove('active');
    btnStep.style.display = 'none';
    startQuiz();
  }
}

function updateStatus(icon, msg, isError = false, isSuccess = false) {
  const iconEl = modalElement.querySelector('#strokeStatusIcon');
  const msgEl = modalElement.querySelector('#strokeStatusMsg');
  const panelEl = modalElement.querySelector('.stroke-status-panel');

  iconEl.textContent = icon;
  msgEl.textContent = msg;

  panelEl.classList.remove('status-error', 'status-success');
  if (isError) panelEl.classList.add('status-error');
  if (isSuccess) panelEl.classList.add('status-success');
}

function updateCountPill(current, total) {
  const pill = modalElement.querySelector('#strokeCountPill');
  pill.textContent = `${current} / ${total} nét`;
}

function selectCharacter(index) {
  currentCharIndex = index;
  const char = charactersList[index];

  // Update tabs
  const tabBtns = modalElement.querySelectorAll('.char-select-pill');
  tabBtns.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Ẩn nút next char
  const nextWrap = modalElement.querySelector('#strokeNextWrap');
  nextWrap.classList.add('hidden');

  // Cập nhật thông tin bộ thủ của chữ đang chọn
  const radList = getRadicalsForWord(char);
  const radBanner = modalElement.querySelector('#strokeCharRadicalBanner');
  if (radBanner) {
    if (radList && radList.length > 0) {
      const r = radList[0];
      radBanner.innerHTML = `
        <span class="stroke-rad-badge">
          <span class="stroke-rad-icon">🧩</span>
          <span>Chữ <strong>${char}</strong>: Bộ <strong>${r.char}</strong> (${r.radicalName} - ${r.pinyin})</span>
          <span class="stroke-rad-sep">•</span>
          <span class="stroke-rad-desc">${r.meaning}</span>
        </span>
      `;
      radBanner.classList.remove('hidden');
    } else {
      radBanner.classList.add('hidden');
    }
  }

  loadCharacter(char);
}

function loadCharacter(char) {
  const target = modalElement.querySelector('#hanziWriterTarget');
  target.innerHTML = '';

  updateStatus('⏳', `Đang tải dữ liệu bút thuận chữ "${char}"...`);
  updateCountPill(0, '--');

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  try {
    currentWriter = HanziWriter.create(target, char, {
      width: 260,
      height: 260,
      padding: 16,
      showOutline: showOutline,
      strokeAnimationSpeed: currentSpeed,
      delayBetweenStrokes: 220,
      strokeColor: '#e11d48',
      radicalColor: '#f59e0b',
      outlineColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)',
      drawingColor: '#2563eb',
      drawingWidth: 12,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      onLoadCharDataSuccess: function(data) {
        totalStrokes = data.strokes ? data.strokes.length : 0;
        currentStrokeIndex = 0;
        updateCountPill(0, totalStrokes);

        if (currentMode === 'animate') {
          runAnimation();
        } else {
          startQuiz();
        }
      },
      onLoadCharDataError: function(err) {
        console.error('HanziWriter load error:', err);
        updateStatus('⚠️', `Không thể tải nét chữ "${char}". Vui lòng kiểm tra kết nối mạng.`, true);
      }
    });
  } catch (err) {
    console.error('HanziWriter creation exception:', err);
    updateStatus('⚠️', `Lỗi khởi tạo bút vẽ chữ "${char}".`, true);
  }
}

function runAnimation() {
  if (!currentWriter) return;
  currentWriter.cancelQuiz();
  updateStatus('▶️', `Đang viết chữ "${charactersList[currentCharIndex]}" theo thứ tự từng nét...`);

  currentWriter.animateCharacter({
    onComplete: function() {
      updateStatus('✨', `Đã hoàn thành viết xong chữ "${charactersList[currentCharIndex]}". Bấm "Tự Viết Thử" để kiểm tra!`);
      updateCountPill(totalStrokes, totalStrokes);

      // Nếu còn chữ tiếp theo trong từ ghép
      if (currentCharIndex < charactersList.length - 1) {
        const nextWrap = modalElement.querySelector('#strokeNextWrap');
        const nextBtn = modalElement.querySelector('#btnNextCharInWord');
        const nextChar = charactersList[currentCharIndex + 1];
        nextBtn.innerHTML = `<span>Đã xong chữ ${charactersList[currentCharIndex]}! Sang chữ tiếp theo: <strong>${nextChar}</strong></span> ➔`;
        nextWrap.classList.remove('hidden');
      }
    }
  });
}

function stepNextStroke() {
  if (!currentWriter) return;
  currentWriter.cancelQuiz();

  if (currentStrokeIndex >= totalStrokes) {
    currentStrokeIndex = 0;
    currentWriter.hideCharacter();
  }

  updateStatus('✍️', `Đang viết nét thứ ${currentStrokeIndex + 1} / ${totalStrokes}...`);
  currentWriter.animateStroke(currentStrokeIndex, {
    onComplete: function() {
      currentStrokeIndex++;
      updateCountPill(currentStrokeIndex, totalStrokes);
      if (currentStrokeIndex >= totalStrokes) {
        updateStatus('✨', 'Đã hoàn thành toàn bộ các nét!');
      }
    }
  });
}

function startQuiz() {
  if (!currentWriter) return;
  currentWriter.cancelQuiz();
  currentStrokeIndex = 0;
  updateCountPill(0, totalStrokes);
  updateStatus('✏️', `Hãy vẽ nét đầu tiên của chữ "${charactersList[currentCharIndex]}" vào ô Mễ Tự Cách...`);

  currentWriter.quiz({
    onMistake: function(strokeData) {
      playSound('wrong');
      const misses = strokeData.mistakesOnStroke;
      if (misses >= 2) {
        updateStatus('💡', `Gợi ý: Hãy quan sát nét màu xanh nhấp nháy để vẽ theo!`, true);
      } else {
        updateStatus('❌', `Nét vừa rồi chưa đúng chiều hoặc thứ tự. Hãy thử lại!`, true);
      }
    },
    onCorrectStroke: function(strokeData) {
      playSound('click');
      currentStrokeIndex = strokeData.strokeNum + 1;
      updateCountPill(currentStrokeIndex, totalStrokes);
      updateStatus('✅', `Chính xác nét thứ ${currentStrokeIndex}! Hãy tiếp tục vẽ nét tiếp theo...`);
    },
    onComplete: function(summaryData) {
      playSound('correct');
      updateStatus('🎉', `Xuất sắc! Bạn đã viết đúng hoàn toàn chữ "${charactersList[currentCharIndex]}" với ${summaryData.totalMistakes} lần thử lại!`, false, true);

      // Nếu còn chữ tiếp theo trong từ ghép
      if (currentCharIndex < charactersList.length - 1) {
        const nextWrap = modalElement.querySelector('#strokeNextWrap');
        const nextBtn = modalElement.querySelector('#btnNextCharInWord');
        const nextChar = charactersList[currentCharIndex + 1];
        nextBtn.innerHTML = `<span>Xuất sắc! Sang luyện chữ tiếp theo: <strong>${nextChar}</strong></span> ➔`;
        nextWrap.classList.remove('hidden');
      }
    }
  });
}

/**
 * Mở modal tập viết chữ Hán động
 * @param {Object} word - { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào", hanViet: "Nhĩ Hảo" }
 */
export function openStrokeModal(word) {
  ensureModalContainer();
  currentWord = word;

  // Lọc chỉ lấy các ký tự chữ Hán (loại bỏ dấu câu, cách, ký tự đặc biệt)
  const hanziChars = (word.hanzi || '').match(/[\u4e00-\u9fa5]/g) || [];
  if (hanziChars.length === 0) {
    alert("Từ này không chứa chữ Hán để luyện viết.");
    return;
  }

  charactersList = hanziChars;
  currentCharIndex = 0;

  // Cập nhật thông tin banner
  modalElement.querySelector('#strokeWordHanzi').textContent = word.hanzi;
  modalElement.querySelector('#strokeWordPinyin').textContent = word.pinyin;
  modalElement.querySelector('#strokeWordHanViet').textContent = word.hanViet ? `Hán-Việt: ${word.hanViet}` : '';
  modalElement.querySelector('#strokeWordMeaning').textContent = word.meaning || '';

  // Render các nút chọn chữ nếu từ ghép có nhiều hơn 1 chữ
  const selectorEl = modalElement.querySelector('#strokeCharSelector');
  if (charactersList.length > 1) {
    selectorEl.innerHTML = `
      <div class="char-selector-label">Chọn chữ cần luyện nét:</div>
      <div class="char-pills-row">
        ${charactersList.map((ch, idx) => `
          <button class="char-select-pill ${idx === 0 ? 'active' : ''}" data-char-idx="${idx}">
            <span class="pill-num">${idx + 1}</span>
            <span class="pill-char">${ch}</span>
          </button>
        `).join('')}
      </div>
    `;
    selectorEl.classList.remove('hidden');

    selectorEl.querySelectorAll('.char-select-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        const idx = parseInt(btn.dataset.charIdx, 10);
        selectCharacter(idx);
      });
    });
  } else {
    selectorEl.innerHTML = '';
    selectorEl.classList.add('hidden');
  }

  // Ẩn nút next char
  modalElement.querySelector('#strokeNextWrap').classList.add('hidden');

  // Mở modal
  modalElement.classList.remove('hidden');

  // Tải chữ đầu tiên
  selectCharacter(0);

  // Tự động phát âm từ vựng
  speakChinese(word.hanzi);
}
