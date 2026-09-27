// SỔ TAY TOÀN DIỆN 48+ ĐIỂM NGỮ PHÁP CHUẨN HSK 3.0 (CẤP ĐỘ 1 VÀ TIẾP NỐI HSK 2 - 3)
export const GRAMMAR_DATA = [
  // =========================================================================
  // PHẦN I: TỪ LOẠI, ĐẠI TỪ, SỐ TỪ & LƯỢNG TỪ (12 Điểm)
  // =========================================================================
  {
    id: "g1-01",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "1. Đại từ nhân xưng & Kính ngữ '您' (nín)",
    formula: "我 (Tôi), 你 (Bạn), 您 (Ngài/Bác - kính ngữ), 他 (Anh ấy), 她 (Cô ấy), 它 (Nó) + 们 (Số nhiều)",
    explanation: "Đại từ nhân xưng chỉ người. Thêm hậu tố '们' (men) để tạo số nhiều (我们, 你们, 他们). Dùng '您' khi giao tiếp với người lớn tuổi, thầy cô, cấp trên để tỏ lòng tôn kính.",
    examples: [
      { zh: "老师，您好！", pinyin: "Lǎoshī, nín hǎo!", vi: "Em chào thầy ạ!" },
      { zh: "我们都是留学生。", pinyin: "Wǒmen dōu shì liúxuéshēng.", vi: "Chúng tôi đều là du học sinh." }
    ],
    tips: "Tuyệt đối không nói '您们' (nínmen). Khi xưng hô số nhiều với người lớn tuổi hoặc cử tọa, người Trung Quốc dùng '各位' (gèwèi) hoặc '大家' (dàjiā)."
  },
  {
    id: "g1-02",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "2. Đại từ chỉ định: 这 (zhè - đây) & 那 (nà - kia)",
    formula: "这 / 那 + (Lượng từ) + Danh từ  |  这儿/这里 (ở đây)  |  那儿/那里 (ở kia)",
    explanation: "'这' chỉ vật/người ở gần người nói; '那' chỉ vật/người ở xa người nói. Thêm '儿' hoặc '里' để chỉ nơi chốn.",
    examples: [
      { zh: "这是我的手机，那是他的。", pinyin: "Zhè shì wǒ de shǒujī, nà shì tā de.", vi: "Đây là điện thoại của tôi, kia là của anh ấy." },
      { zh: "请坐在这儿。", pinyin: "Qǐng zuò zài zhèr.", vi: "Xin mời ngồi ở đây." }
    ],
    tips: "Khi chỉ số nhiều, dùng '这些' (zhèxiē - những cái này) và '那些' (nàxiē - những cái kia)."
  },
  {
    id: "g1-03",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "3. Đại từ nghi vấn '什么' (shénme - cái gì / gì)",
    formula: "Động từ + 什么?  hoặc  什么 + Danh từ?",
    explanation: "Dùng để hỏi về đồ vật, sự việc hoặc tính chất của người/vật.",
    examples: [
      { zh: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", vi: "Bạn tên là gì?" },
      { zh: "你想吃什么？", pinyin: "Nǐ xiǎng chī shénme?", vi: "Bạn muốn ăn cái gì?" }
    ],
    tips: "Câu đã có '什么' thì CUỐI CÂU TUYỆT ĐỐI KHÔNG DÙNG '吗' nữa!"
  },
  {
    id: "g1-04",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "4. Đại từ nghi vấn '谁' (shéi / shuí - ai)",
    formula: "谁 + V / 是 + 谁?  |  谁的 + Danh từ (của ai?)",
    explanation: "Dùng để hỏi về người hoặc chủ sở hữu của đồ vật.",
    examples: [
      { zh: "他是谁？", pinyin: "Tā shì shéi?", vi: "Anh ấy là ai?" },
      { zh: "这是谁的书？", pinyin: "Zhè shì shéi de shū?", vi: "Đây là sách của ai?" }
    ],
    tips: "Cả hai cách phát âm 'shéi' (khẩu ngữ Bắc Kinh) và 'shuí' (văn bản) đều đúng chuẩn."
  },
  {
    id: "g1-05",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "5. Đại từ nghi vấn '哪' (nǎ) & '哪儿 / 哪里' (nǎr / nǎlǐ - ở đâu)",
    formula: "哪 + Lượng từ + Danh từ (nào)  |  S + 在 + 哪儿 / 哪里? (ở đâu)",
    explanation: "'哪' dùng để hỏi sự chọn lựa cụ thể; '哪儿 / 哪里' dùng để hỏi địa điểm, nơi chốn.",
    examples: [
      { zh: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", vi: "Bạn là người nước nào?" },
      { zh: "洗手间在哪儿？", pinyin: "Xǐshǒujiān zài nǎr?", vi: "Nhà vệ sinh ở đâu?" }
    ],
    tips: "Phân biệt chữ '那' (nà - kia, thanh 4) và chữ '哪' (nǎ - nào/đâu, thanh 3 có bộ khẩu 口 phía trước)."
  },
  {
    id: "g1-06",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "6. Phân biệt hỏi số lượng: '几' (jǐ - mấy) vs '多少' (duōshao - bao nhiêu)",
    formula: "几 + Lượng từ + N (số lượng < 10)  |  多少 + (Lượng từ) + N (số lượng > 10 hoặc hỏi giá)",
    explanation: "'几' bắt buộc phải có lượng từ đi kèm và dùng cho số lượng nhỏ dưới 10; '多少' có thể không cần lượng từ và dùng cho số lượng lớn hoặc giá tiền.",
    examples: [
      { zh: "你家有几口人？", pinyin: "Nǐ jiā yǒu jǐ kǒu rén?", vi: "Nhà bạn có mấy người?" },
      { zh: "这个手机多少钱？", pinyin: "Zhège shǒujī duōshao qián?", vi: "Chiếc điện thoại này bao nhiêu tiền?" }
    ],
    tips: "Hỏi tuổi trẻ con dưới 10 tuổi dùng '几岁', người lớn dùng '多大'."
  },
  {
    id: "g1-07",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "7. Đại từ nghi vấn '怎么' (zěnme - thế nào / làm sao)",
    formula: "怎么 + Động từ (Hỏi cách thức thực hiện hành động)",
    explanation: "Dùng để hỏi phương thức làm việc gì đó hoặc hỏi nguyên nhân tại sao.",
    examples: [
      { zh: "这个汉字怎么读？", pinyin: "Zhège hànzì zěnme dú?", vi: "Chữ Hán này đọc như thế nào?" },
      { zh: "你怎么没来？", pinyin: "Nǐ zěnme méi lái?", vi: "Sao bạn lại không đến?" }
    ],
    tips: "'怎么' đứng trước động từ (怎么走, 怎么写); khác với '怎么样' đứng cuối câu."
  },
  {
    id: "g1-08",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "8. Đại từ nghi vấn '怎么样' (zěnmeyàng - như thế nào)",
    formula: "Chủ ngữ / Sự vật + 怎么样?",
    explanation: "Dùng để hỏi về tính chất, tình trạng của sự việc hoặc dùng để hỏi ý kiến người nghe.",
    examples: [
      { zh: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?", vi: "Thời tiết hôm nay thế nào?" },
      { zh: "我们去喝咖啡，怎么样？", pinyin: "Wǒmen qù hē kāfēi, zěnmeyàng?", vi: "Chúng mình đi uống cà phê nhé, thấy sao?" }
    ],
    tips: "Thường đứng ở cuối phân câu hoặc cuối câu hoàn chỉnh."
  },
  {
    id: "g1-09",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "9. Phân biệt số từ '二' (èr) và '两' (liǎng) trong tiếng Trung",
    formula: "Đếm số, số thứ tự, số nhà: dùng 二 (èr)  |  Đứng trước lượng từ chỉ số lượng 2: dùng 两 (liǎng)",
    explanation: "Khi đọc số thứ tự (thứ hai), số đếm (một, hai, ba), số nhà, số điện thoại thì dùng '二'. Khi biểu thị số lượng có 2 cái gì đó đứng trước lượng từ bắt buộc dùng '两'.",
    examples: [
      { zh: "我有两个人。", pinyin: "Wǒ yǒu liǎng gè rén.", vi: "Tôi có hai người bạn (dùng 两, không dùng 二个人)." },
      { zh: "两点二十分。", pinyin: "Liǎng diǎn èrshí fēn.", vi: "2 giờ (两) 20 phút (二)." }
    ],
    tips: "Quy tắc vàng: Trước lượng từ (个, 本, 张, 杯...) số 2 luôn biến thành '两' (liǎng)!"
  },
  {
    id: "g1-10",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "10. Nguyên tắc biểu đạt Ngày Tháng Năm: TỪ LỚN ĐẾN BÉ",
    formula: "Năm (年) + Tháng (月) + Ngày (日/号) + Thứ (星期) + Buổi trong ngày",
    explanation: "Tư duy ngôn ngữ tiếng Trung luôn đi từ cái rộng lớn bao quát đến cái cụ thể nhỏ bé, ngược lại hoàn toàn so với tiếng Việt.",
    examples: [
      { zh: "2026年9月26日星期六上午", pinyin: "Èr líng èr liù nián jiǔ yuè èrshíliù rì xīngqīliù shàngwǔ", vi: "Sáng thứ Bảy ngày 26 tháng 9 năm 2026" }
    ],
    tips: "Khẩu ngữ thường dùng '号' (hào), văn bản trang trọng dùng '日' (rì)."
  },
  {
    id: "g1-11",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "11. Cách đọc Giờ Giấc chính xác",
    formula: "Giờ (点) + Phút (分)  |  Rưỡi: 点 + 半 (bàn)  |  Kém: 差 (chà) + Phút + 点",
    explanation: "Cách nói giờ tương tự tiếng Việt nhưng lưu ý đặt buổi trong ngày (sáng, trưa, tối) lên trước giờ.",
    examples: [
      { zh: "早上八点半。", pinyin: "Zǎoshang bā diǎn bàn.", vi: "8 giờ rưỡi sáng." },
      { zh: "差五分十点。", pinyin: "Chà wǔ fēn shí diǎn.", vi: "10 giờ kém 5 phút." }
    ],
    tips: "2 giờ nói là '两点' (liǎng diǎn), KHÔNG NÓI '二点'."
  },
  {
    id: "g1-12",
    level: 1,
    category: "1. Từ Loại & Lượng Từ",
    title: "12. Cấu trúc Số từ + Lượng từ + Danh từ cốt lõi",
    formula: "Số từ + Lượng từ thích hợp + Danh từ",
    explanation: "Trong tiếng Trung, giữa số đếm và danh từ bắt buộc phải có một lượng từ.",
    examples: [
      { zh: "一个人 (yí gè rén)", pinyin: "yí gè rén", vi: "Một người (lượng từ 个)" },
      { zh: "三本书 (sān běn shū)", pinyin: "sān běn shū", vi: "Ba quyển sách (lượng từ 本)" },
      { zh: "一张桌子 (yì zhāng zhuōzi)", pinyin: "yì zhāng zhuōzi", vi: "Một cái bàn (lượng từ 张)" },
      { zh: "两件衣服 (liǎng jiàn yīfu)", pinyin: "liǎng jiàn yīfu", vi: "Hai bộ quần áo (lượng từ 件)" }
    ],
    tips: "Khi không biết dùng lượng từ nào, có thể tạm thời dùng lượng từ vạn năng '个' (gè)."
  },

  // =========================================================================
  // PHẦN II: ĐỘNG TỪ & ĐỘNG TỪ NĂNG NGUYỆN (10 Điểm)
  // =========================================================================
  {
    id: "g1-13",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "13. Câu chữ '是' (shì - là) phán đoán danh tính",
    formula: "Chủ ngữ (S) + 是 + Danh từ (O)  |  Phủ định: S + 不是 + N",
    explanation: "Dùng để khẳng định tính chất, danh tính, quốc tịch hoặc nghề nghiệp.",
    examples: [
      { zh: "我是越南人。", pinyin: "Wǒ shì Yuènán rén.", vi: "Tôi là người Việt Nam." },
      { zh: "他不是老师。", pinyin: "Tā bú shì lǎoshī.", vi: "Anh ấy không phải giáo viên." }
    ],
    tips: "Trước tính từ KHÔNG dùng '是'. Người Việt hay nói 'Tôi là vui', trong tiếng Trung phải nói '我很开心' (bỏ 是)."
  },
  {
    id: "g1-14",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "14. Động từ sở hữu & tồn tại: '有' (yǒu - có)",
    formula: "Chủ ngữ + 有 + Danh từ  |  Phủ định: 主语 + 没有 + 名词",
    explanation: "Biểu thị sự sở hữu hoặc tồn tại của người/vật.",
    examples: [
      { zh: "我有汉语书。", pinyin: "Wǒ yǒu Hànyǔ shū.", vi: "Tôi có sách tiếng Trung." },
      { zh: "他没有电脑。", pinyin: "Tā méiyǒu diànnǎo.", vi: "Anh ấy không có máy tính." }
    ],
    tips: "Tuyệt đối KHÔNG dùng '不有'. Phủ định của '有' luôn là '没有' (méiyǒu)!"
  },
  {
    id: "g1-15",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "15. Động từ chỉ vị trí: '在' (zài - ở, tại)",
    formula: "Chủ ngữ + 在 + Nơi chốn / Địa điểm",
    explanation: "Dùng như một động từ chính biểu thị người hoặc vật đang ở địa điểm nào.",
    examples: [
      { zh: "我妈妈在家。", pinyin: "Wǒ māma zài jiā.", vi: "Mẹ tôi đang ở nhà." },
      { zh: "猫在桌子下面。", pinyin: "Māo zài zhuōzi xiàmiàn.", vi: "Con mèo ở dưới gầm bàn." }
    ],
    tips: "Phân biệt '在' làm động từ (ở đâu) và '在' làm giới từ (làm gì ở đâu)."
  },
  {
    id: "g1-16",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "16. Động từ phương hướng: '去' (qù - đi) & '来' (lái - đến)",
    formula: "去 / 来 + Địa điểm  hoặc  去 / 来 + Địa điểm + Làm gì",
    explanation: "'去' biểu thị hướng đi ra xa người nói; '来' biểu thị hướng di chuyển lại gần người nói.",
    examples: [
      { zh: "我去学校看书。", pinyin: "Wǒ qù xuéxiào kàn shū.", vi: "Tôi đến trường đọc sách." },
      { zh: "他来我家玩。", pinyin: "Tā lái wǒ jiā wán.", vi: "Anh ấy đến nhà tôi chơi." }
    ],
    tips: "Sau '去' và '来' có thể nối trực tiếp danh từ nơi chốn mà không cần giới từ (去学校, 来北京)."
  },
  {
    id: "g1-17",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "17. Động từ năng nguyện: '会' (huì - biết qua học tập)",
    formula: "Chủ ngữ + 会 + Động từ  |  Phủ định: 不会",
    explanation: "Biểu thị kỹ năng có được thông qua quá trình học tập, rèn luyện (biết bơi, biết lái xe, biết nói ngoại ngữ).",
    examples: [
      { zh: "我会说汉语。", pinyin: "Wǒ huì shuō Hànyǔ.", vi: "Tôi biết nói tiếng Trung." },
      { zh: "他不会做中国菜。", pinyin: "Tā bú huì zuò Zhōngguó cài.", vi: "Anh ấy không biết nấu món Trung Quốc." }
    ],
    tips: "'会' khác với '知道' (zhīdào - biết thông tin)."
  },
  {
    id: "g1-18",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "18. Động từ năng nguyện: '会' (huì - dự đoán khả năng)",
    formula: "S + 会 + Động từ + (的)",
    explanation: "Biểu thị sự việc có khả năng hoặc chắc chắn sẽ diễn ra trong tương lai.",
    examples: [
      { zh: "明天会下雨吗？", pinyin: "Míngtiān huì xià yǔ ma?", vi: "Ngày mai trời có mưa không?" },
      { zh: "他会来的。", pinyin: "Tā huì lái de.", vi: "Anh ấy sẽ đến thôi." }
    ],
    tips: "Thường kết hợp với trợ từ '的' ở cuối câu để tăng độ khẳng định."
  },
  {
    id: "g1-19",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "19. Động từ năng nguyện: '想' (xiǎng - muốn, dự định)",
    formula: "Chủ ngữ + 想 + Động từ  |  Phủ định: 不想",
    explanation: "Biểu thị mong muốn, nguyện vọng trong suy nghĩ mang sắc thái nhẹ nhàng.",
    examples: [
      { zh: "我想喝一杯水。", pinyin: "Wǒ xiǎng hē yì bēi shuǐ.", vi: "Tôi muốn uống một ly nước." },
      { zh: "周末我想去看电影。", pinyin: "Zhōumò wǒ xiǎng qù kàn diànyǐng.", vi: "Cuối tuần tôi dự định đi xem phim." }
    ],
    tips: "Ngoài ra, '想' đứng trước danh từ mang nghĩa là 'nhớ' (我想妈妈 - Tôi nhớ mẹ)."
  },
  {
    id: "g1-20",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "20. Động từ năng nguyện: '要' (yào - muốn, cần, sẽ)",
    formula: "Chủ ngữ + 要 + Động từ / Danh từ  |  Phủ định: 不想 / 不要",
    explanation: "Biểu thị ý muốn mạnh mẽ, dứt khoát hoặc yêu cầu cần thiết phải làm.",
    examples: [
      { zh: "我要买这个手机。", pinyin: "Wǒ yào mǎi zhège shǒujī.", vi: "Tôi muốn mua chiếc điện thoại này." },
      { zh: "明天我要去上班。", pinyin: "Míngtiān wǒ yào qù shàngbān.", vi: "Ngày mai tôi phải đi làm." }
    ],
    tips: "Phủ định của 'yào' khi từ chối nguyện vọng thường dùng '不想', còn '不要' mang nghĩa 'đừng / không được'."
  },
  {
    id: "g1-21",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "21. Động từ năng nguyện: '能' (néng - có thể / xin phép)",
    formula: "Chủ ngữ + 能 + Động từ  |  Phủ định: 不能",
    explanation: "Biểu thị năng lực bản thân hoặc điều kiện hoàn cảnh cho phép làm việc gì.",
    examples: [
      { zh: "我能坐这儿吗？", pinyin: "Wǒ néng zuò zhèr ma?", vi: "Tôi có thể ngồi ở đây không?" },
      { zh: "今天生病了，不能去上学。", pinyin: "Jīntiān shēngbìng le, bù néng qù shàngxué.", vi: "Hôm nay ốm rồi, không thể đi học." }
    ],
    tips: "Dùng '能' trong câu hỏi thể hiện sự xin phép lịch sự nhã nhặn."
  },
  {
    id: "g1-22",
    level: 1,
    category: "2. Động Từ & Năng Nguyện",
    title: "22. Động từ năng nguyện: '可以' (kěyǐ - có thể, được phép)",
    formula: "Chủ ngữ + 可以 + Động từ  |  Phủ định: 不行 / 不能",
    explanation: "Biểu thị sự cho phép hoặc tính khả thi của một việc.",
    examples: [
      { zh: "这里可以刷卡吗？", pinyin: "Zhèlǐ kěyǐ shuākǎ ma?", vi: "Ở đây có thể quẹt thẻ được không?" },
      { zh: "你可以走了。", pinyin: "Nǐ kěyǐ zǒu le.", vi: "Bạn có thể đi rồi." }
    ],
    tips: "Khi đáp lại câu hỏi xin phép, đồng ý nói '可以' (được), từ chối nói '不行' (không được)."
  },

  // =========================================================================
  // PHẦN III: PHÓ TỪ MỨC ĐỘ, THỜI GIAN & PHẠM VI (10 Điểm)
  // =========================================================================
  {
    id: "g1-23",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "23. Phó từ phủ định '不' (bù - không)",
    formula: "不 + Động từ / Tính từ",
    explanation: "Dùng để phủ định hành động ở hiện tại, tương lai, thói quen thường nhật hoặc tính từ.",
    examples: [
      { zh: "我不喝咖啡。", pinyin: "Wǒ bù hē kāfēi.", vi: "Tôi không uống cà phê (thói quen)." },
      { zh: "今天不冷。", pinyin: "Jīntiān bù lěng.", vi: "Hôm nay không lạnh." }
    ],
    tips: "Nhớ quy tắc biến điệu: đứng trước thanh 4 đổi thành 'bú' (bú shì, bú yào, bú qù)."
  },
  {
    id: "g1-24",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "24. Phó từ phủ định '没 / 没有' (méi / méiyǒu - chưa, không)",
    formula: "没 / 没有 + Động từ",
    explanation: "Dùng để phủ định hành động đã qua trong quá khứ hoặc chưa hoàn thành.",
    examples: [
      { zh: "我昨天没去上班。", pinyin: "Wǒ zuótiān méi qù shàngbān.", vi: "Hôm qua tôi đã không đi làm." },
      { zh: "我还没吃饭。", pinyin: "Wǒ hái méi chī fàn.", vi: "Tôi vẫn chưa ăn cơm." }
    ],
    tips: "Trước động từ có '没/没有' thì cuối câu KHÔNG ĐƯỢC CÓ '了'!"
  },
  {
    id: "g1-25",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "25. So sánh phân biệt '不' vs '没 / 没有'",
    formula: "不: Phủ định ý chí, thói quen, tính từ  |  没: Phủ định sự việc đã xảy ra",
    explanation: "Ví dụ: '我不去' = Tôi không muốn đi (ý chí); '我没去' = Tôi đã không đi (sự việc đã qua).",
    examples: [
      { zh: "他不吃肉。(Thói quen không ăn thịt)", pinyin: "Tā bù chī ròu.", vi: "Anh ấy không ăn thịt." },
      { zh: "他今天没吃肉。(Hôm nay anh ấy chưa ăn thịt)", pinyin: "Tā jīntiān méi chī ròu.", vi: "Hôm nay anh ấy chưa ăn thịt." }
    ],
    tips: "Phủ định của '是' luôn là '不是'; phủ định của '有' luôn là '没有'."
  },
  {
    id: "g1-26",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "26. Phó từ mức độ '很' (hěn - rất, cầu nối ngữ)",
    formula: "Chủ ngữ + 很 + Tính từ",
    explanation: "Đóng vai trò cầu nối âm thanh bắt buộc trong câu vị ngữ tính từ, giúp câu cân bằng tự nhiên.",
    examples: [
      { zh: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.", vi: "Hôm nay thời tiết đẹp." },
      { zh: "汉语很难。", pinyin: "Hànyǔ hěn nán.", vi: "Tiếng Trung rất khó." }
    ],
    tips: "Nếu bỏ '很' (今天天气好), câu mang sắc thái so sánh ngầm ('Hôm nay thời tiết đẹp, còn hôm qua thì xấu')."
  },
  {
    id: "g1-27",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "27. Cấu trúc cảm thán: '太...了' (tài... le - quá... rồi)",
    formula: "太 + Tính từ / Tâm lý + 了",
    explanation: "Biểu thị mức độ rất cao mang sắc thái cảm thán, khen ngợi hoặc phàn nàn.",
    examples: [
      { zh: "太漂亮了！", pinyin: "Tài piàoliang le!", vi: "Đẹp quá đi mất!" },
      { zh: "这个太贵了，便宜点儿吧。", pinyin: "Zhège tài guì le, piányi diǎnr ba.", vi: "Cái này đắt quá rồi, rẻ chút đi." }
    ],
    tips: "Phủ định là '不太 + Adj' (không... lắm) và khi phủ định thì BỎ chữ '了' (不太冷)."
  },
  {
    id: "g1-28",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "28. Phó từ mức độ '非常' (fēicháng - vô cùng, cực kỳ)",
    formula: "非常 + Tính từ / Động từ tâm lý",
    explanation: "Mức độ cao hơn '很', mang tính trang trọng và khách quan hơn.",
    examples: [
      { zh: "我非常喜欢越南菜。", pinyin: "Wǒ fēicháng xǐhuan Yuènán cài.", vi: "Tôi vô cùng thích món ăn Việt Nam." },
      { zh: "服务员非常热情。", pinyin: "Fúwùyuán fēicháng rèqíng.", vi: "Nhân viên phục vụ cực kỳ nhiệt tình." }
    ],
    tips: "Có thể đứng trước động từ chỉ cảm xúc (非常喜欢, 非常爱, 非常想)."
  },
  {
    id: "g1-29",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "29. Phó từ mức độ '最' (zuì - nhất)",
    formula: "最 + Tính từ / Động từ tâm lý",
    explanation: "Biểu thị mức độ cao nhất trong tất cả các đối tượng so sánh.",
    examples: [
      { zh: "妈妈做的菜最好吃。", pinyin: "Māma zuò de cài zuì hǎochī.", vi: "Món mẹ nấu là ngon nhất." },
      { zh: "我最喜欢的一本书。", pinyin: "Wǒ zuì xǐhuan de yì běn shū.", vi: "Quyển sách tôi thích nhất." }
    ],
    tips: "Khẩu ngữ thường gặp: 最好 (tốt nhất), 最大 (lớn nhất), 最小 (nhỏ nhất)."
  },
  {
    id: "g1-30",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "30. Phó từ phạm vi '都' (dōu - đều, tất cả)",
    formula: "Chủ ngữ (số nhiều) + 都 + Động từ / Tính từ",
    explanation: "Dùng để tổng kết toàn bộ các đối tượng đã được nhắc đến ở trước.",
    examples: [
      { zh: "他们都是中国人。", pinyin: "Tāmen dōu shì Zhōngguórén.", vi: "Họ đều là người Trung Quốc." },
      { zh: "我们都喜欢学汉语。", pinyin: "Wǒmen dōu xǐhuan xué Hànyǔ.", vi: "Chúng tôi đều thích học tiếng Trung." }
    ],
    tips: "Phân biệt: '都不' (đều không - phủ định toàn bộ) vs '不都' (không đều - phủ định một phần)."
  },
  {
    id: "g1-31",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "31. Phó từ tương đồng '也' (yě - cũng)",
    formula: "Chủ ngữ + 也 + Động từ / Tính từ",
    explanation: "Biểu thị sự đồng nhất hoặc hành động tương tự với đối tượng trước đó.",
    examples: [
      { zh: "我也是学生。", pinyin: "Wǒ yě shì xuésheng.", vi: "Tôi cũng là học sinh." },
      { zh: "他也想去中国旅游。", pinyin: "Tā yě xiǎng qù Zhōngguó lǚyóu.", vi: "Anh ấy cũng muốn đi Trung Quốc du lịch." }
    ],
    tips: "Nếu trong câu có cả '也' và '都', '也' luôn đứng TRƯỚC '都' (我们也都是学生)."
  },
  {
    id: "g1-32",
    level: 1,
    category: "3. Phó Từ & Trạng Từ",
    title: "32. Cấu trúc tiếp diễn: '在 / 正在...呢' (zhèngzài... ne - đang)",
    formula: "Chủ ngữ + 在 / 正在 + Động từ + (呢)",
    explanation: "Biểu thị hành động đang diễn ra tại thời điểm nói.",
    examples: [
      { zh: "他在看书呢。", pinyin: "Tā zài kàn shū ne.", vi: "Anh ấy đang đọc sách đấy." },
      { zh: "我正在吃饭呢。", pinyin: "Wǒ zhèngzài chī fàn ne.", vi: "Tôi đang ăn cơm." }
    ],
    tips: "Phủ định của hành động đang diễn ra dùng '没在 + V' (他没在睡觉)."
  },

  // =========================================================================
  // PHẦN IV: GIỚI TỪ & LIÊN TỪ (8 Điểm)
  // =========================================================================
  {
    id: "g1-33",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "33. Giới từ chỉ nơi chốn: '在' (zài - làm gì ở đâu)",
    formula: "Chủ ngữ + 在 + Địa điểm + Động từ",
    explanation: "Khác với tiếng Việt (Làm gì rồi mới đến ở đâu), tiếng Trung LUÔN ĐẶT NƠI CHỐN TRƯỚC HÀNH ĐỘNG.",
    examples: [
      { zh: "我在中国银行工作。", pinyin: "Wǒ zài Zhōngguó Yínháng gōngzuò.", vi: "Tôi làm việc ở Ngân hàng Trung Quốc." },
      { zh: "他在图书馆看书。", pinyin: "Tā zài túshūguǎn kàn shū.", vi: "Cậu ấy đọc sách ở thư viện." }
    ],
    tips: "Lỗi người Việt hay gặp: Nói 'Tôi ăn cơm ở nhà' ➔ Wǒ chī fàn zài jiā (SAI), phải nói là '我在家吃饭' (ĐÚNG)!"
  },
  {
    id: "g1-34",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "34. Cấu trúc khoảng cách: '从...到...' (cóng... dào... - từ... đến...)",
    formula: "从 + Điểm A + 到 + Điểm B (Áp dụng cả không gian và thời gian)",
    explanation: "Biểu thị quãng đường di chuyển hoặc khoảng thời gian từ mốc này đến mốc kia.",
    examples: [
      { zh: "从河内到北京坐飞机要四个小时。", pinyin: "Cóng Hénèi dào Běijīng zuò fēijī yào sì gè xiǎoshí.", vi: "Từ Hà Nội đến Bắc Kinh đi máy bay mất 4 tiếng." },
      { zh: "从星期一到星期五。", pinyin: "Cóng xīngqīyī dào xīngqīwǔ.", vi: "Từ thứ Hai đến thứ Sáu." }
    ]
  },
  {
    id: "g1-35",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "35. Giới từ đối tượng: '给' (gěi - cho ai đó)",
    formula: "Chủ ngữ + 给 + Người nhận + Động từ",
    explanation: "Biểu thị đối tượng tiếp nhận hành động.",
    examples: [
      { zh: "我想给他打电话。", pinyin: "Wǒ xiǎng gěi tā dǎ diànhuà.", vi: "Tôi muốn gọi điện thoại cho anh ấy." },
      { zh: "请给我一碗米饭。", pinyin: "Qǐng gěi wǒ yì wǎn mǐfàn.", vi: "Xin cho tôi một bát cơm." }
    ]
  },
  {
    id: "g1-36",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "36. Giới từ đồng hành: '和...一起' (hé... yìqǐ - cùng với)",
    formula: "Chủ ngữ + 和 + Người đồng hành + 一起 + Động từ",
    explanation: "Biểu thị hai hay nhiều người cùng nhau thực hiện một hành động.",
    examples: [
      { zh: "我和朋友一起去超市。", pinyin: "Wǒ hé péngyou yìqǐ qù chāoshì.", vi: "Tôi cùng bạn bè đi siêu thị." },
      { zh: "我们一起学汉语吧。", pinyin: "Wǒmen yìqǐ xué Hànyǔ ba.", vi: "Chúng mình cùng học tiếng Trung nhé." }
    ]
  },
  {
    id: "g1-37",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "37. Giới từ phương hướng: '往' (wǎng - về phía / hướng)",
    formula: "往 + Phương hướng + Động từ di chuyển",
    explanation: "Dùng để chỉ hướng đi trong chỉ đường.",
    examples: [
      { zh: "一直往前走。", pinyin: "Yìzhí wǎng qián zǒu.", vi: "Đi thẳng một mạch về phía trước." },
      { zh: "往右拐就是银行。", pinyin: "Wǎng yòu guǎi jiù shì yínháng.", vi: "Rẽ sang bên phải là đến ngân hàng." }
    ]
  },
  {
    id: "g1-38",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "38. Liên từ '和' (hé - và) và phạm vi sử dụng",
    formula: "Danh từ 1 + 和 + Danh từ 2",
    explanation: "'和' CHỈ DÙNG để nối 2 danh từ, đại từ hoặc cụm từ tương đương.",
    examples: [
      { zh: "爸爸和妈妈都在家。", pinyin: "Bàba hé māma dōu zài jiā.", vi: "Bố và mẹ đều ở nhà." },
      { zh: "我买了苹果和香蕉。", pinyin: "Wǒ mǎi le píngguǒ hé xiāngjiāo.", vi: "Tôi đã mua táo và chuối." }
    ],
    tips: "TUYỆT ĐỐI KHÔNG dùng '和' để nối 2 câu độc lập. Ví dụ: 'Tôi đi học và anh ấy đi làm' KHÔNG ĐƯỢC dùng '和'!"
  },
  {
    id: "g1-39",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "39. Liên từ lựa chọn: '还是' (háishì - hay là?) trong câu hỏi",
    formula: "Phương án A + 还是 + Phương án B?",
    explanation: "Dùng trong câu hỏi lựa chọn, yêu cầu người nghe chọn một trong hai phương án.",
    examples: [
      { zh: "你喝茶还是喝咖啡？", pinyin: "Nǐ hē chá háishì hē kāfēi?", vi: "Bạn uống trà hay là uống cà phê?" },
      { zh: "坐地铁还是打车？", pinyin: "Zuò dìtiě háishì dǎchē?", vi: "Đi tàu điện ngầm hay bắt taxi?" }
    ]
  },
  {
    id: "g1-40",
    level: 1,
    category: "4. Giới Từ & Liên Từ",
    title: "40. Liên từ '或者' (huòzhě - hoặc là) trong câu khẳng định",
    formula: "Phương án A + 或者 + Phương án B",
    explanation: "Khác với '还是', '或者' CHỈ DÙNG trong câu trần thuật khẳng định.",
    examples: [
      { zh: "星期六或者星期天都可以。", pinyin: "Xīngqīliù huòzhě xīngqītiān dōu kěyǐ.", vi: "Thứ Bảy hoặc Chủ Nhật đều được." },
      { zh: "我想吃米饭或者面条。", pinyin: "Wǒ xiǎng chī mǐfàn huòzhě miàntiáo.", vi: "Tôi muốn ăn cơm hoặc mì." }
    ],
    tips: "Phân biệt cốt lõi: Câu hỏi dùng 还是 (háishì), câu khẳng định dùng 或者 (huòzhě)!"
  },

  // =========================================================================
  // PHẦN V: HỆ THỐNG TRỢ TỪ (6 Điểm)
  // =========================================================================
  {
    id: "g1-41",
    level: 1,
    category: "5. Hệ Thống Trợ Từ",
    title: "41. Trợ từ kết cấu sở hữu & định ngữ: '的' (de)",
    formula: "Định ngữ (người sở hữu / tính chất) + 的 + Danh từ trung tâm",
    explanation: "Đứng giữa định ngữ và danh từ trung tâm để biểu thị quan hệ sở hữu hoặc miêu tả đặc điểm.",
    examples: [
      { zh: "我的老师。", pinyin: "Wǒ de lǎoshī.", vi: "Thầy giáo của tôi." },
      { zh: "新买的衣服。", pinyin: "Xīn mǎi de yīfu.", vi: "Quần áo mới mua." }
    ],
    tips: "Mối quan hệ thân mật ruột thịt (bố mẹ, anh chị) hoặc cơ quan có thể lược bỏ chữ '的' (我爸爸, 我家)."
  },
  {
    id: "g1-42",
    level: 1,
    category: "5. Hệ Thống Trợ Từ",
    title: "42. Trợ từ động thái: '了' (le) đứng sau động từ",
    formula: "Động từ + 了 + (Tân ngữ)",
    explanation: "Biểu thị hành động đã xảy ra và hoàn tất.",
    examples: [
      { zh: "我买了三本书。", pinyin: "Wǒ mǎi le sān běn shū.", vi: "Tôi đã mua 3 quyển sách." },
      { zh: "他吃了一碗面条。", pinyin: "Tā chī le yì wǎn miàntiáo.", vi: "Anh ấy đã ăn một bát mì." }
    ]
  },
  {
    id: "g1-43",
    level: 1,
    category: "5. Hệ Thống Trợ Từ",
    title: "43. Trợ từ ngữ khí: '了' (le) đứng cuối câu",
    formula: "Câu hoàn chỉnh + 了 (Biểu thị sự biến hóa, tình huống mới xuất hiện)",
    explanation: "Báo hiệu tình huống đã thay đổi so với trước đây.",
    examples: [
      { zh: "下雨了。", pinyin: "Xià yǔ le.", vi: "Mưa rồi (trước đó chưa mưa)." },
      { zh: "我二十岁了。", pinyin: "Wǒ èrshí suì le.", vi: "Tôi 20 tuổi rồi (sang tuổi mới)." }
    ]
  },
  {
    id: "g1-44",
    level: 1,
    category: "5. Hệ Thống Trợ Từ",
    title: "44. Trợ từ nghi vấn: '吗' (ma - phải không?)",
    formula: "Câu trần thuật + 吗?",
    explanation: "Cách đặt câu hỏi Yes/No đơn giản nhất mà không thay đổi trật tự từ.",
    examples: [
      { zh: "你是越南人吗？", pinyin: "Nǐ shì Yuènán rén ma?", vi: "Bạn là người Việt Nam phải không?" },
      { zh: "汉语难吗？", pinyin: "Hànyǔ nán ma?", vi: "Tiếng Trung có khó không?" }
    ]
  },
  {
    id: "g1-45",
    level: 1,
    category: "5. Hệ Thống Trợ Từ",
    title: "45. Trợ từ ngữ khí: '呢' (ne - thế còn... / đang... đấy)",
    formula: "Danh từ / Đại từ + 呢? (còn... thì sao?)  |  V + 呢 (đang làm)",
    explanation: "Dùng để hỏi tiếp theo ngữ cảnh đã có hoặc biểu thị hành động đang tiếp diễn.",
    examples: [
      { zh: "我是学生，你呢？", pinyin: "Wǒ shì xuésheng, nǐ ne?", vi: "Tôi là sinh viên, còn bạn thì sao?" },
      { zh: "他在做作业呢。", pinyin: "Tā zài zuò zuòyè ne.", vi: "Nó đang làm bài tập đấy." }
    ]
  },
  {
    id: "g1-46",
    level: 1,
    category: "5. Hệ Thống Trợ Từ",
    title: "46. Trợ từ ngữ khí: '吧' (ba - đi, nhé, thôi)",
    formula: "Câu đề nghị / rủ rê / thương lượng + 吧",
    explanation: "Làm mềm ngữ khí, biến câu mệnh lệnh thành câu rủ rê, gợi ý nhẹ nhàng.",
    examples: [
      { zh: "我们走吧！", pinyin: "Wǒmen zǒu ba!", vi: "Chúng mình đi thôi!" },
      { zh: "便宜一点儿吧。", pinyin: "Piányi yìdiǎnr ba.", vi: "Bớt rẻ hơn chút đi nhé." }
    ]
  },

  // =========================================================================
  // PHẦN VI: CÁC CẤU TRÚC CÂU ĐẶC BIỆT HSK 1 (6 Điểm)
  // =========================================================================
  {
    id: "g1-47",
    level: 1,
    category: "6. Mẫu Câu Đặc Biệt",
    title: "47. Câu vị ngữ danh từ (Không cần chữ '是')",
    formula: "Chủ ngữ + Danh từ chỉ ngày tháng / giờ / tuổi / giá tiền",
    explanation: "Khi biểu thị thời gian, tuổi tác, ngày tháng hoặc giá cả, danh từ có thể trực tiếp làm vị ngữ mà không cần thêm động từ '是'.",
    examples: [
      { zh: "今天星期六。(Không cần nói 今天是星期六)", pinyin: "Jīntiān xīngqīliù.", vi: "Hôm nay là Thứ Bảy." },
      { zh: "苹果五块钱一斤。", pinyin: "Píngguǒ wǔ kuài qián yì jīn.", vi: "Táo 5 tệ một cân." }
    ]
  },
  {
    id: "g1-48",
    level: 1,
    category: "6. Mẫu Câu Đặc Biệt",
    title: "48. Câu liên động (Serial Verb Construction)",
    formula: "Chủ ngữ + V1 + (Tân ngữ 1) + V2 + (Tân ngữ 2)",
    explanation: "Câu có từ hai hành động trở lên đi liền nhau, trong đó hành động V1 thường biểu thị phương tiện, phương thức hoặc mục đích để thực hiện hành động V2.",
    examples: [
      { zh: "我去学校看书。", pinyin: "Wǒ qù xuéxiào kàn shū.", vi: "Tôi đến trường đọc sách (đi trường để đọc sách)." },
      { zh: "我坐地铁去上班。", pinyin: "Wǒ zuò dìtiě qù shàngbān.", vi: "Tôi đi tàu điện ngầm đi làm (bằng phương tiện tàu điện)." }
    ]
  },
  {
    id: "g1-49",
    level: 1,
    category: "6. Mẫu Câu Đặc Biệt",
    title: "49. Câu tồn hiện cơ bản chữ '有'",
    formula: "Nơi chốn + Phương vị từ (上/下/里) + 有 + Người / Đồ vật",
    explanation: "Biểu thị tại một địa điểm hoặc vị trí nào đó đang có sự hiện diện của ai hoặc vật gì.",
    examples: [
      { zh: "桌子上有一台电脑。", pinyin: "Zhuōzi shang yǒu yì tái diànnǎo.", vi: "Trên bàn có một chiếc máy tính." },
      { zh: "房间里有三个人。", pinyin: "Fángjiān li yǒu sān gè rén.", vi: "Trong phòng có 3 người." }
    ]
  },
  {
    id: "g1-50",
    level: 1,
    category: "6. Mẫu Câu Đặc Biệt",
    title: "50. Cấu trúc nhấn mạnh '是...的' (shì... de)",
    formula: "Chủ ngữ + 是 + [Thời gian / Địa điểm / Phương thức] + Động từ + 的",
    explanation: "Dùng để nhấn mạnh chi tiết về thời gian, địa điểm hoặc phương thức của một hành động ĐÃ XẢY RA trong quá khứ.",
    examples: [
      { zh: "我是坐飞机来的。", pinyin: "Wǒ shì zuò fēijī lái de.", vi: "Tôi đến bằng máy bay (nhấn mạnh phương thức di chuyển)." },
      { zh: "他是去年来北京的。", pinyin: "Tā shì qùnián lái Běijīng de.", vi: "Anh ấy đến Bắc Kinh vào năm ngoái (nhấn mạnh thời gian)." }
    ],
    tips: "Trong câu khẳng định có thể lược bỏ '是', nhưng trong câu phủ định bắt buộc phải có '不是' (我不是坐飞机来的)."
  },
  {
    id: "g1-51",
    level: 1,
    category: "6. Mẫu Câu Đặc Biệt",
    title: "51. Câu hỏi chính phản (V + 不 + V? / Adj + 不 + Adj?)",
    formula: "S + V + 不 + V + (Tân ngữ)?  |  S + Tính từ + 不 + Tính từ?",
    explanation: "Ghép hình thức khẳng định và phủ định lại với nhau để tạo câu hỏi nghi vấn mà không dùng '吗'.",
    examples: [
      { zh: "你去不去学校？", pinyin: "Nǐ qù bu qù xuéxiào?", vi: "Bạn có đi trường học không?" },
      { zh: "汉语难不难？", pinyin: "Hànyǔ nán bu nán?", vi: "Tiếng Trung có khó không?" }
    ],
    tips: "Câu hỏi chính phản TUYỆT ĐỐI KHÔNG thêm trợ từ '吗' ở cuối câu!"
  },
  {
    id: "g1-52",
    level: 1,
    category: "6. Mẫu Câu Đặc Biệt",
    title: "52. Câu so sánh chữ '比' (bǐ - so với) cấp 1",
    formula: "A + 比 + B + Tính từ",
    explanation: "Biểu thị A vượt trội hơn B về một đặc điểm hoặc tính chất nào đó.",
    examples: [
      { zh: "今天比昨天冷。", pinyin: "Jīntiān bǐ zuótiān lěng.", vi: "Hôm nay lạnh hơn hôm qua." },
      { zh: "哥哥比我高。", pinyin: "Gēge bǐ wǒ gāo.", vi: "Anh trai cao hơn tôi." }
    ],
    tips: "Trước tính từ trong câu chữ 比 TUYỆT ĐỐI KHÔNG DÙNG '很' (Không nói: 今天比昨天很冷)!"
  },

  // =========================================================================
  // TIẾP NỐI HSK 2 & HSK 3 (Các điểm ngữ pháp mở rộng then chốt)
  // =========================================================================
  {
    id: "g2-01",
    level: 2,
    category: "HSK 2 Nâng Cao",
    title: "53. Bổ ngữ kết quả (V + 完 / 到 / 懂 / 见 / 好)",
    formula: "Động từ (V) + Bổ ngữ kết quả + (Tân ngữ)",
    explanation: "Động từ kết hợp ngay sau với một động từ khác hoặc tính từ để chỉ rõ hành động đã hoàn tất hoặc đạt được kết quả như thế nào.",
    examples: [
      { zh: "我做完作业了。", pinyin: "Wǒ zuò wán zuòyè le.", vi: "Tôi làm xong bài tập rồi (完 = Xong)." },
      { zh: "你听懂了吗？", pinyin: "Nǐ tīng dǒng le ma?", vi: "Bạn nghe có hiểu không? (懂 = Hiểu)." }
    ],
    tips: "Phủ định của bổ ngữ kết quả dùng '没 / 没有' đứng trước động từ (ví dụ: 我没做完 - Tôi chưa làm xong)."
  },
  {
    id: "g2-02",
    level: 2,
    category: "HSK 2 Nâng Cao",
    title: "54. Bổ ngữ trạng thái với '得' (de)",
    formula: "Động từ (V) + 得 + Tính từ miêu tả mức độ",
    explanation: "Dùng để đánh giá trình độ, mức độ hoặc trạng thái diễn ra thường xuyên hay đã qua của một hành động.",
    examples: [
      { zh: "他说汉语说得很好。", pinyin: "Tā shuō Hànyǔ shuō de hěn hǎo.", vi: "Anh ấy nói tiếng Trung nói rất tốt." },
      { zh: "她跑得非常快。", pinyin: "Tā pǎo de fēicháng kuài.", vi: "Cô ấy chạy cực kỳ nhanh." }
    ],
    tips: "Nếu có tân ngữ, bắt buộc phải lặp lại động từ (V + O + V + 得 + Adj) hoặc đưa tân ngữ lên đầu câu."
  },
  {
    id: "g3-01",
    level: 3,
    category: "HSK 3 Nâng Cao",
    title: "55. Câu chữ '把' (Câu xử lý đối tượng)",
    formula: "Chủ ngữ (S) + 把 + Đối tượng tác động (O) + Động từ (V) + Kết quả/Nơi đến",
    explanation: "Nhấn mạnh sự tác động của chủ ngữ lên đối tượng khiến đối tượng thay đổi trạng thái, vị trí hoặc sở thuộc.",
    examples: [
      { zh: "请把门关上。", pinyin: "Qǐng bǎ mén guān shàng.", vi: "Xin hãy đóng cửa lại (tác động làm cửa đóng)." },
      { zh: "我把手机放在桌子上了。", pinyin: "Wǒ bǎ shǒujī fàng zài zhuōzi shang le.", vi: "Tôi đã để điện thoại ở trên bàn rồi." }
    ],
    tips: "Động từ trong câu chữ 把 không được đứng trơ trọi một mình, phía sau bắt buộc phải có thành phần phụ."
  },
  {
    id: "g3-02",
    level: 3,
    category: "HSK 3 Nâng Cao",
    title: "56. Câu bị động chữ '被' (bèi - Bị, được)",
    formula: "Chủ ngữ bị tác động + 被 + (Tác nhân gây ra) + Động từ + Thành phần khác",
    explanation: "Biểu thị sự việc bị động hoặc sự việc xảy ra ngoài ý muốn đối với chủ ngữ.",
    examples: [
      { zh: "我的钱包被小偷偷走了。", pinyin: "Wǒ de qiánbāo bèi xiǎotōu tōu zǒu le.", vi: "Ví tiền của tôi bị kẻ trộm lấy cắp mất rồi." },
      { zh: "作业被弟弟弄脏了。", pinyin: "Zuòyè bèi dìdi nòng zāng le.", vi: "Bài tập bị em trai làm bẩn mất rồi." }
    ]
  },
  {
    id: "g3-03",
    level: 3,
    category: "HSK 3 Nâng Cao",
    title: "57. Cặp liên từ phức: '不但...而且...' (Không những... mà còn...)",
    formula: "S + 不但 + Đặc điểm 1, 而且 + Đặc điểm 2",
    explanation: "Biểu thị quan hệ tăng tiến về mức độ, đặc điểm của sự vật, sự việc.",
    examples: [
      { zh: "中国菜不但好吃，而且不贵。", pinyin: "Zhōngguó cài búdàn hǎochī, érqiě bú guì.", vi: "Món ăn Trung Quốc không những ngon, mà còn không đắt." }
    ]
  }
];
