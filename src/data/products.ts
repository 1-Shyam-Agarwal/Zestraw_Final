export interface Product {
  _id?: string; // Database ID
  id?: string;  // Static ID (legacy support)
  productName?: string; // Database field
  name?: string; // Legacy field
  category: string;
  productPrice?: number; // Database field
  price?: number; // Legacy field
  sizesAvailable?: Array<{ size: number | string; price: number }>;
  images?: string[];
  image?: string; // Legacy single image
  badge?: string;
  ecoScore?: number;
  type?: string;
  bulkPrice?: number;
  size?: string;
  sustainabilityMetrics?: {
    carbonFootprint: number;
    CO2Emission?: number;
    plasticUse: number;
    plasticAvoided: number;
    paraliUsed?: number;
  };
  details?: {
    description: {
      heading: string;
      primaryContent: string;
      secondaryContent: string;
    };
    keyFeatures: string[];
    technicalSpecifications?: string[];
    "last line"?: string[];
  };
  faqs?: Array<{ question: string; answer: string }>;
  stock?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Rice Straw Dinner Plate",
    category: "PLATES",
    type: "Plates",
    price: 24.0,
    bulkPrice: 18.5,
    image: "plates",
    size: "10-inch",
    badge: "Best Seller",
    ecoScore: 94,
  },
  {
    id: "2",
    name: "Deep Harvest Cereal Bowl",
    category: "BOWLS",
    type: "Bowls",
    price: 18.0,
    bulkPrice: 14.0,
    image: "bowls",
    size: "16oz",
    ecoScore: 88,
  },
  {
    id: "3",
    name: "Rectangle Serving Tray XL",
    category: "TRAYS",
    type: "Trays",
    price: 32.0,
    bulkPrice: 26.0,
    image: "tray",
    size: "14×10 inch",
    ecoScore: 91,
  },
  {
    id: "4",
    name: "Eco-Party Combo Pack (50pcs)",
    category: "COMBO PACKS",
    type: "Combo Packs",
    price: 85.0,
    bulkPrice: 72.0,
    image: "combo",
    badge: "Best Value",
    ecoScore: 96,
  },
  {
    id: "5",
    name: "Square Tapas Plate Set",
    category: "PLATES",
    type: "Plates",
    price: 22.0,
    bulkPrice: 18.0,
    image: "plates",
    size: "6-inch",
    ecoScore: 90,
  },
  {
    id: "6",
    name: "Minimalist Soup Bowl",
    category: "BOWLS",
    type: "Bowls",
    price: 15.0,
    bulkPrice: 11.5,
    image: "bowls",
    size: "12oz",
    ecoScore: 87,
  },
  {
    id: "7",
    name: "Biodegradable Cutlery Set",
    category: "CUTLERY",
    type: "Cutlery",
    price: 18.0,
    bulkPrice: 14.0,
    image: "cutlery",
    ecoScore: 93,
  },
  {
    id: "8",
    name: "Compostable Straws - Natural Finish",
    category: "CUTLERY",
    type: "Cutlery",
    price: 12.0,
    bulkPrice: 9.0,
    image: "straws",
    ecoScore: 95,
  },
  {
    id: "9",
    name: "Rice Straw Dinner Plates (Set of 25)",
    category: "PLATES",
    type: "Plates",
    price: 29.0,
    bulkPrice: 24.0,
    image: "plates",
    size: "10-inch",
    badge: "Sustainable Choice",
    ecoScore: 94,
  },
];

export function getProductImage(imageKey: string): string {
  // Returns a dynamic import path key
  return imageKey;
}
