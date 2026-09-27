// Dữ liệu lộ trình 8 tháng từ HSK 1 đến HSK 3 theo chuẩn mới HSK 3.0
export const ROADMAP_DATA = {
  overview: {
    duration: "8 Tháng (32 Tuần - ~240 Ngày)",
    target: "HSK 1 -> HSK 3 (Chuẩn HSK 3.0)",
    dailyTime: "60 - 90 Phút / Ngày",
    totalWords: "2.245 từ vựng tích lũy",
    totalCharacters: "900 chữ Hán",
    totalGrammar: "387 điểm ngữ pháp tích lũy"
  },
  stages: [
    {
      id: "stage-1",
      title: "Giai đoạn 1: Nền Tảng & HSK 1 (500 từ)",
      timeline: "Tháng 1 - 2 (Tuần 1 - 8)",
      level: "HSK 1",
      badgeColor: "#10b981",
      description: "Làm chủ hoàn toàn phát âm Pinyin, 4 thanh điệu, 50 bộ thủ thông dụng, 8 nét bút thuận và chinh phục 500 từ vựng căn bản HSK 1 cùng 48 điểm ngữ pháp cốt lõi.",
      stats: { words: 500, characters: 300, grammar: 48, duration: "8 Tuần" },
      weeks: [
        {
          week: "Tuần 1 - 2",
          title: "Nhập Môn Phát Âm Pinyin & Chữ Hán",
          objective: "Nắm vững toàn bộ 21 thanh mẫu, 36 vận mẫu, 4 thanh điệu; quy tắc biến âm; 8 nét viết cơ bản và 50 bộ thủ cốt lõi.",
          dailyRoutine: [
            "20p: Luyện phát âm thanh mẫu & vận mẫu theo bảng tương tác",
            "20p: Luyện 4 thanh điệu và quy tắc biến điệu thanh 3, chữ 不, 一",
            "20p: Tập viết 8 nét bút cơ bản và 5 bộ thủ mỗi ngày",
            "15p: Nghe nhại lại (Shadowing) các âm dễ nhầm lẫn (z/zh, c/ch, s/sh, j/q/x)"
          ],
          keyTopics: ["Pinyin toàn diện", "4 Thanh điệu", "Quy tắc bút thuận", "50 Bộ thủ cốt lõi"],
          milestone: "Đọc chuẩn bất kỳ chữ nào có phiên âm Pinyin, viết đúng quy tắc các bộ thủ cơ bản."
        },
        {
          week: "Tuần 3 - 4",
          title: "HSK 1 Khởi Động: Chào Hỏi & Giao Tiếp Đời Sống",
          objective: "Học 150 từ vựng đầu tiên HSK 1 (Chào hỏi, giới thiệu bản thân, số đếm, gia đình, ngày tháng thời gian).",
          dailyRoutine: [
            "25p: Học 12-15 từ mới + nghe phát âm và xem âm Hán Việt",
            "20p: Ôn tập từ vựng cũ bằng Flashcard",
            "20p: Luyện mẫu câu hỏi: 吗 (ma), 什么 (shénme), 谁 (shéi)",
            "15p: Gõ bàn phím Pinyin các câu giới thiệu bản thân"
          ],
          keyTopics: ["Số đếm 1-100", "Thời gian (mấy giờ, thứ mấy)", "Đại từ nhân xưng (我, 你, 他, 她)", "Mẫu câu 你好, 谢谢, 再见"],
          milestone: "Tự tin giới thiệu bản thân, đọc số điện thoại, hỏi giờ và ngày tháng bằng tiếng Trung."
        },
        {
          week: "Tuần 5 - 6",
          title: "HSK 1 Mở Rộng: Ăn Uống, Mua Sắm & Địa Điểm",
          objective: "Nạp thêm 200 từ vựng HSK 1 (Thức ăn, đồ uống, mua sắm, giá tiền, phương hướng, địa điểm).",
          dailyRoutine: [
            "25p: Học 15 từ mới/ngày qua hình ảnh và câu ngữ cảnh",
            "20p: Luyện phản xạ Flashcard lặp lại ngắt quãng",
            "20p: Ngữ pháp câu chữ 在 (ở đâu), 怎么 (thế nào), 多少钱 (bao nhiêu tiền)",
            "15p: Nghe đoạn hội thoại mua bán và gọi món ăn ngắn"
          ],
          keyTopics: ["Hỏi giá tiền 多少钱", "Chỉ đường & nơi chốn (学校, 商店, 医院)", "Động từ sở thích (喜欢, 想, 要)"],
          milestone: "Có thể giao tiếp mua bán, hỏi giá tiền và gọi món cơ bản trong nhà hàng Trung Quốc."
        },
        {
          week: "Tuần 7 - 8",
          title: "Hoàn Thiện HSK 1 & Ôn Tập Tổng Lực",
          objective: "Hoàn thành 150 từ vựng còn lại (Tổng đủ 500 từ HSK 1), tổng hợp 48 điểm ngữ pháp HSK 1 và thi thử đề HSK 1.",
          dailyRoutine: [
            "25p: Hoàn tất các từ vựng còn lại của HSK 1",
            "25p: Ôn tập toàn bộ 500 từ HSK 1 (sàng lọc các từ còn hay quên)",
            "20p: Hệ thống lại 48 cấu trúc ngữ pháp",
            "20p: Làm đề thi thử HSK 1 mô phỏng tính giờ"
          ],
          keyTopics: ["Thời tiết, cảm xúc", "Phương tiện giao thông", "Tổng ôn 48 điểm ngữ pháp", "Thi thử HSK 1"],
          milestone: "Đạt 90%+ điểm bài thi thử HSK 1 chuẩn 3.0, nhận diện và đọc trơn 500 từ vựng."
        }
      ]
    },
    {
      id: "stage-2",
      title: "Giai đoạn 2: Tăng Tốc & Bứt Phá HSK 2 (1.272 từ tích lũy)",
      timeline: "Tháng 3 - 5 (Tuần 9 - 20)",
      level: "HSK 2",
      badgeColor: "#3b82f6",
      description: "Mở rộng 772 từ mới (đạt 1.272 từ tích lũy), chinh phục 129 điểm ngữ pháp HSK 2, nắm vững câu so sánh, câu chữ 把 sơ cấp, bổ ngữ kết quả và trạng thái.",
      stats: { words: 772, characters: 300, grammar: 129, duration: "12 Tuần" },
      weeks: [
        {
          week: "Tuần 9 - 11",
          title: "HSK 2 Khởi Đầu: Đời Sống, Thể Thao & Sức Khỏe",
          objective: "Học 200 từ HSK 2 (Sở thích, thể thao, sức khỏe, phòng ốc, sinh hoạt) + Bổ ngữ kết quả (完, 到, 懂, 见).",
          dailyRoutine: [
            "25p: Nạp 12-14 từ mới mỗi ngày kèm âm Hán Việt đối chiếu",
            "20p: Ôn tập Flashcard ngắt quãng (HSK 1 + từ HSK 2 mới)",
            "20p: Ngữ pháp bổ ngữ kết quả và câu hỏi với 为什么, 因为...所以...",
            "15p: Luyện nghe hội thoại đời sống 50-80 chữ"
          ],
          keyTopics: ["Bổ ngữ kết quả", "Sức khỏe & bệnh viện (生病, 发烧, 吃药)", "Thể thao (踢足球, 跑步, 游泳)"],
          milestone: "Kể được thói quen sinh hoạt và miêu tả tình trạng sức khỏe cá nhân."
        },
        {
          week: "Tuần 12 - 14",
          title: "HSK 2 Trung Đoạn: Công Sở, Du Lịch & So Sánh",
          objective: "Học 200 từ HSK 2 mới + Câu so sánh với 比, 没有, 一样; Cấu trúc liên động.",
          dailyRoutine: [
            "25p: Nạp 14 từ mới/ngày về chủ đề công việc, di chuyển, sân bay, khách sạn",
            "20p: Flashcard luyện nhớ mặt chữ Hán không kèm Pinyin",
            "20p: Cấu trúc câu so sánh A 比 B + Tính từ, câu chữ 就 và 才",
            "15p: Viết 3-5 câu miêu tả chuyến đi du lịch"
          ],
          keyTopics: ["Câu so sánh 比 / 没有", "Phương tiện máy bay, tàu cao tốc (飞机, 火车)", "Đặt phòng & khách sạn (宾馆, 预订)"],
          milestone: "Biết so sánh đồ vật, giá cả, thời tiết; biết đặt vé và hỏi thông tin chuyến đi."
        },
        {
          week: "Tuần 15 - 17",
          title: "HSK 2 Nâng Cao: Bổ Ngữ Trạng Thái & Câu Chữ 把 Sơ Cấp",
          objective: "Học 200 từ HSK 2 tiếp theo + Bổ ngữ trạng thái với 得, Câu chữ 把 dạng căn bản.",
          dailyRoutine: [
            "25p: Học từ vựng chủ đề cảm xúc sâu hơn, giao tiếp xã giao, mua sắm online",
            "20p: Ôn tập Spaced Repetition danh sách từ hay nhầm",
            "25p: Luyện kỹ câu chữ 把 sơ cấp (S + 把 + O + V + 成/在/到/Khác) và bổ ngữ trạng thái (跑得快, 说得好)",
            "15p: Nghe các đoạn văn ngắn 100-120 chữ"
          ],
          keyTopics: ["Bổ ngữ trạng thái V + 得 + Adj", "Câu chữ 把 cơ bản", "Từ nối 虽然...但是..."],
          milestone: "Sử dụng thành thạo câu chữ 把 và đánh giá trình độ/kỹ năng bằng bổ ngữ trạng thái."
        },
        {
          week: "Tuần 18 - 20",
          title: "Tổng Kết HSK 2 & Luyện Đề Chuẩn HSK 3.0 Cấp 2",
          objective: "Hoàn thiện 172 từ còn lại (đạt mốc 1.272 từ tích lũy), ôn luyện 129 điểm ngữ pháp HSK 2 và thi thử.",
          dailyRoutine: [
            "20p: Học các từ vựng còn lại của HSK 2",
            "25p: Ôn tập tổng thể 1.272 từ vựng trên Flashcard",
            "25p: Luyện giải 3 đề thi thử HSK 2 chuẩn cấu trúc mới",
            "20p: Luyện viết đoạn văn 50-80 chữ giới thiệu một ngày của bạn"
          ],
          keyTopics: ["Tổng ôn 129 điểm ngữ pháp HSK 2", "Giải đề thi HSK 2", "Luyện nghe tốc độ tự nhiên"],
          milestone: "Tự tin thi đỗ HSK 2 điểm cao, có thể giao tiếp cơ bản trôi chảy trong hầu hết tình huống thông thường."
        }
      ]
    },
    {
      id: "stage-3",
      title: "Giai đoạn 3: Bứt Phá HSK 3 (2.245 từ tích lũy - Tiền Trung Cấp)",
      timeline: "Tháng 6 - 8 (Tuần 21 - 32)",
      level: "HSK 3",
      badgeColor: "#8b5cf6",
      description: "Bổ sung 973 từ mới (đạt tổng 2.245 từ HSK 3.0), hoàn thành 210 điểm ngữ pháp HSK 3, chinh phục câu chữ 被, bổ ngữ xu hướng kép, các liên từ phức và đọc hiểu văn bản không cần Pinyin.",
      stats: { words: 973, characters: 300, grammar: 210, duration: "12 Tuần" },
      weeks: [
        {
          week: "Tuần 21 - 23",
          title: "HSK 3 Nhập Môn: Công Nghệ, Môi Trường & Quan Hệ Xã Hội",
          objective: "Học 250 từ HSK 3 mới + Các cặp liên từ phức: 不但...而且..., 只要...就..., 只有...才...",
          dailyRoutine: [
            "30p: Học 15-18 từ mới mỗi ngày (chú ý phân tích cấu tạo chữ và âm Hán Việt)",
            "20p: Ôn tập Flashcard vòng lặp",
            "20p: Đặt câu với các cặp liên từ phức HSK 3",
            "20p: Đọc đoạn văn ngắn 150-200 chữ về chủ đề công nghệ & đời sống"
          ],
          keyTopics: ["Công nghệ (电脑, 互联网, 智能)", "Môi trường (保护, 垃圾, 节约)", "Liên từ phức: 不但...而且..."],
          milestone: "Biết diễn đạt các ý nguyên nhân - kết quả, điều kiện và giả thiết phức tạp."
        },
        {
          week: "Tuần 24 - 26",
          title: "HSK 3 Tăng Tốc: Câu Chữ 被 & Bổ Ngữ Xu Hướng Kép",
          objective: "Học 250 từ HSK 3 mới + Câu bị động chữ 被, 叫, 让; Bổ ngữ xu hướng kép (跑出来, 走过去, 拿起来).",
          dailyRoutine: [
            "30p: Nạp 15-18 từ mới chủ đề văn phòng, đàm phán, phong cách sống",
            "20p: Luyện phản xạ thẻ từ vựng nhận diện mặt chữ tốc độ cao",
            "25p: Cấu trúc câu bị động chữ 被 và bổ ngữ xu hướng kép",
            "15p: Nghe postcard/audio tiếng Trung dài 2-3 phút"
          ],
          keyTopics: ["Câu chữ 被 (Bị động)", "Bổ ngữ xu hướng kép (V + 上/下/进/出/回/过/起 + 来/去)", "Cấu trúc 越...越..."],
          milestone: "Làm chủ hai cấu trúc khó nhất của HSK 3: câu chữ 被 và bổ ngữ xu hướng kép."
        },
        {
          week: "Tuần 27 - 29",
          title: "HSK 3 Chuyên Sâu: Văn Hóa, Xã Hội & Cảm Xúc Phức Hợp",
          objective: "Học 250 từ HSK 3 tiếp theo + Cấu trúc 除了...以外, 連...都..., 甚至, 究竟.",
          dailyRoutine: [
            "30p: Học 16-18 từ vựng mỗi ngày",
            "20p: Ôn tập toàn diện Flashcard HSK 1 - 2 - 3",
            "25p: Luyện đọc các bài văn mẫu HSK 3 (độ dài 250-300 chữ)",
            "15p: Tập tóm tắt lại nội dung đoạn văn bằng 3-4 câu tiếng Trung"
          ],
          keyTopics: ["Văn hóa & phong tục truyền thống", "Đọc hiểu nâng cao không Pinyin", "Cấu trúc 除了...以外..."],
          milestone: "Đọc hiểu trôi chảy các văn bản tiếng Trung thường nhật 300 từ mà không cần dựa vào Pinyin."
        },
        {
          week: "Tuần 30 - 32",
          title: "Tổng Ôn Luyện Đề HSK 3.0 & Về Đích 8 Tháng",
          objective: "Hoàn thiện 223 từ cuối cùng (đạt đủ 2.245 từ HSK 3.0), tổng ôn 387 điểm ngữ pháp và luyện giải đề thi chuẩn.",
          dailyRoutine: [
            "20p: Hoàn tất các từ vựng còn lại",
            "30p: Luyện giải đề thi thử HSK 3 chuẩn định dạng 3.0",
            "20p: Sửa lỗi sai, củng cố các bẫy thường gặp trong bài thi",
            "20p: Tự do hội thoại, xem video tiếng Trung ngắn hiểu 80%+"
          ],
          keyTopics: ["Chiến thuật làm bài thi HSK 3", "Quản lý thời gian bài thi", "Phản xạ nghe - đọc thực tế"],
          milestone: "Chính thức chinh phục HSK 3 (HSK 3.0) sau 8 tháng, sẵn sàng thi chứng chỉ hoặc làm việc cơ bản!"
        }
      ]
    }
  ],
  dailyTemplate: {
    title: "Khung Giờ Vàng Học Hàng Ngày (60 - 90 Phút)",
    steps: [
      { time: "20 Phút", task: "Nạp Từ Mới (10-15 từ)", detail: "Nghe phát âm chuẩn, ghi nhớ âm Hán Việt, phân tích các bộ thủ và đặt 1 câu ví dụ." },
      { time: "20 Phút", task: "Ôn Tập Spaced Repetition", detail: "Lật Flashcard ôn lại từ vựng của 1 ngày trước, 3 ngày trước và 7 ngày trước." },
      { time: "25 Phút", task: "Ngữ Pháp & Mẫu Câu", detail: "Nắm vững 1-2 công thức ngữ pháp của tuần và viết 3 câu ứng dụng thực tế." },
      { time: "15 Phút", task: "Luyện Nghe & Shadowing", detail: "Nghe đoạn hội thoại ngắn, nhại lại theo ngữ điệu người bản xứ để luyện thanh điệu." },
      { time: "10 Phút", task: "Trắc Nghiệm & Kiểm Tra", detail: "Làm 5-10 câu quiz trắc nghiệm trên website để củng cố phản xạ tức thì." }
    ]
  }
};
