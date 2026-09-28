import { playSound, speakChinese } from '../utils/speech.js';
import { generateLocalDrills, explainWithAI, getAIConfig, saveAIConfig } from '../utils/aiService.js';

export function renderLessonAIDrills(container, lesson) {
  let drills = generateLocalDrills(lesson);

  function render() {
    container.innerHTML = `
      <div class="lesson-ai-drills-wrapper animate-fade-in">
        <!-- AI Toolbar -->
        <div class="ai-toolbar glass-panel">
          <div class="ai-toolbar-info">
            <span class="ai-badge-pulse">🤖 AI Smart Drills</span>
            <span class="ai-desc-text">Bài tập tự động sinh dựa trên 25 từ & 2 điểm ngữ pháp Bài ${lesson.number}</span>
          </div>

          <div class="ai-toolbar-actions">
            <button class="btn-ai-action" id="btnRegenerateDrills" title="Tự động sinh bộ đề bài tập mới">
              🎲 Tạo Bộ Đề Mới
            </button>
            <button class="btn-ai-action secondary" id="btnOpenAIConfig" title="Cài đặt API Key Gemini / OpenAI">
              ⚙️ Cấu Hình AI
            </button>
          </div>
        </div>

        <!-- Drills List -->
        <div class="ai-drills-list" id="aiDrillsList">
          ${drills.map((drill, dIdx) => renderDrillItem(drill, dIdx)).join('')}
        </div>

        <!-- AI Deep Explanation Modal Container -->
        <div id="aiModalContainer"></div>
      </div>
    `;

    // Gắn sự kiện nút Tạo đề mới
    container.querySelector('#btnRegenerateDrills')?.addEventListener('click', () => {
      playSound('click');
      drills = generateLocalDrills(lesson);
      render();
    });

    // Gắn sự kiện nút Cấu hình AI
    container.querySelector('#btnOpenAIConfig')?.addEventListener('click', () => {
      playSound('click');
      openAIConfigModal(container);
    });

    // Gắn sự kiện cho từng loại bài tập
    attachDrillEvents(container, drills, lesson);
  }

  render();
}

/**
 * Render từng câu hỏi bài tập
 */
function renderDrillItem(drill, idx) {
  if (drill.type === 'scramble') {
    return `
      <div class="drill-card glass-panel" data-drill-id="${drill.id}" data-drill-idx="${idx}">
        <div class="drill-card-header">
          <span class="drill-type-badge scramble">${drill.badge}</span>
          <span class="drill-num">Câu ${idx + 1}</span>
        </div>

        <div class="drill-prompt-title">${drill.title}</div>
        <div class="drill-hint-formula">💡 ${drill.hintFormula}</div>
        <div class="drill-meaning-vi">Dịch nghĩa: "<strong>${drill.meaningVi}</strong>"</div>

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

  if (drill.type === 'cloze') {
    return `
      <div class="drill-card glass-panel" data-drill-id="${drill.id}" data-drill-idx="${idx}">
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

  // Dạng multiple choice thông thường
  return `
    <div class="drill-card glass-panel" data-drill-id="${drill.id}" data-drill-idx="${idx}">
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

/**
 * Gắn sự kiện cho các bài tập
 */
function attachDrillEvents(container, drills, lesson) {
  // Sắp xếp câu (Scramble)
  drills.forEach(drill => {
    if (drill.type === 'scramble') {
      const pool = container.querySelector(`#pool-${drill.id}`);
      const slot = container.querySelector(`#slot-${drill.id}`);
      const btnCheck = container.querySelector(`.btn-check-scramble[data-drill-id="${drill.id}"]`);
      const btnClear = container.querySelector(`.btn-clear-scramble[data-drill-id="${drill.id}"]`);
      const fbEl = container.querySelector(`#fb-${drill.id}`);

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

        // Phát âm câu đúng
        fbEl.querySelector(`#btnAudioFb-${drill.id}`)?.addEventListener('click', () => {
          speakChinese(drill.fullTargetZh);
        });

        // Nút bấm nhờ AI giải thích sâu
        fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
          triggerAIExplanation(container, drill, assembledZh, drill.fullTargetZh, lesson);
        });
      });
    }

    // Dạng Điền từ (Cloze)
    if (drill.type === 'cloze') {
      const buttons = container.querySelectorAll(`.btn-cloze-choice[data-drill-id="${drill.id}"]`);
      const fbEl = container.querySelector(`#fb-${drill.id}`);

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
                <strong>✅ Chính xác!</strong> ${drill.explanation}
                <button class="btn-ai-explain" data-drill-id="${drill.id}" style="margin-top: 0.5rem;">
                  🤖 AI Giải Thích Thêm Về Ngữ Cảnh
                </button>
              </div>
            `;
          } else {
            playSound('wrong');
            fbEl.innerHTML = `
              <div class="drill-fb-box error">
                <strong>❌ Chưa đúng!</strong> ${drill.explanation}
                <button class="btn-ai-explain" data-drill-id="${drill.id}" style="margin-top: 0.5rem;">
                  🤖 Hỏi AI Vì Sao Dùng '${drill.correctWord}'
                </button>
              </div>
            `;
          }

          fbEl.querySelector(`.btn-ai-explain[data-drill-id="${drill.id}"]`)?.addEventListener('click', () => {
            triggerAIExplanation(container, drill, drill.choices[chosenIdx], drill.correctWord, lesson);
          });
        });
      });
    }

    // Dạng Trắc nghiệm (Multiple Choice)
    if (drill.type === 'multiple-choice') {
      const buttons = container.querySelectorAll(`.btn-mc-choice[data-drill-id="${drill.id}"]`);
      const fbEl = container.querySelector(`#fb-${drill.id}`);

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
                <button class="btn-ai-explain" data-drill-id="${drill.id}" style="margin-top: 0.5rem;">
                  🤖 AI Mở Rộng Thêm Ngữ Pháp
                </button>
              </div>
            `;
          } else {
            playSound('wrong');
            fbEl.innerHTML = `
              <div class="drill-fb-box error">
                <strong>❌ Chưa đúng!</strong> ${drill.explanation}
                <button class="btn-ai-explain" data-drill-id="${drill.id}" style="margin-top: 0.5rem;">
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
      contextText: drill.targetZh || drill.sentenceWithBlank || '',
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      grammarPoint: drill.hintFormula || drill.explanation || '',
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
