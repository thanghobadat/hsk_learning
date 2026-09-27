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
 * Tự động phân tích từ vựng & cấu trúc ngữ pháp của bài để tạo bộ câu hỏi đa dạng
 */
export function generateLocalDrills(lesson) {
  const drills = [];
  const words = lesson.words || [];
  const grammarPoints = lesson.grammarPoints || [];

  // DẠNG 1: Sắp xếp câu (Sentence Scramble) theo cấu trúc ngữ pháp
  // Lấy các câu ví dụ từ điểm ngữ pháp và câu ví dụ từ vựng
  const sentencePool = [];
  grammarPoints.forEach(g => {
    (g.examples || []).forEach(ex => {
      sentencePool.push({
        type: 'scramble',
        title: `Sắp xếp câu chuẩn ngữ pháp: ${g.title}`,
        formula: g.formula,
        targetZh: ex.zh,
        pinyin: ex.pinyin,
        meaningVi: ex.vi,
        grammarRef: g.explanation
      });
    });
  });

  // Bổ sung thêm câu ví dụ từ vựng nếu pool ít
  words.slice(0, 4).forEach(w => {
    if (w.exampleZh && w.exampleZh.length <= 15) {
      sentencePool.push({
        type: 'scramble',
        title: `Sắp xếp câu giao tiếp hàng ngày`,
        formula: `Từ vựng trọng tâm: ${w.hanzi} (${w.pinyin})`,
        targetZh: w.exampleZh,
        pinyin: w.examplePinyin,
        meaningVi: w.exampleVi,
        grammarRef: `Câu mẫu ứng dụng từ '${w.hanzi}' - ${w.meaning}`
      });
    }
  });

  // Chọn 2 câu sắp xếp
  const shuffledSentences = [...sentencePool].sort(() => Math.random() - 0.5).slice(0, 2);
  shuffledSentences.forEach((sItem, idx) => {
    // Tách câu tiếng Trung thành các khối từ hợp lý
    // Loại bỏ dấu câu cuối
    const cleanZh = sItem.targetZh.replace(/[。！？?!,\.，]/g, '');
    let tokens = tokenizeChineseSentence(cleanZh, words);
    // Xáo trộn tokens
    const shuffledTokens = [...tokens].sort(() => Math.random() - 0.5);

    drills.push({
      id: `drill-scramble-${idx + 1}`,
      type: 'scramble',
      badge: '🧩 Sắp Xếp Câu',
      title: sItem.title,
      hintFormula: sItem.formula,
      meaningVi: sItem.meaningVi,
      targetZh: cleanZh,
      fullTargetZh: sItem.targetZh,
      pinyin: sItem.pinyin,
      grammarExplanation: sItem.grammarRef,
      tokens: shuffledTokens
    });
  });

  // DẠNG 2: Điền từ vào chỗ trống (Cloze Test) theo ngữ cảnh
  const clozeCandidates = words.filter(w => w.exampleZh && w.exampleZh.includes(w.hanzi)).slice(0, 8);
  const shuffledCloze = [...clozeCandidates].sort(() => Math.random() - 0.5).slice(0, 2);

  shuffledCloze.forEach((wItem, idx) => {
    const blankSentence = wItem.exampleZh.replace(wItem.hanzi, '( ____ )');
    // 3 lựa chọn nhiễu từ cùng bài
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
      badge: '✏️ Điền Từ Vào Ngữ Cảnh',
      title: 'Chọn từ vựng bài học thích hợp nhất để điền vào chỗ trống:',
      sentenceWithBlank: blankSentence,
      meaningVi: wItem.exampleVi,
      pinyin: wItem.examplePinyin,
      correctWord: wItem.hanzi,
      choices: choices,
      correctIndex: correctIdx,
      explanation: `Từ cần điền là '${wItem.hanzi}' (${wItem.pinyin}: ${wItem.meaning}). Câu hoàn chỉnh: ${wItem.exampleZh} (${wItem.exampleVi}).`
    });
  });

  // DẠNG 3: Bắt lỗi sai hoặc trắc nghiệm ngữ pháp thực tế
  if (lesson.quiz && lesson.quiz.length > 0) {
    lesson.quiz.forEach((q, idx) => {
      drills.push({
        id: `drill-quiz-${idx + 1}`,
        type: 'multiple-choice',
        badge: '🎯 Trắc Nghiệm Ngữ Pháp',
        title: q.q,
        choices: q.choices,
        correctIndex: q.correct,
        explanation: q.exp
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
