import { GRAMMAR_DATA } from '../data/grammarData.js';
import { speakChinese, playSound } from '../utils/speech.js';

export function renderGrammarView(container) {
  let activeCategory = 'all';
  let searchQuery = '';

  const categories = [
    { id: 'all', label: `Tất cả (${GRAMMAR_DATA.length})` },
    { id: 'hsk1-all', label: '⭐ Toàn Bộ HSK 1 (52 Điểm)' },
    { id: '1. Từ Loại & Lượng Từ', label: '1. Từ Loại & Lượng Từ' },
    { id: '2. Động Từ & Năng Nguyện', label: '2. Động Từ & Năng Nguyện' },
    { id: '3. Phó Từ & Trạng Từ', label: '3. Phó Từ & Trạng Từ' },
    { id: '4. Giới Từ & Liên Từ', label: '4. Giới Từ & Liên Từ' },
    { id: '5. Hệ Thống Trợ Từ', label: '5. Hệ Thống Trợ Từ' },
    { id: '6. Mẫu Câu Đặc Biệt', label: '6. Mẫu Câu Đặc Biệt' },
    { id: 'hsk2-3', label: 'HSK 2 & 3 Mở Rộng' }
  ];

  function render() {
    container.innerHTML = `
      <div class="grammar-page animate-fade-in">
        <div class="page-header">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Hệ Thống Ngữ Pháp Chuẩn HSK 3.0 Mới Nhất
          </div>
          <h1 class="page-title">Sổ Tay Toàn Diện 52+ Điểm Ngữ Pháp HSK 1 & Mở Rộng</h1>
          <p class="page-subtitle">
            Hệ thống hóa toàn bộ cấu trúc câu, từ loại, hư từ, động từ năng nguyện và các bẫy ngữ pháp thường gặp của người Việt Nam.
          </p>
        </div>

        <!-- Toolbar: Search & Category Filter -->
        <div class="grammar-filter-bar glass-panel">
          <div class="search-input-wrap" style="margin-bottom: 1rem;">
            <span class="search-icon">🔍</span>
            <input type="text" id="grammarSearchInput" class="custom-search" 
                   value="${searchQuery}"
                   placeholder="Tìm điểm ngữ pháp (ví dụ: 'là', 'không', 'năng nguyện', 'nhấn mạnh', '比', '了')...">
            <button id="btnClearGrammarSearch" class="btn-clear-search ${searchQuery ? '' : 'hidden'}">✕</button>
          </div>

          <div class="level-tabs" role="tablist">
            ${categories.map(c => `
              <button class="level-tab-btn ${activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
                ${c.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Result count meta -->
        <div class="vocab-meta-bar" style="margin-bottom: 1.25rem;">
          <span id="grammarResultCount" class="meta-count-text">Đang tải...</span>
          <span class="meta-hint">💡 Bấm vào loa để nghe đọc câu ví dụ mẫu chuẩn ngữ điệu.</span>
        </div>

        <!-- Grammar List -->
        <div id="grammarList" class="grammar-list-container">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    const searchInput = container.querySelector('#grammarSearchInput');
    const btnClearSearch = container.querySelector('#btnClearGrammarSearch');
    const catBtns = container.querySelectorAll('[data-cat]');
    const listEl = container.querySelector('#grammarList');
    const countEl = container.querySelector('#grammarResultCount');

    function renderItems() {
      const q = searchQuery.trim().toLowerCase();

      const filtered = GRAMMAR_DATA.filter(item => {
        // Lọc danh mục
        if (activeCategory === 'hsk1-all') {
          if (item.level !== 1) return false;
        } else if (activeCategory === 'hsk2-3') {
          if (item.level < 2) return false;
        } else if (activeCategory !== 'all') {
          if (item.category !== activeCategory) return false;
        }

        // Tìm kiếm
        if (q) {
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchFormula = item.formula.toLowerCase().includes(q);
          const matchExp = item.explanation.toLowerCase().includes(q);
          const matchCat = (item.category || '').toLowerCase().includes(q);
          const matchEx = item.examples.some(e => e.zh.includes(q) || e.pinyin.toLowerCase().includes(q) || e.vi.toLowerCase().includes(q));
          return matchTitle || matchFormula || matchExp || matchCat || matchEx;
        }

        return true;
      });

      countEl.textContent = `Tìm thấy ${filtered.length} điểm ngữ pháp`;

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state glass-panel" style="padding: 3rem 1.5rem; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
            <h3>Không tìm thấy điểm ngữ pháp phù hợp</h3>
            <p style="color: var(--text-muted);">Hãy thử nhập từ khóa khác hoặc bấm chọn danh mục ở trên.</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(g => {
        const levelColors = { 1: '#10b981', 2: '#3b82f6', 3: '#8b5cf6' };
        const lvlColor = levelColors[g.level] || '#64748b';

        return `
          <div class="grammar-card glass-panel" id="${g.id}">
            <div class="grammar-card-header">
              <div class="grammar-title-wrap">
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
                  <span class="vocab-level-badge" style="background-color: ${lvlColor};">HSK ${g.level}</span>
                  <span class="vocab-cat-badge">${g.category || 'Ngữ Pháp Cốt Lõi'}</span>
                </div>
                <h3 class="grammar-title">${g.title}</h3>
              </div>
            </div>

            <div class="grammar-formula-box">
              <span class="formula-label">Cấu trúc công thức:</span>
              <div class="formula-code">${g.formula}</div>
            </div>

            <div class="grammar-explanation">
              <p>${g.explanation}</p>
            </div>

            <div class="grammar-examples-box">
              <h4 class="examples-heading">Ví dụ minh họa:</h4>
              <div class="examples-list">
                ${g.examples.map(ex => `
                  <div class="example-item">
                    <div class="example-content">
                      <div class="ex-zh">${ex.zh}</div>
                      <div class="ex-pinyin">${ex.pinyin}</div>
                      <div class="ex-vi">${ex.vi}</div>
                    </div>
                    <button class="btn-audio-circle-sm" data-speak="${ex.zh}" title="Nghe câu này">
                      <span>🔊</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            ${g.tips ? `
              <div class="grammar-tips-box">
                <div class="tip-icon">💡</div>
                <div class="tip-text">
                  <strong>Lưu ý / Mẹo tránh bẫy của người Việt:</strong> ${g.tips}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      // Audio click
      listEl.querySelectorAll('[data-speak]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          btn.classList.add('pulse-active');
          speakChinese(btn.dataset.speak, () => {
            btn.classList.remove('pulse-active');
          });
        });
      });
    }

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchQuery) {
        btnClearSearch.classList.remove('hidden');
      } else {
        btnClearSearch.classList.add('hidden');
      }
      renderItems();
    });

    btnClearSearch.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      btnClearSearch.classList.add('hidden');
      renderItems();
    });

    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        renderItems();
      });
    });

    renderItems();
  }

  render();
}
