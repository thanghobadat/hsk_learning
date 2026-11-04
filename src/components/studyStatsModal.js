// ============================================================================
// Component Modal Thống Kê & Nhật Ký Thời Gian Học Tập Hằng Ngày
// ============================================================================

import { playSound } from '../utils/speech.js';
import {
  getStudyAnalytics,
  setDailyGoalMinutes,
  subscribeStudyTimer,
  formatStudyClock,
  formatStudyDurationVi
} from '../utils/studyTimer.js';

const GOAL_OPTIONS = [15, 30, 45, 60, 90];

let modalEl = null;
let unsubscribeLive = null;

function ensureStudyModal() {
  if (modalEl) return modalEl;

  modalEl = document.createElement('div');
  modalEl.id = 'studyStatsModal';
  modalEl.className = 'stroke-modal-overlay study-modal-overlay hidden';

  modalEl.innerHTML = `
    <div class="stroke-modal-backdrop" id="studyModalBackdrop"></div>
    <div class="stroke-modal-dialog study-modal-dialog glass-panel animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="studyModalTitle">
      <div class="stroke-modal-header">
        <div class="stroke-modal-title-group">
          <span class="stroke-modal-badge">⏱️ Theo Dõi Tương Tác Tự Động</span>
          <h2 class="stroke-modal-title" id="studyModalTitle">Thời Gian Học Hằng Ngày</h2>
        </div>
        <button id="btnCloseStudyModal" class="btn-close-modal" title="Đóng bảng">✕</button>
      </div>

      <!-- Thẻ thời gian tương tác hôm nay -->
      <div class="study-today-hero">
        <div class="study-today-top">
          <div>
            <div class="study-today-label">Hôm nay bạn đã tương tác</div>
            <div class="study-today-clock" id="modalTodayClock">00:00</div>
            <div class="study-today-readable" id="modalTodayReadable">0 giây</div>
          </div>
          <div class="study-live-status active" id="modalLiveStatusBadge">
            <span class="study-live-dot"></span>
            <span id="modalLiveStatusText">Đang tương tác</span>
          </div>
        </div>

        <div class="study-goal-progress-wrap">
          <div class="study-goal-meta">
            <span>🎯 Mục tiêu ngày: <strong id="modalGoalTargetText">30 phút</strong></span>
            <span class="study-goal-pct" id="modalGoalPctText">0%</span>
          </div>
          <div class="study-goal-bar-track">
            <div class="study-goal-bar-fill" id="modalGoalBarFill" style="width: 0%"></div>
          </div>
        </div>

        <div class="study-goal-selector">
          <span class="goal-selector-label">Đặt mục tiêu/ngày:</span>
          <div class="goal-pills-row" id="goalPillsContainer">
            ${GOAL_OPTIONS.map(min => `
              <button type="button" class="btn-goal-pill" data-goal="${min}">${min}p</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 4 Chỉ số tổng quan -->
      <div class="study-kpi-grid">
        <div class="study-kpi-card">
          <span class="study-kpi-label">7 ngày qua</span>
          <strong class="study-kpi-value" id="kpiWeekTotal">0p</strong>
        </div>
        <div class="study-kpi-card">
          <span class="study-kpi-label">Trung bình/ngày</span>
          <strong class="study-kpi-value" id="kpiDailyAvg">0p</strong>
        </div>
        <div class="study-kpi-card">
          <span class="study-kpi-label">Tổng tích lũy</span>
          <strong class="study-kpi-value" id="kpiAllTime">0p</strong>
        </div>
        <div class="study-kpi-card">
          <span class="study-kpi-label">Số ngày có học</span>
          <strong class="study-kpi-value" id="kpiActiveDays">0 ngày</strong>
        </div>
      </div>

      <!-- Biểu đồ 7 ngày gần nhất -->
      <div class="study-chart-section">
        <div class="study-section-head">
          <h3>📊 Biểu Đồ 7 Ngày Gần Nhất</h3>
          <span class="study-chart-legend">Màu xanh = Đạt mục tiêu</span>
        </div>
        <div class="study-bars-grid" id="studyChartBars">
          <!-- Render động -->
        </div>
      </div>

      <!-- Nhật ký chi tiết từng ngày -->
      <div class="study-history-section">
        <div class="study-section-head">
          <h3>📅 Nhật Ký Từng Ngày (LocalStorage)</h3>
        </div>
        <div class="study-history-list" id="studyHistoryList">
          <!-- Render động -->
        </div>
      </div>

      <p class="study-footnote">
        💡 Hệ thống chỉ tính giờ khi bạn <strong>đang focus trực tiếp vào website</strong> để học (tự dừng ngay khi bấm sang ứng dụng/cửa sổ khác, chuyển tab, hoặc không thao tác quá 60 giây).
      </p>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Đóng modal
  const closeBtn = modalEl.querySelector('#btnCloseStudyModal');
  const backdrop = modalEl.querySelector('#studyModalBackdrop');

  closeBtn.addEventListener('click', () => {
    playSound('click');
    closeStudyStatsModal();
  });

  backdrop.addEventListener('click', () => {
    closeStudyStatsModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && !modalEl.classList.contains('hidden')) {
      closeStudyStatsModal();
    }
  });

  // Đổi mục tiêu ngày
  const goalContainer = modalEl.querySelector('#goalPillsContainer');
  goalContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-goal-pill');
    if (!btn) return;
    const minutes = parseInt(btn.dataset.goal, 10);
    if (minutes > 0) {
      playSound('click');
      setDailyGoalMinutes(minutes);
      renderModalStats();
    }
  });

  return modalEl;
}

function renderModalStats() {
  if (!modalEl || modalEl.classList.contains('hidden')) return;

  const stats = getStudyAnalytics();

  // 1. Hôm nay & Trạng thái tương tác
  const clockEl = modalEl.querySelector('#modalTodayClock');
  const readableEl = modalEl.querySelector('#modalTodayReadable');
  const badgeEl = modalEl.querySelector('#modalLiveStatusBadge');
  const badgeTextEl = modalEl.querySelector('#modalLiveStatusText');

  if (clockEl) clockEl.textContent = formatStudyClock(stats.todaySeconds);
  if (readableEl) readableEl.textContent = formatStudyDurationVi(stats.todaySeconds);

  if (badgeEl && badgeTextEl) {
    if (stats.isActive) {
      badgeEl.classList.add('active');
      badgeEl.classList.remove('idle');
      badgeTextEl.textContent = 'Đang học (có focus)';
    } else {
      badgeEl.classList.remove('active');
      badgeEl.classList.add('idle');
      badgeTextEl.textContent =
        stats.stateReason === 'unfocused'
          ? 'Tạm dừng (ngoài focus)'
          : 'Tạm nghỉ (chờ thao tác)';
    }
  }

  // 2. Tiến độ mục tiêu ngày
  const goalTargetEl = modalEl.querySelector('#modalGoalTargetText');
  const goalPctEl = modalEl.querySelector('#modalGoalPctText');
  const goalFillEl = modalEl.querySelector('#modalGoalBarFill');

  if (goalTargetEl) goalTargetEl.textContent = `${stats.goalMinutes} phút`;
  if (goalPctEl) goalPctEl.textContent = `${stats.goalPercent}%`;
  if (goalFillEl) {
    goalFillEl.style.width = `${stats.goalPercent}%`;
    goalFillEl.classList.toggle('completed', stats.todaySeconds >= stats.goalSeconds);
  }

  // Cập nhật active pill mục tiêu
  modalEl.querySelectorAll('.btn-goal-pill').forEach(btn => {
    const val = parseInt(btn.dataset.goal, 10);
    btn.classList.toggle('active', val === stats.goalMinutes);
  });

  // 3. KPI Cards
  const kpiWeek = modalEl.querySelector('#kpiWeekTotal');
  const kpiAvg = modalEl.querySelector('#kpiDailyAvg');
  const kpiAll = modalEl.querySelector('#kpiAllTime');
  const kpiDays = modalEl.querySelector('#kpiActiveDays');

  if (kpiWeek) kpiWeek.textContent = formatStudyDurationVi(stats.weekSeconds, true);
  if (kpiAvg) kpiAvg.textContent = formatStudyDurationVi(stats.avgSecondsPerDay, true);
  if (kpiAll) kpiAll.textContent = formatStudyDurationVi(stats.totalSeconds, true);
  if (kpiDays) kpiDays.textContent = `${stats.activeDaysCount} ngày`;

  // 4. Biểu đồ cột 7 ngày
  const chartContainer = modalEl.querySelector('#studyChartBars');
  if (chartContainer) {
    const maxSecs = Math.max(
      stats.goalSeconds,
      ...stats.last7Days.map(d => d.seconds),
      60
    );

    chartContainer.innerHTML = stats.last7Days.map(day => {
      const heightPct = day.seconds > 0
        ? Math.max(8, Math.min(100, Math.round((day.seconds / maxSecs) * 100)))
        : 3;
      const timeLabel = day.seconds >= 60
        ? `${Math.floor(day.seconds / 60)}p`
        : day.seconds > 0 ? `${day.seconds}s` : '0';

      return `
        <div class="study-bar-col ${day.isToday ? 'is-today' : ''}" title="${day.shortDate}: ${formatStudyDurationVi(day.seconds)}">
          <span class="study-bar-val">${timeLabel}</span>
          <div class="study-bar-track">
            <div class="study-bar-fill ${day.metGoal ? 'met-goal' : ''} ${day.seconds === 0 ? 'empty' : ''}" style="height: ${heightPct}%"></div>
          </div>
          <span class="study-bar-day">${day.dayLabel}</span>
          <span class="study-bar-date">${day.shortDate}</span>
        </div>
      `;
    }).join('');
  }

  // 5. Danh sách lịch sử từng ngày (giữ nguyên vị trí cuộn khi cập nhật mỗi giây)
  const historyContainer = modalEl.querySelector('#studyHistoryList');
  if (historyContainer) {
    const prevScrollTop = historyContainer.scrollTop;
    if (stats.historyList.length === 0) {
      historyContainer.innerHTML = `<div class="study-history-empty">Chưa có dữ liệu học tập.</div>`;
    } else {
      historyContainer.innerHTML = stats.historyList.map(item => `
        <div class="study-history-row ${item.isToday ? 'today-row' : ''}">
          <div class="study-history-date">
            <span class="history-cal-icon">${item.metGoal ? '✅' : '🗓️'}</span>
            <span>${item.displayDate}</span>
          </div>
          <div class="study-history-right">
            <strong class="history-duration">${formatStudyDurationVi(item.seconds)}</strong>
            <span class="history-goal-badge ${item.metGoal ? 'met' : ''}">${item.goalPercent}% mục tiêu</span>
          </div>
        </div>
      `).join('');
      historyContainer.scrollTop = prevScrollTop;
    }
  }
}

export function openStudyStatsModal() {
  const modal = ensureStudyModal();
  modal.classList.remove('hidden');
  renderModalStats();

  if (unsubscribeLive) unsubscribeLive();
  unsubscribeLive = subscribeStudyTimer(() => {
    renderModalStats();
  });
}

export function closeStudyStatsModal() {
  if (unsubscribeLive) {
    unsubscribeLive();
    unsubscribeLive = null;
  }
  if (modalEl) {
    modalEl.classList.add('hidden');
  }
}
