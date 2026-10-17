// Service Quản Lý Ghi Âm Micro (MediaRecorder) & Nhận Diện Giọng Nói Tiếng Trung (Web Speech API)
// Hoàn toàn chạy trên trình duyệt (Client-side), 0đ, không phụ thuộc server ngoài

let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];

/**
 * Kiểm tra xem trình duyệt có hỗ trợ ghi âm micro và nhận diện giọng nói không
 */
export function checkVoiceCapabilities() {
  const hasMediaRecorder = typeof window !== 'undefined' && !!(navigator.mediaDevices && window.MediaRecorder);
  const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  return {
    canRecord: hasMediaRecorder,
    canRecognize: !!SpeechRecognition
  };
}

/**
 * Bắt đầu ghi âm giọng nói của người dùng từ Micro
 */
export async function startVoiceRecording() {
  recordedChunks = [];
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Trình duyệt không hỗ trợ truy cập Micro');
    }

    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // Ưu tiên codec webm hoặc mp4 tùy trình duyệt
    let mimeType = 'audio/webm';
    if (typeof MediaRecorder.isTypeSupported === 'function') {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }
    }

    mediaRecorder = new MediaRecorder(mediaStream, { mimeType });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.start(100); // Thu thập chunks mỗi 100ms
    return { success: true, mimeType };
  } catch (err) {
    console.warn('Lỗi khi truy cập Micro:', err);
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }
    return { success: false, error: err.message || 'Không thể truy cập Microphone' };
  }
}

/**
 * Dừng ghi âm và trả về Audio Blob + Object URL
 */
export function stopVoiceRecording() {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        mediaStream = null;
      }
      resolve({ blob: null, audioUrl: null });
      return;
    }

    mediaRecorder.onstop = () => {
      const mimeType = mediaRecorder.mimeType || 'audio/webm';
      const blob = new Blob(recordedChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(blob);

      // Giải phóng stream mic
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        mediaStream = null;
      }
      mediaRecorder = null;
      recordedChunks = [];

      resolve({ blob, audioUrl });
    };

    try {
      mediaRecorder.stop();
    } catch (e) {
      console.warn('Lỗi khi dừng MediaRecorder:', e);
      resolve({ blob: null, audioUrl: null });
    }
  });
}

/**
 * Khởi tạo Speech Recognizer tiếng Trung chuẩn zh-CN
 */
export function createChineseSpeechRecognizer({ onResult, onError, onEnd }) {
  const SpeechRecognition = typeof window !== 'undefined' 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : null;

  if (!SpeechRecognition) {
    return null;
  }

  const recognizer = new SpeechRecognition();
  recognizer.lang = 'zh-CN';
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event) => {
    let interimText = '';
    let finalText = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const res = event.results[i];
      if (res.isFinal) {
        finalText += res[0].transcript;
      } else {
        interimText += res[0].transcript;
      }
    }

    if (onResult) {
      onResult({
        finalText: finalText.trim(),
        interimText: interimText.trim()
      });
    }
  };

  recognizer.onerror = (event) => {
    console.warn('Speech Recognition error:', event.error);
    if (onError) onError(event);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
}

/**
 * Phát file audio blob và gọi callback khi phát xong
 */
let currentAudioPlayer = null;

export function playAudioUrl(url, onEnd) {
  if (currentAudioPlayer) {
    try {
      currentAudioPlayer.pause();
      currentAudioPlayer.currentTime = 0;
    } catch (e) {}
    currentAudioPlayer = null;
  }

  if (!url) {
    if (onEnd) onEnd();
    return null;
  }

  const audio = new Audio(url);
  currentAudioPlayer = audio;

  audio.onended = () => {
    currentAudioPlayer = null;
    if (onEnd) onEnd();
  };

  audio.onerror = (e) => {
    console.warn('Lỗi phát âm thanh recorded:', e);
    currentAudioPlayer = null;
    if (onEnd) onEnd();
  };

  audio.play().catch(e => {
    console.warn('Không thể auto-play audio:', e);
    currentAudioPlayer = null;
    if (onEnd) onEnd();
  });

  return audio;
}

export function stopCurrentAudio() {
  if (currentAudioPlayer) {
    try {
      currentAudioPlayer.pause();
      currentAudioPlayer.currentTime = 0;
    } catch (e) {}
    currentAudioPlayer = null;
  }
}
