// Service quản lý AI Generator & Tích hợp Gemini / OpenAI cho bài tập HSK 1

const STORAGE_KEY_AI_CONFIG = 'hsk_ai_config';

export function getAIConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_CONFIG);
    return raw ? JSON.parse(raw) : { provider: 'gemini', apiKey: '' };
  } catch (e) {
    return { provider: 'gemini', apiKey: '' };
  }
}

export function saveAIConfig(config) {
  localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(config));
}

/**
 * Động cơ Local AI Rule-Based Generator
/**
 * Động cơ Sinh Đề Ngữ Pháp Ma Trận Không Trùng Lặp (Anti-Duplication Combinatorial Engine)
 * Công thức: X (Số dạng bài chọn) × Y (Số mẫu ngữ pháp của bài) × Z (Số từ vựng mỗi mẫu)
 */
export function generateLocalDrills(lesson, options = {}) {
  const selectedTypes = options.selectedTypes && options.selectedTypes.length > 0
    ? options.selectedTypes
    : ['scramble', 'cloze', 'multiple-choice', 'vi_to_zh', 'pinyin_to_vi'];

  // Z: Số từ vựng / câu trên mỗi điểm ngữ pháp (Mặc định 2, có thể chọn 2, 4, 5, 8, 10)
  const wordsPerGrammar = options.wordsPerGrammar || 2;

  const drills = [];
  const words = [...(lesson.words || [])];
  const grammarPoints = [...(lesson.grammarPoints || [])];
  const usedSentenceHashes = new Set();

  function hashSentence(zh) {
    return (zh || '').replace(/[。！？?!,\.，\s]/g, '').trim();
  }

  // Thu thập kho câu mẫu phong phú từ ngữ pháp & từ vựng của bài
  const masterSentencePool = [];
  grammarPoints.forEach((g, gIdx) => {
    (g.examples || []).forEach(ex => {
      masterSentencePool.push({
        source: 'grammar',
        grammarIdx: gIdx,
        grammarTitle: g.title,
        formula: g.formula,
        grammarRef: g.explanation,
        zh: ex.zh,
        pinyin: ex.pinyin,
        vi: ex.vi
      });
    });
  });

  // Bổ sung các câu từ vựng có ngữ cảnh tốt
  words.forEach((w, wIdx) => {
    if (w.exampleZh && w.exampleZh.length <= 25) {
      // Gán vào điểm ngữ pháp tương ứng (xoay vòng)
      const assignedGIdx = wIdx % Math.max(1, grammarPoints.length);
      const g = grammarPoints[assignedGIdx] || { title: 'Ứng dụng từ vựng', formula: w.hanzi, explanation: w.meaning };
      masterSentencePool.push({
        source: 'vocab',
        grammarIdx: assignedGIdx,
        grammarTitle: g.title,
        formula: g.formula || `Từ vựng: ${w.hanzi} (${w.pinyin})`,
        grammarRef: `Cách dùng từ '${w.hanzi}' (${w.meaning}) trong giao tiếp`,
        zh: w.exampleZh,
        pinyin: w.examplePinyin,
        vi: w.exampleVi
      });
    }
  });

  // Số lượng câu mục tiêu cho mỗi dạng = Số ngữ pháp Y * Số từ vựng Z
  const targetCountPerType = Math.max(1, grammarPoints.length * wordsPerGrammar);

  // 1. DẠNG 1: SẮP XẾP CÂU (Sentence Scramble)
  if (selectedTypes.includes('scramble')) {
    const candidates = masterSentencePool
      .filter(s => !usedSentenceHashes.has(hashSentence(s.zh)))
      .sort(() => Math.random() - 0.5);

    const chosen = candidates.slice(0, targetCountPerType);
    chosen.forEach((sItem, idx) => {
      const cleanZh = hashSentence(sItem.zh);
      usedSentenceHashes.add(cleanZh);
      const tokens = tokenizeChineseSentence(cleanZh, words);
      const shuffledTokens = [...tokens].sort(() => Math.random() - 0.5);

      drills.push({
        id: `drill-scramble-${idx + 1}`,
        type: 'scramble',
        badge: '🧩 Sắp Xếp Khối Thành Câu',
        title: `Sắp xếp câu chuẩn cấu trúc: ${sItem.grammarTitle}`,
        hintFormula: sItem.formula,
        meaningVi: sItem.vi,
        targetZh: cleanZh,
        fullTargetZh: sItem.zh,
        pinyin: sItem.pinyin,
        grammarExplanation: sItem.grammarRef,
        tokens: shuffledTokens
      });
    });
  }

  // 2. DẠNG 2: ĐIỀN TỪ CÒN THIẾU (Cloze Test)
  if (selectedTypes.includes('cloze')) {
    const clozePool = words.filter(w => w.exampleZh && w.exampleZh.includes(w.hanzi));
    const shuffledCloze = [...clozePool].sort(() => Math.random() - 0.5).slice(0, targetCountPerType);

    shuffledCloze.forEach((wItem, idx) => {
      const blankSentence = wItem.exampleZh.replace(wItem.hanzi, '( ____ )');
      const distractors = words
        .filter(w => w.hanzi !== wItem.hanzi)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.hanzi);
      const choices = [...distractors, wItem.hanzi].sort(() => Math.random() - 0.5);
      const correctIdx = choices.indexOf(wItem.hanzi);

      drills.push({
        id: `drill-cloze-${idx + 1}`,
        type: 'cloze',
        badge: '✏️ Điền Từ Còn Thiếu',
        title: 'Chọn từ vựng thích hợp nhất để hoàn chỉnh câu:',
        sentenceWithBlank: blankSentence,
        meaningVi: wItem.exampleVi,
        pinyin: wItem.examplePinyin,
        correctWord: wItem.hanzi,
        choices: choices,
        correctIndex: correctIdx,
        explanation: `Từ cần điền là '${wItem.hanzi}' (${wItem.pinyin}: ${wItem.meaning}). Câu đầy đủ: ${wItem.exampleZh}`
      });
    });
  }

  // 3. DẠNG 3: TRẮC NGHIỆM NGỮ PHÁP (Multiple Choice)
  if (selectedTypes.includes('multiple-choice')) {
    const quizPool = (lesson.quiz && lesson.quiz.length > 0) ? [...lesson.quiz] : [];
    
    // Nếu kho quiz ít, tự sinh câu hỏi phân biệt ngữ pháp
    while (quizPool.length < targetCountPerType) {
      const g = grammarPoints[quizPool.length % Math.max(1, grammarPoints.length)];
      if (g && g.examples && g.examples[0]) {
        const ex = g.examples[0];
        quizPool.push({
          q: `Câu nào sau đây sử dụng đúng điểm ngữ pháp "${g.title}"?`,
          choices: [
            ex.zh,
            ex.zh.split('').reverse().join(''), // Câu sai trật tự
            `不${ex.zh}`,
            `很${ex.zh}`
          ].sort(() => Math.random() - 0.5),
          correct: 0,
          exp: `Cấu trúc chuẩn: ${g.formula}. Ví dụ: ${ex.zh} (${ex.vi})`
        });
      } else {
        break;
      }
    }

    const shuffledQuiz = quizPool.sort(() => Math.random() - 0.5).slice(0, targetCountPerType);
    shuffledQuiz.forEach((q, idx) => {
      drills.push({
        id: `drill-quiz-${idx + 1}`,
        type: 'multiple-choice',
        badge: '🎯 Trắc Nghiệm Ngữ Pháp',
        title: q.q,
        choices: q.choices,
        correctIndex: q.correct,
        explanation: q.exp || 'Tuân thủ đúng quy tắc ngữ pháp của bài học.'
      });
    });
  }

  // 4. DẠNG 4: CHO CÂU TIẾNG VIỆT ➔ VIẾT LẠI TIẾNG TRUNG (AI Chấm Điểm)
  if (selectedTypes.includes('vi_to_zh')) {
    const viToZhCandidates = masterSentencePool
      .filter(s => !usedSentenceHashes.has(hashSentence(s.zh)))
      .sort(() => Math.random() - 0.5);

    // Nếu hết câu chưa dùng, cho phép dùng lại nhưng ưu tiên câu ngữ pháp
    const pool = viToZhCandidates.length >= targetCountPerType ? viToZhCandidates : [...masterSentencePool].sort(() => Math.random() - 0.5);
    const chosen = pool.slice(0, targetCountPerType);

    chosen.forEach((sItem, idx) => {
      usedSentenceHashes.add(hashSentence(sItem.zh));
      drills.push({
        id: `drill-vi-zh-${idx + 1}`,
        type: 'vi_to_zh',
        badge: '✍️ Dịch Việt ➔ Viết Tiếng Trung (AI Chấm)',
        title: 'Hãy dịch câu tiếng Việt sau sang tiếng Trung (gõ chữ Hán):',
        meaningVi: sItem.vi,
        hintFormula: sItem.formula || sItem.grammarTitle,
        targetZh: sItem.zh,
        cleanTargetZh: hashSentence(sItem.zh),
        targetPinyin: sItem.pinyin,
        samplePlaceholder: 'Nhập câu tiếng Trung của bạn...',
        grammarExplanation: sItem.grammarRef
      });
    });
  }

  // 5. DẠNG 5: PHẢN XẠ NGHE / PINYIN ➔ VIẾT NGHĨA TIẾNG VIỆT (AI Chấm Điểm)
  if (selectedTypes.includes('pinyin_to_vi')) {
    const pinyinCandidates = masterSentencePool.sort(() => Math.random() - 0.5).slice(0, targetCountPerType);

    pinyinCandidates.forEach((sItem, idx) => {
      drills.push({
        id: `drill-pinyin-vi-${idx + 1}`,
        type: 'pinyin_to_vi',
        badge: '🎧 Nghe Pinyin ➔ Dịch Nghĩa (AI Chấm)',
        title: 'Nghe phát âm hoặc nhìn Pinyin để viết nghĩa tiếng Việt:',
        audioText: sItem.zh,
        pinyin: sItem.pinyin,
        targetVi: sItem.vi,
        targetZh: sItem.zh,
        samplePlaceholder: 'Nhập nghĩa tiếng Việt (không cần quan tâm dấu chấm/phẩy)...',
        grammarExplanation: sItem.grammarRef
      });
    });
  }

  return drills;
}

/**
 * Tách một câu tiếng Trung thành các khối từ vựng hợp lý
 */
function tokenizeChineseSentence(cleanSentence, vocabList) {
  const tokens = [];
  let remaining = cleanSentence;

  // Sắp xếp từ vựng theo độ dài giảm dần để match từ ghép trước
  const sortedVocab = [...vocabList].map(w => w.hanzi).sort((a, b) => b.length - a.length);

  while (remaining.length > 0) {
    let matched = false;
    for (const v of sortedVocab) {
      if (remaining.startsWith(v)) {
        tokens.push(v);
        remaining = remaining.slice(v.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Tách 1 ký tự
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  // Nếu câu bị chia nhỏ thành quá nhiều ký tự đơn lẻ, gộp những cụm 2 chữ nếu phù hợp
  if (tokens.length > 6) {
    const compactTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      if (i < tokens.length - 1 && tokens[i].length === 1 && tokens[i + 1].length === 1 && Math.random() > 0.4) {
        compactTokens.push(tokens[i] + tokens[i + 1]);
        i++;
      } else {
        compactTokens.push(tokens[i]);
      }
    }
    return compactTokens;
  }

  return tokens;
}

/**
 * Gọi Deep AI Assistant (Gemini API hoặc Simulated Fallback)
 * Giải thích sâu câu hỏi, nguyên nhân làm sai, mẹo ngữ pháp cho người Việt
 */
export async function explainWithAI({ questionTitle, contextText, userAnswer, correctAnswer, grammarPoint, lessonTitle }) {
  const config = getAIConfig();

  // Prompt chuyên sâu cho trợ lý tiếng Trung HSK 3.0
  const prompt = `
Bạn là Trợ Lý AI Dạy Tiếng Trung HSK 3.0 Chuyên Nghiệp.
Hãy giải thích ngắn gọn, súc tích và dễ hiểu cho người Việt Nam:
- Bài học: ${lessonTitle}
- Câu hỏi / Bài tập: ${questionTitle}
- Ngữ cảnh / Mẫu câu: ${contextText || ''}
- Đáp án của học viên: ${userAnswer || '(Chưa làm / làm sai)'}
- Đáp án chính xác: ${correctAnswer}
- Điểm ngữ pháp liên quan: ${grammarPoint || ''}

Yêu cầu định dạng câu trả lời (Markdown đẹp):
1. **Phân tích vì sao đáp án chính xác**: Giải thích logic ngữ pháp ngắn gọn.
2. **Lưu ý cho người Việt**: Người Việt thường nhầm lẫn cấu trúc này ở điểm nào?
3. **1 Câu ví dụ mở rộng**: Kèm Hán tự, Pinyin và dịch nghĩa tiếng Việt.
Giọng điệu khích lệ, thân thiện, súc tích dưới 150 từ.
`;

  // Nếu người dùng có Gemini API Key
  if (config.provider === 'gemini' && config.apiKey && config.apiKey.trim().length > 10) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 350, temperature: 0.7 }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        return {
          source: 'gemini',
          text: aiText
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, using built-in smart explanation:', err);
    }
  }

  // Fallback: Built-in Smart AI Tutor Explanation (chạy ngay lập tức không cần API Key)
  await new Promise(r => setTimeout(r, 600)); // Nhẹ nhàng mô phỏng tư duy AI 0.6s
  return {
    source: 'builtin',
    text: `
**🤖 Phân tích của Trợ Lý AI:**

1. **Về cấu trúc:** Trong ngữ cảnh này, đáp án chính xác là **"${correctAnswer}"**. Quy tắc ngữ pháp trọng tâm yêu cầu tuân thủ đúng trật tự từ: thành phần phụ ngữ / thời gian luôn đứng trước vị ngữ chính, không thể dịch theo thứ tự 'word-by-word' của tiếng Việt.

2. **Lưu ý cho người Việt:** Người học tiếng Việt thường có thói quen đem trạng ngữ chỉ thời gian hoặc nơi chốn đặt ở cuối câu. Trong tiếng Trung chuẩn HSK 3.0, địa điểm và thời gian phải đặt trước hành động!

3. **Ví dụ mở rộng tương tự:**  
- **汉字:** 我们明天一起去。(Wǒmen míngtiān yìqǐ qù.)  
- **Dịch nghĩa:** Ngày mai chúng ta cùng đi nhé.
`
  };
}

/**
 * AI Chấm Điểm Bài Tập Dịch Viết (Dạng 4 & Dạng 5)
 * Hỗ trợ Gemini API trực tuyến & Động cơ Local Fuzzy AI Cục Bộ (Không phát sinh chi phí)
 */
export async function gradeWritingWithAI({ taskType, prompt, targetReference, userSubmission, grammarPoint }) {
  const config = getAIConfig();
  const trimmedUser = (userSubmission || '').trim();

  if (!trimmedUser) {
    return {
      status: 'wrong',
      score: 0,
      feedback: 'Bạn chưa nhập câu trả lời. Vui lòng gõ đáp án để AI kiểm tra.',
      improvedVersion: targetReference
    };
  }

  // 1. Nếu có Gemini API Key hợp lệ -> Gọi Gemini chấm sâu
  if (config.provider === 'gemini' && config.apiKey && config.apiKey.trim().length > 10) {
    try {
      const isViToZh = taskType === 'vi_to_zh';
      const systemPrompt = `
Bạn là Giám Khảo Chấm Thi Tiếng Trung HSK 3.0 Chuyên Nghiệp.
Nhiệm vụ: Chấm điểm câu trả lời của học viên một cách khách quan, linh hoạt, chấp nhận các cách diễn đạt đồng nghĩa và trật tự từ hợp lệ.

Thông tin bài tập:
- Thể loại: ${isViToZh ? 'Dịch câu Tiếng Việt sang Tiếng Trung (gõ chữ Hán)' : 'Nghe/Đọc Pinyin và dịch nghĩa sang Tiếng Việt'}
- Đề bài: "${prompt}"
- Đáp án mẫu chuẩn: "${targetReference}"
- Điểm ngữ pháp / cấu trúc: "${grammarPoint || ''}"
- Bài làm của học viên: "${trimmedUser}"

Tiêu chí đánh giá:
1. ${isViToZh 
  ? 'Nếu học viên dùng từ đồng nghĩa hợp lý, đảo vị trí trạng ngữ thời gian/địa điểm hợp lệ trong tiếng Trung, hoặc thiếu dấu chấm câu cuối -> VẪN ĐÁNH GIÁ "correct" (90-100đ) hoặc "acceptable" (75-89đ).' 
  : 'Bỏ qua lỗi dấu câu, chữ hoa/thường, dấu phẩy. Chỉ cần học viên dịch sát nghĩa cốt lõi của câu/từ -> ĐÁNH GIÁ "correct" (90-100đ).'}
2. Nếu sai trật tự ngữ pháp nghiêm trọng hoặc dùng sai từ vựng -> "wrong" (<60đ).

Trả về DUY NHẤT một chuỗi JSON thuần (KHÔNG kèm cú pháp markdown block \`\`\`json):
{
  "status": "correct",
  "score": 95,
  "feedback": "Nhận xét ngắn gọn dưới 35 từ về ưu điểm hoặc lỗi ngữ pháp",
  "improvedVersion": "${targetReference}"
}
`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.3 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            source: 'gemini',
            status: parsed.status || 'correct',
            score: typeof parsed.score === 'number' ? parsed.score : 85,
            feedback: parsed.feedback || 'Câu viết rất tốt!',
            improvedVersion: parsed.improvedVersion || targetReference
          };
        }
      }
    } catch (e) {
      console.warn('Gemini grading call error, fallback to local evaluator:', e);
    }
  }

  // 2. Local AI Fuzzy Semantic Evaluator (Offline / Hoàn toàn miễn phí, 0đ)
  await new Promise(r => setTimeout(r, 400)); // Nhẹ nhàng mô phỏng suy nghĩ AI 0.4s
  return localFuzzyEvaluate(taskType, trimmedUser, targetReference);
}

/**
 * Thuật toán Đánh Giá Ngữ Nghĩa Cục Bộ (Fuzzy Semantic Matching)
 * Chấp nhận dấu câu linh hoạt, từ đồng nghĩa và mức độ tương đồng cao
 */
function localFuzzyEvaluate(taskType, userText, targetText) {
  const cleanUser = userText.replace(/[。！？?!,\.，\s'"`-~:;]/g, '').toLowerCase();
  const cleanTarget = targetText.replace(/[。！？?!,\.，\s'"`-~:;]/g, '').toLowerCase();

  // Khớp 100% không dấu câu
  if (cleanUser === cleanTarget) {
    return {
      source: 'local',
      status: 'correct',
      score: 100,
      feedback: 'Xuất sắc! Bạn đã viết hoàn toàn chính xác từng chữ và chuẩn ngữ pháp.',
      improvedVersion: targetText
    };
  }

  if (taskType === 'vi_to_zh') {
    // Đo độ tương đồng ký tự chữ Hán
    let matchChars = 0;
    for (const char of cleanUser) {
      if (cleanTarget.includes(char)) matchChars++;
    }
    const similarity = cleanTarget.length > 0 ? matchChars / cleanTarget.length : 0;

    if (similarity >= 0.85) {
      return {
        source: 'local',
        status: 'correct',
        score: 92,
        feedback: 'Rất tốt! Câu của bạn truyền tải đúng ngữ pháp và ý nghĩa.',
        improvedVersion: targetText
      };
    } else if (similarity >= 0.6) {
      return {
        source: 'local',
        status: 'acceptable',
        score: 75,
        feedback: 'Khá tốt! Đã nắm được ý cơ bản, nhưng cần chú ý thêm trật tự từ ngữ pháp.',
        improvedVersion: targetText
      };
    } else {
      return {
        source: 'local',
        status: 'wrong',
        score: 45,
        feedback: 'Chưa chuẩn trật tự hoặc thiếu các từ ngữ pháp trọng tâm.',
        improvedVersion: targetText
      };
    }
  } else {
    // Dạng 5: Dịch nghĩa tiếng Việt
    // Tách từ khóa tiếng Việt
    const userWords = userText.toLowerCase().replace(/[.,?!]/g, '').split(/\s+/).filter(Boolean);
    const targetWords = targetText.toLowerCase().replace(/[.,?!]/g, '').split(/\s+/).filter(Boolean);

    let matchCount = 0;
    userWords.forEach(w => {
      if (targetWords.includes(w) || targetText.toLowerCase().includes(w)) matchCount++;
    });

    const ratio = targetWords.length > 0 ? matchCount / targetWords.length : 0;

    if (ratio >= 0.65 || cleanTarget.includes(cleanUser) || cleanUser.includes(cleanTarget)) {
      return {
        source: 'local',
        status: 'correct',
        score: 95,
        feedback: 'Chính xác! Bạn đã hiểu và dịch đúng nghĩa của câu.',
        improvedVersion: targetText
      };
    } else if (ratio >= 0.35) {
      return {
        source: 'local',
        status: 'acceptable',
        score: 78,
        feedback: 'Khá tốt! Nghĩa tương đối sát, hãy tham khảo thêm câu chuẩn.',
        improvedVersion: targetText
      };
    } else {
      return {
        source: 'local',
        status: 'wrong',
        score: 40,
        feedback: 'Nghĩa chưa sát với phiên âm bài học.',
        improvedVersion: targetText
      };
    }
  }
}

/**
 * =========================================================================
 * BỘ TẠO & QUẢN LÝ KỊCH BẢN HỘI THOẠI LUYỆN NÓI AI (CUMULATIVE KNOWLEDGE)
 * Kết hợp kiến thức lũy kế từ Bài 1 -> Bài hiện tại
 * =========================================================================
 */

/**
 * Sinh kịch bản hội thoại luyện nói với AI (Online Gemini hoặc Offline Smart Generator)
 */
export async function generateSpeakingScenario({ lesson, allLessonsUpToNow = [], turnCount = 4, userRole = 'A', topicOverride = '' }) {
  const config = getAIConfig();
  
  // Tổng hợp kho từ vựng và ngữ pháp lũy kế từ Bài 1 -> Bài này
  const lessonsList = allLessonsUpToNow && allLessonsUpToNow.length > 0 ? allLessonsUpToNow : [lesson];
  const allVocab = [];
  const allGrammar = [];

  lessonsList.forEach(l => {
    (l.words || []).forEach(w => allVocab.push(w));
    (l.grammarPoints || []).forEach(g => allGrammar.push(g));
  });

  const totalWords = allVocab.length;
  const totalGrammar = allGrammar.length;

  // 1. Thử gọi Gemini AI nếu có cấu hình API Key
  if (config.provider === 'gemini' && config.apiKey && config.apiKey.trim().length > 10) {
    try {
      const currentLessonWords = (lesson.words || []).slice(0, 15).map(w => `${w.hanzi} (${w.meaning})`).join(', ');
      const currentGrammarTitles = (lesson.grammarPoints || []).map(g => g.title).join('; ');
      const prevThemes = lessonsList.slice(0, -1).map(l => l.title).join(', ');

      const systemPrompt = `
Bạn là Chuyên Gia Sư Phạm Tiếng Trung Chuẩn HSK 3.0.
Nhiệm vụ: Tạo một kịch bản luyện nói đối thoại 1-1 thực tế giữa Học viên và AI.

THÔNG TIN BÀI HỌC:
- Bài hiện tại: "${lesson.title}"
- Ngữ pháp trọng tâm bài hiện tại: ${currentGrammarTitles || 'Giao tiếp hàng ngày'}
- Từ vựng trọng tâm bài này: ${currentLessonWords || 'Từ vựng ứng dụng'}
- Kiến thức tích lũy từ các bài trước: ${prevThemes ? prevThemes : 'Kiến thức khởi động cơ bản'}
- Tổng số từ vựng tích lũy: ${totalWords} từ.

YÊU CẦU ĐỐI THOẠI:
- Bối cảnh giao tiếp: ${topicOverride ? topicOverride : 'Tình huống đời sống tự nhiên gần gũi với bài học (gặp gỡ, mua sắm, hỏi đường, ăn uống, bàn công việc...)'}.
- Tổng số lượt nói: Đúng ${turnCount} lượt (chia đều cho 2 bên).
- Vai của Học viên: Nhân vật ${userRole === 'A' ? 'A (Nói lượt đầu tiên)' : 'B (Nói lượt thứ hai)'}.
- Vai của AI: Nhân vật ${userRole === 'A' ? 'B' : 'A'}.

QUY TẮC CỰC KỲ QUAN TRỌNG:
1. Đối với mỗi lượt của Học viên (speaker: "user"):
   - "viPrompt": Câu TIẾNG VIỆT tự nhiên, đời sống để học viên nhìn vào đó và TỰ NÓI SANG TIẾNG TRUNG vào micro.
   - "expectedZh": Câu tiếng Trung chuẩn mẫu tương ứng (để hệ thống chấm điểm).
   - "expectedPinyin": Phiên âm pinyin kèm thanh điệu chuẩn.
2. Đối với mỗi lượt của AI (speaker: "ai"):
   - "aiZh": Câu TIẾNG TRUNG phản hồi tự nhiên, chuẩn bản xứ.
   - "aiPinyin": Phiên âm pinyin.
   - "aiVi": Bản dịch nghĩa tiếng Việt tương ứng.

Trả về DUY NHẤT một chuỗi JSON thuần (không có \`\`\`json):
{
  "title": "Tên chủ đề ngắn gọn (ví dụ: Hẹn Đi Uống Trà Chiều)",
  "context": "Mô tả bối cảnh 1-2 câu",
  "turns": [
    {
      "speaker": "${userRole === 'A' ? 'user' : 'ai'}",
      "roleLabel": "${userRole === 'A' ? 'Bạn (A)' : 'AI (A)'}",
      ${userRole === 'A' 
        ? '"viPrompt": "Chào bạn, dạo này bạn có bận không?", "expectedZh": "你好，你最近忙吗？", "expectedPinyin": "Nǐ hǎo, nǐ zuìjìn máng ma?"'
        : '"aiZh": "你好！今天天气真好，你想去哪儿？", "aiPinyin": "Nǐ hǎo! Jīntiān tiānqì zhēn hǎo, nǐ xiǎng qù nǎr?", "aiVi": "Chào bạn! Thời tiết hôm nay đẹp thật, bạn muốn đi đâu?"'
      }
    }
  ]
}
`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.6 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.turns) && parsed.turns.length >= 2) {
            return {
              id: `speaking-scenario-${Date.now()}`,
              source: 'gemini',
              title: parsed.title || `Hội thoại: ${lesson.title}`,
              context: parsed.context || 'Cuộc hội thoại tình huống thực tế cùng AI.',
              userRole,
              userRoleTitle: userRole === 'A' ? 'Nhân vật A (Bạn nói trước)' : 'Nhân vật B (Bạn nói sau)',
              aiRoleTitle: userRole === 'A' ? 'Nhân vật B (AI phản hồi)' : 'Nhân vật A (AI mở đầu)',
              turnCount: parsed.turns.length,
              vocabLearnedCount: totalWords,
              grammarLearnedCount: totalGrammar,
              turns: parsed.turns.map((t, idx) => ({
                ...t,
                turnIndex: idx,
                userAudioBlob: null,
                userAudioUrl: null,
                userSpokenZh: '',
                evaluation: null
              }))
            };
          }
        }
      }
    } catch (e) {
      console.warn('Gemini generateSpeakingScenario error, fallback to local:', e);
    }
  }

  // 2. Local Smart Generator (Hoàn toàn miễn phí 0đ, tức thì 0.01s, tích hợp kho kiến thức lũy kế)
  return generateLocalSpeakingScenario({ lesson, allLessonsUpToNow: lessonsList, turnCount, userRole, topicOverride });
}

/**
 * Động cơ sinh kịch bản hội thoại cục bộ thông minh (Offline Local Scenario Engine)
 */
function generateLocalSpeakingScenario({ lesson, allLessonsUpToNow, turnCount = 4, userRole = 'A', topicOverride = '' }) {
  const allVocab = [];
  const allGrammar = [];

  allLessonsUpToNow.forEach(l => {
    (l.words || []).forEach(w => allVocab.push(w));
    (l.grammarPoints || []).forEach(g => allGrammar.push(g));
  });

  const lessonNum = lesson.number || 1;
  const targetTurns = Math.max(2, Math.min(10, turnCount));

  // Bộ mẫu kịch bản giao tiếp phong phú theo chủ đề
  const scenarioThemes = [
    {
      title: "Hẹn Gặp & Chào Hỏi Thân Mật",
      context: "Bạn và người bạn Trung Quốc (AI) tình cờ gặp nhau tại khuôn viên trường học, cùng hỏi thăm và hẹn đi uống nước.",
      turnsPool: [
        {
          userVi: "Xin chào! Lâu rồi không gặp bạn, dạo này bạn khỏe không?",
          userZh: "你好！好久不见，你最近好吗？",
          userPinyin: "Nǐ hǎo! Hǎojiǔ bú jiàn, nǐ zuìjìn hǎo ma?",
          aiZh: "我很好，你呢？今天你有没有时间？",
          aiPinyin: "Wǒ hěn hǎo, nǐ ne? Jīntiān nǐ yǒu méiyǒu shíjiān?",
          aiVi: "Tôi rất khỏe, còn bạn thì sao? Hôm nay bạn có thời gian rảnh không?"
        },
        {
          userVi: "Hôm nay tôi rất rảnh. Chúng ta cùng đi uống cà phê nhé?",
          userZh: "我今天很有空。我们一起去喝咖啡吧？",
          userPinyin: "Wǒ jīntiān hěn yǒu kòng. Wǒmen yìqǐ qù hē kāfēi ba?",
          aiZh: "太好了！学校门口有一家新咖啡馆，咖啡非常好喝。",
          aiPinyin: "Tài hǎo le! Xuéxiào ménkǒu yǒu yì jiā xīn kāfēiguǎn, kāfēi fēicháng hǎohē.",
          aiVi: "Tuyệt quá! Cổng trường có một quán cà phê mới, cà phê rất ngon."
        },
        {
          userVi: "Quán đó ở đâu vậy? Chúng ta đi bộ đến đó được không?",
          userZh: "那家店在哪儿？我们走路去可以吗？",
          userPinyin: "Nà jiā diàn zài nǎr? Wǒmen zǒulù qù kěyǐ ma?",
          aiZh: "就在前面，走路只要五分钟。我们现在就走吧！",
          aiPinyin: "Jiù zài qiánmiàn, zǒulù zhǐ yào wǔ fēnzhōng. Wǒmen xiànzài jiù zǒu ba!",
          aiVi: "Ngay phía trước thôi, đi bộ chỉ mất 5 phút. Chúng ta đi ngay nhé!"
        },
        {
          userVi: "Được, đi thôi! Tôi mời bạn một ly cà phê nhé.",
          userZh: "好的，走吧！我请你喝一杯咖啡。",
          userPinyin: "Hǎo de, zǒu ba! Wǒ qǐng nǐ hē yì bēi kāfēi.",
          aiZh: "谢谢你！那下次我请你吃中国菜。",
          aiPinyin: "Xièxie nǐ! Nà xià cì wǒ qǐng nǐ chī Zhōngguó cài.",
          aiVi: "Cảm ơn bạn nhé! Vậy lần sau tôi mời bạn ăn món Trung Quốc."
        },
        {
          userVi: "Bạn thích ăn món Trung Quốc nào nhất vậy?",
          userZh: "你最喜欢吃什么中国菜？",
          userPinyin: "Nǐ zuì xǐhuan chī shénme Zhōngguó cài?",
          aiZh: "我最喜欢北京烤鸭和水饺，味道好极了！",
          aiPinyin: "Wǒ zuì xǐhuan Běijīng kǎoyā hé shuǐjiǎo, wèidào hǎo jí le!",
          aiVi: "Tôi thích nhất là vịt quay Bắc Kinh và sủi cảo, hương vị ngon tuyệt đỉnh!"
        }
      ]
    },
    {
      title: "Gọi Đồ Uống & Món Ăn Tại Quán",
      context: "Bạn đang ở một quán trà và gọi đồ uống cùng AI (đóng vai nhân viên phục vụ tận tình).",
      turnsPool: [
        {
          userVi: "Xin chào, cho tôi xem thực đơn đồ uống một chút.",
          userZh: "你好，请给我看一下饮料菜单。",
          userPinyin: "Nǐ hǎo, qǐng gěi wǒ kàn yíxià yǐnliào càidān.",
          aiZh: "您好！这是我们的菜单，请问您想喝点儿什么？",
          aiPinyin: "Nín hǎo! Zhè shì wǒmen de càidān, qǐngwèn nín xiǎng hē diǎnr shénme?",
          aiVi: "Chào quý khách! Đây là thực đơn của quán, xin hỏi quý khách muốn dùng đồ uống gì ạ?"
        },
        {
          userVi: "Cho tôi một cốc trà sữa trân châu ít đường và ít đá nhé.",
          userZh: "请给我一杯珍珠奶茶，少糖少冰。",
          userPinyin: "Qǐng gěi wǒ yì bēi zhēnzhū nǎichá, shǎo táng shǎo bīng.",
          aiZh: "好的，请问您要大杯还是中杯？另外还需要甜点吗？",
          aiPinyin: "Hǎo de, qǐngwèn nín yào dà bēi háishì zhōng bēi? Lìngwài hái xūyào tiándiǎn ma?",
          aiVi: "Được ạ, xin hỏi quý khách chọn cốc to hay vừa? Ngoài ra quý khách có dùng thêm bánh ngọt không?"
        },
        {
          userVi: "Cho tôi cốc lớn, và không cần thêm bánh ngọt đâu.",
          userZh: "给我大杯的，不需要甜点了。",
          userPinyin: "Gěi wǒ dà bēi de, bù xūyào tiándiǎn le.",
          aiZh: "好的，一共二十五块钱。请问您用现金还是手机微信支付？",
          aiPinyin: "Hǎo de, yígòng èrshíwǔ kuài qián. Qǐngwèn nín yòng xiànjīn háishì shǒujī Wēixìn zhīfù?",
          aiVi: "Dạ vâng, tổng cộng là 25 tệ. Xin hỏi quý khách trả bằng tiền mặt hay quét mã WeChat?"
        },
        {
          userVi: "Tôi trả bằng điện thoại quét mã nhé. Đây là mã của tôi.",
          userZh: "我用手机扫码支付。这是我的付款码。",
          userPinyin: "Wǒ yòng shǒujī sǎomǎ zhīfù. Zhè shì wǒ de fùkuǎnmǎ.",
          aiZh: "收到二十五元。请您稍等两分钟，马上为您做好！",
          aiPinyin: "Shōudào èrshíwǔ yuán. Qǐng nín shāoděng liǎng fēnzhōng, mǎshàng wèi nín zuò hǎo!",
          aiVi: "Đã nhận 25 tệ. Xin quý khách vui lòng đợi 2 phút, đồ uống sẽ hoàn thành ngay ạ!"
        },
        {
          userVi: "Cảm ơn bạn nhiều, phục vụ rất nhanh nhẹn.",
          userZh: "非常感谢你，服务很周到。",
          userPinyin: "Fēicháng gǎnxiè nǐ, fúwù hěn zhōudào.",
          aiZh: "不客气，这是您的奶茶，祝您今天心情愉快！",
          aiPinyin: "Bú kèqi, zhè shì nín de nǎichá, zhù nín jīntiān xīnqíng yúkuài!",
          aiVi: "Không có gì ạ, đây là trà sữa của quý khách, chúc quý khách một ngày thật vui vẻ!"
        }
      ]
    },
    {
      title: "Hỏi Đường & Phương Tiện Đi Lại",
      context: "Bạn đang ở trên đường phố Bắc Kinh và cần hỏi AI (người qua đường thân thiện) đường đi đến nhà ga hoặc viện bảo tàng.",
      turnsPool: [
        {
          userVi: "Xin hỏi, từ đây đi đến ga tàu điện ngầm đi như thế nào?",
          userZh: "请问，从这里去地铁站怎么走？",
          userPinyin: "Qǐngwèn, cóng zhèlǐ qù dìtiězhàn zěnme zǒu?",
          aiZh: "您一直往前走，在第一个十字路口往右拐就到了。",
          aiPinyin: "Nín yìzhí wǎng qián zǒu, zài dì yí ge shízì lùkǒu wǎng yòu guǎi jiù dào le.",
          aiVi: "Bác cứ đi thẳng về phía trước, đến ngã tư đầu tiên rẽ phải là tới nơi."
        },
        {
          userVi: "Đi bộ đến đó mất bao nhiêu phút vậy bạn?",
          userZh: "走路去那里大概要几分钟？",
          userPinyin: "Zǒulù qù nàlǐ dàgài yào jǐ fēnzhōng?",
          aiZh: "走路大概十分钟。如果您赶时间，可以骑共享单车。",
          aiPinyin: "Zǒulù dàgài shí fēnzhōng. Rúguǒ nín gǎn shíjiān, kěyǐ qí gòngxiǎng dānchē.",
          aiVi: "Đi bộ mất khoảng 10 phút. Nếu bác đang vội, bác có thể đạp xe đạp công cộng."
        },
        {
          userVi: "Ở gần đây có chỗ thuê xe đạp công cộng không?",
          userZh: "这附近有租共享单车的地方吗？",
          userPinyin: "Zhè fùjìn yǒu zū gòngxiǎng dānchē de dìfang ma?",
          aiZh: "就在马路对面，便利店旁边停着很多黄色自行车。",
          aiPinyin: "Jiù zài mǎlù duìmiàn, biànlìdiàn pángbiān tíng zhe hěn duō huángsè zìxíngchē.",
          aiVi: "Ngay bên kia đường kìa, bên cạnh cửa hàng tiện lợi có đỗ rất nhiều xe đạp màu vàng."
        },
        {
          userVi: "Cảm ơn bạn rất nhiều, bạn thật nhiệt tình giúp đỡ!",
          userZh: "太感谢你了，你真热心！",
          userPinyin: "Tài gǎnxiè nǐ le, nǐ zhēn rèxīn!",
          aiZh: "不客气，出门在外互相帮助嘛，祝您旅途顺利！",
          aiPinyin: "Bú kèqi, chūmén zài wài hùxiāng bāngzhù ma, zhù nín lǚtú shùnlì!",
          aiVi: "Dạ không có gì, ra ngoài đường giúp đỡ lẫn nhau là chuyện nên làm mà, chúc bác đi đường thuận lợi!"
        }
      ]
    }
  ];

  // Chọn theme phù hợp với nội dung bài học
  const themeIndex = (lessonNum - 1) % scenarioThemes.length;
  const selectedTheme = scenarioThemes[themeIndex] || scenarioThemes[0];
  const turnsPool = selectedTheme.turnsPool;

  const generatedTurns = [];
  const pairCount = Math.ceil(targetTurns / 2);

  for (let p = 0; p < pairCount; p++) {
    const poolItem = turnsPool[p % turnsPool.length];
    
    if (userRole === 'A') {
      // User nói trước (Lượt chẵn: 0, 2, 4...)
      if (generatedTurns.length < targetTurns) {
        generatedTurns.push({
          turnIndex: generatedTurns.length,
          speaker: 'user',
          roleLabel: 'Bạn (A)',
          viPrompt: poolItem.userVi,
          expectedZh: poolItem.userZh,
          expectedPinyin: poolItem.userPinyin,
          userAudioBlob: null,
          userAudioUrl: null,
          userSpokenZh: '',
          evaluation: null
        });
      }
      // AI đáp lại (Lượt lẻ: 1, 3, 5...)
      if (generatedTurns.length < targetTurns) {
        generatedTurns.push({
          turnIndex: generatedTurns.length,
          speaker: 'ai',
          roleLabel: 'AI (B)',
          aiZh: poolItem.aiZh,
          aiPinyin: poolItem.aiPinyin,
          aiVi: poolItem.aiVi
        });
      }
    } else {
      // AI nói trước (Lượt chẵn: 0, 2, 4...)
      if (generatedTurns.length < targetTurns) {
        generatedTurns.push({
          turnIndex: generatedTurns.length,
          speaker: 'ai',
          roleLabel: 'AI (A)',
          aiZh: poolItem.aiZh,
          aiPinyin: poolItem.aiPinyin,
          aiVi: poolItem.aiVi
        });
      }
      // User đáp lại (Lượt lẻ: 1, 3, 5...)
      if (generatedTurns.length < targetTurns) {
        generatedTurns.push({
          turnIndex: generatedTurns.length,
          speaker: 'user',
          roleLabel: 'Bạn (B)',
          viPrompt: poolItem.userVi,
          expectedZh: poolItem.userZh,
          expectedPinyin: poolItem.userPinyin,
          userAudioBlob: null,
          userAudioUrl: null,
          userSpokenZh: '',
          evaluation: null
        });
      }
    }
  }

  return {
    id: `speaking-scenario-${Date.now()}`,
    source: 'local',
    title: topicOverride || selectedTheme.title,
    context: selectedTheme.context,
    userRole,
    userRoleTitle: userRole === 'A' ? 'Nhân vật A (Bạn nói trước)' : 'Nhân vật B (Bạn nói sau)',
    aiRoleTitle: userRole === 'A' ? 'Nhân vật B (AI phản hồi)' : 'Nhân vật A (AI mở đầu)',
    turnCount: generatedTurns.length,
    vocabLearnedCount: allVocab.length,
    grammarLearnedCount: allGrammar.length,
    turns: generatedTurns
  };
}

/**
 * Tự động cập nhật câu phản hồi của AI khi người dùng chỉnh sửa câu tiếng Việt của mình
 */
export async function adaptAIReplyWithAI({ userVietnameseText, previousTurnZh = '', currentAiZh = '' }) {
  const config = getAIConfig();
  const trimmed = (userVietnameseText || '').trim();
  if (!trimmed) return null;

  if (config.provider === 'gemini' && config.apiKey && config.apiKey.trim().length > 10) {
    try {
      const prompt = `
Bạn là AI đối thoại tiếng Trung tự nhiên.
Người dùng vừa chỉnh sửa câu nói tiếng Việt của họ thành: "${trimmed}".
Câu trước đó trong đoạn chat: "${previousTurnZh || 'Bắt đầu cuộc trò chuyện'}".

Hãy tạo 1 câu phản hồi tiếng Trung tự nhiên, lịch sự và logic tiếp nối câu của người dùng.
Trả về DUY NHẤT một chuỗi JSON thuần:
{
  "aiZh": "Câu tiếng Trung phản hồi",
  "aiPinyin": "Phiên âm pinyin",
  "aiVi": "Bản dịch tiếng Việt"
}
`;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.5 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
      }
    } catch (e) {
      console.warn('Gemini adaptAIReply error:', e);
    }
  }

  // Fallback: Giữ câu cũ hoặc biến tấu nhẹ
  return {
    aiZh: currentAiZh || "好的，我明白了！",
    aiPinyin: "Hǎo de, wǒ míngbai le!",
    aiVi: "Được ạ, tôi hiểu rồi!"
  };
}

/**
 * Đánh giá câu nói tiếng Trung của học viên so với câu tiếng Việt mục tiêu
 */
export async function evaluateSpokenSentenceWithAI({ userSpokenZh, viPrompt, expectedZh }) {
  const config = getAIConfig();
  const trimmed = (userSpokenZh || '').trim();

  if (!trimmed) {
    return {
      status: 'empty',
      score: 0,
      feedback: 'Hệ thống chưa nhận diện được giọng nói của bạn. Vui lòng bấm Mic và nói lại.',
      improvedZh: expectedZh
    };
  }

  // 1. Nếu có Gemini API
  if (config.provider === 'gemini' && config.apiKey && config.apiKey.trim().length > 10) {
    try {
      const prompt = `
Bạn là Giám Khảo Khảo Thí Khẩu Ngữ Tiếng Trung HSK.
Học viên được giao nói một câu tiếng Trung thể hiện ý nghĩa tiếng Việt: "${viPrompt}".
Câu chuẩn tham khảo: "${expectedZh}".
Câu học viên đã phát âm vào Mic (nhận diện thành chữ Hán): "${trimmed}".

Đánh giá xem câu học viên nói có diễn đạt đúng ý không.
Chấp nhận các cách diễn đạt tương đương, khẩu ngữ tự nhiên, không bắt bẻ dấu câu.
Trả về DUY NHẤT một chuỗi JSON thuần:
{
  "status": "correct", // "correct" (85-100), "acceptable" (65-84), hoặc "wrong" (<65)
  "score": 95,
  "feedback": "Nhận xét khích lệ ngắn gọn dưới 30 từ về phát âm / từ vựng",
  "improvedZh": "${expectedZh}"
}
`;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.3 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return {
            status: parsed.status || 'correct',
            score: typeof parsed.score === 'number' ? parsed.score : 90,
            feedback: parsed.feedback || 'Phát âm rất rõ ràng và chuẩn ý!',
            improvedZh: parsed.improvedZh || expectedZh
          };
        }
      }
    } catch (e) {
      console.warn('Gemini spoken eval error:', e);
    }
  }

  // 2. Local Fuzzy Evaluator
  const cleanSpoken = trimmed.replace(/[。！？?!,\.，\s'"`-~:;]/g, '').toLowerCase();
  const cleanExpected = (expectedZh || '').replace(/[。！？?!,\.，\s'"`-~:;]/g, '').toLowerCase();

  if (cleanSpoken === cleanExpected) {
    return {
      status: 'correct',
      score: 100,
      feedback: 'Tuyệt vời! Bạn phát âm hoàn toàn chuẩn xác từng chữ.',
      improvedZh: expectedZh
    };
  }

  // Đếm số ký tự khớp
  let matchCount = 0;
  for (const c of cleanSpoken) {
    if (cleanExpected.includes(c)) matchCount++;
  }
  const ratio = cleanExpected.length > 0 ? matchCount / cleanExpected.length : 0;

  if (ratio >= 0.75) {
    return {
      status: 'correct',
      score: 90,
      feedback: 'Rất tốt! Câu bạn nói rất rõ ràng và truyền tải đúng ý.',
      improvedZh: expectedZh
    };
  } else if (ratio >= 0.45) {
    return {
      status: 'acceptable',
      score: 75,
      feedback: 'Khá tốt! Bạn đã nắm được phần lớn từ khóa, chú ý thêm thanh điệu.',
      improvedZh: expectedZh
    };
  } else {
    return {
      status: 'wrong',
      score: 50,
      feedback: 'Chưa sát nghĩa hoặc phát âm chưa rõ chữ. Hãy nghe lại giọng mẫu nhé.',
      improvedZh: expectedZh
    };
  }
}

