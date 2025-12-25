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

  // Cart
  'cart.title': string;
  'cart.empty': string;
  'cart.continueShopping': string;
  'cart.proceedToCheckout': string;
  'cart.total': string;

  // Checkout
  'checkout.title': string;
  'checkout.firstName': string;
  'checkout.lastName': string;
  'checkout.email': string;
  'checkout.phone': string;
  'checkout.address': string;
  'checkout.city': string;
  'checkout.state': string;
  'checkout.zipCode': string;
  'checkout.shippingInfo': string;
  'checkout.paymentInfo': string;
  'checkout.orderSummary': string;
  'checkout.subtotal': string;
  'checkout.shipping': string;
  'checkout.tax': string;
  'checkout.orderTotal': string;
  'checkout.placeOrder': string;

  // Filters & sorting
  filters: string;
  'filters.title': string;
  'filters.category': string;
  'filters.location': string;
  'filters.priceRange': string;
  'filters.rating': string;
  'filters.applyFilters': string;
  'filters.clearFilters': string;
  'filters.customerRating': string;
  'filters.newestFirst': string;
  'filters.priceLowToHigh': string;
  'filters.priceHighToLow': string;
  'filters.showingResults': string;

  // Product details
  'product.soldBy': string;
  'product.returnPolicy': string;
  'product.freeShipping': string;
  'product.quantity': string;
  'product.addToCart': string;
  'product.inStock': string;
  'product.outOfStock': string;
  'product.reviews': string;
  'products.addedToCart': string;

  // Dashboard & analytics
  actions: string;
  all: string;
  'common.search': string;
  'common.error': string;
  'common.save': string;
  'common.cancel': string;
  'common.login': string;
  'common.loginRequired': string;
  'dashboard.title': string;
  'dashboard.products': string;
  'dashboard.orders': string;
  'dashboard.totalRevenue': string;
  'dashboard.totalProducts': string;
  'dashboard.totalOrders': string;
  'dashboard.analytics': string;
  'dashboard.averageRating': string;
  'dashboard.addProduct': string;
  'dashboard.editProduct': string;
  'dashboard.productTitle': string;
  'dashboard.productDescription': string;
  'dashboard.productPrice': string;
  'dashboard.productStock': string;
  'dashboard.productStatus': string;
  'dashboard.productCategory': string;
  'dashboard.active': string;
  'dashboard.inactive': string;
  'dashboard.draft': string;
  'seller.dashboard': string;

  // Travel booking
  travelBooking: string;
  travelBookingSystem: string;
  discoverAndBookYourNextTrip: string;
  flights: string;
  buses: string;
  tours: string;
  transport: string;
  availableFlights: string;
  availableBuses: string;
  availableTours: string;
  searchFlights: string;
  searchBuses: string;
  searchTours: string;
  from: string;
  to: string;
  departure: string;
  return: string;
  date: string;
  passengers: string;
  oneWay: string;
  roundTrip: string;
  direct: string;
  minPrice: string;
  maxPrice: string;
  duration: string;
  select: string;
  selectDeparture: string;
  selectDestination: string;
  selectDuration: string;
  selectCategory: string;
  destination: string;
  popularDestinations: string;
  bookingDetails: string;
  downloadTicket: string;
  showQR: string;
  startBooking: string;
  myBookings: string;
  noBookingsFound: string;
  youHaveNoBookingsYet: string;
  youHaveNoBookingsInThisCategory: string;
  bookingHistory: string;
  modify: string;
  contactSupport: string;
  refresh: string;

  // Profile & settings
  'profile.title': string;
  'settings.title': string;

  // Footer
  'footer.allRightsReserved': string;
  'footer.bestSellers': string;
  'footer.contactUs': string;
  'footer.cookiePolicy': string;
  'footer.deals': string;
  'footer.description': string;
  'footer.feesCharges': string;
  'footer.helpCenter': string;
  'footer.newArrivals': string;
  'footer.privacyPolicy': string;
  'footer.returns': string;
  'footer.sell': string;
  'footer.sellerHub': string;
  'footer.sellerProtection': string;
  'footer.shippingInfo': string;
  'footer.shop': string;
  'footer.startSelling': string;
  'footer.support': string;
  'footer.termsOfService': string;
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

    // Cart
    'cart.title': 'Giỏ hàng',
    'cart.empty': 'Giỏ hàng trống',
    'cart.continueShopping': 'Tiếp tục mua sắm',
    'cart.proceedToCheckout': 'Tiến hành thanh toán',
    'cart.total': 'Tổng cộng',

    // Checkout
    'checkout.title': 'Thanh toán',
    'checkout.firstName': 'Tên',
    'checkout.lastName': 'Họ',
    'checkout.email': 'Email',
    'checkout.phone': 'Số điện thoại',
    'checkout.address': 'Địa chỉ',
    'checkout.city': 'Thành phố',
    'checkout.state': 'Tỉnh/Thành',
    'checkout.zipCode': 'Mã bưu điện',
    'checkout.shippingInfo': 'Thông tin giao hàng',
    'checkout.paymentInfo': 'Thông tin thanh toán',
    'checkout.orderSummary': 'Tóm tắt đơn hàng',
    'checkout.subtotal': 'Tạm tính',
    'checkout.shipping': 'Phí vận chuyển',
    'checkout.tax': 'Thuế',
    'checkout.orderTotal': 'Tổng đơn hàng',
    'checkout.placeOrder': 'Đặt hàng',

    // Filters & sorting
    filters: 'Bộ lọc',
    'filters.title': 'Bộ lọc',
    'filters.category': 'Danh mục',
    'filters.location': 'Khu vực',
    'filters.priceRange': 'Khoảng giá',
    'filters.rating': 'Đánh giá',
    'filters.applyFilters': 'Áp dụng bộ lọc',
    'filters.clearFilters': 'Xóa bộ lọc',
    'filters.customerRating': 'Đánh giá khách hàng',
    'filters.newestFirst': 'Mới nhất',
    'filters.priceLowToHigh': 'Giá: Thấp đến cao',
    'filters.priceHighToLow': 'Giá: Cao đến thấp',
    'filters.showingResults': 'Kết quả hiển thị',

    // Product details
    'product.soldBy': 'Bán bởi',
    'product.returnPolicy': 'Chính sách đổi trả',
    'product.freeShipping': 'Miễn phí vận chuyển',
    'product.quantity': 'Số lượng',
    'product.addToCart': 'Thêm vào giỏ',
    'product.inStock': 'Còn hàng',
    'product.outOfStock': 'Hết hàng',
    'product.reviews': 'Đánh giá',
    'products.addedToCart': 'Đã thêm vào giỏ',

    // Dashboard & analytics
    actions: 'Thao tác',
    all: 'Tất cả',
    'common.search': 'Tìm kiếm',
    'common.error': 'Lỗi',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.login': 'Đăng nhập',
    'common.loginRequired': 'Yêu cầu đăng nhập',
    'dashboard.title': 'Bảng điều khiển',
    'dashboard.products': 'Sản phẩm',
    'dashboard.orders': 'Đơn hàng',
    'dashboard.totalRevenue': 'Tổng doanh thu',
    'dashboard.totalProducts': 'Tổng sản phẩm',
    'dashboard.totalOrders': 'Tổng đơn hàng',
    'dashboard.analytics': 'Phân tích',
    'dashboard.averageRating': 'Đánh giá trung bình',
    'dashboard.addProduct': 'Thêm sản phẩm',
    'dashboard.editProduct': 'Chỉnh sửa sản phẩm',
    'dashboard.productTitle': 'Tên sản phẩm',
    'dashboard.productDescription': 'Mô tả sản phẩm',
    'dashboard.productPrice': 'Giá sản phẩm',
    'dashboard.productStock': 'Tồn kho',
    'dashboard.productStatus': 'Trạng thái sản phẩm',
    'dashboard.productCategory': 'Danh mục sản phẩm',
    'dashboard.active': 'Hoạt động',
    'dashboard.inactive': 'Ngừng hoạt động',
    'dashboard.draft': 'Bản nháp',
    'seller.dashboard': 'Bảng điều khiển người bán',

    // Travel booking
    travelBooking: 'Đặt dịch vụ du lịch',
    travelBookingSystem: 'Hệ thống đặt chỗ du lịch',
    discoverAndBookYourNextTrip: 'Khám phá và đặt chuyến đi tiếp theo của bạn',
    flights: 'Chuyến bay',
    buses: 'Xe buýt',
    tours: 'Tour',
    transport: 'Phương tiện',
    availableFlights: 'Chuyến bay khả dụng',
    availableBuses: 'Chuyến xe buýt khả dụng',
    availableTours: 'Tour khả dụng',
    searchFlights: 'Tìm kiếm chuyến bay',
    searchBuses: 'Tìm kiếm xe buýt',
    searchTours: 'Tìm kiếm tour',
    from: 'Từ',
    to: 'Đến',
    departure: 'Khởi hành',
    return: 'Trở về',
    date: 'Ngày',
    passengers: 'Hành khách',
    oneWay: 'Một chiều',
    roundTrip: 'Khứ hồi',
    direct: 'Bay thẳng',
    minPrice: 'Giá tối thiểu',
    maxPrice: 'Giá tối đa',
    duration: 'Thời lượng',
    select: 'Chọn',
    selectDeparture: 'Chọn nơi khởi hành',
    selectDestination: 'Chọn điểm đến',
    destination: 'Điểm đến',
    selectDuration: 'Chọn thời lượng',
    selectCategory: 'Chọn danh mục',
    popularDestinations: 'Điểm đến nổi bật',
    bookingDetails: 'Chi tiết đặt chỗ',
    downloadTicket: 'Tải vé',
    showQR: 'Hiển thị QR',
    startBooking: 'Bắt đầu đặt chỗ',
    myBookings: 'Đặt chỗ của tôi',
    noBookingsFound: 'Không tìm thấy đặt chỗ',
    youHaveNoBookingsYet: 'Bạn chưa có đặt chỗ nào',
    youHaveNoBookingsInThisCategory: 'Bạn không có đặt chỗ ở danh mục này',
    modify: 'Chỉnh sửa',
    contactSupport: 'Liên hệ hỗ trợ',
    refresh: 'Làm mới',

    // Profile & settings
    'profile.title': 'Hồ sơ',
    'settings.title': 'Cài đặt',

    // Footer
    'footer.allRightsReserved': 'Mọi quyền được bảo lưu',
    'footer.bestSellers': 'Bán chạy',
    'footer.contactUs': 'Liên hệ',
    'footer.cookiePolicy': 'Chính sách cookie',
    'footer.deals': 'Khuyến mãi',
    'footer.description': 'Hàng triệu sản phẩm với thanh toán an toàn và giao hàng toàn cầu',
    'footer.feesCharges': 'Phí và phụ thu',
    'footer.helpCenter': 'Trung tâm trợ giúp',
    'footer.newArrivals': 'Hàng mới',
    'footer.privacyPolicy': 'Chính sách bảo mật',
    'footer.returns': 'Trả hàng',
    'footer.sell': 'Bán hàng',
    'footer.sellerHub': 'Kênh người bán',
    'footer.sellerProtection': 'Bảo vệ người bán',
    'footer.shippingInfo': 'Thông tin vận chuyển',
    'footer.shop': 'Cửa hàng',
    'footer.startSelling': 'Bắt đầu bán hàng',
    'footer.support': 'Hỗ trợ',
    'footer.termsOfService': 'Điều khoản dịch vụ',
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

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue shopping',
    'cart.proceedToCheckout': 'Proceed to checkout',
    'cart.total': 'Total',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.state': 'State/Province',
    'checkout.zipCode': 'ZIP/Postal Code',
    'checkout.shippingInfo': 'Shipping Information',
    'checkout.paymentInfo': 'Payment Information',
    'checkout.orderSummary': 'Order Summary',
    'checkout.subtotal': 'Subtotal',
    'checkout.shipping': 'Shipping',
    'checkout.tax': 'Tax',
    'checkout.orderTotal': 'Order Total',
    'checkout.placeOrder': 'Place Order',

    // Filters & sorting
    filters: 'Filters',
    'filters.title': 'Filters',
    'filters.category': 'Category',
    'filters.location': 'Location',
    'filters.priceRange': 'Price Range',
    'filters.rating': 'Rating',
    'filters.applyFilters': 'Apply Filters',
    'filters.clearFilters': 'Clear Filters',
    'filters.customerRating': 'Customer Rating',
    'filters.newestFirst': 'Newest First',
    'filters.priceLowToHigh': 'Price: Low to High',
    'filters.priceHighToLow': 'Price: High to Low',
    'filters.showingResults': 'Showing results',

    // Product details
    'product.soldBy': 'Sold by',
    'product.returnPolicy': 'Return policy',
    'product.freeShipping': 'Free shipping',
    'product.quantity': 'Quantity',
    'product.addToCart': 'Add to cart',
    'product.inStock': 'In stock',
    'product.outOfStock': 'Out of stock',
    'product.reviews': 'Reviews',
    'products.addedToCart': 'Added to cart',

    // Dashboard & analytics
    actions: 'Actions',
    all: 'All',
    'common.search': 'Search',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.login': 'Login',
    'common.loginRequired': 'Login required',
    'dashboard.title': 'Dashboard',
    'dashboard.products': 'Products',
    'dashboard.orders': 'Orders',
    'dashboard.totalRevenue': 'Total revenue',
    'dashboard.totalProducts': 'Total products',
    'dashboard.totalOrders': 'Total orders',
    'dashboard.analytics': 'Analytics',
    'dashboard.averageRating': 'Average rating',
    'dashboard.addProduct': 'Add product',
    'dashboard.editProduct': 'Edit product',
    'dashboard.productTitle': 'Product title',
    'dashboard.productDescription': 'Product description',
    'dashboard.productPrice': 'Product price',
    'dashboard.productStock': 'Product stock',
    'dashboard.productStatus': 'Product status',
    'dashboard.productCategory': 'Product category',
    'dashboard.active': 'Active',
    'dashboard.inactive': 'Inactive',
    'dashboard.draft': 'Draft',
    'seller.dashboard': 'Seller dashboard',

    // Travel booking
    travelBooking: 'Travel booking',
    travelBookingSystem: 'Travel booking system',
    discoverAndBookYourNextTrip: 'Discover and book your next trip',
    flights: 'Flights',
    buses: 'Buses',
    tours: 'Tours',
    transport: 'Transport',
    availableFlights: 'Available flights',
    availableBuses: 'Available buses',
    availableTours: 'Available tours',
    searchFlights: 'Search flights',
    searchBuses: 'Search buses',
    searchTours: 'Search tours',
    from: 'From',
    to: 'To',
    departure: 'Departure',
    return: 'Return',
    date: 'Date',
    passengers: 'Passengers',
    oneWay: 'One-way',
    roundTrip: 'Round trip',
    direct: 'Direct',
    minPrice: 'Min price',
    maxPrice: 'Max price',
    duration: 'Duration',
    select: 'Select',
    selectDeparture: 'Select departure',
    selectDestination: 'Select destination',
    destination: 'Destination',
    selectDuration: 'Select duration',
    selectCategory: 'Select category',
    popularDestinations: 'Popular destinations',
    bookingDetails: 'Booking details',
    downloadTicket: 'Download ticket',
    showQR: 'Show QR',
    startBooking: 'Start booking',
    myBookings: 'My bookings',
    noBookingsFound: 'No bookings found',
    youHaveNoBookingsYet: 'You have no bookings yet',
    youHaveNoBookingsInThisCategory: 'You have no bookings in this category',
    modify: 'Modify',
    contactSupport: 'Contact support',
    refresh: 'Refresh',

    // Profile & settings
    'profile.title': 'Profile',
    'settings.title': 'Settings',

    // Footer
    'footer.allRightsReserved': 'All rights reserved',
    'footer.bestSellers': 'Best sellers',
    'footer.contactUs': 'Contact us',
    'footer.cookiePolicy': 'Cookie policy',
    'footer.deals': 'Deals',
    'footer.description': 'Millions of products with secure payments and worldwide shipping',
    'footer.feesCharges': 'Fees & charges',
    'footer.helpCenter': 'Help center',
    'footer.newArrivals': 'New arrivals',
    'footer.privacyPolicy': 'Privacy policy',
    'footer.returns': 'Returns',
    'footer.sell': 'Sell',
    'footer.sellerHub': 'Seller hub',
    'footer.sellerProtection': 'Seller protection',
    'footer.shippingInfo': 'Shipping info',
    'footer.shop': 'Shop',
    'footer.startSelling': 'Start selling',
    'footer.support': 'Support',
    'footer.termsOfService': 'Terms of service',
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

    // Cart
    'cart.title': '장바구니',
    'cart.empty': '장바구니가 비어 있습니다',
    'cart.continueShopping': '쇼핑 계속하기',
    'cart.proceedToCheckout': '결제 진행',
    'cart.total': '총계',

    // Checkout
    'checkout.title': '결제',
    'checkout.firstName': '이름',
    'checkout.lastName': '성',
    'checkout.email': '이메일',
    'checkout.phone': '전화번호',
    'checkout.address': '주소',
    'checkout.city': '도시',
    'checkout.state': '주/도',
    'checkout.zipCode': '우편번호',
    'checkout.shippingInfo': '배송 정보',
    'checkout.paymentInfo': '결제 정보',
    'checkout.orderSummary': '주문 요약',
    'checkout.subtotal': '소계',
    'checkout.shipping': '배송비',
    'checkout.tax': '세금',
    'checkout.orderTotal': '주문 합계',
    'checkout.placeOrder': '주문하기',

    // Filters & sorting
    filters: '필터',
    'filters.title': '필터',
    'filters.category': '카테고리',
    'filters.location': '위치',
    'filters.priceRange': '가격 범위',
    'filters.rating': '평점',
    'filters.applyFilters': '필터 적용',
    'filters.clearFilters': '필터 지우기',
    'filters.customerRating': '고객 평점',
    'filters.newestFirst': '최신순',
    'filters.priceLowToHigh': '가격: 낮은순',
    'filters.priceHighToLow': '가격: 높은순',
    'filters.showingResults': '결과 표시',

    // Product details
    'product.soldBy': '판매자',
    'product.returnPolicy': '반품 정책',
    'product.freeShipping': '무료 배송',
    'product.quantity': '수량',
    'product.addToCart': '장바구니에 담기',
    'product.inStock': '재고 있음',
    'product.outOfStock': '품절',
    'product.reviews': '리뷰',
    'products.addedToCart': '장바구니에 추가됨',

    // Dashboard & analytics
    actions: '작업',
    all: '전체',
    'common.search': '검색',
    'common.error': '오류',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.login': '로그인',
    'common.loginRequired': '로그인이 필요합니다',
    'dashboard.title': '대시보드',
    'dashboard.products': '상품',
    'dashboard.orders': '주문',
    'dashboard.totalRevenue': '총 매출',
    'dashboard.totalProducts': '총 상품',
    'dashboard.totalOrders': '총 주문',
    'dashboard.analytics': '분석',
    'dashboard.averageRating': '평균 평점',
    'dashboard.addProduct': '상품 추가',
    'dashboard.editProduct': '상품 수정',
    'dashboard.productTitle': '상품 제목',
    'dashboard.productDescription': '상품 설명',
    'dashboard.productPrice': '상품 가격',
    'dashboard.productStock': '재고',
    'dashboard.productStatus': '상품 상태',
    'dashboard.productCategory': '상품 카테고리',
    'dashboard.active': '활성',
    'dashboard.inactive': '비활성',
    'dashboard.draft': '임시저장',
    'seller.dashboard': '판매자 대시보드',

    // Travel booking
    travelBooking: '여행 예약',
    travelBookingSystem: '여행 예약 시스템',
    discoverAndBookYourNextTrip: '다음 여행을 발견하고 예약하세요',
    flights: '항공권',
    buses: '버스',
    tours: '투어',
    transport: '교통',
    availableFlights: '예약 가능한 항공편',
    availableBuses: '예약 가능한 버스',
    availableTours: '예약 가능한 투어',
    searchFlights: '항공편 검색',
    searchBuses: '버스 검색',
    searchTours: '투어 검색',
    from: '출발지',
    to: '도착지',
    departure: '출발',
    return: '귀환',
    date: '날짜',
    passengers: '승객',
    oneWay: '편도',
    roundTrip: '왕복',
    direct: '직항',
    minPrice: '최소 가격',
    maxPrice: '최대 가격',
    duration: '소요 시간',
    select: '선택',
    selectDeparture: '출발지 선택',
    selectDestination: '도착지 선택',
    destination: '목적지',
    selectDuration: '기간 선택',
    selectCategory: '카테고리 선택',
    popularDestinations: '인기 목적지',
    bookingDetails: '예약 상세',
    downloadTicket: '티켓 다운로드',
    showQR: 'QR 표시',
    startBooking: '예약 시작',
    myBookings: '나의 예약',
    noBookingsFound: '예약이 없습니다',
    youHaveNoBookingsYet: '아직 예약이 없습니다',
    youHaveNoBookingsInThisCategory: '이 카테고리에 예약이 없습니다',
    modify: '수정',
    contactSupport: '지원 문의',
    refresh: '새로고침',

    // Profile & settings
    'profile.title': '프로필',
    'settings.title': '설정',

    // Footer
    'footer.allRightsReserved': '모든 권리 보유',
    'footer.bestSellers': '베스트셀러',
    'footer.contactUs': '문의하기',
    'footer.cookiePolicy': '쿠키 정책',
    'footer.deals': '특가',
    'footer.description': '수백만 개의 제품, 안전한 결제와 전 세계 배송',
    'footer.feesCharges': '수수료 및 요금',
    'footer.helpCenter': '도움말 센터',
    'footer.newArrivals': '신상품',
    'footer.privacyPolicy': '개인정보 보호정책',
    'footer.returns': '반품',
    'footer.sell': '판매하기',
    'footer.sellerHub': '판매자 센터',
    'footer.sellerProtection': '판매자 보호',
    'footer.shippingInfo': '배송 정보',
    'footer.shop': '쇼핑',
    'footer.startSelling': '판매 시작',
    'footer.support': '지원',
    'footer.termsOfService': '이용 약관',
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

    // Cart
    'cart.title': 'Корзина',
    'cart.empty': 'Ваша корзина пуста',
    'cart.continueShopping': 'Продолжить покупки',
    'cart.proceedToCheckout': 'Перейти к оформлению',
    'cart.total': 'Итого',

    // Checkout
    'checkout.title': 'Оформление заказа',
    'checkout.firstName': 'Имя',
    'checkout.lastName': 'Фамилия',
    'checkout.email': 'Email',
    'checkout.phone': 'Телефон',
    'checkout.address': 'Адрес',
    'checkout.city': 'Город',
    'checkout.state': 'Область/регион',
    'checkout.zipCode': 'Почтовый индекс',
    'checkout.shippingInfo': 'Информация о доставке',
    'checkout.paymentInfo': 'Платёжная информация',
    'checkout.orderSummary': 'Сводка заказа',
    'checkout.subtotal': 'Промежуточный итог',
    'checkout.shipping': 'Доставка',
    'checkout.tax': 'Налог',
    'checkout.orderTotal': 'Сумма заказа',
    'checkout.placeOrder': 'Оформить заказ',

    // Filters & sorting
    filters: 'Фильтры',
    'filters.title': 'Фильтры',
    'filters.category': 'Категория',
    'filters.location': 'Местоположение',
    'filters.priceRange': 'Диапазон цен',
    'filters.rating': 'Рейтинг',
    'filters.applyFilters': 'Применить фильтры',
    'filters.clearFilters': 'Очистить фильтры',
    'filters.customerRating': 'Оценка покупателей',
    'filters.newestFirst': 'Сначала новые',
    'filters.priceLowToHigh': 'Цена: по возрастанию',
    'filters.priceHighToLow': 'Цена: по убыванию',
    'filters.showingResults': 'Показ результатов',

    // Product details
    'product.soldBy': 'Продавец',
    'product.returnPolicy': 'Политика возврата',
    'product.freeShipping': 'Бесплатная доставка',
    'product.quantity': 'Количество',
    'product.addToCart': 'Добавить в корзину',
    'product.inStock': 'В наличии',
    'product.outOfStock': 'Нет в наличии',
    'product.reviews': 'Отзывы',
    'products.addedToCart': 'Добавлено в корзину',

    // Dashboard & analytics
    actions: 'Действия',
    all: 'Все',
    'common.search': 'Поиск',
    'common.error': 'Ошибка',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.login': 'Войти',
    'common.loginRequired': 'Требуется вход',
    'dashboard.title': 'Панель управления',
    'dashboard.products': 'Товары',
    'dashboard.orders': 'Заказы',
    'dashboard.totalRevenue': 'Общая выручка',
    'dashboard.totalProducts': 'Всего товаров',
    'dashboard.totalOrders': 'Всего заказов',
    'dashboard.analytics': 'Аналитика',
    'dashboard.averageRating': 'Средний рейтинг',
    'dashboard.addProduct': 'Добавить товар',
    'dashboard.editProduct': 'Редактировать товар',
    'dashboard.productTitle': 'Название товара',
    'dashboard.productDescription': 'Описание товара',
    'dashboard.productPrice': 'Цена товара',
    'dashboard.productStock': 'Запас товара',
    'dashboard.productStatus': 'Статус товара',
    'dashboard.productCategory': 'Категория товара',
    'dashboard.active': 'Активно',
    'dashboard.inactive': 'Неактивно',
    'dashboard.draft': 'Черновик',
    'seller.dashboard': 'Панель продавца',

    // Travel booking
    travelBooking: 'Бронирование путешествий',
    travelBookingSystem: 'Система бронирования путешествий',
    discoverAndBookYourNextTrip: 'Откройте и забронируйте свою следующую поездку',
    flights: 'Авиарейсы',
    buses: 'Автобусы',
    tours: 'Туры',
    transport: 'Транспорт',
    availableFlights: 'Доступные рейсы',
    availableBuses: 'Доступные автобусы',
    availableTours: 'Доступные туры',
    searchFlights: 'Поиск рейсов',
    searchBuses: 'Поиск автобусов',
    searchTours: 'Поиск туров',
    from: 'Откуда',
    to: 'Куда',
    departure: 'Отправление',
    return: 'Возврат',
    date: 'Дата',
    passengers: 'Пассажиры',
    oneWay: 'В одну сторону',
    roundTrip: 'Туда и обратно',
    direct: 'Прямой',
    minPrice: 'Мин. цена',
    maxPrice: 'Макс. цена',
    duration: 'Длительность',
    select: 'Выберите',
    selectDeparture: 'Выберите отправление',
    selectDestination: 'Выберите пункт назначения',
    destination: 'Направление',
    selectDuration: 'Выберите длительность',
    selectCategory: 'Выберите категорию',
    popularDestinations: 'Популярные направления',
    bookingDetails: 'Детали бронирования',
    downloadTicket: 'Скачать билет',
    showQR: 'Показать QR',
    startBooking: 'Начать бронирование',
    myBookings: 'Мои бронирования',
    noBookingsFound: 'Бронирования не найдены',
    youHaveNoBookingsYet: 'У вас пока нет бронирований',
    youHaveNoBookingsInThisCategory: 'Нет бронирований в этой категории',
    modify: 'Изменить',
    contactSupport: 'Связаться с поддержкой',
    refresh: 'Обновить',

    // Profile & settings
    'profile.title': 'Профиль',
    'settings.title': 'Настройки',

    // Footer
    'footer.allRightsReserved': 'Все права защищены',
    'footer.bestSellers': 'Бестселлеры',
    'footer.contactUs': 'Связаться с нами',
    'footer.cookiePolicy': 'Политика cookie',
    'footer.deals': 'Предложения',
    'footer.description': 'Миллионы товаров с безопасными платежами и доставкой по всему миру',
    'footer.feesCharges': 'Сборы и платежи',
    'footer.helpCenter': 'Справочный центр',
    'footer.newArrivals': 'Новинки',
    'footer.privacyPolicy': 'Политика конфиденциальности',
    'footer.returns': 'Возвраты',
    'footer.sell': 'Продать',
    'footer.sellerHub': 'Центр продавца',
    'footer.sellerProtection': 'Защита продавцов',
    'footer.shippingInfo': 'Информация о доставке',
    'footer.shop': 'Магазин',
    'footer.startSelling': 'Начать продавать',
    'footer.support': 'Поддержка',
    'footer.termsOfService': 'Условия обслуживания',
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

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتك فارغة',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.proceedToCheckout': 'المتابعة للدفع',
    'cart.total': 'الإجمالي',

    // Checkout
    'checkout.title': 'إتمام الطلب',
    'checkout.firstName': 'الاسم الأول',
    'checkout.lastName': 'اسم العائلة',
    'checkout.email': 'البريد الإلكتروني',
    'checkout.phone': 'رقم الهاتف',
    'checkout.address': 'العنوان',
    'checkout.city': 'المدينة',
    'checkout.state': 'الولاية/المنطقة',
    'checkout.zipCode': 'الرمز البريدي',
    'checkout.shippingInfo': 'معلومات الشحن',
    'checkout.paymentInfo': 'معلومات الدفع',
    'checkout.orderSummary': 'ملخص الطلب',
    'checkout.subtotal': 'المجموع الفرعي',
    'checkout.shipping': 'الشحن',
    'checkout.tax': 'الضريبة',
    'checkout.orderTotal': 'إجمالي الطلب',
    'checkout.placeOrder': 'تأكيد الطلب',

    // Filters & sorting
    filters: 'الفلاتر',
    'filters.title': 'الفلاتر',
    'filters.category': 'الفئة',
    'filters.location': 'الموقع',
    'filters.priceRange': 'نطاق السعر',
    'filters.rating': 'التقييم',
    'filters.applyFilters': 'تطبيق الفلاتر',
    'filters.clearFilters': 'إزالة الفلاتر',
    'filters.customerRating': 'تقييم العملاء',
    'filters.newestFirst': 'الأحدث أولاً',
    'filters.priceLowToHigh': 'السعر: من الأقل إلى الأعلى',
    'filters.priceHighToLow': 'السعر: من الأعلى إلى الأقل',
    'filters.showingResults': 'عرض النتائج',

    // Product details
    'product.soldBy': 'البائع',
    'product.returnPolicy': 'سياسة الإرجاع',
    'product.freeShipping': 'شحن مجاني',
    'product.quantity': 'الكمية',
    'product.addToCart': 'أضف إلى السلة',
    'product.inStock': 'متوفر',
    'product.outOfStock': 'غير متوفر',
    'product.reviews': 'المراجعات',
    'products.addedToCart': 'تمت الإضافة إلى السلة',

    // Dashboard & analytics
    actions: 'الإجراءات',
    all: 'الكل',
    'common.search': 'بحث',
    'common.error': 'خطأ',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.login': 'تسجيل الدخول',
    'common.loginRequired': 'يتطلب تسجيل الدخول',
    'dashboard.title': 'لوحة المعلومات',
    'dashboard.products': 'المنتجات',
    'dashboard.orders': 'الطلبات',
    'dashboard.totalRevenue': 'إجمالي الإيرادات',
    'dashboard.totalProducts': 'إجمالي المنتجات',
    'dashboard.totalOrders': 'إجمالي الطلبات',
    'dashboard.analytics': 'التحليلات',
    'dashboard.averageRating': 'متوسط التقييم',
    'dashboard.addProduct': 'إضافة منتج',
    'dashboard.editProduct': 'تعديل المنتج',
    'dashboard.productTitle': 'اسم المنتج',
    'dashboard.productDescription': 'وصف المنتج',
    'dashboard.productPrice': 'سعر المنتج',
    'dashboard.productStock': 'المخزون',
    'dashboard.productStatus': 'حالة المنتج',
    'dashboard.productCategory': 'فئة المنتج',
    'dashboard.active': 'نشط',
    'dashboard.inactive': 'غير نشط',
    'dashboard.draft': 'مسودة',
    'seller.dashboard': 'لوحة البائع',

    // Travel booking
    travelBooking: 'حجوزات السفر',
    travelBookingSystem: 'نظام حجز السفر',
    discoverAndBookYourNextTrip: 'اكتشف واحجز رحلتك القادمة',
    flights: 'الرحلات الجوية',
    buses: 'الحافلات',
    tours: 'الجولات',
    transport: 'النقل',
    availableFlights: 'الرحلات المتاحة',
    availableBuses: 'الحافلات المتاحة',
    availableTours: 'الجولات المتاحة',
    searchFlights: 'بحث الرحلات الجوية',
    searchBuses: 'بحث الحافلات',
    searchTours: 'بحث الجولات',
    from: 'من',
    to: 'إلى',
    departure: 'المغادرة',
    return: 'العودة',
    date: 'التاريخ',
    passengers: 'الركاب',
    oneWay: 'ذهاب فقط',
    roundTrip: 'ذهاب وعودة',
    direct: 'مباشر',
    minPrice: 'أقل سعر',
    maxPrice: 'أعلى سعر',
    duration: 'المدة',
    select: 'اختر',
    selectDeparture: 'اختر المغادرة',
    selectDestination: 'اختر الوجهة',
    destination: 'الوجهة',
    selectDuration: 'اختر المدة',
    selectCategory: 'اختر الفئة',
    popularDestinations: 'وجهات شهيرة',
    bookingDetails: 'تفاصيل الحجز',
    downloadTicket: 'تنزيل التذكرة',
    showQR: 'عرض رمز QR',
    startBooking: 'ابدأ الحجز',
    myBookings: 'حجوزاتي',
    noBookingsFound: 'لم يتم العثور على حجوزات',
    youHaveNoBookingsYet: 'لا توجد لديك حجوزات بعد',
    youHaveNoBookingsInThisCategory: 'لا توجد حجوزات في هذه الفئة',
    modify: 'تعديل',
    contactSupport: 'التواصل مع الدعم',
    refresh: 'تحديث',

    // Profile & settings
    'profile.title': 'الملف الشخصي',
    'settings.title': 'الإعدادات',

    // Footer
    'footer.allRightsReserved': 'جميع الحقوق محفوظة',
    'footer.bestSellers': 'الأكثر مبيعًا',
    'footer.contactUs': 'اتصل بنا',
    'footer.cookiePolicy': 'سياسة الكوكيز',
    'footer.deals': 'عروض',
    'footer.description': 'ملايين المنتجات مع مدفوعات آمنة وشحن عالمي',
    'footer.feesCharges': 'الرسوم والتكاليف',
    'footer.helpCenter': 'مركز المساعدة',
    'footer.newArrivals': 'الواصل حديثًا',
    'footer.privacyPolicy': 'سياسة الخصوصية',
    'footer.returns': 'الإرجاع',
    'footer.sell': 'البيع',
    'footer.sellerHub': 'مركز البائع',
    'footer.sellerProtection': 'حماية البائع',
    'footer.shippingInfo': 'معلومات الشحن',
    'footer.shop': 'تسوق',
    'footer.startSelling': 'ابدأ البيع',
    'footer.support': 'الدعم',
    'footer.termsOfService': 'شروط الخدمة',
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