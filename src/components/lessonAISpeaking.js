// Component: Studio Luyện Nói Đối Thoại 1-1 Với AI (Hội Thoại Linh Động Lũy Kế)
// Tích lũy kiến thức từ Bài 1 -> Bài hiện tại
// Hỗ trợ: Tùy biến kịch bản, chọn vai A/B, chỉnh số câu, ghi âm giọng thật & phát lại toàn bộ song ngữ

import { playSound, speakChinese } from '../utils/speech.js';
import { 
  generateSpeakingScenario, 
  adaptAIReplyWithAI, 
  evaluateSpokenSentenceWithAI,
  getAIConfig 
} from '../utils/aiService.js';
import { 
  startVoiceRecording, 
  stopVoiceRecording, 
  createChineseSpeechRecognizer,
  playAudioUrl,
  stopCurrentAudio,
  checkVoiceCapabilities
} from '../utils/voiceService.js';
import { HSK1_LESSONS } from '../data/hsk1LessonsData.js';
import { HSK2_LESSONS } from '../data/hsk2LessonsData.js';
import { HSK3_LESSONS } from '../data/hsk3LessonsData.js';

export function renderLessonAISpeaking(container, lesson, options = {}) {
  // 1. Thu thập danh sách bài học lũy kế từ Bài 1 -> Bài hiện tại
  const allLessonsUpToNow = resolveCumulativeLessons(lesson, options.allLessons);

  // 2. State chính của Studio
  let state = {
    phase: 'setup', // 'setup' | 'practicing' | 'review'
    userRole: 'A', // 'A' (Nói trước) | 'B' (Nói sau)
    turnCount: 4, // 4, 6, 8, 10
    scenario: null,
    isLoadingScenario: false,
    activeTurnIdx: 0,
    isRecording: false,
    activeRecognizer: null,
    currentSpokenText: '',
    isPlayingAll: false,
    currentPlayingTurnIdx: -1,
    showVietnamese: true,
    feedbackMap: {},
    recordedBlobs: {} // turnIdx => { blob, audioUrl }
  };

  const voiceCaps = checkVoiceCapabilities();

  // Khởi tạo kịch bản ban đầu
  async function initScenario() {
    state.isLoadingScenario = true;
    render();
    try {
      state.scenario = await generateSpeakingScenario({
        lesson,
        allLessonsUpToNow,
        turnCount: state.turnCount,
        userRole: state.userRole
      });
    } catch (e) {
      console.warn('Lỗi sinh kịch bản:', e);
    } finally {
      state.isLoadingScenario = false;
      render();
    }
  }

  // Khởi chạy sinh kịch bản
  initScenario();

  function render() {
    container.innerHTML = `
      <div class="speaking-studio-wrapper animate-fade-in">
        ${renderHeader()}
        ${state.isLoadingScenario ? renderLoadingState() : renderCurrentPhase()}
      </div>
    `;

    attachEvents();
  }

  // Header thông tin kiến thức tích lũy
  function renderHeader() {
    const vocabCount = (allLessonsUpToNow || []).reduce((acc, l) => acc + (l.words || []).length, 0);
    const grammarCount = (allLessonsUpToNow || []).reduce((acc, l) => acc + (l.grammarPoints || []).length, 0);
    const lessonIdx = (lesson.number || 1);

    return `
      <div class="speaking-studio-header glass-panel">
        <div class="speaking-header-left">
          <div class="speaking-studio-badge">
            <span class="live-dot pulse"></span>
            🎙️ Studio Luyện Nói Đối Thoại 1-1 Cùng AI
          </div>
          <h3 class="speaking-studio-title">Khẩu Ngữ Thực Chiến & Tích Lũy Kiến Thức</h3>
          <p class="speaking-studio-desc">
            Vận dụng vốn từ và ngữ pháp từ <strong>Bài 1 đến Bài ${lessonIdx}</strong> để giao tiếp tự nhiên cùng AI. 
            Bạn nói vào Micro ➔ AI nghe hiểu, phản hồi và phát âm giọng chuẩn.
          </p>
        </div>
        <div class="speaking-header-stats">
          <div class="stat-bubble">
            <span class="stat-num">${lessonIdx}</span>
            <span class="stat-lbl">Bài Lũy Kế</span>
          </div>
          <div class="stat-bubble">
            <span class="stat-num">${vocabCount}</span>
            <span class="stat-lbl">Từ Vựng</span>
          </div>
          <div class="stat-bubble">
            <span class="stat-num">${grammarCount}</span>
            <span class="stat-lbl">Điểm Ngữ Pháp</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderLoadingState() {
    return `
      <div class="speaking-loading-box glass-panel">
        <div class="spinner-large"></div>
        <div class="loading-text">Đang tổng hợp kiến thức từ Bài 1 -> Bài hiện tại và soạn kịch bản hội thoại...</div>
        <div class="loading-sub">Hệ thống đang chuẩn bị tình huống giao tiếp đời sống gần gũi nhất.</div>
      </div>
    `;
  }

  function renderCurrentPhase() {
    if (!state.scenario) {
      return `
        <div class="glass-panel" style="padding: 2rem; text-align: center;">
          <p>Chưa có kịch bản đối thoại. Bấm nút dưới để tạo kịch bản mới.</p>
          <button class="btn-ai-action" id="btnRetryScenario">🔄 Tạo Kịch Bản Mới</button>
        </div>
      `;
    }

    if (state.phase === 'setup') {
      return renderSetupPhase();
    } else if (state.phase === 'practicing') {
      return renderPracticingPhase();
    } else if (state.phase === 'review') {
      return renderReviewPhase();
    }
  }

  // =========================================================================
  // GIAI ĐOẠN 1: THIẾT LẬP & CHỈNH SỬA KỊCH BẢN (SETUP & SCRIPT EDITING)
  // =========================================================================
  function renderSetupPhase() {
    const sc = state.scenario;

    return `
      <div class="speaking-setup-container animate-fade-in">
        <!-- Bảng điều khiển cài đặt nhanh -->
        <div class="speaking-config-card glass-panel">
          <div class="config-row-title">⚙️ Tùy Chỉnh Cuộc Đối Thoại:</div>
          <div class="config-controls-grid">
            <!-- Chọn vai A hoặc B -->
            <div class="config-item">
              <label class="config-label">🎭 Chọn vai của bạn:</label>
              <div class="role-selector-btns">
                <button class="btn-role-choice ${state.userRole === 'A' ? 'active' : ''}" data-role="A">
                  <span>👤 Bạn là Nhân vật A</span>
                  <small>(Nói câu mở đầu)</small>
                </button>
                <button class="btn-role-choice ${state.userRole === 'B' ? 'active' : ''}" data-role="B">
                  <span>🤖 Bạn là Nhân vật B</span>
                  <small>(AI mở đầu, bạn đáp lại)</small>
                </button>
              </div>
            </div>

            <!-- Chọn số lượng câu đối thoại -->
            <div class="config-item">
              <label class="config-label">💬 Số lượt đối thoại:</label>
              <div class="turn-count-selector">
                ${[4, 6, 8, 10].map(cnt => `
                  <button class="btn-turn-choice ${state.turnCount === cnt ? 'active' : ''}" data-turns="${cnt}">
                    ${cnt} Câu
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Nút đổi kịch bản -->
            <div class="config-item actions-item">
              <label class="config-label">🔄 Tạo kịch bản khác:</label>
              <button class="btn-ai-action secondary" id="btnRegenerateScenario" style="width: 100%;">
                🎲 Đổi Chủ Đề Khác
              </button>
            </div>
          </div>

          <!-- Thông tin bối cảnh -->
          <div class="scenario-context-banner">
            <div class="context-theme-tag">🎯 Chủ đề: <strong>${sc.title}</strong></div>
            <div class="context-desc-text">📝 Bối cảnh: <em>${sc.context}</em></div>
          </div>
        </div>

        <!-- Danh sách thẻ kịch bản cho phép người dùng tự do sửa -->
        <div class="speaking-script-editor-wrapper">
          <div class="editor-header-bar">
            <h4>📝 Duyệt & Chỉnh Sửa Kịch Bản Trước Khi Nói:</h4>
            <span class="editor-tip">💡 Bạn có thể sửa câu tiếng Việt của mình để nói đúng ý bạn muốn!</span>
          </div>

          <div class="script-turns-list" id="scriptTurnsList">
            ${sc.turns.map((turn, idx) => renderScriptTurnCard(turn, idx)).join('')}
          </div>

          <!-- Nút bắt đầu thực chiến -->
          <div class="start-speaking-action-box">
            <button class="btn-start-speaking" id="btnStartPractice">
              <span>🎙️ Chốt Kịch Bản & Bắt Đầu Luyện Nói (${sc.turns.length} Câu)</span>
              <span class="arrow-icon">➔</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderScriptTurnCard(turn, idx) {
    const isUser = turn.speaker === 'user';

    return `
      <div class="script-turn-card glass-panel ${isUser ? 'user-turn' : 'ai-turn'}" data-turn-idx="${idx}">
        <div class="turn-card-head">
          <div class="speaker-badge ${isUser ? 'badge-user' : 'badge-ai'}">
            ${isUser ? '👤 Bạn (' + (state.userRole) + ')' : '🤖 AI (' + (state.userRole === 'A' ? 'B' : 'A') + ')'}
          </div>
          <span class="turn-seq-num">Lượt ${idx + 1} / ${state.scenario.turns.length}</span>
        </div>

        ${isUser ? `
          <!-- LƯỢT CỦA BẠN: Ô TEXTAREA TIẾNG VIỆT ĐỂ BẠN TỰ SỬA -->
          <div class="user-script-content">
            <label class="field-label">
              <span>🇻🇳 Ý của bạn (Tiếng Việt) - Bạn sẽ nhìn câu này để nói Tiếng Trung:</span>
            </label>
            <textarea class="textarea-turn-vi" data-turn-idx="${idx}" rows="2" 
                      placeholder="Nhập nội dung tiếng Việt bạn muốn phản xạ nói...">${turn.viPrompt || ''}</textarea>
            
            <div class="target-zh-preview">
              <span class="zh-preview-label">💡 Mẫu câu tiếng Trung tham khảo:</span>
              <span class="zh-preview-hanzi">${turn.expectedZh || ''}</span>
              <span class="zh-preview-pinyin">(${turn.expectedPinyin || ''})</span>
            </div>
          </div>
        ` : `
          <!-- LƯỢT CỦA AI: HIỂN THỊ TIẾNG TRUNG + PINYIN + TIẾNG VIỆT -->
          <div class="ai-script-content">
            <div class="ai-speech-row">
              <span class="field-label">🇨🇳 Câu phản hồi của AI (Tiếng Trung):</span>
              <button class="btn-audio-mini" data-speak="${turn.aiZh}" title="Nghe thử câu của AI">
                🔊 Nghe thử
              </button>
            </div>
            <div class="ai-zh-text">${turn.aiZh || ''}</div>
            <div class="ai-pinyin-text">${turn.aiPinyin || ''}</div>
            <div class="ai-vi-text">🇻🇳 Nghĩa: "${turn.aiVi || ''}"</div>

            <button class="btn-adapt-ai" data-turn-idx="${idx}" title="Tự động cập nhật câu AI logic với câu của bạn ở trên">
              🤖 Cập nhật câu AI theo câu của tôi
            </button>
          </div>
        `}
      </div>
    `;
  }

  // =========================================================================
  // GIAI ĐOẠN 2: THỰC CHIẾN LUYỆN NÓI TỪNG LƯỢT (ACTIVE INTERACTIVE PRACTICE)
  // =========================================================================
  function renderPracticingPhase() {
    const sc = state.scenario;
    const curIdx = state.activeTurnIdx;
    const curTurn = sc.turns[curIdx];
    const isUser = curTurn && curTurn.speaker === 'user';
    const isCompleted = curIdx >= sc.turns.length;

    return `
      <div class="speaking-practice-container animate-fade-in">
        <!-- Thanh tiến trình hội thoại -->
        <div class="practice-progress-bar glass-panel">
          <div class="progress-info-left">
            <span class="topic-tag">🎯 ${sc.title}</span>
            <span class="step-count">Lượt: <strong>${Math.min(curIdx + 1, sc.turns.length)} / ${sc.turns.length}</strong></span>
          </div>
          <div class="progress-actions-right">
            <button class="btn-exit-practice" id="btnBackToSetup" title="Quay lại chỉnh sửa kịch bản">
              ⚙️ Sửa Kịch Bản
            </button>
          </div>
        </div>

        <!-- Khung lịch sử hội thoại (Chat Stream) -->
        <div class="speaking-chat-stream glass-panel" id="speakingChatStream">
          ${sc.turns.slice(0, curIdx).map((t, idx) => renderChatBubble(t, idx)).join('')}
          
          <!-- Lượt đang diễn ra -->
          ${!isCompleted ? `
            <div class="active-turn-wrapper animate-slide-up">
              ${isUser ? renderActiveUserTurn(curTurn, curIdx) : renderActiveAITurn(curTurn, curIdx)}
            </div>
          ` : `
            <div class="session-complete-toast glass-panel">
              <span class="trophy-icon">🏆</span>
              <h4>Bạn đã hoàn thành xuất sắc đoạn đối thoại!</h4>
              <p>Hãy bấm nút bên dưới để nghe lại toàn bộ hội thoại và xem bảng đối chiếu song ngữ.</p>
              <button class="btn-start-speaking" id="btnGoToReview">
                🎧 Nghe Lại & Xem Chi Tiết Hội Thoại ➔
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  function renderChatBubble(turn, idx) {
    const isUser = turn.speaker === 'user';
    const audioData = state.recordedBlobs[idx];

    return `
      <div class="chat-bubble-row ${isUser ? 'bubble-user' : 'bubble-ai'} animate-fade-in">
        <div class="bubble-avatar">
          ${isUser ? '👤' : '🤖'}
        </div>
        <div class="bubble-content-box">
          <div class="bubble-speaker-name">
            ${isUser ? 'Bạn' : 'AI'} • Câu ${idx + 1}
          </div>

          ${isUser ? `
            <div class="bubble-user-prompt">
              <em>"${turn.viPrompt}"</em>
            </div>
            <div class="bubble-user-zh">
              ${turn.userSpokenZh || turn.expectedZh}
            </div>
            <div class="bubble-user-actions">
              ${audioData && audioData.audioUrl ? `
                <button class="btn-play-voice" data-audio-url="${audioData.audioUrl}">
                  ▶️ Nghe giọng tôi
                </button>
              ` : ''}
              <button class="btn-audio-mini" data-speak="${turn.expectedZh}">
                🔊 Giọng mẫu
              </button>
              ${turn.evaluation ? `
                <span class="eval-pill ${turn.evaluation.status}">
                  ⭐ ${turn.evaluation.score}đ: ${turn.evaluation.feedback}
                </span>
              ` : ''}
            </div>
          ` : `
            <div class="bubble-ai-zh">${turn.aiZh}</div>
            <div class="bubble-ai-pinyin">${turn.aiPinyin}</div>
            <div class="bubble-ai-vi">"${turn.aiVi}"</div>
            <div class="bubble-ai-actions">
              <button class="btn-audio-mini" data-speak="${turn.aiZh}">
                🔊 Nghe lại
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Khung lượt của người dùng (Interactive Mic & Text Input)
  function renderActiveUserTurn(turn, idx) {
    return `
      <div class="active-user-turn-card glass-panel" id="activeUserTurnCard">
        <div class="turn-prompt-header">
          <span class="badge-active-speaker">🎙️ Đến lượt bạn nói (Lượt ${idx + 1}):</span>
        </div>

        <!-- Đề bài câu tiếng Việt để người dùng tự phản xạ sang tiếng Trung -->
        <div class="user-cue-box">
          <div class="cue-label">Hãy nói bằng Tiếng Trung câu sau:</div>
          <div class="cue-text">"${turn.viPrompt}"</div>
        </div>

        <!-- Gợi ý từ/mẫu câu (Có thể xem nếu cần) -->
        <div class="user-cue-hint">
          <button class="btn-toggle-hint" id="btnTogglePromptHint">
            💡 Xem gợi ý câu mẫu & phát âm
          </button>
          <div class="prompt-hint-content hidden" id="promptHintContent">
            <span class="hint-zh">${turn.expectedZh}</span>
            <span class="hint-pinyin">(${turn.expectedPinyin})</span>
            <button class="btn-audio-mini" data-speak="${turn.expectedZh}" title="Nghe mẫu">🔊</button>
          </div>
        </div>

        <!-- Trạm Micro ghi âm & Nhận diện -->
        <div class="mic-station-box">
          <button class="btn-mic-record ${state.isRecording ? 'recording' : ''}" id="btnToggleMic">
            <div class="mic-icon-wrap">
              <span class="mic-icon">${state.isRecording ? '⏹️' : '🎙️'}</span>
              ${state.isRecording ? '<div class="mic-wave-pulse"></div>' : ''}
            </div>
            <div class="mic-status-text">
              ${state.isRecording ? '🔴 Đang nghe & ghi âm... (Bấm dừng khi nói xong)' : 'Bấm Micro để bắt đầu nói tiếng Trung'}
            </div>
          </button>
        </div>

        <!-- Hộp hiển thị chữ Hán vừa phát âm & có thể chỉnh sửa nếu mic nghe lệch -->
        <div class="user-spoken-preview-box">
          <label class="preview-label">
            <span>Chữ Hán nhận diện được từ giọng nói:</span>
            <span class="preview-sub">(Bạn có thể gõ sửa lại chữ nếu muốn)</span>
          </label>
          <input type="text" class="input-spoken-zh" id="inputSpokenZh" 
                 value="${state.currentSpokenText || ''}" 
                 placeholder="Chữ Hán sẽ tự động xuất hiện khi bạn nói vào mic...">
        </div>

        <!-- Cụm nút gửi câu & mời AI nói -->
        <div class="user-turn-action-bar">
          <button class="btn-send-spoken-turn" id="btnSubmitUserTurn" ${!state.currentSpokenText ? 'disabled' : ''}>
            <span>👉 Gửi & Mời AI Trả Lời</span>
            <span class="send-icon">🚀</span>
          </button>
        </div>
      </div>
    `;
  }

  // Khung lượt của AI
  function renderActiveAITurn(turn, idx) {
    return `
      <div class="active-ai-turn-card glass-panel" id="activeAITurnCard">
        <div class="turn-prompt-header">
          <span class="badge-active-speaker">🤖 Đến lượt AI phản hồi (Lượt ${idx + 1}):</span>
        </div>

        <div class="ai-speaking-stage">
          <div class="ai-avatar-large">🤖</div>
          <div class="ai-bubble-live">
            <div class="live-zh">${turn.aiZh}</div>
            <div class="live-pinyin">${turn.aiPinyin}</div>
            <div class="live-vi">"${turn.aiVi}"</div>
          </div>
        </div>

        <div class="ai-turn-controls">
          <button class="btn-ai-action" id="btnPlayAiSpeech">
            🔊 Nghe Lại Giọng AI
          </button>
          <button class="btn-start-speaking" id="btnNextTurnFromAi">
            👉 Lượt Tiếp Theo Của Bạn ➔
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // GIAI ĐOẠN 3: TỔNG KẾT, NGHE LẠI TOÀN BỘ & TRANSCRIPT SONG NGỮ
  // =========================================================================
  function renderReviewPhase() {
    const sc = state.scenario;

    return `
      <div class="speaking-review-container animate-fade-in">
        <!-- Banner chúc mừng -->
        <div class="review-congrats-card glass-panel">
          <div class="congrats-header">
            <span class="trophy-glow">🎉</span>
            <div>
              <h3>Hoàn Thành Xuất Sắc Buổi Luyện Nói!</h3>
              <p>Bạn đã hoàn thành trọn vẹn ${sc.turns.length} câu đối thoại tự nhiên cùng AI.</p>
            </div>
          </div>
        </div>

        <!-- THANH PHÁT TOÀN BỘ HỘI THOẠI (RADIO MODE - PHÁT TUẦN TỰ) -->
        <div class="audio-full-player-bar glass-panel">
          <div class="player-controls-row">
            <button class="btn-play-all-audio ${state.isPlayingAll ? 'playing' : ''}" id="btnTogglePlayAll">
              <span class="play-icon">${state.isPlayingAll ? '⏹️ Dừng Phát' : '▶️ Phát Toàn Bộ Hội Thoại (Radio Mode)'}</span>
            </button>

            <div class="player-status-badge">
              ${state.isPlayingAll 
                ? `<span>🔊 Đang phát Lượt ${state.currentPlayingTurnIdx + 1}/${sc.turns.length}...</span>` 
                : `<span>Tự động phát: [Giọng thật của bạn] ➔ [Giọng chuẩn của AI]...</span>`
              }
            </div>

            <!-- Nút bật/tắt hiển thị tiếng Việt -->
            <button class="btn-toggle-vietnamese ${state.showVietnamese ? 'active' : ''}" id="btnToggleVietnamese">
              <span>👁️ ${state.showVietnamese ? 'Ẩn Tiếng Việt' : 'Hiện Tiếng Việt'}</span>
            </button>
          </div>
        </div>

        <!-- TRANSCRIPT CHI TIẾT ĐẦY ĐỦ CẢ ĐOẠN HỘI THOẠI -->
        <div class="full-transcript-box glass-panel">
          <div class="transcript-header-row">
            <h4>📜 Biên Bản Hội Thoại Chi Tiết (Song Ngữ Trung - Việt)</h4>
            <span class="transcript-sub">Nghe lại từng câu, đối chiếu phát âm và đọc hiểu sâu sắc.</span>
          </div>

          <div class="transcript-items-list">
            ${sc.turns.map((turn, idx) => renderTranscriptItem(turn, idx)).join('')}
          </div>
        </div>

        <!-- Cụm nút hành động cuối -->
        <div class="review-bottom-actions">
          <button class="btn-ai-action secondary" id="btnRestartSession">
            🔄 Luyện Tập Lại Bài Này
          </button>
          <button class="btn-start-speaking" id="btnNewScenario">
            📝 Soạn Kịch Bản Chủ Đề Mới
          </button>
        </div>
      </div>
    `;
  }

  function renderTranscriptItem(turn, idx) {
    const isUser = turn.speaker === 'user';
    const audioData = state.recordedBlobs[idx];
    const isPlayingThis = state.currentPlayingTurnIdx === idx;

    return `
      <div class="transcript-turn-card glass-panel ${isUser ? 'user-item' : 'ai-item'} ${isPlayingThis ? 'active-playing-turn' : ''}" 
           data-turn-idx="${idx}">
        <div class="transcript-card-head">
          <div class="speaker-tag ${isUser ? 'user-tag' : 'ai-tag'}">
            ${isUser ? '👤 Bạn (' + state.userRole + ')' : '🤖 AI (' + (state.userRole === 'A' ? 'B' : 'A') + ')'}
            <span class="item-turn-num">• Lượt ${idx + 1}</span>
          </div>

          <div class="item-audio-buttons">
            ${isUser && audioData && audioData.audioUrl ? `
              <button class="btn-play-voice-sm" data-audio-url="${audioData.audioUrl}" title="Nghe lại giọng thật của bạn">
                ▶️ Giọng thật của tôi
              </button>
            ` : ''}
            <button class="btn-audio-sm" data-speak="${isUser ? (turn.expectedZh) : (turn.aiZh)}" title="Nghe giọng đọc bản xứ">
              🔊 Giọng chuẩn AI
            </button>
          </div>
        </div>

        ${isUser ? `
          <div class="transcript-user-body">
            <div class="user-prompt-row ${state.showVietnamese ? '' : 'hidden'}">
              <span class="row-label">Đề bài (Tiếng Việt):</span>
              <span class="row-val font-vi">"${turn.viPrompt}"</span>
            </div>
            <div class="user-spoken-row">
              <span class="row-label">Bạn đã nói (Tiếng Trung):</span>
              <span class="row-val font-zh">${turn.userSpokenZh || turn.expectedZh}</span>
              <span class="row-pinyin font-pinyin">(${turn.expectedPinyin || ''})</span>
            </div>
            ${turn.evaluation ? `
              <div class="user-eval-row">
                <span class="eval-pill ${turn.evaluation.status}">
                  ⭐ Điểm: ${turn.evaluation.score}/100 - ${turn.evaluation.feedback}
                </span>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="transcript-ai-body">
            <div class="ai-speech-row">
              <span class="row-val font-zh">${turn.aiZh}</span>
            </div>
            <div class="ai-pinyin-row">
              <span class="row-pinyin font-pinyin">${turn.aiPinyin}</span>
            </div>
            <div class="ai-vi-row ${state.showVietnamese ? '' : 'hidden'}">
              <span class="row-val font-vi">"${turn.aiVi}"</span>
            </div>
          </div>
        `}
      </div>
    `;
  }

  // =========================================================================
  // GẮN SỰ KIỆN TƯƠNG TÁC (EVENT HANDLERS)
  // =========================================================================
  function attachEvents() {
    // 1. Setup Phase Events
    if (state.phase === 'setup') {
      // Chọn vai A hoặc B
      container.querySelectorAll('.btn-role-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          playSound('click');
          state.userRole = btn.dataset.role;
          initScenario();
        });
      });

      // Chọn số câu
      container.querySelectorAll('.btn-turn-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          playSound('click');
          state.turnCount = parseInt(btn.dataset.turns, 10);
          initScenario();
        });
      });

      // Đổi kịch bản ngẫu nhiên
      container.querySelector('#btnRegenerateScenario')?.addEventListener('click', () => {
        playSound('click');
        initScenario();
      });

      // Sửa câu tiếng Việt của người dùng
      container.querySelectorAll('.textarea-turn-vi').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
          const tIdx = parseInt(e.target.dataset.turnIdx, 10);
          if (state.scenario && state.scenario.turns[tIdx]) {
            state.scenario.turns[tIdx].viPrompt = e.target.value;
          }
        });
      });

      // Cập nhật câu AI theo câu người dùng sửa
      container.querySelectorAll('.btn-adapt-ai').forEach(btn => {
        btn.addEventListener('click', async () => {
          playSound('click');
          const tIdx = parseInt(btn.dataset.turnIdx, 10);
          const prevTurn = state.scenario.turns[tIdx - 1];
          const curAiTurn = state.scenario.turns[tIdx];

          if (prevTurn && curAiTurn) {
            btn.textContent = '⏳ Đang tối ưu câu AI...';
            btn.disabled = true;
            const updated = await adaptAIReplyWithAI({
              userVietnameseText: prevTurn.viPrompt,
              previousTurnZh: prevTurn.expectedZh,
              currentAiZh: curAiTurn.aiZh
            });
            if (updated) {
              curAiTurn.aiZh = updated.aiZh;
              curAiTurn.aiPinyin = updated.aiPinyin;
              curAiTurn.aiVi = updated.aiVi;
            }
            render();
          }
        });
      });

      // Nút bắt đầu thực chiến
      container.querySelector('#btnStartPractice')?.addEventListener('click', () => {
        playSound('click');
        state.phase = 'practicing';
        state.activeTurnIdx = 0;
        state.currentSpokenText = '';
        render();

        // Nếu lượt đầu tiên là của AI, tự động phát âm giọng AI
        const firstTurn = state.scenario.turns[0];
        if (firstTurn && firstTurn.speaker === 'ai') {
          setTimeout(() => {
            speakChinese(firstTurn.aiZh);
          }, 400);
        }
      });
    }

    // 2. Practicing Phase Events
    if (state.phase === 'practicing') {
      container.querySelector('#btnBackToSetup')?.addEventListener('click', () => {
        playSound('click');
        cleanupAudioSession();
        state.phase = 'setup';
        render();
      });

      container.querySelector('#btnTogglePromptHint')?.addEventListener('click', () => {
        playSound('click');
        const hintEl = container.querySelector('#promptHintContent');
        if (hintEl) hintEl.classList.toggle('hidden');
      });

      // Ghi âm Micro và Nhận diện giọng nói
      container.querySelector('#btnToggleMic')?.addEventListener('click', async () => {
        playSound('click');
        if (!state.isRecording) {
          // Bắt đầu ghi âm
          const res = await startVoiceRecording();
          if (res.success) {
            state.isRecording = true;

            // Khởi tạo Speech Recognizer tiếng Trung
            state.activeRecognizer = createChineseSpeechRecognizer({
              onResult: ({ finalText, interimText }) => {
                const text = finalText || interimText;
                if (text) {
                  state.currentSpokenText = text;
                  const inputEl = container.querySelector('#inputSpokenZh');
                  if (inputEl) inputEl.value = text;
                  const submitBtn = container.querySelector('#btnSubmitUserTurn');
                  if (submitBtn) submitBtn.disabled = false;
                }
              },
              onError: (e) => {
                console.warn('SpeechRecognition error:', e);
              },
              onEnd: () => {
                // If still marked as recording, keep alive or wait
              }
            });

            if (state.activeRecognizer) {
              try {
                state.activeRecognizer.start();
              } catch (e) {}
            }

            render();
          } else {
            alert('Không thể truy cập Micro: ' + res.error + '\nBạn vẫn có thể gõ câu trả lời vào ô văn bản.');
          }
        } else {
          // Dừng ghi âm
          state.isRecording = false;
          if (state.activeRecognizer) {
            try { state.activeRecognizer.stop(); } catch (e) {}
            state.activeRecognizer = null;
          }

          const { blob, audioUrl } = await stopVoiceRecording();
          if (blob && audioUrl) {
            state.recordedBlobs[state.activeTurnIdx] = { blob, audioUrl };
          }
          render();
        }
      });

      // Input chỉnh sửa chữ Hán
      const spokenInput = container.querySelector('#inputSpokenZh');
      spokenInput?.addEventListener('input', (e) => {
        state.currentSpokenText = e.target.value;
        const submitBtn = container.querySelector('#btnSubmitUserTurn');
        if (submitBtn) {
          submitBtn.disabled = !state.currentSpokenText.trim();
        }
      });

      spokenInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const submitBtn = container.querySelector('#btnSubmitUserTurn');
          if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
          }
        }
      });

      // Người dùng gửi lượt nói
      container.querySelector('#btnSubmitUserTurn')?.addEventListener('click', async () => {
        playSound('click');
        const curTurn = state.scenario.turns[state.activeTurnIdx];
        if (!curTurn) return;

        // Lưu câu nói
        curTurn.userSpokenZh = (state.currentSpokenText || '').trim();

        // Chấm điểm nhanh
        curTurn.evaluation = await evaluateSpokenSentenceWithAI({
          userSpokenZh: curTurn.userSpokenZh,
          viPrompt: curTurn.viPrompt,
          expectedZh: curTurn.expectedZh
        });

        if (curTurn.evaluation.status === 'correct') {
          playSound('correct');
        } else {
          playSound('click');
        }

        // Tăng lượt
        state.activeTurnIdx++;
        state.currentSpokenText = '';

        render();

        // Nếu lượt tiếp theo là của AI, tự động phát âm
        const nextTurn = state.scenario.turns[state.activeTurnIdx];
        if (nextTurn && nextTurn.speaker === 'ai') {
          setTimeout(() => {
            speakChinese(nextTurn.aiZh);
          }, 350);
        }
      });

      // Điều khiển lượt AI
      container.querySelector('#btnPlayAiSpeech')?.addEventListener('click', () => {
        const curTurn = state.scenario.turns[state.activeTurnIdx];
        if (curTurn) speakChinese(curTurn.aiZh);
      });

      container.querySelector('#btnNextTurnFromAi')?.addEventListener('click', () => {
        playSound('click');
        state.activeTurnIdx++;
        render();
      });

      // Nút chuyển sang màn hình Review
      container.querySelector('#btnGoToReview')?.addEventListener('click', () => {
        playSound('correct');
        state.phase = 'review';
        render();
      });
    }

    // 3. Review Phase Events
    if (state.phase === 'review') {
      // Nút phát toàn bộ hội thoại (Radio Mode)
      container.querySelector('#btnTogglePlayAll')?.addEventListener('click', () => {
        playSound('click');
        if (state.isPlayingAll) {
          stopSequentialPlayback();
        } else {
          startSequentialPlayback();
        }
      });

      // Ẩn/Hiện tiếng Việt
      container.querySelector('#btnToggleVietnamese')?.addEventListener('click', () => {
        playSound('click');
        state.showVietnamese = !state.showVietnamese;
        render();
      });

      // Nút luyện lại bài này
      container.querySelector('#btnRestartSession')?.addEventListener('click', () => {
        playSound('click');
        stopSequentialPlayback();
        state.phase = 'practicing';
        state.activeTurnIdx = 0;
        state.recordedBlobs = {};
        state.currentSpokenText = '';
        render();
      });

      // Nút soạn kịch bản mới
      container.querySelector('#btnNewScenario')?.addEventListener('click', () => {
        playSound('click');
        stopSequentialPlayback();
        state.phase = 'setup';
        state.recordedBlobs = {};
        initScenario();
      });
    }

    // Audio Playback Events chung
    container.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.speak;
        if (text) speakChinese(text);
      });
    });

    container.querySelectorAll('[data-audio-url]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.audioUrl;
        if (url) playAudioUrl(url);
      });
    });
  }

  // =========================================================================
  // ĐỘNG CƠ PHÁT LIỀN MẠCH TOÀN BỘ HỘI THOẠI (SEQUENTIAL RADIO PLAYER)
  // =========================================================================
  function startSequentialPlayback() {
    state.isPlayingAll = true;
    state.currentPlayingTurnIdx = 0;
    playTurnSequentially(0);
  }

  function stopSequentialPlayback() {
    state.isPlayingAll = false;
    state.currentPlayingTurnIdx = -1;
    stopCurrentAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    render();
  }

  function playTurnSequentially(index) {
    if (!state.isPlayingAll || !state.scenario) return;
    if (index >= state.scenario.turns.length) {
      // Đã phát hết toàn bộ
      stopSequentialPlayback();
      return;
    }

    state.currentPlayingTurnIdx = index;
    render();

    // Cuộn tới thẻ đang phát
    const turnEl = container.querySelector(`.transcript-turn-card[data-turn-idx="${index}"]`);
    if (turnEl) {
      turnEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const turn = state.scenario.turns[index];
    const isUser = turn.speaker === 'user';
    const audioData = state.recordedBlobs[index];

    if (isUser && audioData && audioData.audioUrl) {
      // Phát giọng thật của người dùng
      playAudioUrl(audioData.audioUrl, () => {
        setTimeout(() => {
          if (state.isPlayingAll) playTurnSequentially(index + 1);
        }, 500);
      });
    } else {
      // Phát giọng đọc tiếng Trung chuẩn AI
      const zhToSpeak = isUser ? (turn.userSpokenZh || turn.expectedZh) : turn.aiZh;
      speakChinese(zhToSpeak, () => {
        setTimeout(() => {
          if (state.isPlayingAll) playTurnSequentially(index + 1);
        }, 500);
      });
    }
  }

  function cleanupAudioSession() {
    stopSequentialPlayback();
    if (state.isRecording) {
      stopVoiceRecording();
      state.isRecording = false;
    }
    if (state.activeRecognizer) {
      try { state.activeRecognizer.stop(); } catch (e) {}
      state.activeRecognizer = null;
    }
  }

  // Cleanup handler khi unmount
  container._cleanup = () => {
    cleanupAudioSession();
  };
}

/**
 * Trích xuất danh sách bài học lũy kế từ Bài 1 -> Bài hiện tại
 */
function resolveCumulativeLessons(currentLesson, passedAllLessons) {
  let lessonsList = passedAllLessons;
  if (!lessonsList || !Array.isArray(lessonsList) || lessonsList.length === 0) {
    if (HSK1_LESSONS.some(l => l.id === currentLesson.id)) {
      lessonsList = HSK1_LESSONS;
    } else if (HSK2_LESSONS.some(l => l.id === currentLesson.id)) {
      lessonsList = HSK2_LESSONS;
    } else if (HSK3_LESSONS.some(l => l.id === currentLesson.id)) {
      lessonsList = HSK3_LESSONS;
    } else {
      lessonsList = [currentLesson];
    }
  }

  const curIdx = lessonsList.findIndex(l => l.id === currentLesson.id);
  return lessonsList.slice(0, curIdx >= 0 ? curIdx + 1 : 1);
}
