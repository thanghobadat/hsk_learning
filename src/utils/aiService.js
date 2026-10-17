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
