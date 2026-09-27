// Bộ công cụ phát âm tiếng Trung chuẩn bản xứ (Web Speech API) & Hiệu ứng âm thanh (Web Audio API)

let currentRate = 0.85; // Tốc độ đọc chuẩn cho người mới bắt đầu

export function setSpeechRate(rate) {
  currentRate = rate;
}

export function getSpeechRate() {
  return currentRate;
}

/**
 * Phát âm chữ Hán hoặc câu tiếng Trung chuẩn giọng zh-CN
 * @param {string} text - Văn bản tiếng Trung cần phát âm
 * @param {Function} [onEnd] - Callback khi đọc xong
 */
export function speakChinese(text, onEnd) {
  if (!('speechSynthesis' in window)) {
    console.warn("Trình duyệt không hỗ trợ Web Speech API.");
    return;
  }

  window.speechSynthesis.cancel(); // Dừng câu đang đọc dở nếu có

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = currentRate;
  utterance.pitch = 1.0;

  // Tìm giọng tiếng Trung tự nhiên tốt nhất trên thiết bị
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh'));
  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

// Khởi tạo giọng nói sẵn sàng
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Warm up voices
  };
}

/**
 * Hiệu ứng âm thanh khi trả lời đúng / sai (Web Audio API không cần file MP3 ngoài)
 */
export function playSound(type = 'correct') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'correct') {
      // Âm thanh chúc mừng thanh thoát (Chord C-E-G)
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } else if (type === 'wrong') {
      // Âm thanh báo sai nhẹ nhàng
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      // Âm click tinh tế
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.error("Audio effect error:", e);
  }
}
