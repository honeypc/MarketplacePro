export interface DestinationHotel {
  id: number;
  name: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  distance: string;
}

export interface Destination {
  id: number;
  name: string;
  nameEn: string;
  location: string;
  coordinates: { lat: number; lng: number };
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  bestTime: string;
  avgStay: string;
  attractions: string[];
  hotels: DestinationHotel[];
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: 'Hạ Long Bay',
    nameEn: 'Ha Long Bay',
    location: 'Quảng Ninh, Vietnam',
    coordinates: { lat: 20.9101, lng: 107.1839 },
    image: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=800&h=600&fit=crop',
    description: 'UNESCO World Heritage site famous for emerald waters and limestone karsts',
    rating: 4.8,
    reviews: 12847,
    category: 'Natural Wonder',
    bestTime: 'October - April',
    avgStay: '2-3 days',
    attractions: ['Titop Island', 'Sung Sot Cave', 'Floating Villages', 'Kayaking'],
    hotels: [
      {
        id: 101,
        name: 'Emeralda Cruise Ha Long',
        rating: 4.7,
        price: 2800000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'spa', 'pool'],
        distance: '0.5km from bay center'
      },
      {
        id: 102,
        name: 'Novotel Ha Long Bay',
        rating: 4.5,
        price: 2200000,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'gym', 'pool'],
        distance: '1.2km from bay center'
      },
      {
        id: 103,
        name: 'Wyndham Legend Ha Long',
        rating: 4.6,
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'spa', 'gym'],
        distance: '2.0km from bay center'
      }
    ]
  },
  {
    id: 2,
    name: 'Phố Cổ Hội An',
    nameEn: 'Hoi An Ancient Town',
    location: 'Quảng Nam, Vietnam',
    coordinates: { lat: 15.8801, lng: 108.3380 },
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
    description: 'Historic trading port with well-preserved ancient architecture',
    rating: 4.9,
    reviews: 18293,
    category: 'Historic Town',
    bestTime: 'February - August',
    avgStay: '3-4 days',
    attractions: ['Japanese Covered Bridge', 'Old Houses', 'Lantern Festival', 'Tailor Shops'],
    hotels: [
      {
        id: 201,
        name: 'La Siesta Hoi An Resort',
        rating: 4.8,
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'spa', 'restaurant'],
        distance: '0.3km from Ancient Town'
      },
      {
        id: 202,
        name: 'Boutique Hoi An Resort',
        rating: 4.6,
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'restaurant', 'spa'],
        distance: '0.5km from Ancient Town'
      },
      {
        id: 203,
        name: 'Hoi An Eco Lodge',
        rating: 4.4,
        price: 900000,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'garden', 'bike'],
        distance: '1.0km from Ancient Town'
      }
    ]
  },
  {
    id: 3,
    name: 'Phú Quốc',
    nameEn: 'Phu Quoc Island',
    location: 'Kiên Giang, Vietnam',
    coordinates: { lat: 10.2899, lng: 103.9840 },
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
    description: 'Tropical island paradise with pristine beaches and crystal clear waters',
    rating: 4.7,
    reviews: 9456,
    category: 'Beach Paradise',
    bestTime: 'November - March',
    avgStay: '4-5 days',
    attractions: ['Sao Beach', 'Night Market', 'Cable Car', 'Pepper Farms'],
    hotels: [
      {
        id: 301,
        name: 'JW Marriott Phu Quoc',
        rating: 4.9,
        price: 4500000,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach'],
        distance: '0.1km from beach'
      },
      {
        id: 302,
        name: 'Salinda Resort Phu Quoc',
        rating: 4.6,
        price: 3200000,
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'spa', 'restaurant'],
        distance: '0.2km from beach'
      },
      {
        id: 303,
        name: 'Phu Quoc Eco Beach Resort',
        rating: 4.3,
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'restaurant', 'beach'],
        distance: '0.3km from beach'
      }
    ]
  },
  {
    id: 4,
    name: 'Đà Lạt',
    nameEn: 'Da Lat',
    location: 'Lâm Đồng, Vietnam',
    coordinates: { lat: 11.9404, lng: 108.4583 },
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    description: 'Cool mountain city known for flowers, waterfalls, and French colonial architecture',
    rating: 4.6,
    reviews: 15782,
    category: 'Mountain City',
    bestTime: 'Year-round',
    avgStay: '2-3 days',
    attractions: ['Flower Gardens', 'Crazy House', 'Waterfalls', 'Coffee Plantations'],
    hotels: [
      {
        id: 401,
        name: 'Dalat Palace Heritage Hotel',
        rating: 4.7,
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'spa', 'golf'],
        distance: '1.0km from city center'
      },
      {
        id: 402,
        name: 'Ana Mandara Villas Dalat',
        rating: 4.5,
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'spa', 'garden'],
        distance: '2.0km from city center'
      },
      {
        id: 403,
        name: 'Dalat Edensee Lake Resort',
        rating: 4.4,
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'lake', 'garden'],
        distance: '3.0km from city center'
      }
    ]
  },
  {
    id: 5,
    name: 'Sapa',
    nameEn: 'Sapa',
    location: 'Lào Cai, Vietnam',
    coordinates: { lat: 22.3380, lng: 103.8438 },
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    description: 'Mountainous region famous for terraced rice fields and ethnic minorities',
    rating: 4.5,
    reviews: 8647,
    category: 'Mountain Adventure',
    bestTime: 'September - November, March - May',
    avgStay: '2-3 days',
    attractions: ['Rice Terraces', 'Fansipan Mountain', 'Ethnic Villages', 'Markets'],
    hotels: [
      {
        id: 501,
        name: 'Hotel de la Coupole - MGallery',
        rating: 4.6,
        price: 2200000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'spa', 'mountain-view'],
        distance: '0.5km from town center'
      },
      {
        id: 502,
        name: "Pao's Sapa Leisure Hotel",
        rating: 4.4,
        price: 1600000,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'spa', 'garden'],
        distance: '1.0km from town center'
      },
      {
        id: 503,
        name: 'Sapa Jade Hill Resort',
        rating: 4.2,
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        amenities: ['wifi', 'restaurant', 'mountain-view', 'garden'],
        distance: '2.0km from town center'
      }
    ]
  },
  {
    id: 6,
    name: 'Nha Trang',
    nameEn: 'Nha Trang',
    location: 'Khánh Hòa, Vietnam',
    coordinates: { lat: 12.2388, lng: 109.1967 },
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
    description: 'Coastal city with beautiful beaches, diving spots, and vibrant nightlife',
    rating: 4.4,
    reviews: 11293,
    category: 'Beach City',
    bestTime: 'January - August',
    avgStay: '3-4 days',
    attractions: ['Beaches', 'Diving', 'Night Markets', 'Temples'],
    hotels: [
      {
        id: 601,
        name: 'InterContinental Nha Trang',
        rating: 4.8,
        price: 3500000,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach'],
        distance: '0.1km from beach'
      },
      {
        id: 602,
        name: 'Sheraton Nha Trang Hotel',
        rating: 4.6,
        price: 2800000,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'spa', 'restaurant'],
        distance: '0.2km from beach'
      },
      {
        id: 603,
        name: 'Nha Trang Lodge',
        rating: 4.3,
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop',
        amenities: ['wifi', 'pool', 'restaurant', 'beach'],
        distance: '0.5km from beach'
      }
    ]
  }
];
