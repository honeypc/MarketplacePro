import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'vi' | 'en' | 'ko' | 'ru' | 'ar';

export interface Translation {
  // Navigation
  home: string;
  products: string;
  properties: string;
  cart: string;
  wishlist: string;
  profile: string;
  settings: string;
  login: string;
  register: string;
  logout: string;
  dashboard: string;
  seller: string;
  inventory: string;
  support: string;
  bookingHistory: string;
  payments: string;
  
  // Common
  search: string;
  filter: string;
  sort: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  loading: string;
  error: string;
  success: string;
  confirm: string;
  close: string;
  next: string;
  previous: string;
  submit: string;
  back: string;
  
  // Product related
  addToCart: string;
  addToWishlist: string;
  removeFromWishlist: string;
  price: string;
  discount: string;
  inStock: string;
  outOfStock: string;
  category: string;
  brand: string;
  rating: string;
  reviews: string;
  description: string;
  specifications: string;
  
  // Property related
  checkIn: string;
  checkOut: string;
  guests: string;
  rooms: string;
  amenities: string;
  location: string;
  bookNow: string;
  pricePerNight: string;
  availability: string;
  
  // Booking
  booking: string;
  bookings: string;
  bookingConfirmed: string;
  bookingPending: string;
  bookingCancelled: string;
  bookingCompleted: string;
  totalPrice: string;
  paymentMethod: string;
  paymentStatus: string;
  
  // UI Elements
  darkMode: string;
  lightMode: string;
  language: string;
  theme: string;
  notifications: string;
  
  // Messages
  welcomeMessage: string;
  noItemsFound: string;
  addedToCart: string;
  addedToWishlist: string;
  removedFromWishlist: string;
  orderPlaced: string;
  paymentSuccessful: string;
  bookingSuccessful: string;
  
  // Errors
  errorGeneric: string;
  errorNetwork: string;
  errorAuth: string;
  errorNotFound: string;
  errorValidation: string;
  
  // Form labels
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  
  // Status
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  cancelled: string;
  processing: string;
  
  // Time
  today: string;
  yesterday: string;
  thisWeek: string;
  thisMonth: string;
  lastMonth: string;
  
  // Numbers
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  
  // Reviews
  writeReview: string;
  readReviews: string;
  ratingOutOf5: string;
  helpful: string;
  notHelpful: string;
  
  // Header specific
  'header.allCategories': string;
  'header.electronics': string;
  'header.fashion': string;
  'header.homeGarden': string;
  'header.sports': string;
  'header.books': string;
  'header.searchPlaceholder': string;
  'header.wishlist': string;
  'header.cart': string;
  'header.profile': string;
  'header.dashboard': string;
  'header.sellOnMarketplace': string;
  'header.logout': string;
  'header.account': string;
  'header.products': string;
  'header.accommodation': string;
  'header.travel': string;
  'header.sell': string;
  'header.signIn': string;
  'header.getStarted': string;
  
  // Hero section
  'hero.title': string;
  'hero.subtitle': string;
  'hero.startShopping': string;
  'hero.becomeSeller': string;
}

export const translations: Record<Language, Translation> = {
  vi: {
    // Navigation
    home: 'Trang chủ',
    products: 'Sản phẩm',
    properties: 'Khách sạn',
    cart: 'Giỏ hàng',
    wishlist: 'Yêu thích',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    dashboard: 'Bảng điều khiển',
    seller: 'Người bán',
    inventory: 'Kho hàng',
    support: 'Hỗ trợ',
    bookingHistory: 'Lịch sử đặt phòng',
    payments: 'Thanh toán',
    
    // Common
    search: 'Tìm kiếm',
    filter: 'Lọc',
    sort: 'Sắp xếp',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    view: 'Xem',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    confirm: 'Xác nhận',
    close: 'Đóng',
    next: 'Tiếp theo',
    previous: 'Trước',
    submit: 'Gửi',
    back: 'Quay lại',
    
    // Product related
    addToCart: 'Thêm vào giỏ',
    addToWishlist: 'Thêm vào yêu thích',
    removeFromWishlist: 'Xóa khỏi yêu thích',
    price: 'Giá',
    discount: 'Giảm giá',
    inStock: 'Còn hàng',
    outOfStock: 'Hết hàng',
    category: 'Danh mục',
    brand: 'Thương hiệu',
    rating: 'Đánh giá',
    reviews: 'Nhận xét',
    description: 'Mô tả',
    specifications: 'Thông số kỹ thuật',
    
    // Property related
    checkIn: 'Nhận phòng',
    checkOut: 'Trả phòng',
    guests: 'Khách',
    rooms: 'Phòng',
    amenities: 'Tiện nghi',
    location: 'Vị trí',
    bookNow: 'Đặt ngay',
    pricePerNight: 'Giá/đêm',
    availability: 'Tình trạng',
    
    // Booking
    booking: 'Đặt phòng',
    bookings: 'Đặt phòng',
    bookingConfirmed: 'Đã xác nhận',
    bookingPending: 'Chờ xác nhận',
    bookingCancelled: 'Đã hủy',
    bookingCompleted: 'Đã hoàn thành',
    totalPrice: 'Tổng tiền',
    paymentMethod: 'Phương thức thanh toán',
    paymentStatus: 'Trạng thái thanh toán',
    
    // UI Elements
    darkMode: 'Chế độ tối',
    lightMode: 'Chế độ sáng',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    notifications: 'Thông báo',
    
    // Messages
    welcomeMessage: 'Chào mừng bạn đến với MarketplacePro',
    noItemsFound: 'Không tìm thấy mục nào',
    addedToCart: 'Đã thêm vào giỏ hàng',
    addedToWishlist: 'Đã thêm vào danh sách yêu thích',
    removedFromWishlist: 'Đã xóa khỏi danh sách yêu thích',
    orderPlaced: 'Đặt hàng thành công',
    paymentSuccessful: 'Thanh toán thành công',
    bookingSuccessful: 'Đặt phòng thành công',
    
    // Errors
    errorGeneric: 'Đã xảy ra lỗi',
    errorNetwork: 'Lỗi kết nối mạng',
    errorAuth: 'Lỗi xác thực',
    errorNotFound: 'Không tìm thấy',
    errorValidation: 'Dữ liệu không hợp lệ',
    
    // Form labels
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    firstName: 'Tên',
    lastName: 'Họ',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    city: 'Thành phố',
    country: 'Quốc gia',
    postalCode: 'Mã bưu điện',
    
    // Status
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    pending: 'Chờ xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    processing: 'Đang xử lý',
    
    // Time
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    thisWeek: 'Tuần này',
    thisMonth: 'Tháng này',
    lastMonth: 'Tháng trước',
    
    // Numbers
    total: 'Tổng',
    subtotal: 'Tạm tính',
    tax: 'Thuế',
    shipping: 'Phí vận chuyển',
    
    // Reviews
    writeReview: 'Viết đánh giá',
    readReviews: 'Đọc đánh giá',
    ratingOutOf5: 'điểm/5',
    helpful: 'Hữu ích',
    notHelpful: 'Không hữu ích',
    
    // Header specific
    'header.allCategories': 'Tất cả danh mục',
    'header.electronics': 'Điện tử',
    'header.fashion': 'Thời trang',
    'header.homeGarden': 'Nhà cửa & Vườn',
    'header.sports': 'Thể thao',
    'header.books': 'Sách',
    'header.searchPlaceholder': 'Tìm kiếm sản phẩm, thương hiệu...',
    'header.wishlist': 'Yêu thích',
    'header.cart': 'Giỏ hàng',
    'header.profile': 'Hồ sơ',
    'header.dashboard': 'Bảng điều khiển',
    'header.sellOnMarketplace': 'Bán trên MarketPlace',
    'header.logout': 'Đăng xuất',
    'header.account': 'Tài khoản',
    'header.products': 'Sản phẩm',
    'header.accommodation': 'Chỗ ở',
    'header.travel': 'Du lịch',
    'header.sell': 'Bán hàng',
    'header.signIn': 'Đăng nhập',
    'header.getStarted': 'Bắt đầu',
    
    // Hero section
    'hero.title': 'Chào mừng đến với MarketPlace Pro',
    'hero.subtitle': 'Nền tảng thương mại điện tử toàn diện với hàng triệu sản phẩm chất lượng và dịch vụ du lịch tuyệt vời',
    'hero.startShopping': 'Bắt đầu mua sắm',
    'hero.becomeSeller': 'Trở thành người bán',
  },
  
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    properties: 'Properties',
    cart: 'Cart',
    wishlist: 'Wishlist',
    profile: 'Profile',
    settings: 'Settings',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    seller: 'Seller',
    inventory: 'Inventory',
    support: 'Support',
    bookingHistory: 'Booking History',
    payments: 'Payments',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    close: 'Close',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    back: 'Back',
    
    // Product related
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    price: 'Price',
    discount: 'Discount',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    category: 'Category',
    brand: 'Brand',
    rating: 'Rating',
    reviews: 'Reviews',
    description: 'Description',
    specifications: 'Specifications',
    
    // Property related
    checkIn: 'Check In',
    checkOut: 'Check Out',
    guests: 'Guests',
    rooms: 'Rooms',
    amenities: 'Amenities',
    location: 'Location',
    bookNow: 'Book Now',
    pricePerNight: 'Price/Night',
    availability: 'Availability',
    
    // Booking
    booking: 'Booking',
    bookings: 'Bookings',
    bookingConfirmed: 'Confirmed',
    bookingPending: 'Pending',
    bookingCancelled: 'Cancelled',
    bookingCompleted: 'Completed',
    totalPrice: 'Total Price',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    
    // UI Elements
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    
    // Messages
    welcomeMessage: 'Welcome to MarketplacePro',
    noItemsFound: 'No items found',
    addedToCart: 'Added to cart',
    addedToWishlist: 'Added to wishlist',
    removedFromWishlist: 'Removed from wishlist',
    orderPlaced: 'Order placed successfully',
    paymentSuccessful: 'Payment successful',
    bookingSuccessful: 'Booking successful',
    
    // Errors
    errorGeneric: 'An error occurred',
    errorNetwork: 'Network error',
    errorAuth: 'Authentication error',
    errorNotFound: 'Not found',
    errorValidation: 'Invalid data',
    
    // Form labels
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    country: 'Country',
    postalCode: 'Postal Code',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    processing: 'Processing',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    
    // Numbers
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    
    // Reviews
    writeReview: 'Write Review',
    readReviews: 'Read Reviews',
    ratingOutOf5: '/5',
    helpful: 'Helpful',
    notHelpful: 'Not Helpful',
    
    // Header specific
    'header.allCategories': 'All Categories',
    'header.electronics': 'Electronics',
    'header.fashion': 'Fashion',
    'header.homeGarden': 'Home & Garden',
    'header.sports': 'Sports',
    'header.books': 'Books',
    'header.searchPlaceholder': 'Search products, brands...',
    'header.wishlist': 'Wishlist',
    'header.cart': 'Cart',
    'header.profile': 'Profile',
    'header.dashboard': 'Dashboard',
    'header.sellOnMarketplace': 'Sell on MarketPlace',
    'header.logout': 'Logout',
    'header.account': 'Account',
    'header.products': 'Products',
    'header.accommodation': 'Accommodation',
    'header.travel': 'Travel',
    'header.sell': 'Sell',
    'header.signIn': 'Sign In',
    'header.getStarted': 'Get Started',
    
    // Hero section
    'hero.title': 'Welcome to MarketPlace Pro',
    'hero.subtitle': 'Comprehensive e-commerce platform with millions of quality products and excellent travel services',
    'hero.startShopping': 'Start Shopping',
    'hero.becomeSeller': 'Become a Seller',
  },
  
  ko: {
    // Navigation
    home: '홈',
    products: '상품',
    properties: '숙소',
    cart: '장바구니',
    wishlist: '위시리스트',
    profile: '프로필',
    settings: '설정',
    login: '로그인',
    register: '회원가입',
    logout: '로그아웃',
    dashboard: '대시보드',
    seller: '판매자',
    inventory: '재고',
    support: '지원',
    bookingHistory: '예약 내역',
    payments: '결제',
    
    // Common
    search: '검색',
    filter: '필터',
    sort: '정렬',
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    edit: '편집',
    view: '보기',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    confirm: '확인',
    close: '닫기',
    next: '다음',
    previous: '이전',
    submit: '제출',
    back: '뒤로',
    
    // Product related
    addToCart: '장바구니에 추가',
    addToWishlist: '위시리스트에 추가',
    removeFromWishlist: '위시리스트에서 제거',
    price: '가격',
    discount: '할인',
    inStock: '재고 있음',
    outOfStock: '품절',
    category: '카테고리',
    brand: '브랜드',
    rating: '평점',
    reviews: '리뷰',
    description: '설명',
    specifications: '사양',
    
    // Property related
    checkIn: '체크인',
    checkOut: '체크아웃',
    guests: '게스트',
    rooms: '객실',
    amenities: '편의시설',
    location: '위치',
    bookNow: '지금 예약',
    pricePerNight: '1박당 가격',
    availability: '예약 가능',
    
    // Booking
    booking: '예약',
    bookings: '예약',
    bookingConfirmed: '확인됨',
    bookingPending: '대기 중',
    bookingCancelled: '취소됨',
    bookingCompleted: '완료됨',
    totalPrice: '총 가격',
    paymentMethod: '결제 방법',
    paymentStatus: '결제 상태',
    
    // UI Elements
    darkMode: '다크 모드',
    lightMode: '라이트 모드',
    language: '언어',
    theme: '테마',
    notifications: '알림',
    
    // Messages
    welcomeMessage: 'MarketplacePro에 오신 것을 환영합니다',
    noItemsFound: '항목을 찾을 수 없습니다',
    addedToCart: '장바구니에 추가되었습니다',
    addedToWishlist: '위시리스트에 추가되었습니다',
    removedFromWishlist: '위시리스트에서 제거되었습니다',
    orderPlaced: '주문이 성공적으로 완료되었습니다',
    paymentSuccessful: '결제가 성공했습니다',
    bookingSuccessful: '예약이 성공했습니다',
    
    // Errors
    errorGeneric: '오류가 발생했습니다',
    errorNetwork: '네트워크 오류',
    errorAuth: '인증 오류',
    errorNotFound: '찾을 수 없음',
    errorValidation: '유효하지 않은 데이터',
    
    // Form labels
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    firstName: '이름',
    lastName: '성',
    phone: '전화번호',
    address: '주소',
    city: '도시',
    country: '국가',
    postalCode: '우편번호',
    
    // Status
    active: '활성',
    inactive: '비활성',
    pending: '대기 중',
    completed: '완료',
    cancelled: '취소됨',
    processing: '처리 중',
    
    // Time
    today: '오늘',
    yesterday: '어제',
    thisWeek: '이번 주',
    thisMonth: '이번 달',
    lastMonth: '지난 달',
    
    // Numbers
    total: '총계',
    subtotal: '소계',
    tax: '세금',
    shipping: '배송비',
    
    // Reviews
    writeReview: '리뷰 작성',
    readReviews: '리뷰 읽기',
    ratingOutOf5: '/5',
    helpful: '도움됨',
    notHelpful: '도움안됨',
    
    // Header specific
    'header.allCategories': '모든 카테고리',
    'header.electronics': '전자제품',
    'header.fashion': '패션',
    'header.homeGarden': '홈 & 가든',
    'header.sports': '스포츠',
    'header.books': '도서',
    'header.searchPlaceholder': '제품, 브랜드 검색...',
    'header.wishlist': '위시리스트',
    'header.cart': '장바구니',
    'header.profile': '프로필',
    'header.dashboard': '대시보드',
    'header.sellOnMarketplace': '마켓플레이스에서 판매',
    'header.logout': '로그아웃',
    'header.account': '계정',
    'header.products': '상품',
    'header.accommodation': '숙박',
    'header.travel': '여행',
    'header.sell': '판매',
    'header.signIn': '로그인',
    'header.getStarted': '시작하기',
    
    // Hero section
    'hero.title': '마켓플레이스 프로에 오신 것을 환영합니다',
    'hero.subtitle': '수백만 개의 고품질 제품과 우수한 여행 서비스를 제공하는 종합 전자상거래 플랫폼',
    'hero.startShopping': '쇼핑 시작',
    'hero.becomeSeller': '판매자 되기',
  },
  
  ru: {
    // Navigation
    home: 'Главная',
    products: 'Товары',
    properties: 'Недвижимость',
    cart: 'Корзина',
    wishlist: 'Избранное',
    profile: 'Профиль',
    settings: 'Настройки',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    dashboard: 'Панель управления',
    seller: 'Продавец',
    inventory: 'Инвентарь',
    support: 'Поддержка',
    bookingHistory: 'История бронирований',
    payments: 'Платежи',
    
    // Common
    search: 'Поиск',
    filter: 'Фильтр',
    sort: 'Сортировать',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    view: 'Просмотр',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    confirm: 'Подтвердить',
    close: 'Закрыть',
    next: 'Далее',
    previous: 'Назад',
    submit: 'Отправить',
    back: 'Назад',
    
    // Product related
    addToCart: 'Добавить в корзину',
    addToWishlist: 'Добавить в избранное',
    removeFromWishlist: 'Удалить из избранного',
    price: 'Цена',
    discount: 'Скидка',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    category: 'Категория',
    brand: 'Бренд',
    rating: 'Рейтинг',
    reviews: 'Отзывы',
    description: 'Описание',
    specifications: 'Характеристики',
    
    // Property related
    checkIn: 'Заезд',
    checkOut: 'Выезд',
    guests: 'Гости',
    rooms: 'Комнаты',
    amenities: 'Удобства',
    location: 'Местоположение',
    bookNow: 'Забронировать',
    pricePerNight: 'Цена за ночь',
    availability: 'Доступность',
    
    // Booking
    booking: 'Бронирование',
    bookings: 'Бронирования',
    bookingConfirmed: 'Подтверждено',
    bookingPending: 'Ожидает',
    bookingCancelled: 'Отменено',
    bookingCompleted: 'Завершено',
    totalPrice: 'Общая цена',
    paymentMethod: 'Способ оплаты',
    paymentStatus: 'Статус платежа',
    
    // UI Elements
    darkMode: 'Темный режим',
    lightMode: 'Светлый режим',
    language: 'Язык',
    theme: 'Тема',
    notifications: 'Уведомления',
    
    // Messages
    welcomeMessage: 'Добро пожаловать в MarketplacePro',
    noItemsFound: 'Товары не найдены',
    addedToCart: 'Добавлено в корзину',
    addedToWishlist: 'Добавлено в избранное',
    removedFromWishlist: 'Удалено из избранного',
    orderPlaced: 'Заказ успешно размещен',
    paymentSuccessful: 'Платеж успешен',
    bookingSuccessful: 'Бронирование успешно',
    
    // Errors
    errorGeneric: 'Произошла ошибка',
    errorNetwork: 'Ошибка сети',
    errorAuth: 'Ошибка аутентификации',
    errorNotFound: 'Не найдено',
    errorValidation: 'Недопустимые данные',
    
    // Form labels
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    address: 'Адрес',
    city: 'Город',
    country: 'Страна',
    postalCode: 'Почтовый индекс',
    
    // Status
    active: 'Активный',
    inactive: 'Неактивный',
    pending: 'Ожидает',
    completed: 'Завершен',
    cancelled: 'Отменен',
    processing: 'Обработка',
    
    // Time
    today: 'Сегодня',
    yesterday: 'Вчера',
    thisWeek: 'На этой неделе',
    thisMonth: 'В этом месяце',
    lastMonth: 'В прошлом месяце',
    
    // Numbers
    total: 'Итого',
    subtotal: 'Промежуточный итог',
    tax: 'Налог',
    shipping: 'Доставка',
    
    // Reviews
    writeReview: 'Написать отзыв',
    readReviews: 'Читать отзывы',
    ratingOutOf5: '/5',
    helpful: 'Полезно',
    notHelpful: 'Не полезно',
    
    // Header specific
    'header.allCategories': 'Все категории',
    'header.electronics': 'Электроника',
    'header.fashion': 'Мода',
    'header.homeGarden': 'Дом и сад',
    'header.sports': 'Спорт',
    'header.books': 'Книги',
    'header.searchPlaceholder': 'Поиск товаров, брендов...',
    'header.wishlist': 'Избранное',
    'header.cart': 'Корзина',
    'header.profile': 'Профиль',
    'header.dashboard': 'Панель управления',
    'header.sellOnMarketplace': 'Продавать на MarketPlace',
    'header.logout': 'Выйти',
    'header.account': 'Аккаунт',
    'header.products': 'Товары',
    'header.accommodation': 'Жилье',
    'header.travel': 'Путешествия',
    'header.sell': 'Продать',
    'header.signIn': 'Войти',
    'header.getStarted': 'Начать',
    
    // Hero section
    'hero.title': 'Добро пожаловать в MarketPlace Pro',
    'hero.subtitle': 'Комплексная платформа электронной коммерции с миллионами качественных товаров и отличными туристическими услугами',
    'hero.startShopping': 'Начать покупки',
    'hero.becomeSeller': 'Стать продавцом',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    products: 'المنتجات',
    properties: 'العقارات',
    cart: 'السلة',
    wishlist: 'المفضلة',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    seller: 'البائع',
    inventory: 'المخزون',
    support: 'الدعم',
    bookingHistory: 'تاريخ الحجوزات',
    payments: 'المدفوعات',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تحرير',
    view: 'عرض',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    confirm: 'تأكيد',
    close: 'إغلاق',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    back: 'رجوع',
    
    // Product related
    addToCart: 'إضافة إلى السلة',
    addToWishlist: 'إضافة إلى المفضلة',
    removeFromWishlist: 'إزالة من المفضلة',
    price: 'السعر',
    discount: 'خصم',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    category: 'الفئة',
    brand: 'العلامة التجارية',
    rating: 'التقييم',
    reviews: 'المراجعات',
    description: 'الوصف',
    specifications: 'المواصفات',
    
    // Property related
    checkIn: 'تسجيل الوصول',
    checkOut: 'تسجيل المغادرة',
    guests: 'الضيوف',
    rooms: 'الغرف',
    amenities: 'المرافق',
    location: 'الموقع',
    bookNow: 'احجز الآن',
    pricePerNight: 'السعر لكل ليلة',
    availability: 'التوفر',
    
    // Booking
    booking: 'حجز',
    bookings: 'الحجوزات',
    bookingConfirmed: 'مؤكد',
    bookingPending: 'في الانتظار',
    bookingCancelled: 'ملغي',
    bookingCompleted: 'مكتمل',
    totalPrice: 'السعر الإجمالي',
    paymentMethod: 'طريقة الدفع',
    paymentStatus: 'حالة الدفع',
    
    // UI Elements
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    language: 'اللغة',
    theme: 'الموضوع',
    notifications: 'الإشعارات',
    
    // Messages
    welcomeMessage: 'مرحباً بك في MarketplacePro',
    noItemsFound: 'لم يتم العثور على عناصر',
    addedToCart: 'تم إضافة العنصر إلى السلة',
    addedToWishlist: 'تم إضافة العنصر إلى المفضلة',
    removedFromWishlist: 'تم إزالة العنصر من المفضلة',
    orderPlaced: 'تم إنشاء الطلب بنجاح',
    paymentSuccessful: 'تم الدفع بنجاح',
    bookingSuccessful: 'تم الحجز بنجاح',
    
    // Errors
    errorGeneric: 'حدث خطأ',
    errorNetwork: 'خطأ في الشبكة',
    errorAuth: 'خطأ في المصادقة',
    errorNotFound: 'غير موجود',
    errorValidation: 'بيانات غير صالحة',
    
    // Form labels
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم الأول',
    lastName: 'الاسم الأخير',
    phone: 'الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    country: 'البلد',
    postalCode: 'الرمز البريدي',
    
    // Status
    active: 'نشط',
    inactive: 'غير نشط',
    pending: 'في الانتظار',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    processing: 'قيد المعالجة',
    
    // Time
    today: 'اليوم',
    yesterday: 'أمس',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    
    // Numbers
    total: 'المجموع',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    shipping: 'الشحن',
    
    // Reviews
    writeReview: 'كتابة مراجعة',
    readReviews: 'قراءة المراجعات',
    ratingOutOf5: '/5',
    helpful: 'مفيد',
    notHelpful: 'غير مفيد',
    
    // Header specific
    'header.allCategories': 'جميع الفئات',
    'header.electronics': 'الإلكترونيات',
    'header.fashion': 'الأزياء',
    'header.homeGarden': 'المنزل والحديقة',
    'header.sports': 'الرياضة',
    'header.books': 'الكتب',
    'header.searchPlaceholder': 'البحث عن المنتجات والعلامات التجارية...',
    'header.wishlist': 'المفضلة',
    'header.cart': 'السلة',
    'header.profile': 'الملف الشخصي',
    'header.dashboard': 'لوحة التحكم',
    'header.sellOnMarketplace': 'البيع على MarketPlace',
    'header.logout': 'تسجيل الخروج',
    'header.account': 'الحساب',
    'header.products': 'المنتجات',
    'header.accommodation': 'الإقامة',
    'header.travel': 'السفر',
    'header.sell': 'بيع',
    'header.signIn': 'تسجيل الدخول',
    'header.getStarted': 'ابدأ',
    
    // Hero section
    'hero.title': 'مرحباً بك في MarketPlace Pro',
    'hero.subtitle': 'منصة التجارة الإلكترونية الشاملة مع ملايين المنتجات عالية الجودة وخدمات السفر الممتازة',
    'hero.startShopping': 'ابدأ التسوق',
    'hero.becomeSeller': 'كن بائعاً',
  },
};

interface I18nStore {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translation) => string;
}

export const useTranslationStore = create<I18nStore>()(
  persist(
    (set, get) => ({
      language: 'vi', // Default to Vietnamese
      setLanguage: (language: Language) => {
        set({ language });
        // Update document direction for RTL languages
        if (language === 'ar') {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = 'ar';
        } else {
          document.documentElement.dir = 'ltr';
          document.documentElement.lang = language;
        }
      },
      t: (key: keyof Translation) => {
        const { language } = get();
        return translations[language][key] || translations.en[key] || key;
      },
    }),
    {
      name: 'i18n-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.language === 'ar') {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = 'ar';
        } else {
          document.documentElement.dir = 'ltr';
          document.documentElement.lang = state?.language || 'vi';
        }
      },
    }
  )
);

// Language flags mapping
export const languageFlags: Record<Language, string> = {
  vi: '🇻🇳',
  en: '🇺🇸',
  ko: '🇰🇷',
  ru: '🇷🇺',
  ar: '🇸🇦',
};

// Language names
export const languageNames: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ko: '한국어',
  ru: 'Русский',
  ar: 'العربية',
};

// Available languages array
export const languages: Language[] = ['vi', 'en', 'ko', 'ru', 'ar'];

// Helper hook for translations
export const useTranslation = () => {
  const { language, setLanguage, t } = useTranslationStore();
  
  return {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar',
  };
};