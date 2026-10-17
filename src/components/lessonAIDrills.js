import { playSound, speakChinese } from '../utils/speech.js';
import { generateLocalDrills, explainWithAI, gradeWritingWithAI, getAIConfig, saveAIConfig } from '../utils/aiService.js';
import { renderLessonAISpeaking } from './lessonAISpeaking.js';

export function renderLessonAIDrills(container, lesson, options = {}) {
  // Lấy cấu hình đã lưu từ localStorage hoặc mặc định
  let selectedTypes = ['scramble', 'cloze', 'multiple-choice', 'vi_to_zh', 'pinyin_to_vi', 'speaking_dialogue'];
  try {
    const savedTypes = localStorage.getItem('hsk_drill_selected_types');
    if (savedTypes) {
      const parsed = JSON.parse(savedTypes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        selectedTypes = parsed;
      }
    }
  } catch (e) {}

  let wordsPerGrammar = 2;
  try {
    const savedWpg = localStorage.getItem('hsk_drill_words_per_grammar');
    if (savedWpg) {
      const parsedWpg = parseInt(savedWpg, 10);
      if (parsedWpg > 0) wordsPerGrammar = parsedWpg;
    }
  } catch (e) {}

  // Lọc các dạng thông thường (ngoại trừ speaking_dialogue) cho generator câu hỏi tĩnh
  const staticTypes = selectedTypes.filter(t => t !== 'speaking_dialogue');
  let drills = generateLocalDrills(lesson, { selectedTypes: staticTypes, wordsPerGrammar });

  function render() {
    const grammarCount = Math.max(1, (lesson.grammarPoints || []).length);
    const hasSpeaking = selectedTypes.includes('speaking_dialogue');
    const formulaStr = `${staticTypes.length} dạng viết × ${grammarCount} ngữ pháp × ${wordsPerGrammar} từ = ${drills.length} câu${hasSpeaking ? ' + 🎙️ Studio Luyện Nói Đối Thoại' : ''}`;
    const isAllSelected = selectedTypes.length === 6;

    container.innerHTML = `
      <div class="lesson-ai-drills-wrapper animate-fade-in">
        <!-- AI Filter Toolbar with Checkboxes -->
        <div class="ai-filter-toolbar glass-panel">
          <div class="filter-header-row">
            <span class="filter-title">🎯 Chọn Dạng Bài Tập:</span>
            <span class="drills-total-badge" id="drillsTotalCount">
              ${hasSpeaking ? '🎙️ Có Luyện Nói + ' : ''}Bộ đề: ${drills.length} Câu
            </span>
          </div>

          <!-- Checkboxes Grid (6 Dạng Bài Tập) -->
          <div class="drill-checkboxes-grid">
            <label class="btn-filter-pill ${isAllSelected ? 'active' : ''}">
              <input type="checkbox" id="chkAllDrills" ${isAllSelected ? 'checked' : ''}>
              <span>🌟 Tất Cả (6 Dạng)</span>
            </label>
            <label class="btn-filter-pill ${selectedTypes.includes('speaking_dialogue') ? 'active' : ''}">
              <input type="checkbox" class="chk-drill-type" data-type="speaking_dialogue" ${selectedTypes.includes('speaking_dialogue') ? 'checked' : ''}>
              <span>🎙️ Luyện Nói Đối Thoại (AI)</span>
            </label>
            <label class="btn-filter-pill ${selectedTypes.includes('scramble') ? 'active' : ''}">
              <input type="checkbox" class="chk-drill-type" data-type="scramble" ${selectedTypes.includes('scramble') ? 'checked' : ''}>
              <span>🧩 Sắp Xếp Câu</span>
            </label>
            <label class="btn-filter-pill ${selectedTypes.includes('cloze') ? 'active' : ''}">
              <input type="checkbox" class="chk-drill-type" data-type="cloze" ${selectedTypes.includes('cloze') ? 'checked' : ''}>
              <span>✏️ Điền Từ</span>
            </label>
            <label class="btn-filter-pill ${selectedTypes.includes('multiple-choice') ? 'active' : ''}">
              <input type="checkbox" class="chk-drill-type" data-type="multiple-choice" ${selectedTypes.includes('multiple-choice') ? 'checked' : ''}>
              <span>🎯 Trắc Nghiệm</span>
            </label>
            <label class="btn-filter-pill ${selectedTypes.includes('vi_to_zh') ? 'active' : ''}">
              <input type="checkbox" class="chk-drill-type" data-type="vi_to_zh" ${selectedTypes.includes('vi_to_zh') ? 'checked' : ''}>
              <span>✍️ Dịch Việt ➔ Trung (AI)</span>
            </label>
            <label class="btn-filter-pill ${selectedTypes.includes('pinyin_to_vi') ? 'active' : ''}">
              <input type="checkbox" class="chk-drill-type" data-type="pinyin_to_vi" ${selectedTypes.includes('pinyin_to_vi') ? 'checked' : ''}>
              <span>🎧 Nghe Pinyin ➔ Việt (AI)</span>
            </label>
          </div>

          <!-- Config & Actions Row -->
          <div class="filter-config-row">
            <div class="formula-info-text">
              <span>📐</span> ${formulaStr}
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-left: auto;">
              <div class="words-per-grammar-wrap">
                <span>Số từ/mẫu:</span>
                <select class="words-per-grammar-select" id="selectWordsPerGrammar">
                  <option value="2" ${wordsPerGrammar === 2 ? 'selected' : ''}>2 câu / mẫu</option>
                  <option value="4" ${wordsPerGrammar === 4 ? 'selected' : ''}>4 câu / mẫu</option>
                  <option value="5" ${wordsPerGrammar === 5 ? 'selected' : ''}>5 câu / mẫu</option>
                  <option value="8" ${wordsPerGrammar === 8 ? 'selected' : ''}>8 câu / mẫu</option>
                  <option value="10" ${wordsPerGrammar === 10 ? 'selected' : ''}>10 câu / mẫu</option>
                </select>
              </div>

              <button class="btn-ai-action" id="btnRegenerateDrills" title="Tự động sinh bộ đề bài tập mới không trùng lặp">
                🎲 Tạo Bộ Đề Mới
              </button>
              <button class="btn-ai-action secondary" id="btnOpenAIConfig" title="Cài đặt API Key Gemini">
                ⚙️ Cấu Hình AI
              </button>
            </div>
          </div>
        </div>

        <!-- DẠNG 6: STUDIO LUYỆN NÓI ĐỐI THOẠI 1-1 VỚI AI (NẾU ĐƯỢC CHỌN) -->
        ${hasSpeaking ? `
          <div class="speaking-studio-mount-container" id="speakingStudioMount"></div>
        ` : ''}

        <!-- DANH SÁCH BÀI TẬP TĨNH (NẾU CÓ) -->
        ${staticTypes.length > 0 ? `
          <div class="ai-drills-list" id="aiDrillsList">
            ${drills.length > 0 
              ? drills.map((drill, dIdx) => renderDrillItem(drill, dIdx)).join('')
              : `<div class="glass-panel" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
                  Không có câu hỏi tĩnh cho các dạng đã chọn.
                </div>`
            }
          </div>
        ` : (!hasSpeaking ? `
          <div class="glass-panel" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
            Vui lòng chọn ít nhất 1 dạng bài tập ở bộ lọc phía trên để bắt đầu luyện tập!
          </div>
        ` : '')}

        <!-- AI Deep Explanation Modal Container (Portal) -->
        <div id="aiModalContainer"></div>
      </div>
    `;

    // Khởi tạo Studio Luyện Nói nếu đang bật
    if (hasSpeaking) {
      const mountEl = container.querySelector('#speakingStudioMount');
      if (mountEl) {
        renderLessonAISpeaking(mountEl, lesson, options);
      }
    }

    // Gắn sự kiện Checkbox filter
    attachFilterEvents();

    // Gắn sự kiện nút Tạo đề mới
    container.querySelector('#btnRegenerateDrills')?.addEventListener('click', () => {
      playSound('click');
      const staticList = selectedTypes.filter(t => t !== 'speaking_dialogue');
      drills = generateLocalDrills(lesson, { selectedTypes: staticList, wordsPerGrammar });
      render();
    });

    // Gắn sự kiện nút Cấu hình AI
    container.querySelector('#btnOpenAIConfig')?.addEventListener('click', () => {
      playSound('click');
      openAIConfigModal(container);
    });

    // Gắn sự kiện cho từng loại bài tập (Kiểm tra & biết ngay kết quả)
    if (staticTypes.length > 0) {
      attachDrillEvents(container, drills, lesson);
    }
  }

  function attachFilterEvents() {
    const allChk = container.querySelector('#chkAllDrills');
    const typeChks = container.querySelectorAll('.chk-drill-type');
    const wpgSelect = container.querySelector('#selectWordsPerGrammar');

    allChk?.addEventListener('change', () => {
      playSound('click');
      if (allChk.checked) {
        selectedTypes = ['scramble', 'cloze', 'multiple-choice', 'vi_to_zh', 'pinyin_to_vi', 'speaking_dialogue'];
      } else {
        selectedTypes = ['speaking_dialogue']; // Giữ lại dạng nói
      }
      localStorage.setItem('hsk_drill_selected_types', JSON.stringify(selectedTypes));
      const staticList = selectedTypes.filter(t => t !== 'speaking_dialogue');
      drills = generateLocalDrills(lesson, { selectedTypes: staticList, wordsPerGrammar });
      render();
    });

    typeChks.forEach(chk => {
      chk.addEventListener('change', () => {
        playSound('click');
        const type = chk.dataset.type;
        if (chk.checked) {
          if (!selectedTypes.includes(type)) selectedTypes.push(type);
        } else {
          selectedTypes = selectedTypes.filter(t => t !== type);
          if (selectedTypes.length === 0) {
            selectedTypes = [type]; // Giữ lại ít nhất 1 dạng
          }
        }
        localStorage.setItem('hsk_drill_selected_types', JSON.stringify(selectedTypes));
        const staticList = selectedTypes.filter(t => t !== 'speaking_dialogue');
        drills = generateLocalDrills(lesson, { selectedTypes: staticList, wordsPerGrammar });
        render();
      });
    });

    wpgSelect?.addEventListener('change', (e) => {
      playSound('click');
      wordsPerGrammar = parseInt(e.target.value, 10) || 2;
      localStorage.setItem('hsk_drill_words_per_grammar', wordsPerGrammar);
      const staticList = selectedTypes.filter(t => t !== 'speaking_dialogue');
      drills = generateLocalDrills(lesson, { selectedTypes: staticList, wordsPerGrammar });
      render();
    });
  }

  // Cleanup handler
  container._cleanup = () => {
    const mountEl = container.querySelector('#speakingStudioMount');
    if (mountEl && typeof mountEl._cleanup === 'function') {
      mountEl._cleanup();
    }
  };

  render();
}

/**
 * Render từng câu hỏi theo 5 dạng bài tập
 */
function renderDrillItem(drill, idx) {
  // DẠNG 1: SẮP XẾP KHỐI THÀNH CÂU
  if (drill.type === 'scramble') {
    return `
      <div class="drill-card glass-panel animate-fade-in" data-drill-id="${drill.id}" data-drill-idx="${idx}">
        <div class="drill-card-header">
          <span class="drill-type-badge scramble">${drill.badge}</span>
          <span class="drill-num">Câu ${idx + 1}</span>
        </div>

        <div class="drill-prompt-title">${drill.title}</div>
        <div class="drill-hint-formula">💡 ${drill.hintFormula}</div>
        <div class="drill-meaning-vi">Nghĩa tiếng Việt: "<strong>${drill.meaningVi}</strong>"</div>

        <!-- Answer Slot Area -->
        <div class="scramble-answer-slot" id="slot-${drill.id}">
          <span class="slot-placeholder">Nhấp chọn các khối từ bên dưới để ghép thành câu...</span>
        </div>

        <!-- Word Tiles Pool -->
        <div class="scramble-tiles-pool" id="pool-${drill.id}">
          ${drill.tokens.map((token, tIdx) => `
            <button class="btn-word-tile" data-token="${token}" data-t-idx="${tIdx}">
              ${token}
            </button>
          `).join('')}
        </div>

        <!-- Action Controls -->
        <div class="scramble-actions">
          <button class="btn-primary-sm btn-check-scramble" data-drill-id="${drill.id}">
            ✓ Kiểm Tra Câu
          </button>
          <button class="btn-ghost-sm btn-clear-scramble" data-drill-id="${drill.id}">
            🔄 Xếp lại
          </button>
        </div>

        <div class="drill-feedback-panel hidden" id="fb-${drill.id}"></div>
      </div>
    `;
  }

  // DẠNG 2: ĐIỀN TỪ CÒN THIẾU
  if (drill.type === 'cloze') {
    return `
      <div class="drill-card glass-panel animate-fade-in" data-drill-id="${drill.id}" data-drill-idx="${idx}">
        <div class="drill-card-header">
          <span class="drill-type-badge cloze">${drill.badge}</span>
          <span class="drill-num">Câu ${idx + 1}</span>
        </div>

        <div class="drill-prompt-title">${drill.title}</div>
        <div class="cloze-sentence-box">
          <div class="cloze-zh">${drill.sentenceWithBlank}</div>
          <div class="cloze-pinyin">${drill.pinyin}</div>
          <div class="cloze-vi">"${drill.meaningVi}"</div>
        </div>

        <div class="drill-choices-grid">
          ${drill.choices.map((ch, cIdx) => `
            <button class="btn-drill-choice btn-cloze-choice" data-drill-id="${drill.id}" data-choice-idx="${cIdx}">
              <span class="choice-letter">${['A', 'B', 'C', 'D'][cIdx]}</span>
              <span class="choice-hanzi">${ch}</span>
            </button>
          `).join('')}
        </div>

        <div class="drill-feedback-panel hidden" id="fb-${drill.id}"></div>
      </div>
    `;
  }

  // DẠNG 3: TRẮC NGHIỆM NGỮ PHÁP
  if (drill.type === 'multiple-choice') {
    return `
      <div class="drill-card glass-panel animate-fade-in" data-drill-id="${drill.id}" data-drill-idx="${idx}">
        <div class="drill-card-header">
          <span class="drill-type-badge quiz">${drill.badge}</span>
          <span class="drill-num">Câu ${idx + 1}</span>
        </div>

        <div class="drill-prompt-title" style="font-size: 1.05rem;">${drill.title}</div>

        <div class="drill-choices-grid" style="margin-top: 0.75rem;">
          ${drill.choices.map((ch, cIdx) => `
            <button class="btn-drill-choice btn-mc-choice" data-drill-id="${drill.id}" data-choice-idx="${cIdx}">
              <span class="choice-letter">${['A', 'B', 'C', 'D'][cIdx]}</span>
              <span>${ch}</span>
            </button>
          `).join('')}
        </div>

        <div class="drill-feedback-panel hidden" id="fb-${drill.id}"></div>
      </div>
    `;
  }

  // DẠNG 4: CHO CÂU TIẾNG VIỆT ➔ VIẾT LẠI TIẾNG TRUNG (AI Chấm Điểm)
  if (drill.type === 'vi_to_zh') {
    return `
      <div class="drill-card glass-panel animate-fade-in" data-drill-id="${drill.id}" data-drill-idx="${idx}">
        <div class="drill-card-header">
          <span class="drill-type-badge vi-to-zh">${drill.badge}</span>
          <span class="drill-num">Câu ${idx + 1}</span>
        </div>

        <div class="drill-prompt-title">${drill.title}</div>
        <div class="drill-meaning-vi-box">
          "${drill.meaningVi}"
        </div>
        <div class="drill-hint-formula">💡 Cấu trúc gợi ý: ${drill.hintFormula}</div>

        <div class="drill-input-wrapper">
          <input type="text" class="drill-text-input input-zh" id="inputZh-${drill.id}" placeholder="${drill.samplePlaceholder}" autocomplete="off">
        </div>

        <div class="scramble-actions">
          <button class="btn-primary-sm btn-submit-zh" data-drill-id="${drill.id}">
            🤖 AI Chấm Câu
          </button>
        </div>

        <div class="drill-feedback-panel hidden" id="fb-${drill.id}"></div>
      </div>
    `;
  }

  // DẠNG 5: PHẢN XẠ NGHE / PINYIN ➔ VIẾT NGHĨA TIẾNG VIỆT (AI Chấm Điểm)
  if (drill.type === 'pinyin_to_vi') {
    return `
      <div class="drill-card glass-panel animate-fade-in" data-drill-id="${drill.id}" data-drill-idx="${idx}">
        <div class="drill-card-header">
          <span class="drill-type-badge pinyin-to-vi">${drill.badge}</span>
          <span class="drill-num">Câu ${idx + 1}</span>
        </div>

        <div class="drill-prompt-title">${drill.title}</div>

        <div class="pinyin-audio-box">
          <button class="btn-audio-circle-md btn-play-audio-drill" data-audio="${drill.audioText}" title="Nghe phát âm">🔊</button>
          <div class="pinyin-text-display" id="pinyinDisplay-${drill.id}">${drill.pinyin}</div>
          <button class="btn-ghost-sm btn-toggle-pinyin" data-drill-id="${drill.id}" style="margin-left: auto;">
            👁️ Ẩn/Hiện Pinyin
          </button>
        </div>

        <div class="drill-input-wrapper">
          <input type="text" class="drill-text-input input-vi" id="inputVi-${drill.id}" placeholder="${drill.samplePlaceholder}" autocomplete="off">
        </div>

        <div class="scramble-actions">
          <button class="btn-primary-sm btn-submit-vi" data-drill-id="${drill.id}">
            ✓ Kiểm Tra Nghĩa (AI)
          </button>
        </div>

        <div class="drill-feedback-panel hidden" id="fb-${drill.id}"></div>
      </div>
    `;
  }

  return '';
}

/**
 * Gắn sự kiện tương tác & Phản hồi tức thì cho cả 5 dạng bài tập
 */
function attachDrillEvents(container, drills, lesson) {
  drills.forEach(drill => {
    const fbEl = container.querySelector(`#fb-${drill.id}`);

    // DẠNG 1: SẮP XẾP CÂU
    if (drill.type === 'scramble') {
      const pool = container.querySelector(`#pool-${drill.id}`);
      const slot = container.querySelector(`#slot-${drill.id}`);
      const btnCheck = container.querySelector(`.btn-check-scramble[data-drill-id="${drill.id}"]`);
      const btnClear = container.querySelector(`.btn-clear-scramble[data-drill-id="${drill.id}"]`);

      if (!pool || !slot) return;

      // Click tile ở pool -> chuyển lên slot
      pool.addEventListener('click', (e) => {
        const tile = e.target.closest('.btn-word-tile');
        if (!tile) return;
        e.preventDefault();
        e.stopPropagation();
        playSound('click');
        slot.querySelector('.slot-placeholder')?.remove();
        slot.appendChild(tile);
      });

      // Click tile ở slot -> trả về pool
      slot.addEventListener('click', (e) => {
        const tile = e.target.closest('.btn-word-tile');
        if (!tile) return;
        e.preventDefault();
        e.stopPropagation();
        playSound('click');
        pool.appendChild(tile);
        if (slot.querySelectorAll('.btn-word-tile').length === 0) {
          slot.innerHTML = `<span class="slot-placeholder">Nhấp chọn các khối từ bên dưới để ghép thành câu...</span>`;
        }
      });

      // Nút Xếp lại
      btnClear?.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('click');
        slot.querySelectorAll('.btn-word-tile').forEach(t => pool.appendChild(t));
        slot.innerHTML = `<span class="slot-placeholder">Nhấp chọn các khối từ bên dưới để ghép thành câu...</span>`;
        fbEl.classList.add('hidden');
      });

      // Nút Kiểm tra
      btnCheck?.addEventListener('click', () => {
        const chosenTiles = Array.from(slot.querySelectorAll('.btn-word-tile')).map(t => t.dataset.token);
        const assembledZh = chosenTiles.join('');

        if (assembledZh.length === 0) {
          alert('Vui lòng chọn các từ để ghép thành câu trước!');
          return;
        }

        const isCorrect = assembledZh === drill.targetZh;
        fbEl.classList.remove('hidden');

        if (isCorrect) {
          playSound('correct');
          fbEl.innerHTML = `
            <div class="drill-fb-box success">
              <div class="fb-top">
                <strong>✅ Hoàn Toàn Chính Xác!</strong>
                <button class="btn-audio-circle-sm" id="btnAudioFb-${drill.id}">🔊 Nghe cả câu</button>
              </div>
              <div class="fb-detail-zh">${drill.fullTargetZh}</div>
              <div class="fb-detail-pinyin">${drill.pinyin}</div>
              <p class="fb-exp">${drill.grammarExplanation}</p>
              <button class="btn-ai-explain" data-drill-id="${drill.id}">
                🤖 AI Phân Tích & Mở Rộng
              </button>
            </div>
          `;
        } else {
          playSound('wrong');
          fbEl.innerHTML = `
            <div class="drill-fb-box error">
              <div class="fb-top">
                <strong>❌ Chưa chuẩn trật tự ngữ pháp!</strong>
                <button class="btn-audio-circle-sm" id="btnAudioFb-${drill.id}">🔊 Nghe câu đúng</button>
              </div>
              <div class="fb-detail-zh">Đáp án chuẩn: ${drill.fullTargetZh}</div>
              <div class="fb-detail-pinyin">${drill.pinyin}</div>
              <p class="fb-exp">${drill.grammarExplanation}</p>
              <button class="btn-ai-explain" data-drill-id="${drill.id}">
                🤖 Hỏi AI: Vì Sao Lại Xếp Như Vậy?
              </button>
            </div>
          `;
        }

        fbEl.querySelector(`#btnAudioFb-${drill.id}`)?.addEventListener('click', () => {
          speakChinese(drill.fullTargetZh);
        });

        fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
          triggerAIExplanation(container, drill, assembledZh, drill.fullTargetZh, lesson);
        });
      });
    }

    // DẠNG 2: ĐIỀN TỪ CÒN THIẾU
    if (drill.type === 'cloze') {
      const buttons = container.querySelectorAll(`.btn-cloze-choice[data-drill-id="${drill.id}"]`);

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const chosenIdx = parseInt(btn.dataset.choiceIdx, 10);
          const isCorrect = chosenIdx === drill.correctIndex;

          buttons.forEach((b, idx) => {
            b.disabled = true;
            if (idx === drill.correctIndex) b.classList.add('correct');
            if (idx === chosenIdx && !isCorrect) b.classList.add('wrong');
          });

          fbEl.classList.remove('hidden');
          if (isCorrect) {
            playSound('correct');
            fbEl.innerHTML = `
              <div class="drill-fb-box success">
                <div class="fb-top">
                  <strong>✅ Chính xác!</strong>
                  <button class="btn-audio-circle-sm" id="btnAudioFb-${drill.id}">🔊 Nghe</button>
                </div>
                <p style="margin: 0.2rem 0;">${drill.explanation}</p>
                <button class="btn-ai-explain" data-drill-id="${drill.id}">
                  🤖 AI Giải Thích Thêm Về Ngữ Cảnh
                </button>
              </div>
            `;
          } else {
            playSound('wrong');
            fbEl.innerHTML = `
              <div class="drill-fb-box error">
                <div class="fb-top">
                  <strong>❌ Chưa đúng!</strong>
                  <button class="btn-audio-circle-sm" id="btnAudioFb-${drill.id}">🔊 Nghe</button>
                </div>
                <p style="margin: 0.2rem 0;">${drill.explanation}</p>
                <button class="btn-ai-explain" data-drill-id="${drill.id}">
                  🤖 Hỏi AI Vì Sao Dùng '${drill.correctWord}'
                </button>
              </div>
            `;
          }

          fbEl.querySelector(`#btnAudioFb-${drill.id}`)?.addEventListener('click', () => {
            speakChinese(drill.correctWord);
          });

          fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
            triggerAIExplanation(container, drill, drill.choices[chosenIdx], drill.correctWord, lesson);
          });
        });
      });
    }

    // DẠNG 3: TRẮC NGHIỆM NGỮ PHÁP
    if (drill.type === 'multiple-choice') {
      const buttons = container.querySelectorAll(`.btn-mc-choice[data-drill-id="${drill.id}"]`);

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const chosenIdx = parseInt(btn.dataset.choiceIdx, 10);
          const isCorrect = chosenIdx === drill.correctIndex;

          buttons.forEach((b, idx) => {
            b.disabled = true;
            if (idx === drill.correctIndex) b.classList.add('correct');
            if (idx === chosenIdx && !isCorrect) b.classList.add('wrong');
          });

          fbEl.classList.remove('hidden');
          if (isCorrect) {
            playSound('correct');
            fbEl.innerHTML = `
              <div class="drill-fb-box success">
                <strong>✅ Đúng rồi!</strong> ${drill.explanation}
                <button class="btn-ai-explain" data-drill-id="${drill.id}">
                  🤖 AI Mở Rộng Thêm Ngữ Pháp
                </button>
              </div>
            `;
          } else {
            playSound('wrong');
            fbEl.innerHTML = `
              <div class="drill-fb-box error">
                <strong>❌ Chưa đúng!</strong> ${drill.explanation}
                <button class="btn-ai-explain" data-drill-id="${drill.id}">
                  🤖 Nhờ AI Phân Tích Lỗi Sai
                </button>
              </div>
            `;
          }

          fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
            triggerAIExplanation(container, drill, drill.choices[chosenIdx], drill.choices[drill.correctIndex], lesson);
          });
        });
      });
    }

    // DẠNG 4: DỊCH VIỆT ➔ VIẾT TIẾNG TRUNG (AI Chấm Điểm)
    if (drill.type === 'vi_to_zh') {
      const btnSubmit = container.querySelector(`.btn-submit-zh[data-drill-id="${drill.id}"]`);
      const inputEl = container.querySelector(`#inputZh-${drill.id}`);

      const handleGradeViToZh = async () => {
        const userText = inputEl.value.trim();
        if (!userText) {
          alert('Vui lòng gõ câu tiếng Trung của bạn trước khi chấm!');
          return;
        }

        fbEl.classList.remove('hidden');
        fbEl.innerHTML = `
          <div class="drill-fb-box" style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3);">
            <div class="ai-loading-spinner" style="padding: 1rem;">
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
              <span>Trợ lý AI đang chấm điểm và phân tích câu của bạn...</span>
            </div>
          </div>
        `;

        const evalResult = await gradeWritingWithAI({
          taskType: 'vi_to_zh',
          prompt: drill.meaningVi,
          targetReference: drill.targetZh,
          userSubmission: userText,
          grammarPoint: drill.hintFormula,
          lessonTitle: lesson.title
        });

        const isGood = evalResult.status === 'correct';
        const isAcceptable = evalResult.status === 'acceptable';

        if (isGood) playSound('correct');
        else if (isAcceptable) playSound('click');
        else playSound('wrong');

        fbEl.innerHTML = `
          <div class="drill-fb-box ${isGood ? 'success' : isAcceptable ? 'acceptable' : 'error'}" style="${isAcceptable ? 'background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: #fef3c7;' : ''}">
            <div class="fb-top">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="ai-status-tag ${evalResult.status}">
                  ${isGood ? '✅ Chính Xác' : isAcceptable ? '💡 Chấp Nhận Được' : '❌ Chưa Chuẩn'}
                </span>
                <span class="ai-eval-score-badge">${evalResult.score}/100đ</span>
              </div>
              <button class="btn-audio-circle-sm" id="btnAudioFb-${drill.id}" title="Nghe câu chuẩn">🔊 Nghe</button>
            </div>

            <p style="margin: 0.4rem 0; font-size: 0.9rem;"><strong>Nhận xét AI:</strong> ${evalResult.feedback}</p>

            <div class="ai-reference-sentence">
              <div style="font-size: 0.78rem; color: var(--gold-500); font-weight: 700;">Câu mẫu đối chiếu:</div>
              <div style="font-family: var(--font-chinese); font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0;">
                ${evalResult.improvedVersion || drill.targetZh}
              </div>
              <div style="font-size: 0.82rem; color: #38bdf8;">${drill.targetPinyin}</div>
            </div>

            <button class="btn-ai-explain" data-drill-id="${drill.id}">
              🤖 Nhờ AI Giải Thích Sâu Thêm
            </button>
          </div>
        `;

        fbEl.querySelector(`#btnAudioFb-${drill.id}`)?.addEventListener('click', () => {
          speakChinese(drill.targetZh);
        });

        fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
          triggerAIExplanation(container, drill, userText, drill.targetZh, lesson);
        });
      };

      btnSubmit?.addEventListener('click', handleGradeViToZh);
      inputEl?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleGradeViToZh();
        }
      });
    }

    // DẠNG 5: PHẢN XẠ NGHE / PINYIN ➔ VIẾT NGHĨA TIẾNG VIỆT (AI Chấm Điểm)
    if (drill.type === 'pinyin_to_vi') {
      const btnSubmit = container.querySelector(`.btn-submit-vi[data-drill-id="${drill.id}"]`);
      const inputEl = container.querySelector(`#inputVi-${drill.id}`);
      const btnPlayAudio = container.querySelector(`.btn-play-audio-drill[data-audio="${drill.audioText}"]`);
      const btnTogglePinyin = container.querySelector(`.btn-toggle-pinyin[data-drill-id="${drill.id}"]`);
      const pinyinEl = container.querySelector(`#pinyinDisplay-${drill.id}`);

      btnPlayAudio?.addEventListener('click', () => {
        speakChinese(drill.audioText);
      });

      btnTogglePinyin?.addEventListener('click', () => {
        pinyinEl?.classList.toggle('hidden');
      });

      const handleGradePinyinToVi = async () => {
        const userText = inputEl.value.trim();
        if (!userText) {
          alert('Vui lòng gõ nghĩa tiếng Việt của bạn trước khi kiểm tra!');
          return;
        }

        fbEl.classList.remove('hidden');
        fbEl.innerHTML = `
          <div class="drill-fb-box" style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3);">
            <div class="ai-loading-spinner" style="padding: 1rem;">
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
              <span>AI đang phân tích ngữ nghĩa câu dịch của bạn...</span>
            </div>
          </div>
        `;

        const evalResult = await gradeWritingWithAI({
          taskType: 'pinyin_to_vi',
          prompt: drill.pinyin,
          targetReference: drill.targetVi,
          userSubmission: userText,
          grammarPoint: drill.grammarExplanation,
          lessonTitle: lesson.title
        });

        const isGood = evalResult.status === 'correct';
        const isAcceptable = evalResult.status === 'acceptable';

        if (isGood) playSound('correct');
        else if (isAcceptable) playSound('click');
        else playSound('wrong');

        fbEl.innerHTML = `
          <div class="drill-fb-box ${isGood ? 'success' : isAcceptable ? 'acceptable' : 'error'}" style="${isAcceptable ? 'background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: #fef3c7;' : ''}">
            <div class="fb-top">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="ai-status-tag ${evalResult.status}">
                  ${isGood ? '✅ Chính Xác' : isAcceptable ? '💡 Chấp Nhận Được' : '❌ Chưa Chuẩn'}
                </span>
                <span class="ai-eval-score-badge">${evalResult.score}/100đ</span>
              </div>
              <button class="btn-audio-circle-sm" id="btnAudioFb-${drill.id}" title="Nghe lại">🔊 Nghe</button>
            </div>

            <p style="margin: 0.4rem 0; font-size: 0.9rem;"><strong>Nhận xét AI:</strong> ${evalResult.feedback}</p>

            <div class="ai-reference-sentence">
              <div style="font-size: 0.78rem; color: var(--gold-500); font-weight: 700;">Nghĩa tiếng Việt chuẩn:</div>
              <div style="font-size: 0.98rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0;">
                "${evalResult.improvedVersion || drill.targetVi}"
              </div>
              <div style="font-family: var(--font-chinese); font-size: 1.1rem; color: #38bdf8;">Chữ Hán: ${drill.targetZh}</div>
            </div>

            <button class="btn-ai-explain" data-drill-id="${drill.id}">
              🤖 Hỏi AI Phân Tích Thêm
            </button>
          </div>
        `;

        fbEl.querySelector(`#btnAudioFb-${drill.id}`)?.addEventListener('click', () => {
          speakChinese(drill.audioText);
        });

        fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
          triggerAIExplanation(container, drill, userText, drill.targetVi, lesson);
        });
      };

      btnSubmit?.addEventListener('click', handleGradePinyinToVi);
      inputEl?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleGradePinyinToVi();
        }
      });
    }
  });
}

/**
 * Hiển thị Popup AI Giải Thích Sâu (Gọi Gemini API hoặc Built-in Smart AI)
 */
async function triggerAIExplanation(container, drill, userAnswer, correctAnswer, lesson) {
  const modalContainer = container.querySelector('#aiModalContainer');
  if (!modalContainer) return;

  playSound('click');

  modalContainer.innerHTML = `
    <div class="ai-modal-backdrop animate-fade-in">
      <div class="ai-modal-card glass-panel animate-scale-up">
        <div class="ai-modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="ai-robot-avatar">🤖</span>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800;">Trợ Lý AI Giải Thích Ngữ Pháp</h3>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${lesson.title}</span>
            </div>
          </div>
          <button class="ai-modal-close" id="btnCloseAiModal">&times;</button>
        </div>

        <div class="ai-modal-body" id="aiModalContent">
          <div class="ai-loading-spinner">
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <span>Trợ lý AI đang phân tích dữ liệu bài học...</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.querySelector('#btnCloseAiModal')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  modalContainer.querySelector('.ai-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('ai-modal-backdrop')) {
      modalContainer.innerHTML = '';
    }
  });

  // Gọi service AI
  try {
    const aiResult = await explainWithAI({
      questionTitle: drill.title,
      contextText: drill.targetZh || drill.sentenceWithBlank || drill.meaningVi || '',
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      grammarPoint: drill.hintFormula || drill.explanation || drill.grammarExplanation || '',
      lessonTitle: lesson.title
    });

    const bodyEl = modalContainer.querySelector('#aiModalContent');
    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="ai-source-badge">
          ${aiResult.source === 'gemini' ? '✨ Phân tích trực tiếp từ Google Gemini API' : '⚡ Phân tích bởi Động Cơ AI Cục Bộ (HSK 3.0 Engine)'}
        </div>
        <div class="ai-markdown-rendered">
          ${formatMarkdownToHtml(aiResult.text)}
        </div>
        <div class="ai-modal-footer-tip">
          💡 Bạn có thể cấu hình Gemini API Key miễn phí tại nút <strong>⚙️ Cấu Hình AI</strong> trên thanh công cụ để trải nghiệm độ sâu tối đa.
        </div>
      `;
    }
  } catch (err) {
    const bodyEl = modalContainer.querySelector('#aiModalContent');
    if (bodyEl) {
      bodyEl.innerHTML = `<div class="ai-error-box">Lỗi kết nối AI: ${err.message}</div>`;
    }
  }
}

/**
 * Modal Cấu Hình API Key (Gemini / OpenAI)
 */
function openAIConfigModal(container) {
  const modalContainer = container.querySelector('#aiModalContainer');
  if (!modalContainer) return;

  const currentConfig = getAIConfig();

  modalContainer.innerHTML = `
    <div class="ai-modal-backdrop animate-fade-in">
      <div class="ai-modal-card glass-panel animate-scale-up" style="max-width: 500px;">
        <div class="ai-modal-header">
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800;">⚙️ Cấu Hình Trí Tuệ Nhân Tạo (AI)</h3>
          <button class="ai-modal-close" id="btnCloseConfigModal">&times;</button>
        </div>

        <div class="ai-modal-body" style="padding: 1.25rem 0;">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">
            Hệ thống luôn tích hợp sẵn <strong>Động Cơ AI Cục Bộ (Miễn phí 100% không cần key)</strong>. Nếu bạn có Google Gemini API Key, hãy nhập vào đây để nhận câu trả lời mở rộng chuyên sâu không giới hạn!
          </p>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.35rem;">Nhà cung cấp AI:</label>
            <select id="selectAIProvider" class="form-select-styled" style="width: 100%; padding: 0.5rem; border-radius: 6px; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid var(--border-subtle);">
              <option value="gemini" ${currentConfig.provider === 'gemini' ? 'selected' : ''}>Google Gemini (Khuyên dùng - Miễn phí & Cực nhanh)</option>
              <option value="builtin" ${currentConfig.provider === 'builtin' ? 'selected' : ''}>Chỉ dùng Động Cơ Cục Bộ (Không cần API Key)</option>
            </select>
          </div>

          <div id="apiKeyGroup" style="margin-bottom: 1rem; ${currentConfig.provider === 'builtin' ? 'display: none;' : ''}">
            <label style="display: block; font-size: 0.82rem; font-weight: 700; margin-bottom: 0.35rem;">
              Google Gemini API Key:
            </label>
            <input type="password" id="inputApiKey" class="form-input-styled" 
                   value="${currentConfig.apiKey || ''}" 
                   placeholder="Dán API Key (AIzaSy...)" 
                   style="width: 100%; padding: 0.6rem; border-radius: 6px; background: rgba(0,0,0,0.2); color: var(--text-primary); border: 1px solid var(--border-subtle); box-sizing: border-box;" />
            <div style="margin-top: 0.4rem; font-size: 0.75rem; color: var(--text-muted);">
              Lấy key miễn phí tại: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #38bdf8; text-decoration: underline;">Google AI Studio</a>. Key được lưu bảo mật 100% trong máy của bạn (localStorage).
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
            <button class="btn-ghost-sm" id="btnCancelConfig">Hủy</button>
            <button class="btn-primary-sm" id="btnSaveConfig">Lưu Cấu Hình</button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.querySelector('#selectAIProvider')?.addEventListener('change', (e) => {
    const group = modalContainer.querySelector('#apiKeyGroup');
    if (group) group.style.display = e.target.value === 'builtin' ? 'none' : 'block';
  });

  modalContainer.querySelector('#btnCloseConfigModal')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  modalContainer.querySelector('#btnCancelConfig')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  modalContainer.querySelector('#btnSaveConfig')?.addEventListener('click', () => {
    playSound('correct');
    const provider = modalContainer.querySelector('#selectAIProvider').value;
    const apiKey = modalContainer.querySelector('#inputApiKey').value.trim();
    saveAIConfig({ provider, apiKey });
    alert('✅ Đã lưu cấu hình AI thành công!');
    modalContainer.innerHTML = '';
  });
}

function formatMarkdownToHtml(markdown) {
  if (!markdown) return '';
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n- /g, '<br/>• ')
    .replace(/\n/g, '<br/>');
}
