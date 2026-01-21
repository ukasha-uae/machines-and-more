export interface Category {
  main: string;
  sub: string;
}

export interface Seller {
  name: string;
  verified: boolean;
}

export interface ImageGallery {
  url: string;
  path: string;
  order: number;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  seller: Seller;
  imageUrl: string;
  gallery: ImageGallery[];
  specs: Specification[];
  createdAt: string;
}

export interface PurchaseRequest {
  id?: string;
  productId: string;
  productName: string;
  customerName: string;
  phoneNumber: string;
  location: string;
  notes?: string;
  aiSuggestedResponse?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  quote: string;
}

export const CATEGORIES = {
  machines: {
    label: "Machines",
    emoji: "🏗️",
    subcategories: [
      "Agricultural Machinery",
      "Construction Equipment",
      "Industrial Machines",
      "Power Tools",
      "Generators"
    ]
  },
  vehicles: {
    label: "Vehicles",
    emoji: "🚗",
    subcategories: [
      "Motorbikes",
      "Tricycles",
      "Cars & SUVs",
      "Trucks",
      "Buses",
      "Vans",
      "Heavy Duty Vehicles"
    ]
  },
  equipment: {
    label: "Equipment",
    emoji: "⚙️",
    subcategories: [
      "Lifting Equipment",
      "Material Handling",
      "Welding Equipment",
      "Compressors",
      "Workshop Tools"
    ]
  },
  parts: {
    label: "Parts",
    emoji: "🔧",
    subcategories: [
      "Engine Parts",
      "Body Parts",
      "Electrical Components",
      "Hydraulic Systems",
      "Tires & Wheels"
    ]
  },
  tools: {
    label: "Tools",
    emoji: "🔨",
    subcategories: [
      "Hand Tools",
      "Power Tools",
      "Measuring Tools",
      "Cutting Tools",
      "Safety Equipment"
    ]
  },
  accessories: {
    label: "Accessories",
    emoji: "📦",
    subcategories: [
      "Attachments",
      "Storage Solutions",
      "Protective Gear",
      "Maintenance Supplies",
      "Spare Parts"
    ]
  }
};
