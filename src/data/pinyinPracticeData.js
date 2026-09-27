// Bộ câu hỏi bài tập tương tác chuyên sâu về Quy Tắc Đọc & Viết Pinyin (Theo giáo trình Tiết 2)
export const PINYIN_PRACTICE_QUESTIONS = [
  {
    id: "q-rule-1",
    category: "Quy tắc viết Pinyin",
    title: "Vận mẫu có 'ü' ghép với j, q, x",
    question: "Khi các vận mẫu 'ü, üe, üan, ün' ghép với thanh mẫu 'j, q, x', chữ 'ü' lúc viết phải xử lý thế nào?",
    audioSample: "去",
    choices: [
      "Giữ nguyên hai dấu chấm (jü, qü, xü)",
      "Bỏ hai dấu chấm trên đầu, viết là 'u' (ju, qu, xu)",
      "Đổi chữ 'ü' thành chữ 'w'",
      "Đổi chữ 'ü' thành chữ 'y'"
    ],
    correctIndex: 1,
    explanation: "Theo quy tắc: j, q, x + (ü, üe, üan, ün) lúc viết PHẢI BỎ HAI DẤU CHẤM trên đầu (ju, qu, xu, jue, que, xue...), nhưng khi phát âm vẫn tròn môi 'ü'."
  },
  {
    id: "q-rule-2",
    category: "Quy tắc viết Pinyin",
    title: "Vận mẫu 'ü, üe' ghép với l, n",
    question: "Cách viết nào dưới đây là ĐÚNG CHÍNH TẢ khi ghép 'n' và 'l' với 'ü'?",
    audioSample: "女",
    choices: [
      "nu, lu",
      "nü, lü (giữ nguyên hai dấu chấm)",
      "ny, ly",
      "nw, lw"
    ],
    correctIndex: 1,
    explanation: "Vì trong tiếng Trung có cả 'lu, nu' lẫn 'lü, nü' nên để phân biệt, khi ghép với 'l, n' BẮT BUỘC PHẢI GIỮ NGUYÊN HAI DẤU CHẤM (ví dụ: 女 nǚ khác với 努力 nǔlì)."
  },
  {
    id: "q-rule-3",
    category: "Quy tắc viết Pinyin",
    title: "Vận mẫu 'u' đứng độc lập",
    question: "Khi nguyên âm 'u' đứng một mình (không ghép với phụ âm nào), cách viết Pinyin đúng là:",
    audioSample: "五",
    choices: [
      "u",
      "wu (thêm 'w' phía trước)",
      "yu",
      "ou"
    ],
    correctIndex: 1,
    explanation: "Quy tắc: Nếu trước vận mẫu 'u' không ghép với thanh mẫu, lúc viết phải thêm 'w' ở phía trước ➔ u biến thành 'wu' (ví dụ: 五 wǔ)."
  },
  {
    id: "q-rule-4",
    category: "Quy tắc viết Pinyin",
    title: "Nhóm vận mẫu bắt đầu bằng 'u' đứng độc lập",
    question: "Các vận mẫu 'ua, uo, uai, uan, uang' khi đứng độc lập (không có thanh mẫu) sẽ được viết như thế nào?",
    audioSample: "我",
    choices: [
      "Giữ nguyên là ua, uo, uai, uan",
      "Bỏ chữ 'u' ở phía trước, thay bằng 'w' ➔ wa, wo, wai, wan, wang",
      "Thay bằng 'y' ➔ ya, yo, yai, yan",
      "Thêm 'w' vào trước ➔ wua, wuo, wuai"
    ],
    correctIndex: 1,
    explanation: "Quy tắc: Các vận mẫu bắt đầu bằng 'u', nếu phía trước không ghép với thanh mẫu thì bỏ 'u' thay bằng 'w' (ví dụ: uo ➔ wo, uan ➔ wan)."
  },
  {
    id: "q-rule-5",
    category: "Quy tắc viết Pinyin",
    title: "Nhóm vận mẫu 'i, in, ing' đứng độc lập",
    question: "Khi các vận mẫu 'i, in, ing' đứng độc lập, lúc viết phải làm gì?",
    audioSample: "一",
    choices: [
      "Giữ nguyên i, in, ing",
      "Thêm 'y' ở phía trước ➔ yi, yin, ying",
      "Đổi thành wi, win, wing",
      "Đổi thành ji, jin, jing"
    ],
    correctIndex: 1,
    explanation: "Quy tắc: 'i, in, ing' nếu phía trước không có thanh mẫu thì lúc viết phải thêm 'y' ở trước: i ➔ yi (ví dụ: 一 yī), in ➔ yin, ing ➔ ying."
  },
  {
    id: "q-rule-6",
    category: "Quy tắc viết Pinyin",
    title: "Rút gọn vận mẫu 'iou'",
    question: "Vận mẫu 'iou' khi kết hợp với thanh mẫu (như q, n, j, l) sẽ được viết rút gọn thành gì?",
    audioSample: "六",
    choices: [
      "Giữ nguyên 'iou' (qiou, liou)",
      "Bỏ 'o' ở giữa, viết là 'iu' (qiū, niú, jiǔ, liù)",
      "Bỏ 'u', viết là 'io' (qio, lio)",
      "Đổi thành 'yu'"
    ],
    correctIndex: 1,
    explanation: "Quy tắc: Vận mẫu 'iou' khi có thanh mẫu phía trước thì lúc viết phải bỏ 'o' ở giữa, viết thành 'iu' (ví dụ: liù, jiǔ, qiū)."
  },
  {
    id: "q-rule-7",
    category: "Quy tắc viết Pinyin",
    title: "Rút gọn vận mẫu 'uei' và 'uen'",
    question: "Vận mẫu 'uei' và 'uen' khi ghép với thanh mẫu sẽ được viết thành dạng nào?",
    audioSample: "贵",
    choices: [
      "Giữ nguyên 'uei' và 'uen'",
      "Bỏ chữ 'e' ở giữa, viết thành 'ui' và 'un'",
      "Bỏ chữ 'u' ở đầu, viết thành 'ei' và 'en'",
      "Đổi thành 'wi' và 'wn'"
    ],
    correctIndex: 1,
    explanation: "Quy tắc: Các vận mẫu 'uei, uen' nếu phía trước ghép với thanh mẫu thì bỏ 'e' ở giữa ➔ viết thành 'ui' và 'un' (ví dụ: g + uei ➔ guì, d + uen ➔ dùn)."
  },
  {
    id: "q-rule-8",
    category: "Quy tắc đánh dấu thanh điệu",
    title: "Thứ tự ưu tiên đánh dấu thanh điệu",
    question: "Trong từ '好' (hǎo), vì sao dấu thanh 3 lại đánh trên chữ cái 'a' thay vì 'o'?",
    audioSample: "好",
    choices: [
      "Vì 'a' đứng trước 'o'",
      "Vì theo thứ tự ưu tiên nguyên âm: a ➔ o ➔ e ➔ i ➔ u ➔ ü, 'a' có độ mở miệng lớn nhất",
      "Do người viết tự chọn tùy ý",
      "Vì 'o' là phụ âm"
    ],
    correctIndex: 1,
    explanation: "Thứ tự ưu tiên chuẩn mực khi đánh thanh điệu: a ➔ o ➔ e ➔ i ➔ u ➔ ü. Cứ thấy 'a' là ưu tiên đánh dấu lên 'a' đầu tiên!"
  },
  {
    id: "q-rule-9",
    category: "Quy tắc đánh dấu thanh điệu",
    title: "Quy tắc đặc biệt cho cặp 'iu' và 'ui'",
    question: "Khi gặp hai nguyên âm 'iu' hoặc 'ui' đi liền nhau, dấu thanh điệu sẽ được đánh ở đâu?",
    audioSample: "水",
    choices: [
      "Luôn luôn đánh trên chữ 'i'",
      "Luôn luôn đánh trên chữ 'u'",
      "Đánh trên nguyên âm nằm phía sau ('iu' đánh trên 'u', 'ui' đánh trên 'i')",
      "Đánh vào khoảng trống giữa hai chữ"
    ],
    correctIndex: 2,
    explanation: "Quy tắc ngoại lệ kinh điển: 'iu' và 'ui' đi cùng nhau, nguyên âm nào đứng phía sau thì nguyên âm đó nhận dấu (ví dụ: liù đánh trên u, shuǐ đánh trên i)."
  },
  {
    id: "q-rule-10",
    category: "Quy tắc đánh dấu thanh điệu",
    title: "Thực hành đặt dấu từ '六' (liù)",
    question: "Dấu thanh 4 trong từ '六' (liù - số 6) nằm trên chữ cái nào?",
    audioSample: "六",
    choices: [
      "Chữ cái 'l'",
      "Chữ cái 'i'",
      "Chữ cái 'u' (vì trong 'iu' thì 'u' nằm phía sau)",
      "Cả hai chữ 'i' và 'u'"
    ],
    correctIndex: 2,
    explanation: "Trong 'iu', chữ 'u' đứng phía sau nên dấu thanh 4 đánh trực tiếp trên đầu chữ 'u' ➔ liù."
  },
  {
    id: "q-rule-11",
    category: "Quy tắc đọc & biến điệu",
    title: "Biến điệu hai thanh 3 đi liền nhau",
    question: "Khi nói câu '你好' (phiên âm: nǐ hǎo), thanh 3 thứ nhất sẽ phát âm thành thanh mấy?",
    audioSample: "你好",
    choices: [
      "Giữ nguyên thanh 3 (nǐ hǎo)",
      "Đổi thành thanh 2 (ní hǎo)",
      "Đổi thành thanh 1 (nī hǎo)",
      "Đổi thành thanh 4 (nì hǎo)"
    ],
    correctIndex: 1,
    explanation: "Quy tắc: Thanh 3 + Thanh 3 ➔ Thanh 2 + Thanh 3. Khi nói phải đọc là 'ní hǎo', dù chữ viết Pinyin vẫn ghi là 'nǐ hǎo'."
  },
  {
    id: "q-rule-12",
    category: "Quy tắc đọc & biến điệu",
    title: "Biến điệu của chữ '不' (bù)",
    question: "Chữ '不' (bù) khi đứng trước chữ '去' (qù - mang thanh 4) sẽ phát âm như thế nào?",
    audioSample: "不去",
    choices: [
      "bù qù (giữ nguyên thanh 4)",
      "bú qù (đổi thành thanh 2)",
      "bǔ qù (đổi thành thanh 3)",
      "bu qù (đọc thanh nhẹ)"
    ],
    correctIndex: 1,
    explanation: "Quy tắc chữ 不: bù + thanh 4 ➔ chuyển thành [bú] (ví dụ: 不去 bú qù, 不是 bú shì, 不要 bú yào, 不对 bú duì)."
  },
  {
    id: "q-rule-13",
    category: "Quy tắc đọc & biến điệu",
    title: "Chữ '不' (bù) trước thanh 1, 2, 3",
    question: "Trong cụm từ '不好' (hǎo mang thanh 3), chữ '不' sẽ phát âm là gì?",
    audioSample: "不好",
    choices: [
      "bù hǎo (giữ nguyên thanh 4)",
      "bú hǎo (đổi thanh 2)",
      "bǔ hǎo (đổi thanh 3)",
      "bū hǎo (đổi thanh 1)"
    ],
    correctIndex: 0,
    explanation: "Chữ '不' chỉ biến điệu thành 'bú' khi đứng trước thanh 4. Khi đứng trước thanh 1, 2, 3 nó vẫn đọc chuẩn là thanh 4 [bù] (ví dụ: bù zhī, bù xíng, bù hǎo)."
  },
  {
    id: "q-rule-14",
    category: "Quy tắc đọc & biến điệu",
    title: "Biến điệu của chữ '一' (yī) trước thanh 4",
    question: "Chữ '一' (yī) trong cụm từ '一个' (gè mang thanh 4) sẽ phát âm là:",
    audioSample: "一个",
    choices: [
      "yī gè (giữ thanh 1)",
      "yí gè (đổi thành thanh 2)",
      "yì gè (đổi thành thanh 4)",
      "yi gè (thanh nhẹ)"
    ],
    correctIndex: 1,
    explanation: "Quy tắc chữ 一: Khi đứng trước âm tiết mang thanh 4, 'yī' đổi thành thanh 2 ➔ [yí] (ví dụ: 一个 yí gè, 一样 yí yàng, 一定 yí dìng)."
  },
  {
    id: "q-rule-15",
    category: "Quy tắc đọc & biến điệu",
    title: "Biến điệu của chữ '一' (yī) trước thanh 1, 2, 3",
    question: "Chữ '一' (yī) trong cụm từ '一天' (tiān mang thanh 1) sẽ phát âm là:",
    audioSample: "一天",
    choices: [
      "yī tiān (giữ thanh 1)",
      "yì tiān (đổi thành thanh 4)",
      "yí tiān (đổi thành thanh 2)",
      "yǐ tiān (thanh 3)"
    ],
    correctIndex: 1,
    explanation: "Quy tắc chữ 一: Khi đứng trước âm tiết mang thanh 1, 2, 3, 'yī' đổi thành thanh 4 ➔ [yì] (ví dụ: 一天 yì tiān, 一年 yì nián, 一起 yì qǐ)."
  },
  {
    id: "q-rule-16",
    category: "Quy tắc đọc & biến điệu",
    title: "Nhận diện Thanh Nhẹ (Khinh Thanh)",
    question: "Từ nào dưới đây có chứa âm tiết đọc ở dạng 'Thanh nhẹ' (rất ngắn và không mang dấu)?",
    audioSample: "哥哥",
    choices: [
      "Hànyǔ (汉语)",
      "gēge (哥哥 - chữ ge thứ hai đọc nhẹ)",
      "Běijīng (北京)",
      "Zhōngguó (中国)"
    ],
    correctIndex: 1,
    explanation: "Trong các danh từ xưng hô gia đình lặp lại (gēge, māma, bàba, mèimei), từ thứ hai luôn đọc thành thanh nhẹ, không đánh dấu và phát âm ngắn nhẹ."
  }
];
