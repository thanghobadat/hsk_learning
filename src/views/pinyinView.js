import confetti from 'canvas-confetti';
import { PINYIN_DATA } from '../data/pinyinData.js';
import { PINYIN_PRACTICE_QUESTIONS } from '../data/pinyinPracticeData.js';
import { speakChinese, playSound } from '../utils/speech.js';

export function renderPinyinView(container) {
  let activeSubTab = 'rules'; // 'rules', 'practice', 'tones', 'initials', 'synth'
  let ruleFilter = 'all'; // 'all', 'writing-rules', 'tone-marking-rules', 'pronunciation-tone-rules'

  // Trạng thái bài tập
  let practiceIndex = 0;
  let practiceScore = 0;
  let practiceAnswered = false;
  let randomizedQuestions = [...PINYIN_PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());

  function render() {
    container.innerHTML = `
      <div class="pinyin-page animate-fade-in">
        <div class="page-header">
          <h1 class="page-title">Hệ Thống Quy Tắc Đọc - Viết Pinyin & Bảng Phát Âm Chuẩn</h1>
          <p class="page-subtitle">
            Toàn bộ quy tắc chính tả viết Pinyin, đánh dấu thanh điệu, quy tắc biến điệu từ tài liệu Tiết 2 cùng bài tập ôn luyện tương tác.
          </p>
        </div>

        <!-- Sub-navigation Bar -->
        <div class="pinyin-subnav" role="tablist">
          <button class="pinyin-subnav-btn ${activeSubTab === 'rules' ? 'active' : ''}" data-subtab="rules">
            <span>📜</span> Quy Tắc Đọc - Viết (16 Quy Tắc)
          </button>
          <button class="pinyin-subnav-btn ${activeSubTab === 'practice' ? 'active' : ''}" data-subtab="practice">
            <span>📝</span> Bài Tập Ôn Luyện (16 Câu Hỏi)
          </button>
          <button class="pinyin-subnav-btn ${activeSubTab === 'tones' ? 'active' : ''}" data-subtab="tones">
            <span>🎵</span> 4 Thanh Điệu
          </button>
          <button class="pinyin-subnav-btn ${activeSubTab === 'initials' ? 'active' : ''}" data-subtab="initials">
            <span>🗣️</span> 21 Thanh Mẫu & Vận Mẫu
          </button>
          <button class="pinyin-subnav-btn ${activeSubTab === 'synth' ? 'active' : ''}" data-subtab="synth">
            <span>🎛️</span> Máy Ghép Âm (Syllable Lab)
          </button>
        </div>

        <!-- Dynamic Sub-Tab View Container -->
        <div id="subTabContent" class="subtab-content-area">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    // Gắn sự kiện chuyển subtab
    const subNavBtns = container.querySelectorAll('.pinyin-subnav-btn');
    subNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        activeSubTab = btn.dataset.subtab;
        render();
      });
    });

    const contentArea = container.querySelector('#subTabContent');

    if (activeSubTab === 'rules') {
      renderRulesSection(contentArea);
    } else if (activeSubTab === 'practice') {
      renderPracticeSection(contentArea);
    } else if (activeSubTab === 'tones') {
      renderTonesSection(contentArea);
    } else if (activeSubTab === 'initials') {
      renderInitialsSection(contentArea);
    } else if (activeSubTab === 'synth') {
      renderSynthSection(contentArea);
    }
  }

  // --- 1. RENDER QUY TẮC ĐỌC - VIẾT TOÀN DIỆN (TIẾT 2) ---
  function renderRulesSection(contentArea) {
    contentArea.innerHTML = `
      <div class="section-card glass-panel animate-fade-in">
        <div class="section-header">
          <div class="section-icon">📜</div>
          <div>
            <h2 class="section-title">Tổng Hợp Đầy Đủ 16 Quy Tắc Đọc - Viết Pinyin (Tiết 2)</h2>
            <p class="section-subtitle">Được chia thành 3 phần trọng tâm: Quy tắc viết chính tả, Quy tắc đặt dấu thanh điệu và Quy tắc biến điệu khi đọc</p>
          </div>
        </div>

        <!-- Rule Category Filter Pills -->
        <div class="level-tabs" style="margin-bottom: 1.5rem;">
          <button class="level-tab-btn ${ruleFilter === 'all' ? 'active' : ''}" data-rule-filter="all">Tất cả quy tắc (16)</button>
          <button class="level-tab-btn ${ruleFilter === 'writing-rules' ? 'active' : ''}" data-rule-filter="writing-rules">I. Quy tắc viết (8)</button>
          <button class="level-tab-btn ${ruleFilter === 'tone-marking-rules' ? 'active' : ''}" data-rule-filter="tone-marking-rules">II. Đánh dấu thanh điệu (3)</button>
          <button class="level-tab-btn ${ruleFilter === 'pronunciation-tone-rules' ? 'active' : ''}" data-rule-filter="pronunciation-tone-rules">III. Biến điệu & Thanh nhẹ (5)</button>
        </div>

        <div class="rules-categories-container">
          ${PINYIN_DATA.ruleCategories.filter(cat => ruleFilter === 'all' || cat.id === ruleFilter).map(cat => `
            <div class="rules-category-block">
              <div class="category-block-header">
                <h3 class="category-block-title">
                  <span class="vocab-level-badge" style="background-color: var(--crimson-500);">${cat.badge}</span>
                  ${cat.title}
                </h3>
                <p class="category-block-desc">${cat.desc}</p>
              </div>

              <div class="rules-grid">
                ${cat.rules.map(r => `
                  <div class="rule-box" id="${r.id}">
                    <div class="rule-box-header">
                      <span class="rule-num-badge">${r.number}</span>
                      <h4 class="rule-title">${r.title}</h4>
                    </div>

                    <div class="rule-formula">${r.formula}</div>

                    <p class="rule-explanation">${r.explanation}</p>

                    <div class="rule-examples-list">
                      ${r.examples.map(ex => `
                        <div class="rule-example-item">
                          <span class="rule-ex-text">${ex.text} (${ex.pinyin}) - <em>${ex.vi}</em></span>
                          <button class="rule-ex-audio-btn" data-speak="${ex.audio}" title="Bấm nghe phát âm">
                            <span>🔊</span> Nghe
                          </button>
                        </div>
                      `).join('')}
                    </div>

                    <div class="rule-note">
                      💡 ${r.note}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Filter sự kiện
    contentArea.querySelectorAll('[data-rule-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        playSound('click');
        ruleFilter = btn.dataset.ruleFilter;
        renderRulesSection(contentArea);
      });
    });

    // Phát âm thanh
    contentArea.querySelectorAll('[data-speak]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.add('pulse-active');
        speakChinese(btn.dataset.speak, () => {
          btn.classList.remove('pulse-active');
        });
      });
    });
  }

  // --- 2. RENDER BÀI TẬP ÔN LUYỆN QUY TẮC ĐỌC - VIẾT ---
  function renderPracticeSection(contentArea) {
    const totalQ = randomizedQuestions.length;

    if (practiceIndex >= totalQ) {
      const percentage = Math.round((practiceScore / totalQ) * 100);
      if (percentage >= 75) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      contentArea.innerHTML = `
        <div class="rule-practice-arena animate-fade-in">
          <div class="quiz-result-card glass-panel text-center">
            <div class="result-trophy">${percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪'}</div>
            <h2 class="result-title">Hoàn Thành Bài Tập Quy Tắc Đọc - Viết!</h2>
            <p class="result-subtitle">Kết quả ôn tập của bạn từ giáo trình Tiết 2</p>

            <div class="result-score-circle">
              <span class="score-number">${practiceScore} / ${totalQ}</span>
              <span class="score-percent">(${percentage}%)</span>
            </div>

            <div class="result-feedback">
              ${percentage >= 90 ? 'Xuất sắc! Bạn đã làm chủ 100% các quy tắc chính tả Pinyin và biến điệu ngữ âm.' :
                percentage >= 70 ? 'Rất tốt! Bạn nắm vững hầu hết các quy tắc, chú ý thêm các trường hợp đặc biệt như iu/ui và biến điệu của chữ 一.' :
                'Hãy đọc lại phần "Quy Tắc Đọc - Viết" một lần nữa và luyện tập lại để không bị nhầm lẫn nhé.'}
            </div>

            <div class="result-actions">
              <button id="btnRestartPractice" class="btn-primary-action">
                <span>🔄</span> Làm Lại Bài Tập
              </button>
            </div>
          </div>
        </div>
      `;

      contentArea.querySelector('#btnRestartPractice').addEventListener('click', () => {
        playSound('click');
        practiceIndex = 0;
        practiceScore = 0;
        practiceAnswered = false;
        randomizedQuestions = [...PINYIN_PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());
        renderPracticeSection(contentArea);
      });
      return;
    }

    const currentQ = randomizedQuestions[practiceIndex];

    contentArea.innerHTML = `
      <div class="rule-practice-arena animate-fade-in">
        <div class="section-card practice-card-box glass-panel">
          <div class="practice-meta-row">
            <span class="practice-q-category">${currentQ.category}</span>
            <span class="practice-score-badge">Câu ${practiceIndex + 1} / ${totalQ} | Đúng: ${practiceScore}</span>
          </div>

          <div class="quiz-track" style="margin-bottom: 1.25rem;">
            <div class="quiz-fill" style="width: ${((practiceIndex + 1) / totalQ) * 100}%"></div>
          </div>

          <h3 class="practice-question-text">${currentQ.question}</h3>

          ${currentQ.audioSample ? `
            <div class="practice-audio-bar">
              <button id="btnPlayQSample" class="btn-practice-audio" data-speak="${currentQ.audioSample}">
                <span>🔊</span> Nghe phát âm mẫu: <strong>${currentQ.audioSample}</strong>
              </button>
            </div>
          ` : ''}

          <div class="practice-choices-list">
            ${currentQ.choices.map((ch, idx) => `
              <button class="practice-choice-item" data-idx="${idx}" ${practiceAnswered ? 'disabled' : ''}>
                <span class="choice-letter">${['A', 'B', 'C', 'D'][idx]}</span>
                <span class="choice-content">${ch}</span>
              </button>
            `).join('')}
          </div>

          <div id="practiceFeedback" class="practice-feedback-container hidden">
            <!-- Rendered after answer -->
          </div>
        </div>
      </div>
    `;

    // Nút nghe audio mẫu
    const audioBtn = contentArea.querySelector('#btnPlayQSample');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        speakChinese(audioBtn.dataset.speak);
      });
    }

    // Xử lý chọn đáp án
    const choiceBtns = contentArea.querySelectorAll('.practice-choice-item');
    const fbBox = contentArea.querySelector('#practiceFeedback');

    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (practiceAnswered) return;
        practiceAnswered = true;
        const selectedIdx = parseInt(btn.dataset.idx, 10);
        const isCorrect = selectedIdx === currentQ.correctIndex;

        if (isCorrect) {
          practiceScore++;
          playSound('correct');
          btn.classList.add('correct');
        } else {
          playSound('wrong');
          btn.classList.add('wrong');
          // Highlight nút đúng
          choiceBtns.forEach(b => {
            if (parseInt(b.dataset.idx, 10) === currentQ.correctIndex) {
              b.classList.add('correct');
            }
          });
        }

        fbBox.classList.remove('hidden');
        fbBox.innerHTML = `
          <div class="practice-feedback-panel ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
            <div class="fb-status">${isCorrect ? '✅ Chính xác!' : '❌ Chưa chính xác!'}</div>
            <div class="fb-detail">
              <strong>Giải thích quy tắc:</strong> ${currentQ.explanation}
            </div>
            <button id="btnNextPracticeQ" class="btn-next-q">
              <span>${practiceIndex === totalQ - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span> ➔
            </button>
          </div>
        `;

        contentArea.querySelector('#btnNextPracticeQ').addEventListener('click', () => {
          playSound('click');
          practiceIndex++;
          practiceAnswered = false;
          renderPracticeSection(contentArea);
        });
      });
    });
  }

  // --- 3. RENDER 4 THANH ĐIỆU CƠ BẢN ---
  function renderTonesSection(contentArea) {
    contentArea.innerHTML = `
      <div class="section-card glass-panel animate-fade-in">
        <div class="section-header">
          <div class="section-icon">🎵</div>
          <div>
            <h2 class="section-title">4 Thanh Điệu Cơ Bản & Thanh Nhẹ</h2>
            <p class="section-subtitle">Thanh điệu quyết định hoàn toàn nghĩa của từ. Bấm vào nút để nghe và nhại theo cao độ chuẩn.</p>
          </div>
        </div>

        <div class="tones-grid">
          ${PINYIN_DATA.tones.map(t => `
            <div class="tone-card" style="border-top: 4px solid ${t.color}">
              <div class="tone-card-top">
                <span class="tone-badge" style="background-color: ${t.color}">Thanh ${t.tone === 0 ? 'Nhẹ' : t.tone}</span>
                <span class="tone-pitch">${t.pitch}</span>
              </div>
              <div class="tone-symbol">${t.symbol}</div>
              <h3 class="tone-name">${t.name}</h3>
              <p class="tone-desc">${t.desc}</p>
              <div class="tone-action">
                <button class="btn-play-tone" data-audio="${t.audioSample}" title="Nghe phát âm">
                  <span class="play-icon">🔊</span> Nghe mẫu: <strong>${t.example}</strong>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    contentArea.querySelectorAll('.btn-play-tone').forEach(btn => {
      btn.addEventListener('click', () => {
        speakChinese(btn.dataset.audio);
      });
    });
  }

  // --- 4. RENDER 21 THANH MẪU & VẬN MẪU ---
  function renderInitialsSection(contentArea) {
    contentArea.innerHTML = `
      <div class="section-card glass-panel animate-fade-in">
        <div class="section-header">
          <div class="section-icon">🗣️</div>
          <div>
            <h2 class="section-title">21 Thanh Mẫu (Phụ Âm Đầu)</h2>
            <p class="section-subtitle">Được phân nhóm khoa học theo vị trí phát âm của môi, lưỡi và răng kèm ví dụ có âm thanh</p>
          </div>
        </div>

        <div class="initials-category-list">
          ${PINYIN_DATA.initials.map(grp => `
            <div class="initial-group">
              <h4 class="group-title">${grp.category}</h4>
              <div class="sound-grid">
                ${grp.items.map(it => `
                  <div class="sound-card sound-btn" data-speak="${it.sampleWord}">
                    <div class="sound-char">${it.char}</div>
                    <div class="sound-ipa">${it.ipa}</div>
                    <div class="sound-tip">${it.tip}</div>
                    <div class="sound-sample">
                      <span>Ví dụ: <strong>${it.sampleWord}</strong> (${it.samplePinyin} - ${it.sampleMeaning})</span>
                      <span class="mini-sound-icon">🔊</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section-card glass-panel animate-fade-in">
        <div class="section-header">
          <div class="section-icon">👄</div>
          <div>
            <h2 class="section-title">Các Vận Mẫu Quan Trọng (Nguyên Âm)</h2>
            <p class="section-subtitle">Bao gồm vận mẫu đơn, vận mẫu kép và vận mẫu mũi</p>
          </div>
        </div>

        <div class="finals-list">
          ${PINYIN_DATA.finals.map(fGrp => `
            <div class="final-group">
              <h4 class="group-title">${fGrp.category}</h4>
              <div class="finals-grid">
                ${fGrp.items.map(f => `
                  <div class="final-card sound-btn" data-speak="${f.sample.split(' ')[0]}">
                    <div class="final-char">${f.char}</div>
                    <div class="final-tip">${f.tip}</div>
                    <div class="final-sample">
                      <span>${f.sample}</span>
                      <span class="mini-sound-icon">🔊</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    contentArea.querySelectorAll('.sound-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        speakChinese(btn.dataset.speak);
      });
    });
  }

  // --- 5. RENDER MÁY GHÉP ÂM (SYLLABLE LAB) ---
  function renderSynthSection(contentArea) {
    contentArea.innerHTML = `
      <div class="section-card synth-card glass-panel animate-fade-in">
        <div class="section-header">
          <div class="section-icon">🎛️</div>
          <div>
            <h2 class="section-title">Máy Ghép Âm Pinyin Tương Tác (Syllable Lab)</h2>
            <p class="section-subtitle">Tự chọn Thanh mẫu + Vận mẫu + Thanh điệu để nghe cách ghép âm chuẩn xác</p>
          </div>
        </div>

        <div class="synth-body">
          <div class="synth-selectors">
            <div class="synth-group">
              <label>Thanh mẫu (Phụ âm):</label>
              <select id="synthInitial" class="custom-select">
                <option value="b">b (như p)</option>
                <option value="p">p (bật hơi)</option>
                <option value="m">m</option>
                <option value="f">f (ph)</option>
                <option value="d">d (như t)</option>
                <option value="t">t (th bật hơi)</option>
                <option value="n">n</option>
                <option value="l">l</option>
                <option value="g">g (c/k)</option>
                <option value="k">k (kh bật hơi)</option>
                <option value="h">h</option>
                <option value="j">j (ch)</option>
                <option value="q">q (bật hơi)</option>
                <option value="x">x</option>
                <option value="zh">zh (tr uốn lưỡi)</option>
                <option value="ch">ch (bật hơi uốn lưỡi)</option>
                <option value="sh">sh (s uốn lưỡi)</option>
                <option value="r">r (uốn lưỡi)</option>
                <option value="z">z</option>
                <option value="c">c (bật hơi)</option>
                <option value="s">s</option>
              </select>
            </div>

            <div class="synth-group">
              <label>Vận mẫu (Nguyên âm):</label>
              <select id="synthFinal" class="custom-select">
                <option value="a">a</option>
                <option value="o">o</option>
                <option value="e">e</option>
                <option value="i">i</option>
                <option value="u">u</option>
                <option value="ai">ai</option>
                <option value="ei">ei</option>
                <option value="ao">ao</option>
                <option value="ou">ou</option>
                <option value="an">an</option>
                <option value="en">en</option>
                <option value="ang">ang</option>
                <option value="eng">eng</option>
              </select>
            </div>

            <div class="synth-group">
              <label>Thanh điệu:</label>
              <select id="synthTone" class="custom-select">
                <option value="1">Thanh 1 (Ngang cao)</option>
                <option value="2">Thanh 2 (Dấu sắc đi lên)</option>
                <option value="3">Thanh 3 (Hỏi đi xuống rồi lên)</option>
                <option value="4">Thanh 4 (Hạ dứt khoát)</option>
              </select>
            </div>
          </div>

          <div class="synth-result-box">
            <div class="synth-preview">
              <span id="synthPinyinDisplay" class="synth-display">bā</span>
            </div>
            <button id="btnPlaySynth" class="btn-primary-action">
              <span>🔊</span> Phát Âm Âm Tiết Này
            </button>
          </div>
        </div>
      </div>
    `;

    const initialSelect = contentArea.querySelector('#synthInitial');
    const finalSelect = contentArea.querySelector('#synthFinal');
    const toneSelect = contentArea.querySelector('#synthTone');
    const display = contentArea.querySelector('#synthPinyinDisplay');
    const playSynthBtn = contentArea.querySelector('#btnPlaySynth');

    const toneVowelMap = {
      a: ['ā', 'á', 'ǎ', 'à'],
      o: ['ō', 'ó', 'ǒ', 'ò'],
      e: ['ē', 'é', 'ě', 'è'],
      i: ['ī', 'í', 'ǐ', 'ì'],
      u: ['ū', 'ú', 'ǔ', 'ù'],
      ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ']
    };

    function updateSynthDisplay() {
      const init = initialSelect.value;
      const fin = finalSelect.value;
      const toneIdx = parseInt(toneSelect.value, 10) - 1;

      let modifiedFin = fin;
      if (fin.includes('a')) {
        modifiedFin = fin.replace('a', toneVowelMap.a[toneIdx]);
      } else if (fin.includes('o')) {
        modifiedFin = fin.replace('o', toneVowelMap.o[toneIdx]);
      } else if (fin.includes('e')) {
        modifiedFin = fin.replace('e', toneVowelMap.e[toneIdx]);
      } else if (fin.includes('ui')) {
        modifiedFin = fin.replace('i', toneVowelMap.i[toneIdx]);
      } else if (fin.includes('iu')) {
        modifiedFin = fin.replace('u', toneVowelMap.u[toneIdx]);
      } else if (fin.includes('i')) {
        modifiedFin = fin.replace('i', toneVowelMap.i[toneIdx]);
      } else if (fin.includes('u')) {
        modifiedFin = fin.replace('u', toneVowelMap.u[toneIdx]);
      }

      display.textContent = `${init}${modifiedFin}`;
    }

    [initialSelect, finalSelect, toneSelect].forEach(el => {
      el.addEventListener('change', () => {
        playSound('click');
        updateSynthDisplay();
      });
    });

    playSynthBtn.addEventListener('click', () => {
      const syllable = display.textContent;
      playSynthBtn.classList.add('pulse-active');
      speakChinese(syllable, () => {
        playSynthBtn.classList.remove('pulse-active');
      });
    });

    updateSynthDisplay();
  }

  render();
}
