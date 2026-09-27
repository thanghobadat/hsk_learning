import { HSK_VOCABULARY } from '../data/hskData.js';
import { speakChinese, playSound } from '../utils/speech.js';

export function renderFlashcardView(container) {
  let currentLevel = '1';
  let deck = [];
  let currentIndex = 0;
  let isFlipped = false;
  let hidePinyinMode = false;
  let masteredCount = 0;
  let reviewCount = 0;

  function filterDeck() {
    if (currentLevel === 'fav') {
      const favs = JSON.parse(localStorage.getItem('hsk_favorites') || '[]');
      deck = HSK_VOCABULARY.filter(v => favs.includes(v.id));
    } else if (currentLevel === 'all') {
      deck = [...HSK_VOCABULARY];
    } else {
      deck = HSK_VOCABULARY.filter(v => v.level.toString() === currentLevel);
    }
    currentIndex = 0;
    isFlipped = false;
    masteredCount = 0;
    reviewCount = 0;
  }

  function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    currentIndex = 0;
    isFlipped = false;
  }

  filterDeck();

  container.innerHTML = `
    <div class="flashcard-page animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Flashcard 3D Nhớ Mặt Chữ & Lặp Lại Ngắt Quãng</h1>
        <p class="page-subtitle">
          Phương pháp ghi nhớ phản xạ mặt chữ Hán tốt nhất. Bấm vào thẻ để lật xem Pinyin, Hán-Việt và nghĩa.
        </p>
      </div>

      <!-- Controls bar -->
      <div class="flashcard-controls-bar glass-panel">
        <div class="deck-selector">
          <label>Bộ thẻ:</label>
          <select id="flashcardDeckSelect" class="custom-select-sm">
            <option value="1">HSK 1 (Cốt lõi)</option>
            <option value="2">HSK 2 (Đời sống)</option>
            <option value="3">HSK 3 (Trung cấp)</option>
            <option value="all">Tất cả từ vựng</option>
            <option value="fav">Từ đã lưu yêu thích ⭐</option>
          </select>
        </div>

        <div class="deck-toggles">
          <label class="toggle-switch-label">
            <input type="checkbox" id="toggleHidePinyin" ${hidePinyinMode ? 'checked' : ''}>
            <span class="toggle-slider"></span>
            <span>Ẩn Pinyin (Luyện nhớ mặt chữ)</span>
          </label>
        </div>

        <div class="deck-actions">
          <button id="btnShuffle" class="btn-subtle" title="Trộn thẻ">
            <span>🔀</span> Trộn ngẫu nhiên
          </button>
        </div>
      </div>

      <!-- Main Flashcard Area -->
      <div class="flashcard-arena">
        <div class="flashcard-meta-top">
          <span class="card-counter" id="cardCounter">Thẻ 1 / ${deck.length}</span>
          <div class="card-stats-pill">
            <span class="stat-green">Đã thuộc: <strong id="statMastered">0</strong></span>
            <span class="stat-red">Cần ôn: <strong id="statReview">0</strong></span>
          </div>
        </div>

        <div class="flashcard-container" id="flashcardElement">
          <!-- Dynamic Flashcard Body -->
        </div>

        <!-- Action Buttons -->
        <div class="flashcard-action-bar">
          <button id="btnPrevCard" class="btn-nav-card" title="Thẻ trước">
            <span>◀</span> Thẻ trước
          </button>

          <div class="judgment-buttons">
            <button id="btnMarkReview" class="btn-judge-review">
              <span>✕</span> Chưa nhớ (Ôn lại)
            </button>
            <button id="btnFlipCard" class="btn-judge-flip">
              <span>🔄</span> Lật thẻ
            </button>
            <button id="btnMarkMastered" class="btn-judge-mastered">
              <span>✓</span> Đã thuộc!
            </button>
          </div>

          <button id="btnNextCard" class="btn-nav-card" title="Thẻ sau">
            Thẻ sau <span>▶</span>
          </button>
        </div>

        <div class="keyboard-shortcuts-hint">
          <span>⌨️ Phím tắt: <strong>Phím Space</strong> = Lật thẻ | <strong>Mũi tên Trái/Phải</strong> = Thẻ trước/sau | <strong>Số 1</strong> = Chưa nhớ | <strong>Số 2</strong> = Đã thuộc</span>
        </div>
      </div>
    </div>
  `;

  const deckSelect = container.querySelector('#flashcardDeckSelect');
  const toggleHidePinyin = container.querySelector('#toggleHidePinyin');
  const btnShuffle = container.querySelector('#btnShuffle');
  const cardContainer = container.querySelector('#flashcardElement');
  const cardCounter = container.querySelector('#cardCounter');
  const statMastered = container.querySelector('#statMastered');
  const statReview = container.querySelector('#statReview');
  const btnPrev = container.querySelector('#btnPrevCard');
  const btnNext = container.querySelector('#btnNextCard');
  const btnFlip = container.querySelector('#btnFlipCard');
  const btnMarkReview = container.querySelector('#btnMarkReview');
  const btnMarkMastered = container.querySelector('#btnMarkMastered');

  function renderCurrentCard() {
    if (deck.length === 0) {
      cardContainer.innerHTML = `
        <div class="empty-deck glass-panel">
          <div class="empty-icon">📭</div>
          <h3>Bộ thẻ đang trống!</h3>
          <p>Chưa có từ vựng nào trong danh mục này (hoặc bạn chưa đánh dấu sao từ nào).</p>
        </div>
      `;
      cardCounter.textContent = '0 / 0';
      return;
    }

    const item = deck[currentIndex];
    cardCounter.textContent = `Thẻ ${currentIndex + 1} / ${deck.length}`;
    statMastered.textContent = masteredCount;
    statReview.textContent = reviewCount;

    cardContainer.innerHTML = `
      <div class="flashcard-3d ${isFlipped ? 'flipped' : ''}">
        <!-- Mặt trước (Front) -->
        <div class="card-face card-front glass-panel">
          <div class="card-top-tags">
            <span class="vocab-level-badge">HSK ${item.level}</span>
            <span class="vocab-cat-badge">${item.category}</span>
          </div>

          <div class="card-center-hanzi">
            <div class="front-hanzi">${item.hanzi}</div>
            <div class="front-pinyin ${hidePinyinMode ? 'blur-pinyin' : ''}">${item.pinyin}</div>
          </div>

          <div class="card-bottom-actions">
            <button class="btn-card-sound" data-speak="${item.hanzi}" title="Nghe phát âm">
              <span>🔊</span> Bấm để nghe
            </button>
            <span class="flip-hint">Chạm thẻ để xem nghĩa ➔</span>
          </div>
        </div>

        <!-- Mặt sau (Back) -->
        <div class="card-face card-back glass-panel">
          <div class="card-top-tags">
            <span class="vocab-level-badge">HSK ${item.level}</span>
            <span class="vocab-cat-badge">${item.category}</span>
          </div>

          <div class="back-content">
            <div class="back-hanzi-small">${item.hanzi}</div>
            <div class="back-pinyin">${item.pinyin}</div>

            <div class="back-info-pill">
              <span class="label">Âm Hán - Việt:</span>
              <strong class="hanviet">${item.hanViet}</strong>
            </div>

            <div class="back-meaning-text">
              <span class="label">Nghĩa:</span>
              <strong>${item.meaning}</strong>
            </div>

            <div class="back-example-box">
              <div class="ex-zh">${item.exampleZh}</div>
              <div class="ex-pinyin">${item.examplePinyin}</div>
              <div class="ex-vi">${item.exampleVi}</div>
            </div>
          </div>

          <div class="card-bottom-actions">
            <button class="btn-card-sound" data-speak="${item.exampleZh}" title="Nghe câu ví dụ">
              <span>🔊</span> Nghe câu ví dụ
            </button>
            <span class="flip-hint">↺ Chạm để quay lại</span>
          </div>
        </div>
      </div>
    `;

    // Gắn sự kiện lật khi click vào thẻ
    const card3d = cardContainer.querySelector('.flashcard-3d');
    if (card3d) {
      card3d.addEventListener('click', (e) => {
        if (e.target.closest('[data-speak]')) return;
        isFlipped = !isFlipped;
        playSound('click');
        card3d.classList.toggle('flipped', isFlipped);
      });
    }

    // Gắn sự kiện âm thanh
    const audioBtns = cardContainer.querySelectorAll('[data-speak]');
    audioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakChinese(btn.dataset.speak);
      });
    });
  }

  function nextCard() {
    if (deck.length === 0) return;
    isFlipped = false;
    currentIndex = (currentIndex + 1) % deck.length;
    renderCurrentCard();
  }

  function prevCard() {
    if (deck.length === 0) return;
    isFlipped = false;
    currentIndex = (currentIndex - 1 + deck.length) % deck.length;
    renderCurrentCard();
  }

  function flipCard() {
    isFlipped = !isFlipped;
    playSound('click');
    const card3d = cardContainer.querySelector('.flashcard-3d');
    if (card3d) card3d.classList.toggle('flipped', isFlipped);
  }

  btnPrev.addEventListener('click', prevCard);
  btnNext.addEventListener('click', nextCard);
  btnFlip.addEventListener('click', flipCard);

  btnMarkReview.addEventListener('click', () => {
    playSound('wrong');
    reviewCount++;
    nextCard();
  });

  btnMarkMastered.addEventListener('click', () => {
    playSound('correct');
    masteredCount++;
    nextCard();
  });

  deckSelect.addEventListener('change', (e) => {
    playSound('click');
    currentLevel = e.target.value;
    filterDeck();
    renderCurrentCard();
  });

  toggleHidePinyin.addEventListener('change', (e) => {
    hidePinyinMode = e.target.checked;
    renderCurrentCard();
  });

  btnShuffle.addEventListener('click', () => {
    playSound('click');
    shuffleDeck();
    renderCurrentCard();
  });

  // Hỗ trợ phím tắt
  const keyHandler = (e) => {
    // Chỉ xử lý nếu trang flashcard đang hiển thị
    if (!document.querySelector('.flashcard-page')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      flipCard();
    } else if (e.code === 'ArrowRight') {
      nextCard();
    } else if (e.code === 'ArrowLeft') {
      prevCard();
    } else if (e.key === '1') {
      btnMarkReview.click();
    } else if (e.key === '2') {
      btnMarkMastered.click();
    }
  };

  window.addEventListener('keydown', keyHandler);

  renderCurrentCard();
}
