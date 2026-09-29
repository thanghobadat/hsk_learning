import { HSK1_LESSONS } from '../data/hsk1LessonsData.js';
import { HSK2_LESSONS } from '../data/hsk2LessonsData.js';
import { HSK3_LESSONS } from '../data/hsk3LessonsData.js';
import { speakChinese, playSound } from '../utils/speech.js';
import { openStrokeModal } from '../components/strokeModal.js';
import { renderLessonFlashcard } from '../components/lessonFlashcard.js';
import { renderLessonReflex } from '../components/lessonReflex.js';
import { renderLessonAIDrills } from '../components/lessonAIDrills.js';
import { getRadicalsForWord } from '../data/radicalDict.js';

// Cấu hình 3 cấp độ chuẩn HSK 3.0
const HSK_LEVELS = {
  hsk1: {
    id: 'hsk1',
    name: 'HSK 1',
    dotColor: 'var(--emerald-500)',
    badgeBg: 'var(--emerald-500)',
    heroBadge: '🟢 Hệ Thống 20 Chuyên Đề Độc Quyền HSK 1 (Chuẩn 3.0)',
    title: '20 Bài Học Toàn Diện HSK 1 (500 Từ & 48 Ngữ Pháp)',
    subtitle: 'Học tuần tự từng bài theo chuẩn mới nhất của Bộ Giáo Dục Trung Quốc. Mỗi bài gồm 25 từ vựng, ngữ pháp ứng dụng và ôn tập phản xạ 3 mục.',
    data: HSK1_LESSONS,
    defaultLessonId: 'lesson-1',
    totalWords: 500,
    metaLabel: '20 Bài • 500 Từ'
  },
  hsk2: {
    id: 'hsk2',
    name: 'HSK 2',
    dotColor: '#38bdf8',
    badgeBg: '#0284c7',
    heroBadge: '🔵 Hệ Thống 25 Chuyên Đề Mở Rộng HSK 2 (Chuẩn 3.0)',
    title: '25 Bài Học Chuyên Đề HSK 2 (775 Từ & 81 Ngữ Pháp Mới)',
    subtitle: 'Mở rộng vốn từ vựng thực chiến, bổ ngữ kết quả, câu chữ 把 và các tình huống giao tiếp công sở, du lịch, đời sống đô thị.',
    data: HSK2_LESSONS,
    defaultLessonId: 'hsk2-lesson-1',
    totalWords: 775,
    metaLabel: '25 Bài • 775 Từ'
  },
  hsk3: {
    id: 'hsk3',
    name: 'HSK 3',
    dotColor: '#c084fc',
    badgeBg: '#9333ea',
    heroBadge: '🟣 Hệ Thống 30 Chuyên Đề Bứt Phá HSK 3 (Chuẩn 3.0)',
    title: '30 Bài Học Bứt Phá HSK 3 (960 Từ & 81 Ngữ Pháp Mới)',
    subtitle: 'Chinh phục trình độ tiền trung cấp, tích lũy 2.245 từ vựng và 210 điểm ngữ pháp sơ cấp. Tự tin thi đỗ chứng chỉ HSK 3.0 điểm cao.',
    data: HSK3_LESSONS,
    defaultLessonId: 'hsk3-lesson-1',
    totalWords: 960,
    metaLabel: '30 Bài • 960 Từ'
  }
};

export function renderLessonsView(container) {
  let currentLevelId = localStorage.getItem('hsk_current_level') || 'hsk1';
  if (!HSK_LEVELS[currentLevelId]) {
    currentLevelId = 'hsk1';
  }

  let activeInnerTab = 'vocab'; // 'vocab', 'grammar', 'review'
  let activeReviewSubTab = 'flashcard'; // 'flashcard', 'reflex', 'ai'

  function getSelectedLessonId(levelId) {
    const saved = localStorage.getItem(`hsk_${levelId}_lesson_id`);
    if (saved) return saved;
    if (levelId === 'hsk1') {
      return localStorage.getItem('hsk_current_lesson_id') || HSK_LEVELS.hsk1.defaultLessonId;
    }
    return HSK_LEVELS[levelId].defaultLessonId;
  }

  function setSelectedLessonId(levelId, lessonId) {
    localStorage.setItem(`hsk_${levelId}_lesson_id`, lessonId);
    if (levelId === 'hsk1') {
      localStorage.setItem('hsk_current_lesson_id', lessonId);
    }
  }

  function getCompletedLessons() {
    return JSON.parse(localStorage.getItem('hsk_completed_lessons') || '[]');
  }

  function toggleCompleteLesson(lessonId) {
    let completed = getCompletedLessons();
    if (completed.includes(lessonId)) {
      completed = completed.filter(id => id !== lessonId);
    } else {
      completed.push(lessonId);
      playSound('correct');
    }
    localStorage.setItem('hsk_completed_lessons', JSON.stringify(completed));
    render();
  }

  let isSidebarOpenMobile = false;

  function render() {
    const levelConfig = HSK_LEVELS[currentLevelId];
    const allCompleted = getCompletedLessons();
    const completedList = allCompleted.filter(id => levelConfig.data.some(l => l.id === id));
    const progressPercent = Math.round((completedList.length / levelConfig.data.length) * 100);
    
    let selectedLessonId = getSelectedLessonId(currentLevelId);
    let currentLesson = levelConfig.data.find(l => l.id === selectedLessonId);
    if (!currentLesson) {
      currentLesson = levelConfig.data[0];
      selectedLessonId = currentLesson.id;
      setSelectedLessonId(currentLevelId, selectedLessonId);
    }

    const isLessonDone = allCompleted.includes(currentLesson.id);

    // Dọn dẹp nội dung cũ nếu có hook cleanup
    const oldContent = container.querySelector('#lessonInnerContent');
    if (oldContent && typeof oldContent._cleanup === 'function') {
      oldContent._cleanup();
      oldContent._cleanup = null;
    }

    container.innerHTML = `
      <div class="lessons-page animate-fade-in">
        <!-- Header -->
        <div class="page-header">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            ${levelConfig.heroBadge}
          </div>
          <h1 class="page-title">${levelConfig.title}</h1>
          <p class="page-subtitle">
            ${levelConfig.subtitle}
          </p>

          <!-- Level Selector Bar (HSK 1 - 2 - 3) -->
          <div class="level-selector-nav glass-panel" role="tablist" aria-label="Chọn cấp độ bài học HSK">
            ${Object.values(HSK_LEVELS).map(lvl => `
              <button class="btn-level-pill ${lvl.id} ${lvl.id === currentLevelId ? 'active' : ''}" data-level="${lvl.id}">
                <div class="level-pill-left">
                  <span class="level-indicator-dot"></span>
                  <span class="level-pill-title">${lvl.name}</span>
                </div>
                <span class="level-pill-meta">${lvl.metaLabel}</span>
              </button>
            `).join('')}
          </div>

          <!-- Overall Progress for Active Level -->
          <div class="lesson-overall-progress glass-panel" style="margin-top: 1rem; padding: 1rem 1.25rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem; font-weight: 700;">
              <span>Tiến độ hoàn thành ${levelConfig.name}: <strong>${completedList.length} / ${levelConfig.data.length} bài</strong></span>
              <span style="color: ${levelConfig.dotColor};">${progressPercent}%</span>
            </div>
            <div class="progress-track" style="margin-bottom: 0; height: 10px;">
              <div class="progress-fill" style="width: ${progressPercent}%; background: ${levelConfig.badgeBg};"></div>
            </div>
          </div>
        </div>

        <!-- Mobile Lesson Bar (Chỉ hiển thị trên điện thoại để không bị choán màn hình) -->
        <div class="sidebar-mobile-toggle glass-panel">
          <div class="toggle-mobile-left">
            <span class="vocab-level-badge" style="background-color: ${levelConfig.badgeBg}; font-size: 0.72rem; padding: 2px 8px;">
              ${levelConfig.name} • Bài ${currentLesson.number}
            </span>
            <span class="toggle-mobile-title">${currentLesson.title.split(':')[1] || currentLesson.title}</span>
          </div>
          <button class="btn-toggle-sidebar" id="btnToggleSidebarMobile">
            <span>${isSidebarOpenMobile ? '✕ Đóng' : '📖 Đổi bài'}</span>
            <span class="toggle-arrow">${isSidebarOpenMobile ? '▲' : '▼'}</span>
          </button>
        </div>

        <!-- 2-Column Layout: Sidebar Lessons List & Main Lesson Content -->
        <div class="lessons-layout">
          <!-- Sidebar: List of Lessons for Active Level -->
          <aside class="lessons-sidebar glass-panel ${isSidebarOpenMobile ? 'mobile-open' : 'mobile-closed'}" id="lessonsSidebar">
            <h3 class="sidebar-heading">Danh Mục ${levelConfig.data.length} Bài Học (${levelConfig.name})</h3>
            <div class="lessons-nav-list">
              ${levelConfig.data.map(l => {
                const done = allCompleted.includes(l.id);
                const active = l.id === currentLesson.id;
                return `
                  <button class="lesson-nav-item ${active ? 'active' : ''} ${done ? 'done' : ''}" data-lesson-id="${l.id}">
                    <div class="lesson-nav-top">
                      <span class="lesson-num-pill" style="${active ? `background:${levelConfig.badgeBg}; color:white;` : ''}">${l.number}</span>
                      <span class="lesson-nav-title">${l.title.split(':')[1] || l.title}</span>
                      ${done ? '<span class="done-check">✓</span>' : ''}
                    </div>
                    <div class="lesson-nav-sub">${l.titleZh}</div>
                  </button>
                `;
              }).join('')}
            </div>
          </aside>

          <!-- Main Content of Selected Lesson -->
          <main class="lesson-main-content" id="lessonMainContent">
            <!-- Lesson Header Card -->
            <div class="lesson-header-card glass-panel">
              <div class="lesson-header-left">
                <span class="vocab-level-badge" style="background-color: ${levelConfig.badgeBg};">${levelConfig.name} • Bài ${currentLesson.number} / ${levelConfig.data.length}</span>
                <h2 class="lesson-display-title">${currentLesson.title}</h2>
                <div class="lesson-display-zh">${currentLesson.titleZh}</div>
                <p class="lesson-display-desc">${currentLesson.desc}</p>
              </div>

              <div class="lesson-header-actions">
                <button id="btnToggleComplete" class="btn-complete-lesson ${isLessonDone ? 'completed' : ''}">
                  ${isLessonDone ? '✓ Đã hoàn thành bài này' : '○ Đánh dấu đã học xong'}
                </button>
              </div>
            </div>

            <!-- Inner Tabs: Từ vựng, Ngữ pháp, Ôn tập -->
            <div class="lesson-inner-tabs" role="tablist">
              <button class="lesson-inner-tab-btn ${activeInnerTab === 'vocab' ? 'active' : ''}" data-inner-tab="vocab">
                <span>📚</span> Từ Vựng Bài Học (${(currentLesson.words || []).length} từ)
              </button>
              <button class="lesson-inner-tab-btn ${activeInnerTab === 'grammar' ? 'active' : ''}" data-inner-tab="grammar">
                <span>📝</span> Ngữ Pháp Trọng Tâm (${(currentLesson.grammarPoints || []).length} điểm)
              </button>
              <button class="lesson-inner-tab-btn ${activeInnerTab === 'review' ? 'active' : ''}" data-inner-tab="review">
                <span>🔄</span> Ôn Tập Bài Học (3 Mục)
              </button>
            </div>

            <!-- Inner Tab Content Container -->
            <div id="lessonInnerContent" class="lesson-inner-content-box">
              <!-- Dynamically injected below -->
            </div>
          </main>
        </div>
      </div>
    `;

    // Sự kiện toggle mở/đóng danh mục bài học trên mobile
    container.querySelector('#btnToggleSidebarMobile')?.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      isSidebarOpenMobile = !isSidebarOpenMobile;
      const sidebar = container.querySelector('#lessonsSidebar');
      const toggleBtn = container.querySelector('#btnToggleSidebarMobile');
      if (sidebar) {
        if (isSidebarOpenMobile) {
          sidebar.classList.remove('mobile-closed');
          sidebar.classList.add('mobile-open');
        } else {
          sidebar.classList.remove('mobile-open');
          sidebar.classList.add('mobile-closed');
        }
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = `<span>${isSidebarOpenMobile ? '✕ Đóng' : '📖 Đổi bài'}</span><span class="toggle-arrow">${isSidebarOpenMobile ? '▲' : '▼'}</span>`;
      }
    });

    // Sự kiện chuyển cấp độ (Level Pills)
    container.querySelectorAll('.btn-level-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        currentLevelId = btn.dataset.level;
        localStorage.setItem('hsk_current_level', currentLevelId);
        isSidebarOpenMobile = false;
        render();
      });
    });

    // Sidebar sự kiện chọn bài
    container.querySelectorAll('.lesson-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        playSound('click');
        const lessonId = item.dataset.lessonId;
        setSelectedLessonId(currentLevelId, lessonId);
        isSidebarOpenMobile = false;
        render();
        // Cuộn mượt đến nội dung bài nếu đang trên màn hình di động
        if (window.innerWidth <= 960) {
          setTimeout(() => {
            container.querySelector('#lessonMainContent')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      });
    });

    // Nút đánh dấu hoàn thành bài
    const btnComplete = container.querySelector('#btnToggleComplete');
    if (btnComplete) {
      btnComplete.addEventListener('click', () => {
        toggleCompleteLesson(currentLesson.id);
      });
    }

    // Inner Tabs
    const innerTabBtns = container.querySelectorAll('.lesson-inner-tab-btn');
    innerTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (activeInnerTab === btn.dataset.innerTab) return;
        playSound('click');
        activeInnerTab = btn.dataset.innerTab;
        renderInnerContent(container.querySelector('#lessonInnerContent'), currentLesson);
        innerTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    renderInnerContent(container.querySelector('#lessonInnerContent'), currentLesson);
  }

  function renderInnerContent(contentEl, lesson) {
    if (contentEl && typeof contentEl._cleanup === 'function') {
      contentEl._cleanup();
      contentEl._cleanup = null;
    }

    if (activeInnerTab === 'vocab') {
      contentEl.innerHTML = `
        <div class="lesson-words-grid animate-fade-in">
          ${lesson.words.map((w, idx) => {
            const radicals = getRadicalsForWord(w.hanzi);
            return `
            <div class="word-card glass-panel">
              <div class="word-card-header">
                <span class="rule-num-badge">${idx + 1}</span>
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <button class="btn-stroke-practice" 
                          data-hanzi="${w.hanzi}" 
                          data-pinyin="${w.pinyin}" 
                          data-meaning="${w.meaning}" 
                          data-hanviet="${w.hanViet || ''}" 
                          title="Xem cách viết từng nét & tập viết">
                    ✍️ Tập viết
                  </button>
                  <button class="btn-audio-circle-sm" data-speak="${w.hanzi}" title="Nghe từ">
                    <span>🔊</span>
                  </button>
                </div>
              </div>

              <div class="word-main-row" style="margin-top: 0.25rem;">
                <div>
                  <div class="word-hanzi" style="font-size: 2rem;">${w.hanzi}</div>
                  <div class="word-pinyin">${w.pinyin}</div>
                </div>
              </div>

              <div class="word-hanviet-box">
                <span class="hanviet-label">Hán - Việt:</span>
                <span class="hanviet-val">${w.hanViet || ''}</span>
              </div>

              <div class="word-meaning-box">
                <span class="meaning-val">${w.meaning}</span>
              </div>

              ${radicals.length > 0 ? `
                <div class="word-radicals-box">
                  <div class="radicals-header">
                    <span class="radicals-tag">🧩 Bộ thủ cấu thành:</span>
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

              ${w.mnemonic ? `
                <div class="word-mnemonic-box">
                  <div class="mnemonic-header">
                    <span class="mnemonic-tag">💡 Mẹo nhớ nhanh:</span>
                  </div>
                  <div class="mnemonic-text">${w.mnemonic}</div>
                </div>
              ` : ''}

              <div class="word-example-box">
                <div class="example-header">
                  <span class="example-tag">Câu mẫu:</span>
                  <button class="btn-mini-audio" data-speak="${w.exampleZh}">🔊 Nghe câu</button>
                </div>
                <div class="example-zh">${w.exampleZh}</div>
                <div class="example-pinyin">${w.examplePinyin}</div>
                <div class="example-vi">${w.exampleVi}</div>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      `;
    } else if (activeInnerTab === 'grammar') {
      contentEl.innerHTML = `
        <div class="lesson-grammar-list animate-fade-in">
          ${lesson.grammarPoints.map(g => `
            <div class="grammar-card glass-panel" style="margin-bottom: 1.25rem;">
              <h3 class="grammar-title">${g.title}</h3>
              <div class="rule-formula" style="margin: 0.5rem 0;">${g.formula}</div>
              <p class="grammar-explanation">${g.explanation}</p>

              <div class="grammar-examples-box" style="margin-top: 0.75rem;">
                <h4 class="examples-heading">Ví dụ minh họa:</h4>
                <div class="examples-list">
                  ${g.examples.map(ex => `
                    <div class="example-item">
                      <div class="example-content">
                        <div class="ex-zh">${ex.zh}</div>
                        <div class="ex-pinyin">${ex.pinyin}</div>
                        <div class="ex-vi">${ex.vi}</div>
                      </div>
                      <button class="btn-audio-circle-sm" data-speak="${ex.zh}">🔊</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (activeInnerTab === 'review') {
      contentEl.innerHTML = `
        <div class="lesson-review-center animate-fade-in">
          <!-- Subtabs Navigation Bar -->
          <div class="review-subtabs-nav glass-panel" role="tablist">
            <button class="review-subtab-btn ${activeReviewSubTab === 'flashcard' ? 'active' : ''}" data-subtab="flashcard">
              <span>🗂️</span> Mục 1: Flashcard Từ Vựng (${lesson.words.length})
            </button>
            <button class="review-subtab-btn ${activeReviewSubTab === 'reflex' ? 'active' : ''}" data-subtab="reflex">
              <span>⚡</span> Mục 2: Bài Tập Phản Xạ
            </button>
            <button class="review-subtab-btn ${activeReviewSubTab === 'ai' ? 'active' : ''}" data-subtab="ai">
              <span>🤖</span> Mục 3: AI Luyện Ngữ Pháp
            </button>
          </div>

          <!-- Subtab Content Body -->
          <div id="reviewSubTabContent" class="review-subtab-content-box"></div>
        </div>
      `;

      const subContentEl = contentEl.querySelector('#reviewSubTabContent');

      function renderReviewSubTab() {
        if (!subContentEl) return;
        if (typeof subContentEl._cleanup === 'function') {
          subContentEl._cleanup();
          subContentEl._cleanup = null;
        }
        if (activeReviewSubTab === 'flashcard') {
          renderLessonFlashcard(subContentEl, lesson);
        } else if (activeReviewSubTab === 'reflex') {
          renderLessonReflex(subContentEl, lesson);
        } else if (activeReviewSubTab === 'ai') {
          renderLessonAIDrills(subContentEl, lesson);
        }
      }

      const subTabBtns = contentEl.querySelectorAll('.review-subtab-btn');
      subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (activeReviewSubTab === btn.dataset.subtab) return;
          playSound('click');
          activeReviewSubTab = btn.dataset.subtab;
          subTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderReviewSubTab();
        });
      });

      renderReviewSubTab();
    }

    // Stroke practice click handlers
    contentEl.querySelectorAll('.btn-stroke-practice').forEach(btn => {
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

    // Audio click handlers
    contentEl.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.add('pulse-active');
        speakChinese(btn.dataset.speak, () => {
          btn.classList.remove('pulse-active');
        });
      });
    });
  }

  render();
}
