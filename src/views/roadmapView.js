import { ROADMAP_DATA } from '../data/roadmapData.js';
import { playSound } from '../utils/speech.js';

export function renderRoadmapView(container) {
  const completedWeeks = JSON.parse(localStorage.getItem('hsk_completed_weeks') || '[]');
  const totalWeeks = 32;
  const progressPercent = Math.round((completedWeeks.length / totalWeeks) * 100);

  container.innerHTML = `
    <div class="roadmap-page animate-fade-in">
      <!-- Header Banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Kế Hoạch Độc Quyền Theo Chuẩn HSK 3.0 Mới Nhất
          </div>
          <h1 class="hero-title">Lộ Trình 8 Tháng Chinh Phục HSK 1 Đến HSK 3</h1>
          <p class="hero-desc">
            Chiến lược phân tầng từ con số 0: 32 tuần học tập khoa học, kiểm soát <strong>2.245 từ vựng tích lũy</strong>, 
            <strong>900 chữ Hán</strong> và <strong>387 điểm ngữ pháp</strong> theo chuẩn mới nhất của Bộ Giáo Dục Trung Quốc.
          </p>

          <div style="margin-bottom: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button id="btnGoToLessons" class="btn-primary-action">
              <span>📖</span> Vào Học 75 Bài Học HSK 3.0 (Cấp 1 - 3)
            </button>
          </div>

          <div class="hero-stats-grid">
            <div class="stat-pill">
              <span class="stat-label">Thời gian</span>
              <span class="stat-val">${ROADMAP_DATA.overview.duration}</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Thời lượng/ngày</span>
              <span class="stat-val">${ROADMAP_DATA.overview.dailyTime}</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Tổng từ vựng HSK 3.0</span>
              <span class="stat-val">${ROADMAP_DATA.overview.totalWords}</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Chữ Hán</span>
              <span class="stat-val">${ROADMAP_DATA.overview.totalCharacters}</span>
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="progress-box glass-panel">
          <div class="progress-box-header">
            <h3>Tiến Độ Học Tập 8 Tháng</h3>
            <span class="progress-number">${progressPercent}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="progress-meta">
            <span>Đã hoàn thành <strong>${completedWeeks.length}</strong> / ${totalWeeks} tuần</span>
            <span>Mục tiêu: Đạt chuẩn HSK 3</span>
          </div>
          <button id="btnResetProgress" class="btn-text-subtle">Cài lại tiến độ</button>
        </div>
      </div>

      <!-- Khung giờ vàng hàng ngày -->
      <div class="section-card daily-routine-card glass-panel">
        <div class="section-header">
          <div class="section-icon">⏱️</div>
          <div>
            <h2 class="section-title">${ROADMAP_DATA.dailyTemplate.title}</h2>
            <p class="section-subtitle">Phương pháp phân bổ thời gian học hiệu quả nhất cho người đi làm và học sinh</p>
          </div>
        </div>
        <div class="routine-steps-grid">
          ${ROADMAP_DATA.dailyTemplate.steps.map((s, idx) => `
            <div class="routine-step-item">
              <div class="step-badge">${idx + 1}</div>
              <div class="step-time">${s.time}</div>
              <div class="step-task">${s.task}</div>
              <div class="step-detail">${s.detail}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Stage Selector Tabs -->
      <div class="stage-tabs-wrapper">
        <div class="stage-tabs" role="tablist">
          ${ROADMAP_DATA.stages.map((stg, idx) => `
            <button class="stage-tab-btn ${idx === 0 ? 'active' : ''}" data-stage="${stg.id}">
              <span class="stage-tab-level" style="background-color: ${stg.badgeColor}">Level ${idx + 1}</span>
              <span class="stage-tab-title">${stg.title.split(':')[0]}</span>
              <span class="stage-tab-time">${stg.timeline}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Stage Content Panels -->
      <div class="stage-content-container">
        ${ROADMAP_DATA.stages.map((stg, idx) => `
          <div class="stage-panel ${idx === 0 ? 'active' : ''}" id="panel-${stg.id}">
            <div class="stage-info-card glass-panel">
              <div class="stage-info-left">
                <span class="stage-badge" style="background-color: ${stg.badgeColor}">${stg.level}</span>
                <h3 class="stage-heading">${stg.title}</h3>
                <p class="stage-desc">${stg.description}</p>
              </div>
              <div class="stage-kpi-grid">
                <div class="kpi-box">
                  <span class="kpi-num">${stg.stats.words}</span>
                  <span class="kpi-label">Từ vựng mới</span>
                </div>
                <div class="kpi-box">
                  <span class="kpi-num">${stg.stats.characters}</span>
                  <span class="kpi-label">Chữ Hán</span>
                </div>
                <div class="kpi-box">
                  <span class="kpi-num">${stg.stats.grammar}</span>
                  <span class="kpi-label">Điểm ngữ pháp</span>
                </div>
                <div class="kpi-box">
                  <span class="kpi-num">${stg.stats.duration}</span>
                  <span class="kpi-label">Thời lượng</span>
                </div>
              </div>
            </div>

            <!-- Weeks Accordion/List -->
            <div class="weeks-grid">
              ${stg.weeks.map(w => {
                const weekKey = `${stg.id}-${w.week}`;
                const isChecked = completedWeeks.includes(weekKey);
                return `
                  <div class="week-card glass-panel ${isChecked ? 'completed' : ''}" data-week-id="${weekKey}">
                    <div class="week-card-top">
                      <div class="week-title-wrap">
                        <span class="week-tag">${w.week}</span>
                        <h4 class="week-name">${w.title}</h4>
                      </div>
                      <label class="custom-checkbox-wrap" title="Đánh dấu đã hoàn thành tuần này">
                        <input type="checkbox" class="week-check" data-week-id="${weekKey}" ${isChecked ? 'checked' : ''}/>
                        <span class="checkmark"></span>
                      </label>
                    </div>

                    <div class="week-objective">
                      <strong>🎯 Mục tiêu tuần:</strong> ${w.objective}
                    </div>

                    <div class="week-routine">
                      <div class="routine-title">Lịch học hàng ngày:</div>
                      <ul>
                        ${w.dailyRoutine.map(r => `<li>${r}</li>`).join('')}
                      </ul>
                    </div>

                    <div class="week-footer">
                      <div class="key-topics">
                        ${w.keyTopics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
                      </div>
                      <div class="milestone-box">
                        <span class="milestone-icon">🏆</span>
                        <span class="milestone-text"><strong>Cột mốc:</strong> ${w.milestone}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Gắn sự kiện chuyển tab Stage
  const tabBtns = container.querySelectorAll('.stage-tab-btn');
  const panels = container.querySelectorAll('.stage-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `panel-${btn.dataset.stage}`;
      const targetPanel = container.querySelector(`#${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Gắn sự kiện checkbox tuần
  const checkBoxes = container.querySelectorAll('.week-check');
  checkBoxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const weekId = e.target.dataset.weekId;
      let currentCompleted = JSON.parse(localStorage.getItem('hsk_completed_weeks') || '[]');
      if (e.target.checked) {
        if (!currentCompleted.includes(weekId)) currentCompleted.push(weekId);
        playSound('correct');
      } else {
        currentCompleted = currentCompleted.filter(id => id !== weekId);
      }
      localStorage.setItem('hsk_completed_weeks', JSON.stringify(currentCompleted));
      renderRoadmapView(container); // Re-render update stats
    });
  });

  // Nút reset tiến độ
  const resetBtn = container.querySelector('#btnResetProgress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đặt lại toàn bộ tiến độ các tuần đã tích không?')) {
        localStorage.removeItem('hsk_completed_weeks');
        renderRoadmapView(container);
      }
    });
  }

  // Nút chuyển nhanh vào 20 Bài học HSK 1
  const btnGoToLessons = container.querySelector('#btnGoToLessons');
  if (btnGoToLessons) {
    btnGoToLessons.addEventListener('click', () => {
      playSound('click');
      const lessonsNavTab = document.querySelector('[data-tab="lessons"]');
      if (lessonsNavTab) {
        lessonsNavTab.click();
      }
    });
  }
}
