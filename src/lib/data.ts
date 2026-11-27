import type { Lang } from './i18n';

export interface CarouselSlide {
  image: string;
  titleVi: string;
  titleEn: string;
  subVi: string;
  subEn: string;
}

export const slides: CarouselSlide[] = [
  {
    image:
      'https://images.pexels.com/photos/6455961/pexels-photo-6455961.jpeg?auto=compress&cs=tinysrgb&w=900',
    titleVi: 'Bảo tàng gốm Bát Tràng',
    titleEn: 'Bat Trang Ceramic Museum',
    subVi: 'Kiến trúc gốm độc đáo & cổ vật 700 năm',
    subEn: 'Iconic architecture & 700-year relics',
  },
  {
    image:
      'https://images.pexels.com/photos/6455960/pexels-photo-6455960.jpeg?auto=compress&cs=tinysrgb&w=900',
    titleVi: 'Chợ gốm Bát Tràng',
    titleEn: 'Bat Trang Pottery Market',
    subVi: 'Hàng trăm gian hàng chén bát, lọ hoa, trầm hương',
    subEn: 'Hundreds of stalls of bowls, vases & incense',
  },
  {
    image:
      'https://images.pexels.com/photos/7425137/pexels-photo-7425137.jpeg?auto=compress&cs=tinysrgb&w=900',
    titleVi: 'Tour xe điện khám phá làng',
    titleEn: 'Electric Cart Village Tour',
    subVi: 'Vòng quanh làng cổ 30 phút, chỉ 30.000đ',
    subEn: '30-minute old village loop, from 30k VND',
  },
  {
    image:
      'https://images.pexels.com/photos/4992659/pexels-photo-4992659.jpeg?auto=compress&cs=tinysrgb&w=900',
    titleVi: 'Tự tay làm gốm cùng nghệ nhân',
    titleEn: 'Hands-on Pottery with Artisans',
    subVi: 'Trải nghiệm xoay mâm & vẽ gốm từ 50.000đ',
    subEn: 'Wheel-throwing & painting from 50k VND',
  },
  {
    image:
      'https://images.pexels.com/photos/10697982/pexels-photo-10697982.jpeg?auto=compress&cs=tinysrgb&w=900',
    titleVi: 'Phố cổ bên bờ sông Hồng',
    titleEn: 'Ancient Streets by the Red River',
    subVi: 'Check-in con hẻm gốm & bến sông trăm năm',
    subEn: 'Check in at pottery alleys & century-old wharf',
  },
];

export interface FoodItem {
  emoji: string;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
}

export const foods: FoodItem[] = [
  {
    emoji: '🦑',
    nameVi: 'Canh măng mực',
    nameEn: 'Dried squid & bamboo soup',
    descVi: 'Món đãi khách trứ danh của làng gốm, măng tươi nấu cùng mực khô dẻo thơm.',
    descEn: 'The village’s famous feast dish — fresh bamboo shoots with sun-dried squid.',
  },
  {
    emoji: '🥟',
    nameVi: 'Bánh tẻ',
    nameEn: 'Banh te rice cake',
    descVi: 'Bánh gạo lá dong gói đôi, nhân thịt nằm giữa lớp bột gạo dẻo.',
    descEn: 'Steamed rice cakes wrapped in dong leaves with seasoned pork filling.',
  },
  {
    emoji: '🍖',
    nameVi: 'Giò thủ Bát Tràng',
    nameEn: 'Bat Trang pork terrine',
    descVi: 'Giò thủ tai heo giòn sần, ăn kèm bánh đúc nóng.',
    descEn: 'Crunchy ear terrine served with warm rice cake.',
  },
  {
    emoji: '🌿',
    nameVi: 'Rau cui làng Kim Lan',
    nameEn: 'Kim Lan wild herbs',
    descVi: 'Rau cui dân dã chần sôi, chấm mắm đậu phộng.',
    descEn: 'Wild river greens blanched, dipped in peanut fish sauce.',
  },
  {
    emoji: '🍲',
    nameVi: 'Chè kho Phù Chần',
    nameEn: 'Phu Chan green bean sweet',
    descVi: 'Chè kho đỗ xanh dẻo thơm, món ăn chay ngày rằm.',
    descEn: 'Sticky green-bean sweet paste, a vegetarian festival dish.',
  },
  {
    emoji: '🥖',
    nameVi: 'Bánh đa Kế (lân cận)',
    nameEn: 'Banh da ke crackers',
    descVi: 'Bánh gạo nướng giòn quê Bắc Ninh, mua về làm quà.',
    descEn: 'Crispy roasted rice crackers from nearby Bac Ninh, a gift favorite.',
  },
];

export interface Eatery {
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  rating: number;
  priceVi: string;
  priceEn: string;
}

export const eateries: Eatery[] = [
  {
    nameVi: 'Vườn Âm Nhạc Bát Tràng',
    nameEn: 'Bat Trang Garden Restaurant',
    descVi: 'Set canh măng mực đầy đủ, sân vườn rộng đón đoàn.',
    descEn: 'Full squid-bamboo sets, big garden for groups.',
    rating: 4.7,
    priceVi: '120.000đ–200.000đ/người',
    priceEn: '120k–200k VND/person',
  },
  {
    nameVi: 'Quán Bún Đậu 28',
    nameEn: 'Bun Dau 28 Eatery',
    descVi: 'Bún đậu mắm tôm gần chợ gốm, nhanh & rẻ.',
    descEn: 'Noodle & tofu with shrimp paste near the market, fast & cheap.',
    rating: 4.4,
    priceVi: '45.000đ–70.000đ/người',
    priceEn: '45k–70k VND/person',
  },
  {
    nameVi: 'Giao Tiếp Café gốm',
    nameEn: 'Giao Tiep Ceramic Café',
    descVi: 'Cà phê trong nhà gốm, thử món chè kho nhà làm.',
    descEn: 'Coffee inside a pottery house, homemade green-bean sweet.',
    rating: 4.6,
    priceVi: '35.000đ–60.000đ/người',
    priceEn: '35k–60k VND/person',
  },
  {
    nameVi: 'Nhà hàng sông Hồngview',
    nameEn: 'Red River View Restaurant',
    descVi: 'Ngắm sông Hồng, chuyên hải sản sông & giò thủ.',
    descEn: 'Red River views, river seafood & pork terrine.',
    rating: 4.3,
    priceVi: '150.000đ–250.000đ/người',
    priceEn: '150k–250k VND/person',
  },
];

export interface Experience {
  id: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  priceVi: string;
  priceEn: string;
  durationVi: string;
  durationEn: string;
  icon: 'wheel' | 'paint' | 'cart' | 'eco';
}

export const experiences: Experience[] = [
  {
    id: 'wheel',
    icon: 'wheel',
    titleVi: 'Xoay mâm gốm cùng nghệ nhân',
    titleEn: 'Pottery wheel with an artisan',
    descVi: 'Tự tay nặn một sản phẩm gốm mang về nhà.',
    descEn: 'Shape your own ceramic piece to take home.',
    priceVi: '50.000đ/người',
    priceEn: '50k VND/person',
    durationVi: '60 phút',
    durationEn: '60 minutes',
  },
  {
    id: 'paint',
    icon: 'paint',
    titleVi: 'Vẽ gốm & nung tại lò',
    titleEn: 'Ceramic painting & kiln firing',
    descVi: 'Vẽ lên bình trắng, nhận sản phẩm sau 2 ngày.',
    descEn: 'Paint a white vase, pick it up after 2 days.',
    priceVi: '70.000đ/người',
    priceEn: '70k VND/person',
    durationVi: '90 phút',
    durationEn: '90 minutes',
  },
  {
    id: 'cart',
    icon: 'cart',
    titleVi: 'Tour xe điện quanh làng',
    titleEn: 'Electric cart village tour',
    descVi: 'Vòng quanh đình làng, chợ gốm và bến sông.',
    descEn: 'Loop past the communal house, market & wharf.',
    priceVi: '30.000đ/người',
    priceEn: '30k VND/person',
    durationVi: '30 phút',
    durationEn: '30 minutes',
  },
  {
    id: 'eco',
    icon: 'eco',
    titleVi: 'Eco-tour thả diều & câu cá',
    titleEn: 'Eco-tour: kites & fishing',
    descVi: 'Ngoài trời bên đê sông Hồng, phù hợp gia đình.',
    descEn: 'Outdoor fun on the Red River dike, family-friendly.',
    priceVi: '80.000đ/người',
    priceEn: '80k VND/person',
    durationVi: '2 giờ',
    durationEn: '2 hours',
  },
];

export interface Itinerary {
  time: string;
  titleVi: string;
  titleEn: string;
}

export const halfDayItinerary: Itinerary[] = [
  { time: '8:30', titleVi: 'Khởi hành từ Hà Nội qua cầu Chương Dương', titleEn: 'Arrive via Chuong Duong bridge' },
  { time: '9:00', titleVi: 'Tham quan Bảo tàng gốm Bát Tràng', titleEn: 'Visit the Ceramic Museum' },
  { time: '10:30', titleVi: 'Trải nghiệm xoay mâm tại xưởng gốm', titleEn: 'Pottery wheel at a workshop' },
  { time: '12:00', titleVi: 'Ăn trưa canh măng mực', titleEn: 'Lunch: squid & bamboo soup' },
  { time: '13:30', titleVi: 'Mua sắm tại chợ gốm & về Hà Nội', titleEn: 'Shop the pottery market & return' },
];

export const fullDayItinerary: Itinerary[] = [
  { time: '8:00', titleVi: 'Khởi hành từ Hà Nội', titleEn: 'Depart Hanoi' },
  { time: '9:00', titleVi: 'Bảo tàng gốm & đình làng', titleEn: 'Museum & communal house' },
  { time: '11:00', titleVi: 'Vẽ gốm & nung lò', titleEn: 'Ceramic painting & kiln' },
  { time: '12:30', titleVi: 'Ăn trưa view sông Hồng', titleEn: 'Lunch with river view' },
  { time: '14:00', titleVi: 'Tour xe điện & check-in bến sông', titleEn: 'Cart tour & wharf check-in' },
  { time: '15:30', titleVi: 'Trà đạo trong nhà gốm cổ', titleEn: 'Tea ceremony in an old pottery house' },
  { time: '17:00', titleVi: 'Ngắm hoàng hôn sông Hồng & về', titleEn: 'Sunset on the Red River & return' },
];

export interface Etiquette {
  icon: 'respect' | 'camera' | 'hands' | 'walk' | 'bargain' | 'green';
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
}

export const etiquette: Etiquette[] = [
  {
    icon: 'respect',
    titleVi: 'Mũ đội đầu, đi nhẹ nói khẽ khi vào đình, đền',
    titleEn: 'Cover up & keep quiet in temples',
    descVi: 'Gỡ mũ, chỉnh trang trang phục trước khi vào không gian thờ tự.',
    descEn: 'Remove hats and dress modestly before entering worship spaces.',
  },
  {
    icon: 'camera',
    titleVi: 'Xin phép trước khi chụp nghệ nhân',
    titleEn: 'Ask before photographing artisans',
    descVi: 'Một nụ cười và một câu “cho chụp với ạ” luôn được hoan nghênh.',
    descEn: 'A smile and a quick ask is always appreciated.',
  },
  {
    icon: 'hands',
    titleVi: 'Cầm gốm bằng hai tay',
    titleEn: 'Hold ceramics with two hands',
    descVi: 'Cả một cử chỉ tôn trọng với sản phẩm của người thợ.',
    descEn: 'A gesture of respect for the maker’s work.',
  },
  {
    icon: 'walk',
    titleVi: 'Đi bộ chậm trong hẻm gốm',
    titleEn: 'Walk slowly in pottery alleys',
    descVi: 'Hẻm nhỏ có xe máy qua lại và lò nung còn hoạt động.',
    descEn: 'Narrow alleys carry motorbikes and active kilns.',
  },
  {
    icon: 'bargain',
    titleVi: 'Trả giá thân thiện tại chợ',
    titleEn: 'Bargain kindly at the market',
    descVi: 'Mặc cả nhẹ nhàng 10–15% là điều bình thường.',
    descEn: 'Gently negotiating 10–15% off is normal.',
  },
  {
    icon: 'green',
    titleVi: 'Không xả rác xuống sông Hồng',
    titleEn: 'Keep the Red River clean',
    descVi: 'Mang rác về thùng, giữ bến sông sạch cho mọi người.',
    descEn: 'Carry trash to bins and keep the wharf clean.',
  },
];

export const history: { year: string; textVi: string; textEn: string }[] = [
  {
    year: 'Thế kỷ 14',
    textVi: 'Nghệ nhân từ Ninh Bình (lò sứ vua Lý) lập làng gốm Bát Tràng bên sông Hồng.',
    textEn: 'Artisans from the royal Ly dynasty kilns settle Bat Trang by the Red River.',
  },
  {
    year: 'Thế kỷ 15–16',
    textVi: 'Gốm Bát Tràng theo thương thuyền đến các nước Đông Nam Á và Trung Quốc.',
    textEn: 'Bat Trang ceramics reach Southeast Asia and China via trading ships.',
  },
  {
    year: 'Thế kỷ 18',
    textVi: 'Làng được vua ban quốc hiệu “Bát Tràng quan xưởng” – lò sứ của triều đình.',
    textEn: 'The village is named an official royal kiln of the court.',
  },
  {
    year: '2004',
    textVi: 'Làng nghề được công nhận làng du lịch nổi tiếng, hàng triệu khách mỗi năm.',
    textEn: 'Recognized as a famous craft tourism village, millions of visitors a year.',
  },
  {
    year: 'Hôm nay',
    textVi: 'Hơn 800 hộ gia đình sống bằng nghề gốm, từ men celadon tới gốm vẽ tay.',
    textEn: '800+ households live from pottery, from celadon glaze to hand-painted ware.',
  },
];

export const aiPopularQuestions: { vi: string; en: string }[] = [
  { vi: 'Đi Bát Tràng bằng cách nào?', en: 'How do I get to Bat Trang?' },
  { vi: 'Trải nghiệm làm gốm giá bao nhiêu?', en: 'How much is a pottery class?' },
  { vi: 'Món ăn nào nên thử?', en: 'Which dishes should I try?' },
  { vi: 'Chợ gốm mở cửa lúc mấy giờ?', en: 'What time does the market open?' },
  { vi: 'Nên đi trong bao lâu?', en: 'How long should I stay?' },
  { vi: 'Có bãi đỗ xe không?', en: 'Is there parking?' },
];

export function aiReply(question: string, lang: Lang): string {
  const q = question.toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => q.includes(k));

  if (has('đường', 'đi', 'xe', 'bus', 'how to get', 'get to', 'transport')) {
    return lang === 'vi'
      ? 'Từ trung tâm Hà Nội: xe buýt 47A từ Long Biên (9.000đ, 45 phút) hoặc xe máy qua cầu Chương Dương (~30 phút). Có bãi giữ xe miễn phí tại cổng làng cuối tuần.'
      : 'From central Hanoi: bus 47A from Long Bien (9,000 VND, 45 min) or a motorbike via Chuong Duong bridge (~30 min). Free weekend parking at the village gate.';
  }
  if (has('gốm', 'làm', 'pottery', 'class', 'wheel', 'xoay')) {
    return lang === 'vi'
      ? 'Lớp xoay mâm gốm khoảng 50.000đ/người (60 phút), vẽ gốm 70.000đ. Bạn có thể đặt ngay ở mục “Trải nghiệm/ Đặt lịch” trên màn hình chính nhé!'
      : 'Wheel-throwing is about 50,000 VND/person (60 min), painting 70,000 VND. You can book right away in the “Experiences/ Booking” section on the home screen!';
  }
  if (has('ăn', 'món', 'food', 'eat', 'dish', 'specialty')) {
    return lang === 'vi'
      ? 'Nhất định phải thử canh măng mực và bánh tẻ! Xem mục “Ẩm thực” để thấy 6 món đặc sản và 4 quán được đánh giá cao nhất của làng.'
      : 'Do not miss canh mang muc (squid & bamboo soup) and banh te! Check the “Food” section for 6 specialties and the village’s 4 best-rated eateries.';
  }
  if (has('giờ', 'mở', 'open', 'hour', 'time', 'market', 'chợ')) {
    return lang === 'vi'
      ? 'Chợ gốm mở 8:00–18:00 mỗi ngày, đẹp nhất sáng sớm. Bảo tàng gốm mở 8:00–17:00, nghỉ thứ Hai.'
      : 'The pottery market is open 8:00–18:00 daily, best early in the morning. The museum is open 8:00–17:00, closed Mondays.';
  }
  if (has('bao lâu', 'nên đi', 'how long', 'stay', 'duration', 'half day', 'itinerary')) {
    return lang === 'vi'
      ? 'Nửa ngày (4 giờ) là đủ cho bảo tàng + làm gốm + chợ. Cả ngày cho phép thêm tour xe điện và trà đạo. Xem “Hướng dẫn” để xem lịch trình chi tiết 2 lựa chọn!'
      : 'Half a day (4 hours) covers museum + pottery + market. A full day adds the cart tour and tea ceremony. See the “Guide” section for both detailed itineraries!';
  }
  if (has('đỗ', 'parking', 'xe hơi', 'car')) {
    return lang === 'vi'
      ? 'Có 2 bãi đỗ xe chính: cổng chợ (10.000đ xe máy, 30.000đ ô tô) và bãi bến sông. Cuối tuần nên tới trước 9h sáng.'
      : 'Two main lots: market gate (10k motorbike, 30k car) and riverside. On weekends arrive before 9am.';
  }
  if (has('mua', 'quà', 'buy', 'gift', 'souvenir', 'memento')) {
    return lang === 'vi'
      ? 'Mua gì làm quà: bộ chén men celadon, lọ hoa vẽ tay hoặc trầm hương gốm. Nhớ trả giá nhẹ nhàng 10–15% và xin gói bọc kỹ!'
    : 'Gift ideas: celadon bowls, hand-painted vases or ceramic incense holders. Bargain gently (10–15%) and ask for careful wrapping!';
  }
  return lang === 'vi'
    ? 'Câu hỏi hay! Bát Tràng nổi tiếng với: chợ gốm, bảo tàng, xưởng làm gốm và ẩm thực làng nghề. Bạn thử hỏi về đường đi, giá làm gốm, món ăn hay giờ mở cửa nhé.'
    : 'Great question! Bat Trang is famous for its pottery market, museum, workshops and village food. Try asking about directions, class prices, dishes or opening hours.';
}
