import { HSK_VOCABULARY } from '../data/hskData.js';
import { speakChinese, playSound, setSpeechRate, getSpeechRate } from '../utils/speech.js';
import { openStrokeModal } from '../components/strokeModal.js';
import { getRadicalsForWord, getAllAvailableRadicals, wordContainsRadical } from '../data/radicalDict.js';

export function renderVocabView(container) {
  let activeLevel = 'all'; // 'all', '1', '2', '3', 'fav'
  let searchQuery = '';
  let activeCategory = 'all';
  let activeRadical = 'all';

  function getFavorites() {
    return JSON.parse(localStorage.getItem('hsk_favorites') || '[]');
  }

  function toggleFavorite(id) {
    let favs = getFavorites();
    if (favs.includes(id)) {
      favs = favs.filter(fId => fId !== id);
    } else {
      favs.push(id);
      playSound('correct');
    }
    localStorage.setItem('hsk_favorites', JSON.stringify(favs));
    renderWordList();
  }

  // Lấy danh sách danh mục duy nhất
  const categories = ['all', ...new Set(HSK_VOCABULARY.map(v => v.category))];
  const availableRadicals = getAllAvailableRadicals().slice(0, 40);

  container.innerHTML = `
    <div class="vocab-page animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Kho Từ Vựng HSK 3.0 Chuẩn Hóa</h1>
        <p class="page-subtitle">
          Từ vựng phân tầng HSK 1 - 3 kèm âm Hán-Việt, phát âm chuẩn bản xứ và câu ví dụ song ngữ sinh động
        </p>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="vocab-toolbar glass-panel">
        <div class="toolbar-top">
          <!-- Search Box -->
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="vocabSearchInput" class="custom-search" 
                   placeholder="Tìm kiếm chữ Hán, Pinyin, Hán-Việt hoặc nghĩa tiếng Việt...">
            <button id="btnClearSearch" class="btn-clear-search hidden">✕</button>
          </div>

          <!-- Speed Control -->
          <div class="speed-control-wrap">
            <span class="speed-label">Tốc độ đọc:</span>
            <div class="speed-buttons" role="group">
              <button class="speed-btn ${getSpeechRate() === 0.7 ? 'active' : ''}" data-rate="0.7">0.7x (Chậm)</button>
              <button class="speed-btn ${getSpeechRate() === 0.85 ? 'active' : ''}" data-rate="0.85">0.85x (Chuẩn)</button>
              <button class="speed-btn ${getSpeechRate() === 1.0 ? 'active' : ''}" data-rate="1.0">1.0x (Nhanh)</button>
            </div>
          </div>
        </div>

        <div class="toolbar-bottom">
          <!-- Level Tabs -->
          <div class="level-tabs" role="tablist">
            <button class="level-tab-btn active" data-level="all">Tất cả (${HSK_VOCABULARY.length})</button>
            <button class="level-tab-btn" data-level="1">HSK 1</button>
            <button class="level-tab-btn" data-level="2">HSK 2</button>
            <button class="level-tab-btn" data-level="3">HSK 3</button>
            <button class="level-tab-btn" data-level="fav">
              <span>⭐</span> Yêu thích (<span id="favCount">0</span>)
            </button>
          </div>

          <!-- Filter Group: Chủ đề & Bộ thủ -->
          <div class="toolbar-filters-group">
            <div class="category-filter-wrap">
              <label for="catSelect">Chủ đề:</label>
              <select id="catSelect" class="custom-select-sm">
                <option value="all">Tất cả chủ đề</option>
                ${categories.filter(c => c !== 'all').map(c => `
                  <option value="${c}">${c}</option>
                `).join('')}
              </select>
            </div>

            <div class="radical-filter-wrap">
              <label for="radicalSelect">🧩 Bộ thủ:</label>
              <select id="radicalSelect" class="custom-select-sm">
                <option value="all">Tất cả bộ thủ</option>
                ${availableRadicals.map(r => `
                  <option value="${r.char}">${r.char} (${r.hanViet}) - ${r.count} chữ</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Counter -->
      <div class="vocab-meta-bar">
        <span id="resultCount" class="meta-count-text">Hiển thị 0 từ</span>
        <span class="meta-hint">💡 Bấm vào loa để nghe từ hoặc câu ví dụ. Dùng âm Hán-Việt để nhớ mặt chữ nhanh gấp 3 lần!</span>
      </div>

      <!-- Word Cards Grid -->
      <div id="wordGrid" class="word-cards-grid">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  const searchInput = container.querySelector('#vocabSearchInput');
  const btnClearSearch = container.querySelector('#btnClearSearch');
  const levelBtns = container.querySelectorAll('.level-tab-btn');
  const catSelect = container.querySelector('#catSelect');
  const radicalSelect = container.querySelector('#radicalSelect');
  const wordGrid = container.querySelector('#wordGrid');
  const resultCount = container.querySelector('#resultCount');
  const favCount = container.querySelector('#favCount');
  const speedBtns = container.querySelectorAll('.speed-btn');

  function updateFavCount() {
    const favs = getFavorites();
    if (favCount) favCount.textContent = favs.length;
  }

  function renderWordList() {
    const favs = getFavorites();
    updateFavCount();

    const q = searchQuery.trim().toLowerCase();

    const filtered = HSK_VOCABULARY.filter(item => {
      // Level check
      if (activeLevel === 'fav') {
        if (!favs.includes(item.id)) return false;
      } else if (activeLevel !== 'all') {
        if (item.level.toString() !== activeLevel) return false;
      }

      // Category check
      if (activeCategory !== 'all') {
        if (item.category !== activeCategory) return false;
      }

      // Radical check
      if (activeRadical !== 'all') {
        if (!wordContainsRadical(item.hanzi, activeRadical)) return false;
      }

      // Search query check
      if (q) {
        const matchHanzi = item.hanzi.toLowerCase().includes(q);
        const matchPinyin = item.pinyin.toLowerCase().includes(q);
        const matchHanViet = (item.hanViet || '').toLowerCase().includes(q);
        const matchMeaning = item.meaning.toLowerCase().includes(q);
        const radicals = getRadicalsForWord(item.hanzi);
        const matchRadical = radicals.some(r => 
          r.char === q || 
          r.radicalName.toLowerCase().includes(q) || 
          r.meaning.toLowerCase().includes(q)
        );
        return matchHanzi || matchPinyin || matchHanViet || matchMeaning || matchRadical;
      }

      return true;
    });

    resultCount.textContent = `Tìm thấy ${filtered.length} từ vựng`;

    if (filtered.length === 0) {
      wordGrid.innerHTML = `
        <div class="empty-state glass-panel">
          <div class="empty-icon">🔍</div>
          <h3>Không tìm thấy từ vựng phù hợp</h3>
          <p>Hãy thử tìm bằng từ khóa khác hoặc chuyển sang cấp độ HSK khác.</p>
        </div>
      `;
      return;
    }

    wordGrid.innerHTML = filtered.map(w => {
      const isFav = favs.includes(w.id);
      const levelColors = { 1: '#10b981', 2: '#3b82f6', 3: '#8b5cf6' };
      const lvlColor = levelColors[w.level] || '#64748b';
      const radicals = getRadicalsForWord(w.hanzi);

      return `
        <div class="word-card glass-panel" data-word-id="${w.id}">
          <div class="word-card-header">
            <div class="badge-group">
              <span class="vocab-level-badge" style="background-color: ${lvlColor}">HSK ${w.level}</span>
              <span class="vocab-cat-badge">${w.category}</span>
            </div>
            <button class="btn-star ${isFav ? 'starred' : ''}" data-fav-id="${w.id}" title="${isFav ? 'Bỏ lưu' : 'Lưu vào từ cần nhớ'}">
              ★
            </button>
          </div>

          <div class="word-main-row">
            <div class="word-hanzi-wrap">
              <div class="word-hanzi">${w.hanzi}</div>
              <div class="word-pinyin">${w.pinyin}</div>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button class="btn-stroke-practice" 
                      data-hanzi="${w.hanzi}" 
                      data-pinyin="${w.pinyin}" 
                      data-meaning="${w.meaning}" 
                      data-hanviet="${w.hanViet || ''}" 
                      title="Xem cách viết từng nét & tập viết">
                ✍️ Tập viết
              </button>
              <button class="btn-audio-circle" data-speak="${w.hanzi}" title="Nghe phát âm">
                <span>🔊</span>
              </button>
            </div>
          </div>

          <div class="word-hanviet-box">
            <span class="hanviet-label">Hán - Việt:</span>
            <span class="hanviet-val">${w.hanViet}</span>
          </div>

          <div class="word-meaning-box">
            <span class="meaning-label">Nghĩa:</span>
            <span class="meaning-val">${w.meaning}</span>
          </div>

          ${radicals.length > 0 ? `
            <div class="word-radicals-box">
              <div class="radicals-header">
                <span class="radicals-tag">🧩 Bộ thủ:</span>
              </div>
              <div class="radicals-pills-list">
                ${radicals.map(r => `
                  <div class="radical-pill" title="Chữ ${r.forChar}: Bộ ${r.char} (${r.radicalName}) - ${r.meaning}">
                    <span class="rad-pill-char">${r.forChar}</span>
                    <span class="rad-pill-arrow">➔</span>
                    <span class="rad-pill-symbol">${r.char}</span>
                    <span class="rad-pill-name">${r.radicalName}</span>
                    ${r.pinyin ? `<span class="rad-pill-pinyin">(${r.pinyin})</span>` : ''}
                    <span class="rad-pill-meaning">: ${r.meaning}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="word-example-box">
            <div class="example-header">
              <span class="example-tag">Ví dụ:</span>
              <button class="btn-mini-audio" data-speak="${w.exampleZh}" title="Nghe câu ví dụ">
                🔊 Nghe câu
              </button>
            </div>
            <div class="example-zh">${w.exampleZh}</div>
            <div class="example-pinyin">${w.examplePinyin}</div>
            <div class="example-vi">${w.exampleVi}</div>
          </div>
        </div>
      `;
    }).join('');

    // Gắn sự kiện phát âm
    const audioBtns = wordGrid.querySelectorAll('[data-speak]');
    audioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.speak;
        btn.classList.add('pulse-active');
        speakChinese(text, () => {
          btn.classList.remove('pulse-active');
        });
      });
    });

    // Gắn sự kiện Star
    const starBtns = wordGrid.querySelectorAll('[data-fav-id]');
    starBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.favId, 10);
        toggleFavorite(id);
      });
    });

    // Gắn sự kiện tập viết bút thuận
    wordGrid.querySelectorAll('.btn-stroke-practice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        openStrokeModal({
          hanzi: btn.dataset.hanzi,
          pinyin: btn.dataset.pinyin,
          meaning: btn.dataset.meaning,
          hanViet: btn.dataset.hanviet
        });
      });
    });
  }

  // Sự kiện tìm kiếm
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery) {
      btnClearSearch.classList.remove('hidden');
    } else {
      btnClearSearch.classList.add('hidden');
    }
    renderWordList();
  });

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    btnClearSearch.classList.add('hidden');
    renderWordList();
  });

  // Sự kiện chuyển cấp độ HSK
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      levelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLevel = btn.dataset.level;
      renderWordList();
    });
  });

  // Sự kiện chọn chủ đề
  catSelect.addEventListener('change', (e) => {
    playSound('click');
    activeCategory = e.target.value;
    renderWordList();
  });

  // Sự kiện chọn bộ thủ
  radicalSelect?.addEventListener('change', (e) => {
    playSound('click');
    activeRadical = e.target.value;
    renderWordList();
  });

  // Sự kiện chỉnh tốc độ đọc
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rate = parseFloat(btn.dataset.rate);
      setSpeechRate(rate);
    });
  });

  renderWordList();
}
