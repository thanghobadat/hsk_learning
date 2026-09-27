import { playSound, speakChinese } from '../utils/speech.js';
import { openStrokeModal } from './strokeModal.js';

export function renderLessonFlashcard(container, lesson) {
  const storageKey = `hsk_lesson_${lesson.id}_learned_cards`;
  let learnedHanzi = new Set();
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) learnedHanzi = new Set(JSON.parse(raw));
  } catch (e) {}

  let cards = [...lesson.words];
  let currentIndex = 0;
  let isFlipped = false;

  function saveLearned() {
    localStorage.setItem(storageKey, JSON.stringify([...learnedHanzi]));
  }

  function render() {
    if (!cards || cards.length === 0) {
      container.innerHTML = `<div class="empty-state">Bài học này chưa có từ vựng.</div>`;
      return;
    }

    const currentWord = cards[currentIndex];
    const isLearned = learnedHanzi.has(currentWord.hanzi);
    const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

    container.innerHTML = `
      <div class="lesson-flashcard-wrapper animate-fade-in">
        <!-- Top Toolbar -->
        <div class="lfc-toolbar glass-panel">
          <div class="lfc-counter">
            <span class="lfc-current-num">${currentIndex + 1}</span>
            <span class="lfc-total-num">/ ${cards.length}</span>
            <span class="lfc-learned-badge ${isLearned ? 'is-learned' : ''}">
              ${isLearned ? '✓ Đã thuộc' : '○ Đang học'}
            </span>
          </div>

          <div class="lfc-progress-bar-wrap">
            <div class="lfc-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <div class="lfc-toolbar-actions">
            <button class="btn-lfc-tool" id="btnLfcShuffle" title="Trộn thẻ ngẫu nhiên">🔀 Trộn thẻ</button>
            <button class="btn-lfc-tool" id="btnLfcReset" title="Xem từ thẻ đầu tiên">🔄 Về đầu</button>
          </div>
        </div>

        <!-- 3D Flip Card Container -->
        <div class="lfc-scene">
          <div class="lfc-card ${isFlipped ? 'flipped' : ''}" id="lfcCardElement">
            <!-- Mặt trước (Front) -->
            <div class="lfc-face lfc-front glass-panel">
              <div class="lfc-face-header">
                <span class="lfc-index-badge">#${currentIndex + 1}</span>
                <div class="lfc-header-btns">
                  <button class="btn-audio-circle-sm" id="btnFrontAudio" title="Nghe phát âm">🔊</button>
                  <button class="btn-stroke-practice" id="btnFrontStroke" title="Tập viết chữ">✍️ Tập viết</button>
                </div>
              </div>

              <div class="lfc-front-main">
                <div class="lfc-hanzi">${currentWord.hanzi}</div>
                <div class="lfc-front-sub">Nhấp chuột hoặc nhấn <kbd>Space</kbd> để lật</div>
              </div>

              <div class="lfc-front-footer">
                <span class="lfc-flip-hint">🔄 Lật thẻ xem Pinyin & Nghĩa</span>
              </div>
            </div>

            <!-- Mặt sau (Back) -->
            <div class="lfc-face lfc-back glass-panel">
              <div class="lfc-face-header">
                <div class="lfc-back-pinyin">${currentWord.pinyin}</div>
                <button class="btn-audio-circle-sm" id="btnBackAudio" title="Nghe phát âm">🔊</button>
              </div>

              <div class="lfc-back-hanviet">
                <span class="hanviet-label">Hán - Việt:</span>
                <span class="hanviet-val">${currentWord.hanViet || ''}</span>
              </div>

              <div class="lfc-back-meaning">
                ${currentWord.meaning}
              </div>

              ${currentWord.mnemonic ? `
                <div class="lfc-back-mnemonic">
                  <span class="lfc-mnemonic-tag">💡 Mẹo nhớ:</span>
                  <p class="lfc-mnemonic-text">${currentWord.mnemonic}</p>
                </div>
              ` : ''}

              ${currentWord.exampleZh ? `
                <div class="lfc-back-example">
                  <div class="example-header">
                    <span class="example-tag">Câu mẫu:</span>
                    <button class="btn-mini-audio" id="btnBackExampleAudio">🔊 Nghe câu</button>
                  </div>
                  <div class="example-zh">${currentWord.exampleZh}</div>
                  <div class="example-pinyin">${currentWord.examplePinyin || ''}</div>
                  <div class="example-vi">${currentWord.exampleVi || ''}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Controls Bar -->
        <div class="lfc-controls-bar">
          <button class="btn-lfc-nav" id="btnLfcPrev" ${currentIndex === 0 ? 'disabled' : ''} title="Thẻ trước (Phím ←)">
            ◀ Trước
          </button>

          <div class="lfc-mark-group">
            <button class="btn-lfc-mark mark-unlearned ${!isLearned ? 'active' : ''}" id="btnMarkUnlearned">
              🔴 Chưa nhớ
            </button>
            <button class="btn-lfc-mark mark-learned ${isLearned ? 'active' : ''}" id="btnMarkLearned">
              🟢 Đã thuộc
            </button>
          </div>

          <button class="btn-lfc-nav" id="btnLfcNext" ${currentIndex === cards.length - 1 ? 'disabled' : ''} title="Thẻ sau (Phím →)">
            Sau ▶
          </button>
        </div>

        <div class="lfc-keyboard-shortcuts">
          Mẹo: Dùng phím <kbd>←</kbd> <kbd>→</kbd> để chuyển thẻ, <kbd>Space</kbd> để lật thẻ
        </div>
      </div>
    `;

    // Gắn sự kiện lật thẻ
    const cardEl = container.querySelector('#lfcCardElement');
    cardEl.addEventListener('click', (e) => {
      // Tránh lật khi bấm nút audio hoặc nút tập viết bên trong
      if (e.target.closest('button')) return;
      playSound('card_flip');
      isFlipped = !isFlipped;
      cardEl.classList.toggle('flipped', isFlipped);
    });

    // Phát âm mặt trước
    const btnFrontAudio = container.querySelector('#btnFrontAudio');
    if (btnFrontAudio) {
      btnFrontAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        speakChinese(currentWord.hanzi);
      });
    }

    // Tập viết mặt trước
    const btnFrontStroke = container.querySelector('#btnFrontStroke');
    if (btnFrontStroke) {
      btnFrontStroke.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        openStrokeModal({
          hanzi: currentWord.hanzi,
          pinyin: currentWord.pinyin,
          meaning: currentWord.meaning,
          hanViet: currentWord.hanViet
        });
      });
    }

    // Phát âm mặt sau
    const btnBackAudio = container.querySelector('#btnBackAudio');
    if (btnBackAudio) {
      btnBackAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        speakChinese(currentWord.hanzi);
      });
    }

    // Phát âm câu ví dụ mặt sau
    const btnBackExampleAudio = container.querySelector('#btnBackExampleAudio');
    if (btnBackExampleAudio) {
      btnBackExampleAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        speakChinese(currentWord.exampleZh);
      });
    }

    // Điều hướng trước / sau
    container.querySelector('#btnLfcPrev')?.addEventListener('click', () => {
      if (currentIndex > 0) {
        playSound('click');
        currentIndex--;
        isFlipped = false;
        render();
      }
    });

    container.querySelector('#btnLfcNext')?.addEventListener('click', () => {
      if (currentIndex < cards.length - 1) {
        playSound('click');
        currentIndex++;
        isFlipped = false;
        render();
      }
    });

    // Đánh dấu chưa nhớ / đã thuộc
    container.querySelector('#btnMarkLearned')?.addEventListener('click', () => {
      playSound('correct');
      learnedHanzi.add(currentWord.hanzi);
      saveLearned();
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        isFlipped = false;
      }
      render();
    });

    container.querySelector('#btnMarkUnlearned')?.addEventListener('click', () => {
      playSound('wrong');
      learnedHanzi.delete(currentWord.hanzi);
      saveLearned();
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        isFlipped = false;
      }
      render();
    });

    // Trộn thẻ
    container.querySelector('#btnLfcShuffle')?.addEventListener('click', () => {
      playSound('card_flip');
      cards = [...cards].sort(() => Math.random() - 0.5);
      currentIndex = 0;
      isFlipped = false;
      render();
    });

    // Về đầu
    container.querySelector('#btnLfcReset')?.addEventListener('click', () => {
      playSound('click');
      currentIndex = 0;
      isFlipped = false;
      render();
    });
  }

  render();
}
