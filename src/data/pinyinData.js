// Dữ liệu bảng phát âm Pinyin, Thanh điệu và ĐẦY ĐỦ các Quy tắc đọc - viết theo giáo trình Tiết 2
export const PINYIN_DATA = {
  tones: [
    {
      tone: 1,
      name: "Thanh 1 (Âm Bình)",
      symbol: "¯ (mā)",
      pitch: "5 - 5 (Cao & Phẳng)",
      color: "#3b82f6",
      desc: "Giữ giọng cao đều, bằng phẳng, kéo dài khoảng 1 giây. Giống như nốt Sol cao ngân dài.",
      example: "mā (妈 - Mẹ)",
      audioSample: "妈"
    },
    {
      tone: 2,
      name: "Thanh 2 (Dương Bình)",
      symbol: "´ (má)",
      pitch: "3 - 5 (Đi lên cao)",
      color: "#10b981",
      desc: "Bắt đầu ở cao độ trung bình rồi vút lên cao. Gần giống dấu sắc trong tiếng Việt nhưng mượt mà hơn.",
      example: "má (麻 - Gai, tê)",
      audioSample: "麻"
    },
    {
      tone: 3,
      name: "Thanh 3 (Thượng Thanh)",
      symbol: "ˇ (mǎ)",
      pitch: "2 - 1 - 4 (Xuống sâu rồi lên)",
      color: "#f59e0b",
      desc: "Hạ giọng xuống thật trầm rồi hơi nâng nhẹ lên. Tương tự như dấu hỏi nhưng kéo dài và sâu hơn.",
      example: "mǎ (马 - Ngựa)",
      audioSample: "马"
    },
    {
      tone: 4,
      name: "Thanh 4 (Khứ Thanh)",
      symbol: "` (mà)",
      pitch: "5 - 1 (Hạ nhanh, dứt khoát)",
      color: "#ef4444",
      desc: "Hạ giọng từ cao nhất xuống thấp nhất một cách bất ngờ, dứt khoát, không kéo dài. Tương tự như đang ra lệnh hoặc chém xuống.",
      example: "mà (骂 - Mắng)",
      audioSample: "骂"
    },
    {
      tone: 0,
      name: "Thanh Nhẹ (Khinh Thanh)",
      symbol: "· (ma)",
      pitch: "Nhẹ & Ngắn",
      color: "#8b5cf6",
      desc: "Đọc thật nhẹ và ngắn, phụ thuộc vào âm đứng trước nó. Không đánh dấu thanh điệu.",
      example: "māma (妈妈 - Mẹ)",
      audioSample: "妈妈"
    }
  ],

  // --- HỆ THỐNG TOÀN DIỆN CÁC QUY TẮC ĐỌC & VIẾT TỪ GIÁO TRÌNH TIẾT 2 ---
  ruleCategories: [
    {
      id: "writing-rules",
      title: "I. Quy Tắc Viết Pinyin (8 Quy Tắc Trọng Tâm)",
      badge: "Quy Tắc Viết",
      desc: "Cách biến đổi nguyên âm, dấu chấm trên ü, và cách xử lý khi không có thanh mẫu",
      rules: [
        {
          id: "w-rule-1",
          number: "1",
          title: "Vận mẫu ü, üe, üan, ün khi ghép với j, q, x",
          formula: "j, q, x + (ü, üe, üan, ün) ➔ BỎ 2 DẤU CHẤM TRÊN ü (viết là u)",
          explanation: "Khi các vận mẫu có chứa 'ü' ghép với 3 thanh mẫu mặt lưỡi 'j, q, x', lúc viết bắt buộc phải bỏ hai dấu chấm trên chữ 'ü', nhưng khi đọc vẫn giữ nguyên khẩu hình tròn môi của 'ü'.",
          examples: [
            { text: "j + ü ➔ ju", pinyin: "jū (居)", audio: "居", vi: "ở, cư trú" },
            { text: "q + üe ➔ que", pinyin: "quē (缺)", audio: "缺", vi: "thiếu" },
            { text: "x + üan ➔ xuan", pinyin: "xuān (宣)", audio: "宣", vi: "tuyên truyền" },
            { text: "x + ün ➔ xun", pinyin: "xùn (训)", audio: "训", vi: "huấn luyện" }
          ],
          note: "Ghi nhớ: ju, qu, xu, jue, que, xue, juan, quan, xuan, jun, qun, xun tuy viết là 'u' nhưng bản chất phát âm 100% là âm 'ü' tròn môi!"
        },
        {
          id: "w-rule-2",
          number: "2",
          title: "Vận mẫu ü, üe khi ghép với thanh mẫu l, n",
          formula: "l, n + (ü, üe) ➔ BẮT BUỘC GIỮ NGUYÊN 2 DẤU CHẤM",
          explanation: "Vì trong tiếng Trung 'l' và 'n' có thể đi với cả 'u' thường (lu, nu) lẫn 'ü' (lü, nü), nên để phân biệt bắt buộc phải giữ nguyên hai dấu chấm trên đầu 'ü'.",
          examples: [
            { text: "n + ü ➔ nü", pinyin: "nǚ (女)", audio: "女", vi: "phụ nữ (khác với nǔ - 努力 nỗ lực)" },
            { text: "l + ü ➔ lü", pinyin: "lǜ (绿)", audio: "绿", vi: "màu xanh lá (khác với lù - 路 con đường)" },
            { text: "l + üe ➔ lüe", pinyin: "lüè (略)", audio: "略", vi: "sơ lược" },
            { text: "n + üe ➔ nüe", pinyin: "nüè (虐)", audio: "虐", vi: "ngược đãi" }
          ],
          note: "So sánh phân biệt: nǔ (nỗ lực) ≠ nǚ (nữ); lù (đường) ≠ lǜ (xanh lục)."
        },
        {
          id: "w-rule-3",
          number: "3",
          title: "Vận mẫu 'u' đứng độc lập (không có thanh mẫu)",
          formula: "u (đứng một mình) ➔ THÊM 'w' PHÍA TRƯỚC ➔ wu",
          explanation: "Khi âm tiết chỉ có một mình nguyên âm 'u', trong văn bản Pinyin không được viết một chữ 'u' đơn độc mà phải thêm phụ âm 'w' phía trước.",
          examples: [
            { text: "u ➔ wu", pinyin: "wǔ (五)", audio: "五", vi: "Số 5" },
            { text: "u ➔ wù", pinyin: "wù (雾)", audio: "雾", vi: "Sương mù" }
          ],
          note: "Phát âm vẫn giữ nguyên là âm 'u'."
        },
        {
          id: "w-rule-4",
          number: "4",
          title: "Các vận mẫu bắt đầu bằng 'u' đứng độc lập (ua, uo, uai, uei, uan, uen, uang, ueng)",
          formula: "ua, uo, uai, uei, uan, uen, uang, ueng ➔ BỎ 'u', THAY BẰNG 'w'",
          explanation: "Nếu phía trước không có thanh mẫu, toàn bộ chữ 'u' đứng đầu sẽ biến thành chữ 'w'.",
          examples: [
            { text: "ua ➔ wa", pinyin: "wá (娃)", audio: "娃", vi: "Em bé" },
            { text: "uo ➔ wo", pinyin: "wǒ (我)", audio: "我", vi: "Tôi" },
            { text: "uai ➔ wai", pinyin: "wài (外)", audio: "外", vi: "Bên ngoài" },
            { text: "uei ➔ wei", pinyin: "wèi (为)", audio: "为", vi: "Vì, để" },
            { text: "uan ➔ wan", pinyin: "wán (玩)", audio: "玩", vi: "Chơi" },
            { text: "uen ➔ wen", pinyin: "wén (文)", audio: "文", vi: "Văn hóa" },
            { text: "uang ➔ wang", pinyin: "wàng (忘)", audio: "忘", vi: "Quên" },
            { text: "ueng ➔ weng", pinyin: "wēng (翁)", audio: "翁", vi: "Ông lão" }
          ],
          note: "Đặc biệt chú ý: 'uei' đổi thành 'wei' (chứ không phải we), 'uen' đổi thành 'wen'."
        },
        {
          id: "w-rule-5",
          number: "5",
          title: "Các vận mẫu 'i, in, ing' khi đứng độc lập",
          formula: "i, in, ing (đứng một mình) ➔ THÊM 'y' PHÍA TRƯỚC ➔ yi, yin, ying",
          explanation: "Khi không có thanh mẫu đứng trước, các vận mẫu này không thể đứng một mình mà phải thêm phụ âm 'y' ở đằng trước.",
          examples: [
            { text: "i ➔ yi", pinyin: "yī (一)", audio: "一", vi: "Số 1" },
            { text: "in ➔ yin", pinyin: "yīn (音)", audio: "音", vi: "Âm thanh" },
            { text: "ing ➔ ying", pinyin: "yīng (英)", audio: "英", vi: "Anh hùng / Tiếng Anh" }
          ],
          note: "Phát âm không thay đổi, chỉ thêm con chữ 'y' về mặt chính tả."
        },
        {
          id: "w-rule-6",
          number: "6",
          title: "Các vận mẫu bắt đầu bằng 'i' đứng độc lập (ia, ie, iao, iou, ian, iang, iong)",
          formula: "ia, ie, iao, iou, ian, iang, iong ➔ BỎ 'i', THAY BẰNG 'y'",
          explanation: "Khi không có phụ âm đứng trước, chữ 'i' đứng đầu sẽ được thay thế trực tiếp bằng chữ 'y'.",
          examples: [
            { text: "ia ➔ ya", pinyin: "yā (鸭)", audio: "鸭", vi: "Con vịt" },
            { text: "ie ➔ ye", pinyin: "yě (也)", audio: "也", vi: "Cũng" },
            { text: "iao ➔ yao", pinyin: "yào (要)", audio: "要", vi: "Muốn, cần" },
            { text: "iou ➔ you", pinyin: "yǒu (有)", audio: "有", vi: "Có" },
            { text: "ian ➔ yan", pinyin: "yán (言)", audio: "言", vi: "Lời nói" },
            { text: "iang ➔ yang", pinyin: "yáng (羊)", audio: "羊", vi: "Con cừu, dê" },
            { text: "iong ➔ yong", pinyin: "yòng (用)", audio: "用", vi: "Sử dụng" }
          ],
          note: "Lưu ý chữ 'iou' khi đứng độc lập biến đổi thành 'you'."
        },
        {
          id: "w-rule-7",
          number: "7",
          title: "Vận mẫu 'iou' khi ghép với thanh mẫu ➔ RÚT GỌN THÀNH 'iu'",
          formula: "Thanh mẫu + iou ➔ BỎ 'o' Ở GIỮA ➔ Viết thành 'iu'",
          explanation: "Khi có phụ âm đi kèm, để viết nhanh và gọn, chữ 'o' ở giữa bị lược bỏ trong văn bản viết, nhưng phát âm lướt vẫn có âm 'o'.",
          examples: [
            { text: "q + iou ➔ qiu", pinyin: "qiū (秋)", audio: "秋", vi: "Mùa thu" },
            { text: "n + iou ➔ niu", pinyin: "niú (牛)", audio: "牛", vi: "Con bò" },
            { text: "j + iou ➔ jiu", pinyin: "jiǔ (九)", audio: "九", vi: "Số 9" },
            { text: "l + iou ➔ liu", pinyin: "liù (六)", audio: "六", vi: "Số 6" }
          ],
          note: "Không bao giờ được viết là qiou, niou, jiou, liou!"
        },
        {
          id: "w-rule-8",
          number: "8",
          title: "Vận mẫu 'uei', 'uen' khi ghép với thanh mẫu ➔ RÚT GỌN THÀNH 'ui', 'un'",
          formula: "Thanh mẫu + uei ➔ BỎ 'e' ➔ 'ui'  |  Thanh mẫu + uen ➔ BỎ 'e' ➔ 'un'",
          explanation: "Chữ 'e' ở giữa được lược bỏ đi khi có thanh mẫu đứng trước.",
          examples: [
            { text: "r + uei ➔ rui", pinyin: "ruì (瑞)", audio: "瑞", vi: "Tốt lành, Thụy Điển" },
            { text: "l + uen ➔ lun", pinyin: "lún (轮)", audio: "轮", vi: "Bánh xe" },
            { text: "d + uen ➔ dun", pinyin: "dùn (顿)", audio: "顿", vi: "Bữa ăn" },
            { text: "g + uei ➔ gui", pinyin: "guì (贵)", audio: "贵", vi: "Đắt, quý báu" }
          ],
          note: "Khi nhìn thấy 'ui', 'un' hãy nhớ nguyên gốc của nó là 'uei', 'uen' để phát âm tròn đầy."
        }
      ]
    },

    {
      id: "tone-marking-rules",
      title: "II. Quy Tắc Đánh Dấu Thanh Điệu (Chính Tả Pinyin)",
      badge: "Vị Trí Đặt Dấu",
      desc: "Quy tắc xác định nguyên âm nào được đội dấu thanh điệu trong một âm tiết",
      rules: [
        {
          id: "tm-rule-1",
          number: "1",
          title: "Âm tiết chỉ có 1 nguyên âm đơn",
          formula: "ĐÁNH DẤU TRỰC TIẾP VÀO NGUYÊN ÂM ĐÓ",
          explanation: "Nếu âm tiết chỉ chứa duy nhất một nguyên âm (a, o, e, i, u, ü), dấu thanh điệu đánh ngay trên đầu nó.",
          examples: [
            { text: "b + a ➔ bā", pinyin: "bā (八)", audio: "八", vi: "Số 8" },
            { text: "p + o ➔ pó", pinyin: "pó (婆)", audio: "婆", vi: "Bà ngoại" },
            { text: "h + e ➔ hē", pinyin: "hē (喝)", audio: "喝", vi: "Uống" },
            { text: "m + i ➔ mǐ", pinyin: "mǐ (米)", audio: "米", vi: "Gạo" }
          ],
          note: "Lưu ý: Khi đánh dấu lên chữ 'i', dấu chấm tròn trên đầu chữ 'i' sẽ bị bỏ đi (thay bằng dấu thanh: ī, í, ǐ, ì)."
        },
        {
          id: "tm-rule-2",
          number: "2",
          title: "Vận mẫu kép: Thứ tự ưu tiên theo độ mở miệng",
          formula: "ƯU TIÊN THEO THỨ TỰ: a ➔ o ➔ e ➔ i ➔ u ➔ ü",
          explanation: "Trong một âm tiết có nhiều nguyên âm, hãy tìm theo thứ tự: Có 'a' thì đánh lên 'a'. Không có 'a' thì tìm 'o', rồi đến 'e', 'i', 'u', 'ü'.",
          examples: [
            { text: "hǎo (h + ao)", pinyin: "hǎo (好)", audio: "好", vi: "Có 'a' nên đánh trên a" },
            { text: "xiè (x + ie)", pinyin: "xiè (谢)", audio: "谢", vi: "Có 'e' nên đánh trên e" },
            { text: "gōu (g + ou)", pinyin: "gōu (钩)", audio: "钩", vi: "Có 'o' nên đánh trên o" },
            { text: "bái (b + ai)", pinyin: "bái (白)", audio: "白", vi: "Có 'a' nên đánh trên a" }
          ],
          note: "Mẹo nhớ thần chú: 'Thấy a đánh a, không a tìm o e; i u đi liền nhau, dấu nằm ở đuôi'."
        },
        {
          id: "tm-rule-3",
          number: "3",
          title: "Ngoại lệ đặc biệt: Cặp 'iu' và 'ui'",
          formula: "GẶP 'iu' HOẶC 'ui' ➔ ĐÁNH DẤU LÊN NGUYÊN ÂM NẰM PHÍA SAU",
          explanation: "Khi 'i' và 'u' đi liền nhau, dấu thanh điệu luôn luôn đánh trên chữ đứng sau (iu đánh trên u, ui đánh trên i).",
          examples: [
            { text: "liù (l + iu)", pinyin: "liù (六)", audio: "六", vi: "'iu' đứng sau là u ➔ đánh trên u" },
            { text: "shuǐ (sh + ui)", pinyin: "shuǐ (水)", audio: "水", vi: "'ui' đứng sau là i ➔ đánh trên i" },
            { text: "guì (g + ui)", pinyin: "guì (贵)", audio: "贵", vi: "'ui' đứng sau là i ➔ đánh trên i" },
            { text: "jiǔ (j + iu)", pinyin: "jiǔ (九)", audio: "九", vi: "'iu' đứng sau là u ➔ đánh trên u" }
          ],
          note: "Quy tắc bỏ túi cực dễ: 'i và u đứng cạnh, đứa nào đứng sau đứa đó đội mũ!'"
        }
      ]
    },

    {
      id: "pronunciation-tone-rules",
      title: "III. Quy Tắc Đọc Pinyin & Biến Điệu (Ngữ Điệu Tự Nhiên)",
      badge: "Quy Tắc Đọc",
      desc: "Các biến điệu thực tế khi nói tiếng Trung để giữ âm điệu mượt mà, không vấp giọng",
      rules: [
        {
          id: "pr-rule-1",
          number: "1",
          title: "Biến điệu khi có 2 thanh 3 đi liền nhau",
          formula: "Thanh 3 + Thanh 3 ➔ Thanh 2 + Thanh 3",
          explanation: "Khi hai âm tiết mang thanh 3 đứng cạnh nhau, âm tiết thứ nhất bắt buộc chuyển sang đọc thành thanh 2 (dấu sắc).",
          examples: [
            { text: "nǐ hǎo ➔ ní hǎo", pinyin: "nǐ hǎo (你好)", audio: "你好", vi: "Xin chào" },
            { text: "kěyǐ ➔ kéyǐ", pinyin: "kěyǐ (可以)", audio: "可以", vi: "Có thể" },
            { text: "shǒubiǎo ➔ shóubiǎo", pinyin: "shǒubiǎo (手表)", audio: "手表", vi: "Đồng hồ đeo tay" },
            { text: "yǔsǎn ➔ yúsǎn", pinyin: "yǔsǎn (雨伞)", audio: "雨伞", vi: "Cái ô (dù)" }
          ],
          note: "Lưu ý quan trọng: Khi viết chữ Pinyin vẫn viết đúng nguyên bản thanh 3 (nǐ hǎo), nhưng khi mở miệng nói PHẢI tự động phát âm thành ní hǎo."
        },
        {
          id: "pr-rule-2",
          number: "2",
          title: "Biến điệu khi có 3 thanh 3 trở lên",
          formula: "ĐỔI THANH ĐIỆU THEO CỤM NGHĨA HOẶC XEN KẼ (Đảm bảo số thanh biến đổi ít hơn số không đổi)",
          explanation: "Khi có 3 thanh 3 đi liền nhau, ta chia theo kết cấu ngữ nghĩa của từ: thường là 2 + 3 + 3 (đổi âm 1 thành thanh 2) hoặc 3 + 2 + 3 (đổi âm giữa thành thanh 2).",
          examples: [
            { text: "Wǒ hěn hǎo ➔ Wǒ hén hǎo", pinyin: "Wǒ hěn hǎo (我很好)", audio: "我很好", vi: "Tôi rất khỏe (ngắt: 我 / 很好 ➔ Wǒ hén hǎo)" },
            { text: "Wǒ mǎi yǔsǎn ➔ Wǒ mái yǔsǎn", pinyin: "Wǒ mǎi yǔsǎn (我买雨伞)", audio: "我买雨伞", vi: "Tôi mua cái ô (ngắt: 我买 / 雨伞 ➔ Wó mǎi yúsǎn hoặc Wǒ mái yǔsǎn)" }
          ],
          note: "Cách thông dụng nhất trong giao tiếp là nhóm theo từ ghép có nghĩa rồi áp dụng quy tắc 2 thanh 3 cho từ ghép đó."
        },
        {
          id: "pr-rule-3",
          number: "3",
          title: "Quy tắc biến điệu của chữ '一' (yī)",
          formula: "Đếm số: [yī]  |  Trước thanh 1,2,3: ➔ [yì]  |  Trước thanh 4: ➔ [yí]",
          explanation: "Chữ 一 có 3 cách đọc tùy theo ngữ cảnh và âm tiết đi ngay sau nó:",
          examples: [
            { text: "Số đếm đứng một mình ➔ yī", pinyin: "yī, èr, sān (一, 二, 三)", audio: "一二三", vi: "Đọc chuẩn thanh 1 [yī]" },
            { text: "yī + thanh 1 ➔ yì tiān", pinyin: "yī tiān (一天)", audio: "一天", vi: "Một ngày (đọc là yì tiān)" },
            { text: "yī + thanh 2 ➔ yì nián", pinyin: "yī nián (一年)", audio: "一年", vi: "Một năm (đọc là yì nián)" },
            { text: "yī + thanh 3 ➔ yì qǐ", pinyin: "yī qǐ (一起)", audio: "一起", vi: "Cùng nhau (đọc là yì qǐ)" },
            { text: "yī + thanh 4 ➔ yí gè", pinyin: "yī gè (一个)", audio: "一个", vi: "Một cái (đổi thành thanh 2 yí gè)" },
            { text: "yī + thanh 4 ➔ yí yàng", pinyin: "yī yàng (一样)", audio: "一样", vi: "Giống nhau (đổi thành yí yàng)" },
            { text: "yī + thanh 4 ➔ yí dìng", pinyin: "yī dìng (一定)", audio: "一定", vi: "Nhất định (đổi thành yí dìng)" }
          ],
          note: "Khi đọc số thứ tự (ví dụ: 第一 dì-yī), số nhà, số điện thoại thì vẫn giữ nguyên âm thanh 1 là [yī]."
        },
        {
          id: "pr-rule-4",
          number: "4",
          title: "Quy tắc biến điệu của chữ '不' (bù)",
          formula: "Trước thanh 1, 2, 3: Giữ nguyên [bù]  |  Trước thanh 4: Đổi thành [bú]",
          explanation: "Chữ '不' nguyên gốc mang thanh 4 (bù). Khi đứng trước một âm tiết cũng mang thanh 4, nó bắt buộc phải chuyển thành thanh 2 (bú) để tránh việc hạ giọng liên tục hai lần gây gắt tai.",
          examples: [
            { text: "bù + thanh 1 ➔ bù zhī", pinyin: "bù zhī (不知)", audio: "不知", vi: "Không biết (giữ nguyên bù)" },
            { text: "bù + thanh 2 ➔ bù xíng", pinyin: "bù xíng (不行)", audio: "不行", vi: "Không được (giữ nguyên bù)" },
            { text: "bù + thanh 3 ➔ bù hǎo", pinyin: "bù hǎo (不好)", audio: "不好", vi: "Không tốt (giữ nguyên bù)" },
            { text: "bù + thanh 4 ➔ bú biàn", pinyin: "bù biàn (不变)", audio: "不变", vi: "Không đổi (đọc thành bú biàn)" },
            { text: "bù + thanh 4 ➔ bú qù", pinyin: "bù qù (不去)", audio: "不去", vi: "Không đi (đọc thành bú qù)" },
            { text: "bù + thanh 4 ➔ bú shì", pinyin: "bù shì (不是)", audio: "不是", vi: "Không phải (đọc thành bú shì)" },
            { text: "bù + thanh 4 ➔ bú duì", pinyin: "bù duì (不对)", audio: "不对", vi: "Không đúng (đọc thành bú duì)" }
          ],
          note: "Chỉ khi đứng trước thanh 4 thì mới đổi thành 'bú'!"
        },
        {
          id: "pr-rule-5",
          number: "5",
          title: "Thanh nhẹ (Khinh thanh) trong khẩu ngữ",
          formula: "Âm tiết được đọc RẤT NGẮN, NHẸ và KHÔNG MANG DẤU",
          explanation: "Một số âm tiết trong tiếng Trung khi đứng sau các từ khác được lược bỏ thanh điệu ban đầu, đọc lướt nhanh và êm dịu.",
          examples: [
            { text: "rènshi (thanh nhẹ)", pinyin: "rènshi (认识)", audio: "认识", vi: "Quen biết (shi đọc nhẹ)" },
            { text: "gēge (thanh nhẹ)", pinyin: "gēge (哥哥)", audio: "哥哥", vi: "Anh trai (chữ ge thứ hai đọc nhẹ)" },
            { text: "xiānsheng (thanh nhẹ)", pinyin: "xiānsheng (先生)", audio: "先生", vi: "Tiên sinh, quý ông" },
            { text: "xiūxi (thanh nhẹ)", pinyin: "xiūxi (休息)", audio: "休息", vi: "Nghỉ ngơi" }
          ],
          note: "Thanh nhẹ thường gặp ở: từ lặp lại (māma, bàba, gēge), trợ từ ngữ khí (ma, ne, ba, le), hoặc các danh từ quen thuộc."
        }
      ]
    }
  ],

  // 21 Thanh mẫu
  initials: [
    {
      category: "Âm môi (Phát âm bằng hai môi / môi - răng)",
      items: [
        { char: "b", pinyin: "b", ipa: "[p]", tip: "Đọc như chữ 'p' trong tiếng Việt (không bật hơi).", sampleWord: "爸爸", samplePinyin: "bàba", sampleMeaning: "Bố" },
        { char: "p", pinyin: "p", ipa: "[pʰ]", tip: "Bật hơi thật mạnh! Đặt mẩu giấy trước miệng, phát âm giấy phải bay.", sampleWord: "朋友", samplePinyin: "péngyou", sampleMeaning: "Bạn bè" },
        { char: "m", pinyin: "m", ipa: "[m]", tip: "Đọc như chữ 'm' tiếng Việt.", sampleWord: "妈妈", samplePinyin: "māma", sampleMeaning: "Mẹ" },
        { char: "f", pinyin: "f", ipa: "[f]", tip: "Đọc như chữ 'ph' tiếng Việt (răng trên chạm môi dưới).", sampleWord: "飞机", samplePinyin: "fēijī", sampleMeaning: "Máy bay" }
      ]
    },
    {
      category: "Âm đầu lưỡi (Đầu lưỡi chạm chân răng trên)",
      items: [
        { char: "d", pinyin: "d", ipa: "[t]", tip: "Đọc như chữ 't' trong tiếng Việt (không bật hơi).", sampleWord: "大", samplePinyin: "dà", sampleMeaning: "Lớn, to" },
        { char: "t", pinyin: "t", ipa: "[tʰ]", tip: "Bật hơi mạnh! Đọc như chữ 'th' tiếng Việt nhưng có luồng hơi mạnh.", sampleWord: "天气", samplePinyin: "tiānqì", sampleMeaning: "Thời tiết" },
        { char: "n", pinyin: "n", ipa: "[n]", tip: "Đọc như chữ 'n' tiếng Việt.", sampleWord: "你", samplePinyin: "nǐ", sampleMeaning: "Bạn, anh, chị" },
        { char: "l", pinyin: "l", ipa: "[l]", tip: "Đọc như chữ 'l' tiếng Việt.", sampleWord: "老师", samplePinyin: "lǎoshī", sampleMeaning: "Thầy cô giáo" }
      ]
    },
    {
      category: "Âm cuống lưỡi (Gốc lưỡi nâng lên chạm vòm mềm)",
      items: [
        { char: "g", pinyin: "g", ipa: "[k]", tip: "Đọc như chữ 'c/k' tiếng Việt (không bật hơi).", sampleWord: "高兴", samplePinyin: "gāoxìng", sampleMeaning: "Vui vẻ" },
        { char: "k", pinyin: "k", ipa: "[kʰ]", tip: "Bật hơi mạnh từ cổ họng! Đọc như chữ 'kh' nhưng có hơi nổ.", sampleWord: "看", samplePinyin: "kàn", sampleMeaning: "Xem, nhìn" },
        { char: "h", pinyin: "h", ipa: "[x]", tip: "Đọc nằm giữa 'h' và 'kh' tiếng Việt, hơi lướt nhẹ từ cổ.", sampleWord: "好", samplePinyin: "hǎo", sampleMeaning: "Tốt, đẹp" }
      ]
    },
    {
      category: "Âm mặt lưỡi (Mặt lưỡi áp sát ngạc cứng)",
      items: [
        { char: "j", pinyin: "j", ipa: "[tɕ]", tip: "Đọc như 'ch' trong tiếng Việt (không bật hơi, khóe miệng kéo ngang).", sampleWord: "家", samplePinyin: "jiā", sampleMeaning: "Gia đình, nhà" },
        { char: "q", pinyin: "q", ipa: "[tɕʰ]", tip: "Bật hơi thật mạnh! Miệng kéo ngang, đẩy luồng khí sắc bén ra ngoài.", sampleWord: "去", samplePinyin: "qù", sampleMeaning: "Đi" },
        { char: "x", pinyin: "x", ipa: "[ɕ]", tip: "Đọc như chữ 'x' tiếng Việt nhưng hai mép miệng kéo dài sang hai bên.", sampleWord: "想", samplePinyin: "xiǎng", sampleMeaning: "Nghĩ, muốn" }
      ]
    },
    {
      category: "Âm uốn lưỡi (Đầu lưỡi cong lên chạm vòm họng)",
      items: [
        { char: "zh", pinyin: "zh", ipa: "[tʂ]", tip: "Uốn cong lưỡi, đọc như 'tr' tiếng Việt (không bật hơi, âm dày).", sampleWord: "中国", samplePinyin: "zhōngguó", sampleMeaning: "Trung Quốc" },
        { char: "ch", pinyin: "ch", ipa: "[tʂʰ]", tip: "Uốn cong lưỡi và bật hơi thật mạnh! Âm rất đặc trưng.", sampleWord: "吃", samplePinyin: "chī", sampleMeaning: "Ăn" },
        { char: "sh", pinyin: "sh", ipa: "[ʂ]", tip: "Uốn cong lưỡi, đọc như 's' tiếng miền Nam (xát mạnh).", sampleWord: "书", samplePinyin: "shū", sampleMeaning: "Sách" },
        { char: "r", pinyin: "r", ipa: "[ʐ]", tip: "Uốn lưỡi, phát âm rung nhẹ như 'r' tiếng Việt pha lẫn 'j'.", sampleWord: "热", samplePinyin: "rè", sampleMeaning: "Nóng" }
      ]
    },
    {
      category: "Âm đầu lưỡi trước (Đầu lưỡi chạm mặt sau răng trên)",
      items: [
        { char: "z", pinyin: "z", ipa: "[ts]", tip: "Hai hàm răng khép hờ, đọc như 'tr/ch' phẳng lưỡi (không bật hơi).", sampleWord: "在", samplePinyin: "zài", sampleMeaning: "Ở, đang" },
        { char: "c", pinyin: "c", ipa: "[tsʰ]", tip: "Bật hơi mạnh qua kẽ hai hàm răng! Đẩy khí ra như tiếng xì hơi.", sampleWord: "菜", samplePinyin: "cài", sampleMeaning: "Món ăn, rau" },
        { char: "s", pinyin: "s", ipa: "[s]", tip: "Phát âm như chữ 'x' tiếng Việt nhẹ, đầu lưỡi thẳng sát răng.", sampleWord: "四", samplePinyin: "sì", sampleMeaning: "Số 4" }
      ]
    }
  ],

  // Vận mẫu
  finals: [
    {
      category: "Vận mẫu đơn (Nguyên âm đơn)",
      items: [
        { char: "a", pinyin: "a", tip: "Mở rộng miệng, đọc như 'a' tiếng Việt.", sample: "八 (bā)" },
        { char: "o", pinyin: "o", tip: "Tròn môi, đọc như 'ô' hoặc lai 'ua' sau âm môi.", sample: "波 (bō)" },
        { char: "e", pinyin: "e", tip: "Mở miệng vừa phải, đọc như 'ưa' tiếng Việt.", sample: "喝 (hē)" },
        { char: "i", pinyin: "i", tip: "Kéo ngang khóe môi, đọc như 'i' tiếng Việt.", sample: "米 (mǐ)" },
        { char: "u", pinyin: "u", tip: "Chu môi nhỏ tròn, đọc như 'u' tiếng Việt.", sample: "路 (lù)" },
        { char: "ü", pinyin: "ü", tip: "Phát âm 'i' nhưng giữ khẩu hình tròn môi của 'u' (không đổi khẩu hình).", sample: "绿 (lǜ)" }
      ]
    },
    {
      category: "Vận mẫu kép thông dụng",
      items: [
        { char: "ai", pinyin: "ai", tip: "Đọc như 'ai' tiếng Việt.", sample: "爱 (ài)" },
        { char: "ei", pinyin: "ei", tip: "Đọc như 'ây' tiếng Việt.", sample: "杯 (bēi)" },
        { char: "ao", pinyin: "ao", tip: "Đọc như 'ao' tiếng Việt.", sample: "高 (gāo)" },
        { char: "ou", pinyin: "ou", tip: "Đọc như 'âu' tiếng Việt.", sample: "狗 (gǒu)" },
        { char: "ia", pinyin: "ia", tip: "Đọc như 'ia' lướt nhanh.", sample: "家 (jiā)" },
        { char: "ie", pinyin: "ie", tip: "Đọc như 'iê' tiếng Việt.", sample: "谢 (xiè)" },
        { char: "ua", pinyin: "ua", tip: "Đọc như 'oa' tiếng Việt.", sample: "花 (huā)" },
        { char: "uo", pinyin: "uo", tip: "Đọc như 'ua / uô' tiếng Việt.", sample: "桌 (zhuō)" }
      ]
    },
    {
      category: "Vận mẫu mũi (Kết thúc bằng n hoặc ng)",
      items: [
        { char: "an", pinyin: "an", tip: "Đọc như 'an' tiếng Việt.", sample: "慢 (màn)" },
        { char: "en", pinyin: "en", tip: "Đọc như 'ơn / ân' tiếng Việt.", sample: "门 (mén)" },
        { char: "ang", pinyin: "ang", tip: "Đọc như 'ang' ngân vang trong họng.", sample: "忙 (máng)" },
        { char: "eng", pinyin: "eng", tip: "Đọc như 'âng' tiếng Việt.", sample: "冷 (lěng)" },
        { char: "ing", pinyin: "ing", tip: "Đọc như 'inh' tiếng Việt.", sample: "听 (tīng)" },
        { char: "ong", pinyin: "ong", tip: "Đọc như 'ung' tròn môi.", sample: "红 (hóng)" }
      ]
    }
  ]
};
