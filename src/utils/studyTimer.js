// ============================================================================
// HSK 3.0 Master - Quản Lý & Đếm Thời Gian Học Tập Hằng Ngày
// Chỉ tính giờ khi người dùng đang FOCUS trực tiếp vào website và có tương tác
// ============================================================================

const STORAGE_KEY_DAILY_TIME = 'hsk_daily_study_time';
const STORAGE_KEY_DAILY_GOAL = 'hsk_daily_goal_minutes';
const IDLE_THRESHOLD_MS = 60 * 1000; // Tự động tạm dừng nếu để nguyên không thao tác quá 60 giây
const FLUSH_INTERVAL_SECONDS = 5;    // Lưu định kỳ vào localStorage mỗi 5 giây

let isInitialized = false;
let isWindowFocused =
  typeof document !== 'undefined' && typeof document.hasFocus === 'function'
    ? document.hasFocus()
    : true;
let lastInteractionAt = Date.now();
let unflushedSeconds = 0;
let secondsSinceFlush = 0;
let tickTimerId = null;
const listeners = new Set();

/**
 * Lấy chuỗi ngày hiện tại theo múi giờ địa phương (YYYY-MM-DD)
 */
export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Đọc dữ liệu thời gian học từng ngày từ localStorage
 * Cấu trúc: { "2026-11-04": 1520, "2026-11-03": 2400 } (đơn vị: giây)
 */
export function readDailyStudyMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAILY_TIME);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Không thể đọc hsk_daily_study_time từ localStorage:', err);
  }
  return {};
}

/**
 * Lấy mục tiêu số phút học mỗi ngày
 */
export function getDailyGoalMinutes() {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY_DAILY_GOAL) || '30', 10);
  return Number.isFinite(saved) && saved > 0 ? saved : 30;
}

/**
 * Cập nhật mục tiêu số phút học mỗi ngày
 */
export function setDailyGoalMinutes(minutes) {
  const valid = Math.max(5, Math.min(300, parseInt(minutes, 10) || 30));
  localStorage.setItem(STORAGE_KEY_DAILY_GOAL, String(valid));
  notifyListeners();
  return valid;
}

/**
 * Kiểm tra cửa sổ trang web có đang được người dùng focus trực tiếp hay không
 */
export function isWebsiteFocused() {
  if (typeof document === 'undefined') return false;
  if (document.visibilityState !== 'visible') return false;
  if (!isWindowFocused) return false;
  if (typeof document.hasFocus === 'function' && !document.hasFocus()) return false;
  return true;
}

/**
 * Trả về trạng thái chi tiết: 'active' | 'unfocused' | 'idle'
 */
export function getStudyStateReason() {
  if (!isWebsiteFocused()) return 'unfocused';

  const isSpeakingAudio =
    typeof window !== 'undefined' &&
    window.speechSynthesis &&
    window.speechSynthesis.speaking;

  if (isSpeakingAudio) return 'active';

  if (Date.now() - lastInteractionAt < IDLE_THRESHOLD_MS) {
    return 'active';
  }
  return 'idle';
}

/**
 * Kiểm tra người dùng có đang focus vào website và tương tác học tập hay không
 */
export function isUserCurrentlyActive() {
  return getStudyStateReason() === 'active';
}

/**
 * Ghi phần thời gian tăng thêm (delta) vào localStorage an toàn (hỗ trợ mở nhiều tab)
 */
export function flushStudyTime() {
  if (unflushedSeconds <= 0) return;

  const todayKey = getLocalDateKey();
  const map = readDailyStudyMap();
  const currentSaved = Math.max(0, Math.floor(Number(map[todayKey]) || 0));
  map[todayKey] = currentSaved + unflushedSeconds;

  try {
    localStorage.setItem(STORAGE_KEY_DAILY_TIME, JSON.stringify(map));
    unflushedSeconds = 0;
    secondsSinceFlush = 0;
  } catch (err) {
    console.warn('Không thể lưu hsk_daily_study_time vào localStorage:', err);
  }
}

/**
 * Lấy tổng số giây đã học của ngày hôm nay (bao gồm cả phần chưa flush)
 */
export function getTodayActiveSeconds() {
  const todayKey = getLocalDateKey();
  const map = readDailyStudyMap();
  const saved = Math.max(0, Math.floor(Number(map[todayKey]) || 0));
  return saved + unflushedSeconds;
}

/**
 * Định dạng đồng hồ ngắn gọn cho thanh Header: MM:SS hoặc HH:MM:SS
 */
export function formatStudyClock(totalSeconds) {
  const sec = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Định dạng thời lượng thân thiện bằng tiếng Việt
 */
export function formatStudyDurationVi(totalSeconds, compact = false) {
  const sec = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (compact) {
    if (hours > 0) return `${hours}g ${minutes}p`;
    if (minutes > 0) return `${minutes}p ${seconds}s`;
    return `${seconds}s`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes} phút ${seconds} giây` : `${minutes} phút`;
  }
  return `${seconds} giây`;
}

/**
 * Định dạng chuỗi ngày YYYY-MM-DD sang DD/MM/YYYY
 */
function formatDateVi(dateKey) {
  const parts = dateKey.split('-');
  if (parts.length !== 3) return dateKey;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Tổng hợp đầy đủ số liệu thống kê cho Modal & Dashboard
 */
export function getStudyAnalytics() {
  const todayDate = new Date();
  const todayKey = getLocalDateKey(todayDate);
  const rawMap = readDailyStudyMap();

  // Gộp cả phần giây đang đếm trong bộ nhớ cho ngày hôm nay
  const mergedMap = { ...rawMap };
  mergedMap[todayKey] = Math.max(0, Math.floor(Number(mergedMap[todayKey]) || 0)) + unflushedSeconds;

  const todaySeconds = mergedMap[todayKey] || 0;
  const goalMinutes = getDailyGoalMinutes();
  const goalSeconds = goalMinutes * 60;
  const goalPercent = Math.min(100, Math.round((todaySeconds / goalSeconds) * 100));

  // Dữ liệu 7 ngày gần nhất (từ 6 ngày trước -> hôm nay)
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const last7Days = [];
  let weekSeconds = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() - i);
    const key = getLocalDateKey(d);
    const secs = Math.max(0, Math.floor(Number(mergedMap[key]) || 0));
    weekSeconds += secs;

    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');

    last7Days.push({
      dateKey: key,
      dayLabel: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
      shortDate: `${dd}/${mm}`,
      seconds: secs,
      isToday: i === 0,
      metGoal: secs >= goalSeconds
    });
  }

  // Tổng hợp lịch sử toàn bộ các ngày có ghi nhận
  const allEntries = Object.entries(mergedMap)
    .map(([dateKey, secs]) => ({
      dateKey,
      seconds: Math.max(0, Math.floor(Number(secs) || 0))
    }))
    .filter(item => item.seconds > 0 || item.dateKey === todayKey)
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  let totalSeconds = 0;
  let activeDaysCount = 0;

  allEntries.forEach(item => {
    totalSeconds += item.seconds;
    if (item.seconds > 0) activeDaysCount += 1;
  });

  const avgSecondsPerDay = activeDaysCount > 0 ? Math.round(totalSeconds / activeDaysCount) : 0;

  const historyList = allEntries.map(item => {
    const pct = Math.min(100, Math.round((item.seconds / goalSeconds) * 100));
    return {
      dateKey: item.dateKey,
      displayDate: item.dateKey === todayKey ? `Hôm nay (${formatDateVi(item.dateKey)})` : formatDateVi(item.dateKey),
      isToday: item.dateKey === todayKey,
      seconds: item.seconds,
      goalPercent: pct,
      metGoal: item.seconds >= goalSeconds
    };
  });

  const stateReason = getStudyStateReason();

  return {
    todayKey,
    todaySeconds,
    isActive: stateReason === 'active',
    stateReason,
    goalMinutes,
    goalSeconds,
    goalPercent,
    weekSeconds,
    totalSeconds,
    activeDaysCount,
    avgSecondsPerDay,
    last7Days,
    historyList
  };
}

function buildSnapshot() {
  const stateReason = getStudyStateReason();
  return {
    todayKey: getLocalDateKey(),
    todaySeconds: getTodayActiveSeconds(),
    isActive: stateReason === 'active',
    stateReason,
    goalMinutes: getDailyGoalMinutes()
  };
}

function notifyListeners() {
  const snapshot = buildSnapshot();
  listeners.forEach(cb => {
    try {
      cb(snapshot);
    } catch (err) {
      console.error('Lỗi listener studyTimer:', err);
    }
  });
}

/**
 * Đăng ký nhận cập nhật mỗi giây & ngay khi đổi trạng thái focus (trả về hàm hủy đăng ký)
 */
export function subscribeStudyTimer(callback) {
  if (typeof callback !== 'function') return () => {};
  listeners.add(callback);
  callback(buildSnapshot());
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Khởi chạy bộ theo dõi tương tác & focus toàn cục
 */
export function initStudyTimer() {
  if (isInitialized) return;
  isInitialized = true;

  isWindowFocused =
    typeof document !== 'undefined' && typeof document.hasFocus === 'function'
      ? document.hasFocus()
      : true;

  let lastMoveRecord = 0;

  const markDirectInteraction = () => {
    const wasActive = isUserCurrentlyActive();
    isWindowFocused = true;
    lastInteractionAt = Date.now();
    if (!wasActive) {
      notifyListeners();
    }
  };

  const markPassiveMoveInteraction = () => {
    // Không tính di chuột lướt ngang qua cửa sổ đang không được focus
    if (!isWebsiteFocused()) return;
    const now = Date.now();
    if (now - lastMoveRecord >= 1000) {
      lastMoveRecord = now;
      const wasActive = isUserCurrentlyActive();
      lastInteractionAt = now;
      if (!wasActive) {
        notifyListeners();
      }
    }
  };

  // Tương tác trực tiếp (click, gõ phím, chạm màn hình)
  const immediateEvents = ['pointerdown', 'keydown', 'touchstart', 'click', 'input', 'change'];
  immediateEvents.forEach(evt => {
    window.addEventListener(evt, markDirectInteraction, { passive: true });
  });

  // Cuộn hoặc di chuột khi đang focus vào trang
  const throttledEvents = ['mousemove', 'scroll', 'wheel', 'touchmove'];
  throttledEvents.forEach(evt => {
    window.addEventListener(evt, markPassiveMoveInteraction, { passive: true });
  });

  // Dừng đếm NGAY LẬP TỨC khi người dùng rời focus khỏi cửa sổ trình duyệt (Alt+Tab, bấm sang app khác)
  window.addEventListener('blur', () => {
    isWindowFocused = false;
    flushStudyTime();
    notifyListeners();
  });

  // Tiếp tục ghi nhận khi người dùng quay lại focus vào website
  window.addEventListener('focus', () => {
    isWindowFocused = true;
    lastInteractionAt = Date.now();
    notifyListeners();
  });

  // Đảm bảo khởi tạo key ngày hôm nay trong localStorage nếu chưa có
  const ensureTodayEntry = () => {
    const todayKey = getLocalDateKey();
    const map = readDailyStudyMap();
    if (map[todayKey] === undefined) {
      map[todayKey] = 0;
      try {
        localStorage.setItem(STORAGE_KEY_DAILY_TIME, JSON.stringify(map));
      } catch (_) {}
    }
  };
  ensureTodayEntry();

  let currentTrackedDate = getLocalDateKey();

  // Bộ đếm nhịp 1 giây
  tickTimerId = window.setInterval(() => {
    const nowDateKey = getLocalDateKey();

    // Nếu vừa bước qua 00:00 sang ngày mới: lưu nốt giây của ngày cũ trước
    if (nowDateKey !== currentTrackedDate) {
      if (unflushedSeconds > 0) {
        const map = readDailyStudyMap();
        map[currentTrackedDate] = Math.max(0, Math.floor(Number(map[currentTrackedDate]) || 0)) + unflushedSeconds;
        try {
          localStorage.setItem(STORAGE_KEY_DAILY_TIME, JSON.stringify(map));
        } catch (_) {}
        unflushedSeconds = 0;
        secondsSinceFlush = 0;
      }
      currentTrackedDate = nowDateKey;
      ensureTodayEntry();
    }

    if (isUserCurrentlyActive()) {
      unflushedSeconds += 1;
      secondsSinceFlush += 1;

      if (secondsSinceFlush >= FLUSH_INTERVAL_SECONDS) {
        flushStudyTime();
      }
    } else if (unflushedSeconds > 0) {
      // Người dùng vừa rời focus hoặc hết thời gian tương tác -> lưu ngay
      flushStudyTime();
    }

    notifyListeners();
  }, 1000);

  // Lưu ngay lập tức khi chuyển sang tab khác, thu nhỏ trình duyệt hoặc đóng trang
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      isWindowFocused = false;
      flushStudyTime();
    } else if (typeof document.hasFocus === 'function' && document.hasFocus()) {
      isWindowFocused = true;
      lastInteractionAt = Date.now();
    }
    notifyListeners();
  });

  window.addEventListener('pagehide', flushStudyTime);
  window.addEventListener('beforeunload', flushStudyTime);

  // Đồng bộ khi có nhiều tab cùng mở
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_DAILY_TIME || e.key === STORAGE_KEY_DAILY_GOAL) {
      notifyListeners();
    }
  });
}
