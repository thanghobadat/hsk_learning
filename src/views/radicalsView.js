import { RADICALS_DATA } from '../data/radicalsData.js';
import { speakChinese, playSound } from '../utils/speech.js';

export function renderRadicalsView(container) {
  let searchRadicalQuery = '';

  container.innerHTML = `
    <div class="radicals-page animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Bộ Thủ Cốt Lõi, Nét Bút & Bảng Tập Viết Chữ Hán</h1>
        <p class="page-subtitle">
          Bí quyết giải mã hàng nghìn chữ Hán thông qua 50 bộ thủ thông dụng, 8 nét bút cơ bản và quy tắc bút thuận.
        </p>
      </div>

      <!-- Interactive Canvas Practice Studio -->
      <div class="section-card practice-studio-card glass-panel">
        <div class="section-header">
          <div class="section-icon">✍️</div>
          <div>
            <h2 class="section-title">Bảng Luyện Viết Chữ Hán Tương Tác (Mễ Tự Cách)</h2>
            <p class="section-subtitle">Tập viết theo ô chữ điền/mễ chuẩn mực. Bạn có thể gõ chữ bất kỳ để tô theo hoặc tự do vẽ nét.</p>
          </div>
        </div>

        <div class="canvas-studio-layout">
          <div class="canvas-wrapper">
            <canvas id="hanziCanvas" width="340" height="340"></canvas>
            <div id="characterWatermark" class="canvas-watermark">好</div>
          </div>

          <div class="canvas-control-panel">
            <div class="canvas-input-group">
              <label for="charToTrace">Chữ Hán mẫu cần đồ nét:</label>
              <div class="trace-input-wrap">
                <input type="text" id="charToTrace" maxlength="2" value="好" class="custom-trace-input">
                <button id="btnApplyChar" class="btn-primary-action">Đổi Chữ</button>
                <button id="btnSpeakChar" class="btn-icon-action" title="Nghe phát âm">🔊</button>
              </div>
            </div>

            <div class="canvas-sample-pills">
              <span>Gợi ý luyện tập:</span>
              <button class="sample-char-btn" data-char="人">人</button>
              <button class="sample-char-btn" data-char="你">你</button>
              <button class="sample-char-btn" data-char="好">好</button>
              <button class="sample-char-btn" data-char="中">中</button>
              <button class="sample-char-btn" data-char="国">国</button>
              <button class="sample-char-btn" data-char="水">水</button>
              <button class="sample-char-btn" data-char="爱">爱</button>
            </div>

            <div class="canvas-tool-settings">
              <div class="tool-setting-item">
                <label>Độ đậm nét bút:</label>
                <input type="range" id="brushSize" min="4" max="22" value="10" class="custom-range">
              </div>
              <div class="tool-setting-item">
                <label>Màu mực:</label>
                <div class="color-picker-wrap">
                  <button class="color-dot active" data-color="#1e293b" style="background: #1e293b;"></button>
                  <button class="color-dot" data-color="#e11d48" style="background: #e11d48;"></button>
                  <button class="color-dot" data-color="#2563eb" style="background: #2563eb;"></button>
                  <button class="color-dot" data-color="#059669" style="background: #059669;"></button>
                </div>
              </div>
            </div>

            <div class="canvas-buttons-row">
              <button id="btnClearCanvas" class="btn-clear-canvas">
                <span>🗑️</span> Xóa viết lại
              </button>
              <button id="btnToggleWatermark" class="btn-subtle">
                <span>👁️</span> Ẩn/Hiện chữ mờ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 8 Nét Cơ Bản -->
      <div class="section-card glass-panel">
        <div class="section-header">
          <div class="section-icon">🖌️</div>
          <div>
            <h2 class="section-title">8 Nét Viết Chữ Hán Cơ Bản</h2>
            <p class="section-subtitle">Mọi chữ Hán phức tạp đều được cấu thành từ 8 nét cơ bản này</p>
          </div>
        </div>

        <div class="strokes-grid">
          ${RADICALS_DATA.basicStrokes.map(s => `
            <div class="stroke-card">
              <div class="stroke-symbol">${s.symbol}</div>
              <h4 class="stroke-name">${s.name}</h4>
              <p class="stroke-dir">${s.direction}</p>
              <div class="stroke-ex">Ví dụ: <strong>${s.example}</strong></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 7 Quy Tắc Bút Thuận -->
      <div class="section-card glass-panel">
        <div class="section-header">
          <div class="section-icon">📐</div>
          <div>
            <h2 class="section-title">7 Quy Tắc Bút Thuận Kinh Điển</h2>
            <p class="section-subtitle">Viết đúng quy tắc giúp nét chữ cân đối, đẹp mắt và tốc độ viết nhanh hơn</p>
          </div>
        </div>

        <div class="rules-list-grid">
          ${RADICALS_DATA.strokeRules.map(r => `
            <div class="stroke-rule-card">
              <h4 class="rule-name">${r.rule}</h4>
              <p class="rule-desc">${r.desc}</p>
              <div class="rule-sample">
                <span>Ví dụ:</span>
                <strong>${r.example}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 50 Bộ Thủ Cốt Lõi -->
      <div class="section-card glass-panel">
        <div class="section-header">
          <div class="section-icon">🗂️</div>
          <div>
            <h2 class="section-title">Kho 50 Bộ Thủ Cốt Lõi Thông Dụng Nhất (HSK 1 - 3)</h2>
            <p class="section-subtitle">Nắm vững 50 bộ thủ then chốt này giúp bạn giải mã cấu trúc chữ Hán, nhớ nhanh và suy đoán nghĩa 85% từ vựng.</p>
          </div>
        </div>

        <div class="radical-search-bar search-input-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="radicalSearch" class="custom-search" 
                 placeholder="Tìm bộ thủ theo chữ, Pinyin, Hán-Việt hoặc ý nghĩa (nước, người, cây, lửa, tiền, mắt...)...">
          <button id="btnClearRadicalSearch" class="btn-clear-search hidden">✕</button>
        </div>

        <div class="radical-filter-bar" id="radicalCatFilters">
          <button class="radical-cat-btn active" data-cat="all">Tất cả (50)</button>
          <button class="radical-cat-btn" data-cat="Con Người & Xã Hội">Con Người & Xã Hội</button>
          <button class="radical-cat-btn" data-cat="Thiên Nhiên & Vũ Trụ">Thiên Nhiên & Vũ Trụ</button>
          <button class="radical-cat-btn" data-cat="Động Vật & Thực Vật">Động Vật & Thực Vật</button>
          <button class="radical-cat-btn" data-cat="Nhà Cửa & Đồ Vật">Nhà Cửa & Đồ Vật</button>
          <button class="radical-cat-btn" data-cat="Hành Động & Di Chuyển">Hành Động & Di Chuyển</button>
          <button class="radical-cat-btn" data-cat="Cảm Xúc & Tinh Thần">Cảm Xúc & Tinh Thần</button>
        </div>

        <div class="radical-meta-row">
          <span id="radicalCountText" class="radical-count-text">Đang hiển thị 50 / 50 bộ thủ</span>
          <span class="radical-meta-hint">💡 Bấm vào '✍️ Luyện viết bộ này' để đưa chữ lên bảng Mễ Tự Cách ở trên và tập viết!</span>
        </div>

        <div id="radicalsGrid" class="radicals-grid">
          <!-- Dynamically rendered -->
        </div>
      </div>
    </div>
  `;

  // --- Khởi tạo Canvas vẽ chữ Hán ---
  const canvas = container.querySelector('#hanziCanvas');
  const ctx = canvas.getContext('2d');
  const watermark = container.querySelector('#characterWatermark');
  const charInput = container.querySelector('#charToTrace');
  const btnApplyChar = container.querySelector('#btnApplyChar');
  const btnSpeakChar = container.querySelector('#btnSpeakChar');
  const btnClear = container.querySelector('#btnClearCanvas');
  const btnToggleWatermark = container.querySelector('#btnToggleWatermark');
  const brushSize = container.querySelector('#brushSize');
  const colorDots = container.querySelectorAll('.color-dot');
  const sampleBtns = container.querySelectorAll('.sample-char-btn');

  let isDrawing = false;
  let currentColor = '#1e293b';

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = '#fee2e2';
    ctx.lineWidth = 1.5;

    // Viền khung
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Đường nét đứt chữ điền & chữ mễ
    ctx.setLineDash([4, 4]);
    ctx.beginPath();

    // Dọc giữa
    ctx.moveTo(canvas.width / 2, 4);
    ctx.lineTo(canvas.width / 2, canvas.height - 4);

    // Ngang giữa
    ctx.moveTo(4, canvas.height / 2);
    ctx.lineTo(canvas.width - 4, canvas.height / 2);

    // Chéo 1
    ctx.moveTo(4, 4);
    ctx.lineTo(canvas.width - 4, canvas.height - 4);

    // Chéo 2
    ctx.moveTo(canvas.width - 4, 4);
    ctx.lineTo(4, canvas.height - 4);

    ctx.stroke();
    ctx.restore();
  }

  drawGrid();

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = parseInt(brushSize.value, 10);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDraw() {
    isDrawing = false;
    ctx.closePath();
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDraw);

  btnClear.addEventListener('click', () => {
    playSound('click');
    drawGrid();
  });

  btnToggleWatermark.addEventListener('click', () => {
    watermark.classList.toggle('hidden');
  });

  function updateTraceChar(char) {
    watermark.textContent = char;
    charInput.value = char;
    drawGrid();
  }

  btnApplyChar.addEventListener('click', () => {
    const val = charInput.value.trim();
    if (val) {
      updateTraceChar(val);
      playSound('click');
    }
  });

  btnSpeakChar.addEventListener('click', () => {
    const val = charInput.value.trim();
    if (val) speakChinese(val);
  });

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      updateTraceChar(btn.dataset.char);
    });
  });

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      currentColor = dot.dataset.color;
    });
  });

  // --- Render 50 Bộ Thủ ---
  let activeRadicalCat = 'all';
  const radicalsGrid = container.querySelector('#radicalsGrid');
  const radicalSearch = container.querySelector('#radicalSearch');
  const btnClearRadicalSearch = container.querySelector('#btnClearRadicalSearch');
  const countText = container.querySelector('#radicalCountText');
  const catBtns = container.querySelectorAll('.radical-cat-btn');

  function renderRadicals() {
    const q = searchRadicalQuery.trim().toLowerCase();
    const filtered = RADICALS_DATA.radicals.filter(r => {
      // Lọc danh mục
      if (activeRadicalCat !== 'all' && r.category !== activeRadicalCat) {
        return false;
      }
      // Lọc tìm kiếm
      if (!q) return true;
      return r.char.toLowerCase().includes(q) ||
             r.pinyin.toLowerCase().includes(q) ||
             r.hanViet.toLowerCase().includes(q) ||
             r.meaning.toLowerCase().includes(q) ||
             r.example.toLowerCase().includes(q) ||
             (r.category && r.category.toLowerCase().includes(q));
    });

    countText.textContent = `Đang hiển thị ${filtered.length} / ${RADICALS_DATA.radicals.length} bộ thủ cốt lõi`;

    if (filtered.length === 0) {
      radicalsGrid.innerHTML = `
        <div class="empty-state glass-panel" style="grid-column: 1 / -1; padding: 2.5rem; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <h3>Không tìm thấy bộ thủ nào phù hợp</h3>
          <p style="color: var(--text-muted);">Hãy thử nhập từ khóa khác hoặc bấm chọn danh mục 'Tất cả'</p>
        </div>
      `;
      return;
    }

    radicalsGrid.innerHTML = filtered.map(r => {
      const mainChar = r.char.split('/')[0].trim();
      const idFormatted = r.id < 10 ? '0' + r.id : r.id;
      return `
        <div class="radical-card glass-panel" data-char="${mainChar}">
          <div class="radical-top-tags">
            <div class="radical-badge-group">
              <span class="radical-id-tag">#${idFormatted}</span>
              <span class="radical-stroke-tag">${r.strokes} nét</span>
              <span class="radical-cat-tag">${r.category}</span>
            </div>
            <button class="btn-mini-sound" data-speak="${mainChar}" title="Nghe phát âm">🔊</button>
          </div>

          <div class="radical-header">
            <div class="radical-char-wrap">
              <span class="radical-char">${r.char}</span>
              ${r.origin ? `<span class="radical-origin">(Gốc: ${r.origin})</span>` : ''}
            </div>
            <div style="text-align: right;">
              <div class="radical-pinyin">${r.pinyin}</div>
              <div class="radical-hanviet">${r.hanViet}</div>
            </div>
          </div>

          <div class="radical-meaning">${r.meaning}</div>

          <div class="radical-examples">
            <span>Chữ Hán tiêu biểu:</span><br>
            <strong>${r.example}</strong>
          </div>

          <button class="btn-practice-this" data-trace="${mainChar}">
            ✍️ Luyện viết bộ này
          </button>
        </div>
      `;
    }).join('');

    // Sự kiện nghe phát âm bộ thủ
    radicalsGrid.querySelectorAll('.btn-mini-sound').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakChinese(btn.dataset.speak);
      });
    });

    // Sự kiện nạp bộ thủ lên canvas luyện viết
    radicalsGrid.querySelectorAll('.btn-practice-this').forEach(btn => {
      btn.addEventListener('click', () => {
        const char = btn.dataset.trace;
        updateTraceChar(char);
        window.scrollTo({ top: container.offsetTop, behavior: 'smooth' });
        playSound('correct');
      });
    });
  }

  // Sự kiện tìm kiếm bộ thủ
  radicalSearch.addEventListener('input', (e) => {
    searchRadicalQuery = e.target.value;
    if (searchRadicalQuery) {
      btnClearRadicalSearch.classList.remove('hidden');
    } else {
      btnClearRadicalSearch.classList.add('hidden');
    }
    renderRadicals();
  });

  btnClearRadicalSearch.addEventListener('click', () => {
    searchRadicalQuery = '';
    radicalSearch.value = '';
    btnClearRadicalSearch.classList.add('hidden');
    renderRadicals();
  });

  // Sự kiện lọc danh mục
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRadicalCat = btn.dataset.cat;
      renderRadicals();
    });
  });

  renderRadicals();
}
