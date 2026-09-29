import fs from 'fs';

const allCharsList = JSON.parse(fs.readFileSync('./scripts/all_chars.json', 'utf8'));
const charRadRaw = JSON.parse(fs.readFileSync('./scripts/char_rad_map.json', 'utf8'));

const RADICAL_MASTER_DEFS = {
  "一": { pinyin: "yī", hanViet: "Nhất", origin: "一", meaning: "Số một, khởi đầu, thống nhất", category: "Ký Hiệu & Số Đếm" },
  "丨": { pinyin: "gǔn", hanViet: "Cổn", origin: "丨", meaning: "Nét sổ thẳng đứng, nối trên xuống dưới", category: "Nét Cơ Bản" },
  "丶": { pinyin: "zhǔ", hanViet: "Chủ (Chấm)", origin: "丶", meaning: "Dấu chấm gọn, ngọn đèn", category: "Nét Cơ Bản" },
  "丿": { pinyin: "piě", hanViet: "Phiệt", origin: "丿", meaning: "Nét phẩy vuốt nhọn sang trái", category: "Nét Cơ Bản" },
  "乙": { pinyin: "yǐ", hanViet: "Ất", origin: "乙", meaning: "Mầm cây uốn mình nhú lên, nét cong", category: "Ký Hiệu & Số Đếm" },
  "乛": { pinyin: "yǐ", hanViet: "Ất (Gập)", origin: "乙", meaning: "Nét ngang gập móc, mầm cây", category: "Nét Cơ Bản" },
  "亅": { pinyin: "jué", hanViet: "Quyết", origin: "亅", meaning: "Nét móc câu nhọn hất ngược lên", category: "Nét Cơ Bản" },
  "二": { pinyin: "èr", hanViet: "Nhị", origin: "二", meaning: "Số hai, trời và đất, âm dương hòa hợp", category: "Ký Hiệu & Số Đếm" },
  "亠": { pinyin: "tóu", hanViet: "Đầu", origin: "亠", meaning: "Phần trên nóc, nắp đậy che chắn", category: "Ký Hiệu & Số Đếm" },
  "人": { pinyin: "rén", hanViet: "Nhân", origin: "人", meaning: "Con người, dáng người đi đứng", category: "Con Người & Xã Hội" },
  "亻": { pinyin: "rén", hanViet: "Nhân đứng", origin: "人", meaning: "Liên quan đến con người, tính cách, hành vi", category: "Con Người & Xã Hội" },
  "儿": { pinyin: "ér", hanViet: "Nhi", origin: "儿", meaning: "Đôi chân người đang bước, trẻ nhỏ", category: "Con Người & Xã Hội" },
  "入": { pinyin: "rù", hanViet: "Nhập", origin: "入", meaning: "Bước vào bên trong, gia nhập", category: "Hành Động & Di Chuyển" },
  "八": { pinyin: "bā", hanViet: "Bát", origin: "八", meaning: "Số tám, mở rộng chia tách hai bên", category: "Ký Hiệu & Số Đếm" },
  "丷": { pinyin: "bā", hanViet: "Bát (ngược)", origin: "八", meaning: "Dạng đầu của bộ Bát, mở sang hai bên", category: "Ký Hiệu & Số Đếm" },
  "冂": { pinyin: "jiōng", hanViet: "Quynh", origin: "冂", meaning: "Vùng biên ải xa xôi, đất trống bao quanh", category: "Nhà Cửa & Đồ Vật" },
  "冖": { pinyin: "mì", hanViet: "Mịch", origin: "冖", meaning: "Khăn vuông trùm đầu, che phủ", category: "Nhà Cửa & Đồ Vật" },
  "冫": { pinyin: "bīng", hanViet: "Băng", origin: "冫", meaning: "Băng tuyết đóng băng, giá lạnh, nhiệt độ thấp", category: "Thiên Nhiên & Vũ Trụ" },
  "⺀": { pinyin: "bīng", hanViet: "Băng (chấm)", origin: "冫", meaning: "Biến thể hai chấm băng giá, rét lạnh", category: "Thiên Nhiên & Vũ Trụ" },
  "几": { pinyin: "jī", hanViet: "Kỷ", origin: "几", meaning: "Chiếc bàn trà nhỏ bằng gỗ, chỗ ngồi dựa", category: "Nhà Cửa & Đồ Vật" },
  "凵": { pinyin: "kǎn", hanViet: "Khảm", origin: "凵", meaning: "Miệng hố sâu, đồ vật lòng trũng", category: "Nhà Cửa & Đồ Vật" },
  "刀": { pinyin: "dāo", hanViet: "Đao", origin: "刀", meaning: "Dao kiếm, cắt gọt, chặt chém, chia tách", category: "Nhà Cửa & Đồ Vật" },
  "刂": { pinyin: "dāo", hanViet: "Đao đứng", origin: "刀", meaning: "Dao kiếm dựng đứng, cắt gọt, chia rẽ", category: "Nhà Cửa & Đồ Vật" },
  "力": { pinyin: "lì", hanViet: "Lực", origin: "力", meaning: "Sức mạnh cơ bắp, thể lực, lao động, công sức", category: "Con Người & Xã Hội" },
  "勹": { pinyin: "bāo", hanViet: "Bao", origin: "勹", meaning: "Bọc lại, ôm ấp, bao bọc đồ vật", category: "Hành Động & Di Chuyển" },
  "匕": { pinyin: "bǐ", hanViet: "Chủy", origin: "匕", meaning: "Cái thìa múc canh cơm, dao găm nhỏ", category: "Nhà Cửa & Đồ Vật" },
  "匚": { pinyin: "fāng", hanViet: "Phương", origin: "匚", meaning: "Hòm đựng đồ vật nằm ngang, chứa đồ", category: "Nhà Cửa & Đồ Vật" },
  "匸": { pinyin: "xì", hanViet: "Hệ", origin: "匸", meaning: "Che giấu, cất giữ kín đáo bên trong", category: "Nhà Cửa & Đồ Vật" },
  "十": { pinyin: "shí", hanViet: "Thập", origin: "十", meaning: "Số mười, hoàn chỉnh, thập toàn thập mỹ", category: "Ký Hiệu & Số Đếm" },
  "卜": { pinyin: "bǔ", hanViet: "Bốc", origin: "卜", meaning: "Vết nứt trên mai rùa bói toán thời xưa", category: "Cảm Xúc & Tinh Thần" },
  "卩": { pinyin: "jié", hanViet: "Tiết", origin: "卩", meaning: "Người quỳ gối phục tùng, đốt tre, ấn tín", category: "Con Người & Xã Hội" },
  "㔾": { pinyin: "jié", hanViet: "Tiết (cong)", origin: "卩", meaning: "Biến thể uốn gập của bộ Tiết, quỳ gối", category: "Con Người & Xã Hội" },
  "厂": { pinyin: "chǎng / hǎn", hanViet: "Hán / Xưởng", origin: "厂", meaning: "Sườn núi đá dốc, mái nhà xưởng chế tác", category: "Nhà Cửa & Đồ Vật" },
  "厶": { pinyin: "sī", hanViet: "Tư / Khứu", origin: "厶", meaning: "Riêng tư, bản thân, góc kín", category: "Con Người & Xã Hội" },
  "又": { pinyin: "yòu", hanViet: "Hựu", origin: "又", meaning: "Bàn tay phải nắm lấy, lặp lại hành động, bạn bè", category: "Hành Động & Di Chuyển" },
  "口": { pinyin: "kǒu", hanViet: "Khẩu", origin: "口", meaning: "Miệng, ăn uống, nói năng, gọi tên, phát âm", category: "Con Người & Xã Hội" },
  "囗": { pinyin: "wéi", hanViet: "Vi", origin: "囗", meaning: "Vây quanh, bao bọc 4 phía, chu vi, khuôn viên", category: "Nhà Cửa & Đồ Vật" },
  "土": { pinyin: "tǔ", hanViet: "Thổ", origin: "土", meaning: "Đất đai, bùn đất, mặt đất, công trình xây dựng", category: "Thiên Nhiên & Vũ Trụ" },
  "士": { pinyin: "shì", hanViet: "Sĩ", origin: "士", meaning: "Kẻ sĩ, người có học thức, phẩm chất tài giỏi", category: "Con Người & Xã Hội" },
  "夂": { pinyin: "zhǐ", hanViet: "Trĩ / Tuy", origin: "夂", meaning: "Bước chân đi chậm rãi theo sau", category: "Hành Động & Di Chuyển" },
  "夊": { pinyin: "suī", hanViet: "Tuy", origin: "夊", meaning: "Bước chân chậm chạp, kéo dài phía sau", category: "Hành Động & Di Chuyển" },
  "夕": { pinyin: "xī", hanViet: "Tịch", origin: "夕", meaning: "Buổi chiều tà, hoàng hôn, trăng non, đêm tối", category: "Thiên Nhiên & Vũ Trụ" },
  "大": { pinyin: "dà", hanViet: "Đại", origin: "大", meaning: "Người dang rộng tay chân, to lớn, vĩ đại", category: "Con Người & Xã Hội" },
  "女": { pinyin: "nǚ", hanViet: "Nữ", origin: "女", meaning: "Người phụ nữ, người mẹ, phái đẹp, họ hàng huyết thống", category: "Con Người & Xã Hội" },
  "子": { pinyin: "zǐ", hanViet: "Tử", origin: "子", meaning: "Con cái, trẻ thơ, sinh sôi, học trò, hạt mầm", category: "Con Người & Xã Hội" },
  "宀": { pinyin: "mián", hanViet: "Miên (Mái nhà)", origin: "宀", meaning: "Mái nhà, nơi cư ngụ, nhà ở, che chắn bảo vệ", category: "Nhà Cửa & Đồ Vật" },
  "寸": { pinyin: "cùn", hanViet: "Thốn", origin: "寸", meaning: "Tấc gang tay, khoảng cách đo lường, quy tắc phép tắc", category: "Nhà Cửa & Đồ Vật" },
  "小": { pinyin: "xiǎo", hanViet: "Tiểu", origin: "小", meaning: "Nhỏ bé, ít ỏi, mảnh mai", category: "Ký Hiệu & Số Đếm" },
  "⺌": { pinyin: "xiǎo", hanViet: "Tiểu (đầu)", origin: "小", meaning: "Dạng trên đầu của bộ Tiểu, nhỏ bé", category: "Ký Hiệu & Số Đếm" },
  "尢": { pinyin: "wāng", hanViet: "Uông", origin: "尢", meaning: "Người chân cong khập khiễng, dị biệt", category: "Con Người & Xã Hội" },
  "尸": { pinyin: "shī", hanViet: "Thi", origin: "尸", meaning: "Thân thể người ngồi, nhà ở che chở, phòng ốc", category: "Con Người & Xã Hội" },
  "屮": { pinyin: "chè", hanViet: "Triệt", origin: "屮", meaning: "Chồi non mới nhú lên khỏi mặt đất", category: "Động Vật & Thực Vật" },
  "山": { pinyin: "shān", hanViet: "Sơn", origin: "山", meaning: "Núi non, đồi dốc, vùng cao, đỉnh núi hiểm trở", category: "Thiên Nhiên & Vũ Trụ" },
  "巛": { pinyin: "chuān", hanViet: "Xuyên", origin: "川", meaning: "Dòng sông suối chảy xiết uốn lượn", category: "Thiên Nhiên & Vũ Trụ" },
  "工": { pinyin: "gōng", hanViet: "Công", origin: "工", meaning: "Thợ khéo léo, dụng cụ chế tác, công việc, công sức", category: "Con Người & Xã Hội" },
  "己": { pinyin: "jǐ", hanViet: "Kỷ", origin: "己", meaning: "Bản thân mình, dây quấn uốn cong", category: "Con Người & Xã Hội" },
  "巳": { pinyin: "sì", hanViet: "Tỵ", origin: "巳", meaning: "Chi Tỵ (con rắn), bào thai uốn mình", category: "Động Vật & Thực Vật" },
  "巾": { pinyin: "jīn", hanViet: "Cân", origin: "巾", meaning: "Khăn vải, dải lụa che, vải vóc may mặc", category: "Nhà Cửa & Đồ Vật" },
  "干": { pinyin: "gān", hanViet: "Can", origin: "干", meaning: "Cái khiên che đỡ, khô ráo, làm lụng can dự", category: "Nhà Cửa & Đồ Vật" },
  "幺": { pinyin: "yāo", hanViet: "Yêu", origin: "幺", meaning: "Nhỏ nhoi, sợi tơ non mảnh mai, bé bỏng", category: "Ký Hiệu & Số Đếm" },
  "广": { pinyin: "guǎng", hanViet: "Quảng", origin: "广", meaning: "Mái hiên rộng, kho hàng, kiến trúc có mái che, tòa nhà công", category: "Nhà Cửa & Đồ Vật" },
  "廴": { pinyin: "yǐn", hanViet: "Dẫn", origin: "廴", meaning: "Bước chân dài, kéo dài quãng đường, dẫn dắt", category: "Hành Động & Di Chuyển" },
  "廾": { pinyin: "gǒng", hanViet: "Củng", origin: "廾", meaning: "Hai bàn tay chắp lại dâng lên cung kính", category: "Hành Động & Di Chuyển" },
  "弋": { pinyin: "yì", hanViet: "Dặc", origin: "弋", meaning: "Cọc gỗ nhỏ, bắn tên buộc dây", category: "Nhà Cửa & Đồ Vật" },
  "弓": { pinyin: "gōng", hanViet: "Cung", origin: "弓", meaning: "Cây cung bắn tên uốn cong, vũ khí", category: "Nhà Cửa & Đồ Vật" },
  "彐": { pinyin: "jì", hanViet: "Kế", origin: "彐", meaning: "Đầu con nhím, mõm thú ngửi đồ", category: "Động Vật & Thực Vật" },
  "彡": { pinyin: "shān", hanViet: "Sanh", origin: "彡", meaning: "Lông tơ mịn màng, hoa văn trang trí đẹp đẽ", category: "Ký Hiệu & Số Đếm" },
  "彳": { pinyin: "chì", hanViet: "Xích (Chim chích)", origin: "彳", meaning: "Nửa bước chân trái, hành trình đi lại, đường sá, hành vi", category: "Hành Động & Di Chuyển" },
  "心": { pinyin: "xīn", hanViet: "Tâm", origin: "心", meaning: "Trái tim, tâm tư, tình cảm, cảm xúc và tư duy", category: "Cảm Xúc & Tinh Thần" },
  "忄": { pinyin: "xīn", hanViet: "Tâm đứng", origin: "心", meaning: "Trái tim dựng đứng, cảm xúc, tâm trạng nôn nao", category: "Cảm Xúc & Tinh Thần" },
  "⺗": { pinyin: "xīn", hanViet: "Tâm dưới", origin: "心", meaning: "Biến thể đáy của bộ Tâm, tình cảm đáy lòng", category: "Cảm Xúc & Tinh Thần" },
  "戈": { pinyin: "gē", hanViet: "Qua", origin: "戈", meaning: "Ngọn giáo mác, binh khí cổ, chiến trận", category: "Nhà Cửa & Đồ Vật" },
  "户": { pinyin: "hù", hanViet: "Hộ", origin: "户", meaning: "Một cánh cửa gỗ, hộ gia đình, căn nhà", category: "Nhà Cửa & Đồ Vật" },
  "手": { pinyin: "shǒu", hanViet: "Thủ", origin: "手", meaning: "Bàn tay con người, thao tác cầm nắm, kỹ năng", category: "Hành Động & Di Chuyển" },
  "扌": { pinyin: "shǒu", hanViet: "Đề thủ (Thủ đứng)", origin: "手", meaning: "Bàn tay thao tác cầm nắm, vận động, tác động vật lý", category: "Hành Động & Di Chuyển" },
  "支": { pinyin: "zhī", hanViet: "Chi", origin: "支", meaning: "Cành cây giơ ra, chống đỡ, chi trả", category: "Động Vật & Thực Vật" },
  "攴": { pinyin: "pū", hanViet: "Phác", origin: "攴", meaning: "Cầm que gõ nhẹ, thúc giục hành động", category: "Hành Động & Di Chuyển" },
  "攵": { pinyin: "pū", hanViet: "Phác (đứng)", origin: "攴", meaning: "Cầm que đánh khẽ, thúc giục, cải biến, giáo dục", category: "Hành Động & Di Chuyển" },
  "文": { pinyin: "wén", hanViet: "Văn", origin: "文", meaning: "Hoa văn dệt vẽ, chữ viết, văn học, tri thức", category: "Con Người & Xã Hội" },
  "斗": { pinyin: "dǒu", hanViet: "Đẩu", origin: "斗", meaning: "Cái gáo múc rượu, đấu đong lúa, sao Bắc Đẩu", category: "Nhà Cửa & Đồ Vật" },
  "斤": { pinyin: "jīn", hanViet: "Cân", origin: "斤", meaning: "Cái rìu đốn gỗ, đơn vị cân nặng thời xưa", category: "Nhà Cửa & Đồ Vật" },
  "方": { pinyin: "fāng", hanViet: "Phương", origin: "方", meaning: "Phương hướng, bốn phương ngay ngắn, thuyền đôi", category: "Thiên Nhiên & Vũ Trụ" },
  "无": { pinyin: "wú", hanViet: "Vô", origin: "无", meaning: "Không có, trống không, hư vô", category: "Ký Hiệu & Số Đếm" },
  "日": { pinyin: "rì", hanViet: "Nhật", origin: "日", meaning: "Mặt trời, ban ngày, ngày tháng, thời gian và ánh sáng", category: "Thiên Nhiên & Vũ Trụ" },
  "曰": { pinyin: "yuē", hanViet: "Viết", origin: "曰", meaning: "Mở miệng cất lời rằng, bảo rằng", category: "Con Người & Xã Hội" },
  "月": { pinyin: "yuè", hanViet: "Nguyệt / Nhục", origin: "月/肉", meaning: "Mặt trăng hoặc các bộ phận cơ thể con người (thịt/nhục)", category: "Con Người & Xã Hội" },
  "⺼": { pinyin: "ròu", hanViet: "Nhục (thịt)", origin: "肉", meaning: "Các bộ phận cơ thể thịt xương con người", category: "Con Người & Xã Hội" },
  "肉": { pinyin: "ròu", hanViet: "Nhục", origin: "肉", meaning: "Miếng thịt, cơ bắp cơ thể con người và động vật", category: "Con Người & Xã Hội" },
  "木": { pinyin: "mù", hanViet: "Mộc", origin: "木", meaning: "Cây cối, gỗ, rừng, đồ đạc bằng gỗ tự nhiên", category: "Thiên Nhiên & Vũ Trụ" },
  "欠": { pinyin: "qiàn", hanViet: "Khiếm", origin: "欠", meaning: "Há miệng ngáp, thiếu thốn, nợ nần", category: "Con Người & Xã Hội" },
  "止": { pinyin: "zhǐ", hanViet: "Chỉ", origin: "止", meaning: "Bàn chân đứng yên, dừng lại, đình chỉ", category: "Hành Động & Di Chuyển" },
  "殳": { pinyin: "shū", hanViet: "Thù", origin: "殳", meaning: "Binh khí gậy trúc nhọn không có lưỡi dao", category: "Nhà Cửa & Đồ Vật" },
  "比": { pinyin: "bǐ", hanViet: "Tỉ (So sánh)", origin: "比", meaning: "Hai người sánh vai so sánh cao thấp, kề nhau", category: "Con Người & Xã Hội" },
  "毛": { pinyin: "máo", hanViet: "Mao", origin: "毛", meaning: "Lông thú, sợi tóc mai mỏng mảnh", category: "Động Vật & Thực Vật" },
  "氏": { pinyin: "shì", hanViet: "Thị", origin: "氏", meaning: "Dòng họ, thị tộc, nguồn gốc gia đình", category: "Con Người & Xã Hội" },
  "气": { pinyin: "qì", hanViet: "Khí", origin: "气", meaning: "Hơi nước bốc lên, không khí, thời tiết, khí hậu", category: "Thiên Nhiên & Vũ Trụ" },
  "水": { pinyin: "shuǐ", hanViet: "Thủy", origin: "水", meaning: "Nước sông suối, chất lỏng, dòng chảy", category: "Thiên Nhiên & Vũ Trụ" },
  "氵": { pinyin: "shuǐ", hanViet: "Ba chấm thủy", origin: "水", meaning: "Nước, sông suối, biển cả, chất lỏng và tắm rửa", category: "Thiên Nhiên & Vũ Trụ" },
  "氺": { pinyin: "shuǐ", hanViet: "Thủy (đáy)", origin: "水", meaning: "Biến thể đáy của bộ Thủy, dòng nước chảy róc rách", category: "Thiên Nhiên & Vũ Trụ" },
  "火": { pinyin: "huǒ", hanViet: "Hỏa", origin: "火", meaning: "Ngọn lửa bốc cháy, nhiệt độ, thiêu đốt, chiếu sáng", category: "Thiên Nhiên & Vũ Trụ" },
  "灬": { pinyin: "huǒ", hanViet: "Tứ điểm hỏa", origin: "火", meaning: "Bốn chấm lửa bập bùng bên dưới, nấu nướng nhiệt độ", category: "Thiên Nhiên & Vũ Trụ" },
  "爪": { pinyin: "zhuǎ", hanViet: "Trảo", origin: "爪", meaning: "Bàn chân có móng vuốt chim thú", category: "Động Vật & Thực Vật" },
  "爫": { pinyin: "zhuǎ", hanViet: "Trảo (đầu)", origin: "爪", meaning: "Bàn tay chụp từ trên xuống, móng vuốt", category: "Hành Động & Di Chuyển" },
  "父": { pinyin: "fù", hanViet: "Phụ", origin: "父", meaning: "Người cha tay cầm roi dạy con, bậc bề trên", category: "Con Người & Xã Hội" },
  "片": { pinyin: "piàn", hanViet: "Phiến", origin: "片", meaning: "Mảnh gỗ chẻ đôi mỏng mảnh, phiến lá tấm card", category: "Nhà Cửa & Đồ Vật" },
  "牙": { pinyin: "yá", hanViet: "Nha", origin: "牙", meaning: "Răng nanh ăn khớp, ngà voi sắc nhọn", category: "Con Người & Xã Hội" },
  "牛": { pinyin: "niú", hanViet: "Ngưu", origin: "牛", meaning: "Con trâu bò có đôi sừng nhọn, cày bừa siêng năng", category: "Động Vật & Thực Vật" },
  "牜": { pinyin: "niú", hanViet: "Ngưu đứng", origin: "牛", meaning: "Biến thể đứng của bộ Ngưu, trâu bò chăn nuôi", category: "Động Vật & Thực Vật" },
  "犬": { pinyin: "quǎn", hanViet: "Khuyển", origin: "犬", meaning: "Con chó trung thành, loài thú bốn chân săn mồi", category: "Động Vật & Thực Vật" },
  "犭": { pinyin: "quǎn", hanViet: "Khuyển (đứng)", origin: "犬", meaning: "Động vật bốn chân có lông, muông thú nuôi hoặc hoang dã", category: "Động Vật & Thực Vật" },
  "玄": { pinyin: "xuán", hanViet: "Huyền", origin: "玄", meaning: "Màu đen sẫm sâu thẳm, huyền bí khôn lường", category: "Ký Hiệu & Số Đếm" },
  "玉": { pinyin: "yù", hanViet: "Ngọc", origin: "玉", meaning: "Đá ngọc quý tỏa ánh sáng, báu vật trang sức", category: "Nhà Cửa & Đồ Vật" },
  "王": { pinyin: "wáng", hanViet: "Vương / Ngọc", origin: "玉", meaning: "Viên ngọc quý hoặc bậc vua chúa quyền uy", category: "Nhà Cửa & Đồ Vật" },
  "瓦": { pinyin: "wǎ", hanViet: "Ngõa", origin: "瓦", meaning: "Viên ngói đất sét nung lợp mái nhà", category: "Nhà Cửa & Đồ Vật" },
  "甘": { pinyin: "gān", hanViet: "Cam", origin: "甘", meaning: "Vị ngọt dịu ngậm trong miệng", category: "Cảm Xúc & Tinh Thần" },
  "生": { pinyin: "shēng", hanViet: "Sinh", origin: "生", meaning: "Chồi non sinh sôi nảy nở, sự sống, sống động", category: "Thiên Nhiên & Vũ Trụ" },
  "用": { pinyin: "yòng", hanViet: "Dụng", origin: "用", meaning: "Cái thùng đựng đồ, sử dụng phát huy công dụng", category: "Hành Động & Di Chuyển" },
  "田": { pinyin: "tián", hanViet: "Điền", origin: "田", meaning: "Thửa ruộng vuông vức, đất canh tác trồng trọt", category: "Thiên Nhiên & Vũ Trụ" },
  "疋": { pinyin: "pǐ", hanViet: "Thất", origin: "疋", meaning: "Cuộn vải dệt, bàn chân bước đi", category: "Nhà Cửa & Đồ Vật" },
  "疒": { pinyin: "nì", hanViet: "Nạch", origin: "疒", meaning: "Người nằm ốm liệt giường, bệnh tật, đau đớn", category: "Con Người & Xã Hội" },
  "癶": { pinyin: "bō", hanViet: "Bát (bước)", origin: "癶", meaning: "Hai chân giẫm ngược nhau, leo trèo bước đi", category: "Hành Động & Di Chuyển" },
  "白": { pinyin: "bái", hanViet: "Bạch", origin: "白", meaning: "Màu trắng tinh khôi, sự trong sáng, ánh sáng ban ngày", category: "Thiên Nhiên & Vũ Trụ" },
  "皮": { pinyin: "pí", hanViet: "Bì", origin: "皮", meaning: "Bàn tay lột tấm da thú, lớp vỏ ngoài", category: "Con Người & Xã Hội" },
  "皿": { pinyin: "mǐn", hanViet: "Mãnh", origin: "皿", meaning: "Cái bát đĩa, chén đĩa lòng nông đựng thức ăn", category: "Nhà Cửa & Đồ Vật" },
  "目": { pinyin: "mù", hanViet: "Mục", origin: "目", meaning: "Đôi mắt con người, thị giác, nhìn ngó, quan sát", category: "Con Người & Xã Hội" },
  "矛": { pinyin: "máo", hanViet: "Mâu", origin: "矛", meaning: "Ngọn giáo dài nhọn tấn công đâm xuyên", category: "Nhà Cửa & Đồ Vật" },
  "矢": { pinyin: "shǐ", hanViet: "Thỉ", origin: "矢", meaning: "Mũi tên bay thẳng vào hồng tâm, ngay thẳng", category: "Nhà Cửa & Đồ Vật" },
  "石": { pinyin: "shí", hanViet: "Thạch", origin: "石", meaning: "Đá tảng dưới vách núi, khoáng vật rắn chắc", category: "Thiên Nhiên & Vũ Trụ" },
  "示": { pinyin: "shì", hanViet: "Thị", origin: "示", meaning: "Bàn thờ tổ tiên, điềm báo thần linh, chúc phúc", category: "Cảm Xúc & Tinh Thần" },
  "礻": { pinyin: "shì", hanViet: "Thị (đứng)", origin: "示", meaning: "Bàn thờ thần linh, điềm báo, phước lành nghi lễ", category: "Cảm Xúc & Tinh Thần" },
  "禸": { pinyin: "róu", hanViet: "Nhựu", origin: "禸", meaning: "Dấu chân muông thú giẫm trên nền đất mềm", category: "Động Vật & Thực Vật" },
  "禾": { pinyin: "hé", hanViet: "Hòa", origin: "禾", meaning: "Cây lúa non, bông lúa chín trĩu hạt, nghề nông", category: "Động Vật & Thực Vật" },
  "穴": { pinyin: "xué", hanViet: "Huyệt", origin: "穴", meaning: "Hang hốc dưới mái đất, không gian rỗng, cửa sổ", category: "Nhà Cửa & Đồ Vật" },
  "立": { pinyin: "lì", hanViet: "Lập", origin: "立", meaning: "Người đứng vững thẳng trên mặt đất, thiết lập", category: "Hành Động & Di Chuyển" },
  "竹": { pinyin: "zhú", hanViet: "Trúc", origin: "竹", meaning: "Cây tre trúc đốt thẳng, vật dụng tre nứa", category: "Động Vật & Thực Vật" },
  "⺮": { pinyin: "zhú", hanViet: "Trúc (đầu)", origin: "竹", meaning: "Lá tre trúc rủ xuống, cây bút tre, thẻ sách", category: "Động Vật & Thực Vật" },
  "米": { pinyin: "mǐ", hanViet: "Mễ", origin: "米", meaning: "Hạt gạo trắng ngọc, lương thực ngũ cốc", category: "Nhà Cửa & Đồ Vật" },
  "糸": { pinyin: "mì", hanViet: "Mịch / Ty", origin: "糸", meaning: "Bó sợi tơ tằm dệt lụa, sự liên kết gắn bó", category: "Nhà Cửa & Đồ Vật" },
  "纟": { pinyin: "sī / mì", hanViet: "Mịch (sợi tơ)", origin: "糹/糸", meaning: "Sợi tơ dệt vải, màu sắc tơ lụa và sự kết nối", category: "Nhà Cửa & Đồ Vật" },
  "缶": { pinyin: "fǒu", hanViet: "Phẫu", origin: "缶", meaning: "Đồ gốm đất nung cổ miệng nhỏ bụng to đựng rượu", category: "Nhà Cửa & Đồ Vật" },
  "网": { pinyin: "wǎng", hanViet: "Võng", origin: "网", meaning: "Tấm lưới bắt cá chim, mạng lưới pháp luật", category: "Nhà Cửa & Đồ Vật" },
  "罒": { pinyin: "wǎng", hanViet: "Võng (ngang)", origin: "网", meaning: "Biến thể đầu của tấm lưới giăng bắt", category: "Nhà Cửa & Đồ Vật" },
  "羊": { pinyin: "yáng", hanViet: "Dương", origin: "羊", meaning: "Con dê cừu hiền lành có đôi sừng uốn, điềm tốt lành", category: "Động Vật & Thực Vật" },
  "羽": { pinyin: "yǔ", hanViet: "Vũ", origin: "羽", meaning: "Lông vũ chim chóc, đôi cánh bay lượn", category: "Động Vật & Thực Vật" },
  "老": { pinyin: "lǎo", hanViet: "Lão", origin: "老", meaning: "Cụ già râu tóc bạc phơ chống gậy, kính trọng", category: "Con Người & Xã Hội" },
  "耂": { pinyin: "lǎo", hanViet: "Lão (đầu)", origin: "老", meaning: "Dạng đầu của bộ Lão, người cao tuổi", category: "Con Người & Xã Hội" },
  "而": { pinyin: "ér", hanViet: "Nhi", origin: "而", meaning: "Râu cằm rủ xuống, liên từ mà / vả lại", category: "Con Người & Xã Hội" },
  "耳": { pinyin: "ěr", hanViet: "Nhĩ", origin: "耳", meaning: "Chiếc tai, thính giác, nghe ngóng âm thanh", category: "Con Người & Xã Hội" },
  "臣": { pinyin: "chén", hanViet: "Thần", origin: "臣", meaning: "Bề tôi cúi mắt trung thành, thần tử triều đình", category: "Con Người & Xã Hội" },
  "自": { pinyin: "zì", hanViet: "Tự", origin: "自", meaning: "Cái mũi trỏ vào bản thân mình, tự giác, từ xuất phát", category: "Con Người & Xã Hội" },
  "至": { pinyin: "zhì", hanViet: "Chí", origin: "至", meaning: "Mũi tên bay cắm xuống đích, đến nơi, tột cùng", category: "Hành Động & Di Chuyển" },
  "舌": { pinyin: "shé", hanViet: "Thiệt", origin: "舌", meaning: "Cái lưỡi trong khoang miệng, vị giác, lời nói", category: "Con Người & Xã Hội" },
  "舛": { pinyin: "chuǎn", hanViet: "Suyễn", origin: "舛", meaning: "Hai bàn chân giẫm ngược chiều nhau, sai lệch", category: "Hành Động & Di Chuyển" },
  "舟": { pinyin: "zhōu", hanViet: "Chu", origin: "舟", meaning: "Chiếc thuyền gỗ lướt trên mặt nước", category: "Nhà Cửa & Đồ Vật" },
  "色": { pinyin: "sè", hanViet: "Sắc", origin: "色", meaning: "Sắc màu rực rỡ, dung nhan, sắc thái", category: "Thiên Nhiên & Vũ Trụ" },
  "艹": { pinyin: "cǎo", hanViet: "Thảo đầu", origin: "草", meaning: "Cỏ cây hoa lá, thực vật thảo mộc, rau củ quả", category: "Động Vật & Thực Vật" },
  "虎": { pinyin: "hǔ", hanViet: "Hổ", origin: "虎", meaning: "Con hổ vằn dũng mãnh, chúa sơn lâm", category: "Động Vật & Thực Vật" },
  "虫": { pinyin: "chóng", hanViet: "Trùng", origin: "虫", meaning: "Sâu bọ, côn trùng, bò sát nhỏ đẻ trứng", category: "Động Vật & Thực Vật" },
  "行": { pinyin: "xíng", hanViet: "Hành", origin: "行", meaning: "Ngã tư đường lớn, đi lại di chuyển, hành vi", category: "Hành Động & Di Chuyển" },
  "衣": { pinyin: "yī", hanViet: "Y", origin: "衣", meaning: "Quần áo, may mặc, trang phục, vải vóc che thân", category: "Nhà Cửa & Đồ Vật" },
  "衤": { pinyin: "yī", hanViet: "Y (đứng)", origin: "衣", meaning: "Quần áo may mặc, vạt áo, vải vóc", category: "Nhà Cửa & Đồ Vật" },
  "西": { pinyin: "xī", hanViet: "Tây", origin: "西", meaning: "Phương Tây mặt trời lặn chim đậu về tổ", category: "Thiên Nhiên & Vũ Trụ" },
  "覀": { pinyin: "xī", hanViet: "Á / Tây", origin: "西", meaning: "Tấm bọc đậy bên trên, hướng tây", category: "Thiên Nhiên & Vũ Trụ" },
  "见": { pinyin: "jiàn", hanViet: "Kiến", origin: "見", meaning: "Mắt mở to nhìn thấy, trông thấy, gặp gỡ", category: "Con Người & Xã Hội" },
  "角": { pinyin: "jiǎo", hanViet: "Giác", origin: "角", meaning: "Cái sừng thú nhọn hoắt, góc cạnh, tranh đấu", category: "Động Vật & Thực Vật" },
  "言": { pinyin: "yán", hanViet: "Ngôn", origin: "言", meaning: "Lời nói, ngôn ngữ phát ra từ miệng, đối thoại", category: "Cảm Xúc & Tinh Thần" },
  "讠": { pinyin: "yán", hanViet: "Ngôn (đứng)", origin: "言", meaning: "Lời nói, ngôn ngữ, phát ngôn, đối thoại, chữ nghĩa", category: "Cảm Xúc & Tinh Thần" },
  "豕": { pinyin: "shǐ", hanViet: "Thỉ", origin: "豕", meaning: "Con heo (lợn) nuôi trong nhà ấm no", category: "Động Vật & Thực Vật" },
  "贝": { pinyin: "bèi", hanViet: "Bối", origin: "貝", meaning: "Vỏ sò tiền tệ cổ đại, tiền của, quý giá, thương mại", category: "Nhà Cửa & Đồ Vật" },
  "走": { pinyin: "zǒu", hanViet: "Tẩu", origin: "走", meaning: "Người rảo bước chạy nhanh, đi bộ, di chuyển", category: "Hành Động & Di Chuyển" },
  "足": { pinyin: "zú", hanViet: "Túc", origin: "足", meaning: "Bàn chân, bước đi, chạy nhảy, đá chân", category: "Hành Động & Di Chuyển" },
  "⻊": { pinyin: "zú", hanViet: "Túc (đứng)", origin: "足", meaning: "Bàn chân bước đi, chạy nhảy, vận động thể lực", category: "Hành Động & Di Chuyển" },
  "身": { pinyin: "shēn", hanViet: "Thân", origin: "身", meaning: "Thân thể người mang thai, vóc dáng, chính mình", category: "Con Người & Xã Hội" },
  "车": { pinyin: "chē", hanViet: "Xa", origin: "車", meaning: "Xe cộ, bánh xe lăn, phương tiện giao thông trên cạn", category: "Nhà Cửa & Đồ Vật" },
  "辛": { pinyin: "xīn", hanViet: "Tân", origin: "辛", meaning: "Mũi dao khắc trừng phạt, cay đắng, khổ cực gian truân", category: "Cảm Xúc & Tinh Thần" },
  "辰": { pinyin: "chén", hanViet: "Thần", origin: "辰", meaning: "Thời điểm nhật nguyệt gặp gỡ, thì giờ, rồng bay", category: "Thiên Nhiên & Vũ Trụ" },
  "辶": { pinyin: "chuò", hanViet: "Xước", origin: "辵", meaning: "Bước chân đi tới, đi lại, khoảng cách đường sá", category: "Hành Động & Di Chuyển" },
  "阝": { pinyin: "fù / yì", hanViet: "Phụ (trái) / Ấp (phải)", origin: "阜/邑", meaning: "Bên trái là gò đất (阜); bên phải là thành quách, nơi chốn (邑)", category: "Thiên Nhiên & Vũ Trụ" },
  "酉": { pinyin: "yǒu", hanViet: "Dậu", origin: "酉", meaning: "Bình rượu ủ men thơm ngon, men rượu, mùa thu chín", category: "Nhà Cửa & Đồ Vật" },
  "里": { pinyin: "lǐ", hanViet: "Lý", origin: "里", meaning: "Thửa ruộng bên làng xóm, dặm đường, bên trong", category: "Thiên Nhiên & Vũ Trụ" },
  "金": { pinyin: "jīn", hanViet: "Kim", origin: "金", meaning: "Kim loại quý, vàng bạc, tiền tệ cổ kim", category: "Nhà Cửa & Đồ Vật" },
  "钅": { pinyin: "jīn", hanViet: "Kim (đứng)", origin: "金", meaning: "Kim loại, tiền bạc, sắt thép, đồng hồ, chuông", category: "Nhà Cửa & Đồ Vật" },
  "长": { pinyin: "cháng", hanViet: "Trường", origin: "長", meaning: "Mái tóc dài thướt tha, chiều dài, trưởng thành", category: "Con Người & Xã Hội" },
  "门": { pinyin: "mén", hanViet: "Môn", origin: "門", meaning: "Hai cánh cửa khép mở, then chốt, phòng ốc lối ra vào", category: "Nhà Cửa & Đồ Vật" },
  "雨": { pinyin: "yǔ", hanViet: "Vũ", origin: "雨", meaning: "Mưa rơi từ mây trời, thời tiết khí tượng thiên nhiên", category: "Thiên Nhiên & Vũ Trụ" },
  "青": { pinyin: "qīng", hanViet: "Thanh", origin: "青", meaning: "Màu xanh biếc của cây cỏ non, thanh xuân trong sáng", category: "Thiên Nhiên & Vũ Trụ" },
  "非": { pinyin: "fēi", hanViet: "Phi", origin: "非", meaning: "Đôi cánh xòe ngược nhau, không phải, phản đối", category: "Ký Hiệu & Số Đếm" },
  "面": { pinyin: "miàn", hanViet: "Diện", origin: "面", meaning: "Khuôn mặt con người, bề mặt, diện mạo", category: "Con Người & Xã Hội" },
  "革": { pinyin: "gé", hanViet: "Cách", origin: "革", meaning: "Tấm da thú đã thuộc phẳng phiu, thay đổi cải cách", category: "Nhà Cửa & Đồ Vật" },
  "韦": { pinyin: "wéi", hanViet: "Vi", origin: "韋", meaning: "Miếng da thuộc mềm mại, bao quanh bảo vệ", category: "Nhà Cửa & Đồ Vật" },
  "音": { pinyin: "yīn", hanViet: "Âm", origin: "音", meaning: "Âm thanh tiếng nói trong miệng phát ra, âm nhạc", category: "Con Người & Xã Hội" },
  "页": { pinyin: "yè", hanViet: "Hiệt", origin: "頁", meaning: "Cái đầu con người, gáy hoặc trang giấy, tài liệu", category: "Con Người & Xã Hội" },
  "风": { pinyin: "fēng", hanViet: "Phong", origin: "風", meaning: "Gió thổi muôn nơi, phong cảnh, tác phong", category: "Thiên Nhiên & Vũ Trụ" },
  "飞": { pinyin: "fēi", hanViet: "Phi", origin: "飛", meaning: "Loài chim sải cánh bay vút lên trời xanh", category: "Động Vật & Thực Vật" },
  "食": { pinyin: "shí", hanViet: "Thực", origin: "食", meaning: "Lương thực, đồ ăn uống dinh dưỡng, ẩm thực", category: "Nhà Cửa & Đồ Vật" },
  "饣": { pinyin: "shí", hanViet: "Thực (đứng)", origin: "食", meaning: "Đồ ăn, lương thực, ăn uống no đói, ẩm thực nhà hàng", category: "Nhà Cửa & Đồ Vật" },
  "首": { pinyin: "shǒu", hanViet: "Thủ", origin: "首", meaning: "Cái đầu có tóc, đi đầu, thủ lĩnh, khởi đầu", category: "Con Người & Xã Hội" },
  "香": { pinyin: "xiāng", hanViet: "Hương", origin: "香", meaning: "Hương lúa ngọt ngào, mùi thơm quyến rũ", category: "Cảm Xúc & Tinh Thần" },
  "马": { pinyin: "mǎ", hanViet: "Mã", origin: "馬", meaning: "Con ngựa phi nhanh tung vó kéo xe", category: "Động Vật & Thực Vật" },
  "高": { pinyin: "gāo", hanViet: "Cao", origin: "高", meaning: "Lầu gác cao vút, cao ráo, trình độ xuất sắc", category: "Nhà Cửa & Đồ Vật" },
  "鱼": { pinyin: "yú", hanViet: "Ngư", origin: "魚", meaning: "Loài cá bơi lội dưới nước, thủy hải sản tươi ngon", category: "Động Vật & Thực Vật" },
  "鸟": { pinyin: "niǎo", hanViet: "Điểu", origin: "鳥", meaning: "Loài chim có lông vũ dài và cánh bay lượn trên trời", category: "Động Vật & Thực Vật" },
  "黄": { pinyin: "huáng", hanViet: "Hoàng", origin: "黄", meaning: "Màu vàng hoàng thổ đất đai, vua chúa quyền quý", category: "Thiên Nhiên & Vũ Trụ" },
  "黑": { pinyin: "hēi", hanViet: "Hắc", origin: "黑", meaning: "Màu đen muội than, bóng đêm tối tăm", category: "Thiên Nhiên & Vũ Trụ" },
  "鼓": { pinyin: "gǔ", hanViet: "Cổ", origin: "鼓", meaning: "Cái trống da, gõ trống thúc giục, cổ vũ tinh thần", category: "Nhà Cửa & Đồ Vật" },
  "鼻": { pinyin: "bí", hanViet: "Tỵ", origin: "鼻", meaning: "Chiếc mũi con người hít thở, khứu giác ngửi mùi", category: "Con Người & Xã Hội" },
  "龟": { pinyin: "guī", hanViet: "Quy", origin: "龜", meaning: "Con rùa trường thọ, mai rùa bói toán thiêng liêng", category: "Động Vật & Thực Vật" },
  "民": { pinyin: "mín", hanViet: "Dân", origin: "民", meaning: "Người dân, bách tính trăm họ, cư dân", category: "Con Người & Xã Hội" }
};

// Đảm bảo mọi radical đều có trường char
const finalDefs = {};
for (const [k, v] of Object.entries(RADICAL_MASTER_DEFS)) {
  finalDefs[k] = {
    char: k,
    ...v
  };
}

const fileContent = `// Hệ Thống Tra Cứu Bộ Thủ Toàn Diện Cho Toàn Bộ Từ Vựng HSK 1 - 3
// Chuẩn hóa 214 Bộ Thủ Khang Hy và ánh xạ 1.016 Chữ Hán Cốt Lõi

export const RADICAL_DATABASE = ${JSON.stringify(finalDefs, null, 2)};

export const CHAR_TO_RADICAL = ${JSON.stringify(charRadRaw, null, 2)};

/**
 * Lấy danh sách thông tin bộ thủ đầy đủ cho từng chữ Hán cấu thành trong một từ vựng
 * @param {string} hanzi - Từ vựng chữ Hán (ví dụ: '你好', '吃', '出租车')
 * @returns {Array<Object>} Danh sách bộ thủ cho từng chữ
 */
export function getRadicalsForWord(hanzi) {
  if (!hanzi || typeof hanzi !== 'string') return [];
  
  const chars = Array.from(hanzi).filter(ch => /[\\u4e00-\\u9fa5]/.test(ch));
  if (chars.length === 0) return [];

  // Lọc lấy các chữ Hán duy nhất để tránh lặp (ví dụ 谢谢, 妈妈, 爸爸)
  const uniqueChars = Array.from(new Set(chars));

  return uniqueChars.map(ch => {
    const radSymbol = CHAR_TO_RADICAL[ch] || ch;
    const def = RADICAL_DATABASE[radSymbol] || RADICAL_DATABASE[ch] || {
      char: radSymbol,
      origin: radSymbol,
      pinyin: '',
      hanViet: radSymbol,
      meaning: 'Bộ thủ chữ ' + ch,
      category: 'Căn Bản'
    };

    return {
      forChar: ch,
      char: def.char,
      origin: def.origin,
      radicalName: def.hanViet,
      pinyin: def.pinyin,
      meaning: def.meaning,
      category: def.category
    };
  });
}

/**
 * Lấy thông tin định nghĩa chi tiết của một bộ thủ
 * @param {string} radicalChar 
 * @returns {Object|null}
 */
export function getRadicalInfo(radicalChar) {
  if (!radicalChar) return null;
  return RADICAL_DATABASE[radicalChar] || null;
}

/**
 * Lấy danh sách các bộ thủ xuất hiện nhiều nhất trong kho từ vựng kèm số lượng chữ
 * Phục vụ cho bộ lọc danh mục bộ thủ trong Kho Từ Vựng
 * @returns {Array<Object>}
 */
export function getAllAvailableRadicals() {
  const counts = {};
  for (const rad of Object.values(CHAR_TO_RADICAL)) {
    counts[rad] = (counts[rad] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([rad, count]) => {
      const def = RADICAL_DATABASE[rad] || { hanViet: rad, meaning: '' };
      return {
        char: rad,
        count,
        hanViet: def.hanViet,
        meaning: def.meaning,
        origin: def.origin || rad,
        pinyin: def.pinyin || ''
      };
    });
}

/**
 * Kiểm tra xem từ vựng có chứa bộ thủ này hay không
 * @param {string} hanzi 
 * @param {string} targetRadicalChar 
 * @returns {boolean}
 */
export function wordContainsRadical(hanzi, targetRadicalChar) {
  if (!hanzi || !targetRadicalChar) return false;
  const rads = getRadicalsForWord(hanzi);
  return rads.some(r => r.char === targetRadicalChar || r.origin === targetRadicalChar);
}
`;

fs.writeFileSync('./src/data/radicalDict.js', fileContent);
console.log('Successfully generated src/data/radicalDict.js!');
