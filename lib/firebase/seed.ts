import { Product } from '@/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const seedProducts: Omit<Product, 'id'>[] = [
  {
    slug: 'caterpillar-excavator-320d',
    name: 'Caterpillar Excavator 320D',
    category: {
      main: 'Machines',
      sub: 'Construction Equipment'
    },
    price: 85000,
    description: 'Heavy-duty excavator ideal for large construction projects. Features advanced hydraulic systems and fuel-efficient engine.',
    seller: {
      name: 'Ghana Heavy Equipment Ltd.',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
        path: 'products/demo/excavator-1.jpg',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        path: 'products/demo/excavator-2.jpg',
        order: 1
      }
    ],
    specs: [
      { key: 'Operating Weight', value: '20,240 kg' },
      { key: 'Engine Power', value: '105 kW' },
      { key: 'Bucket Capacity', value: '0.9 m³' },
      { key: 'Max Digging Depth', value: '6.5 m' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    slug: 'john-deere-tractor-5075e',
    name: 'John Deere Tractor 5075E',
    category: {
      main: 'Machines',
      sub: 'Agricultural Machinery'
    },
    price: 42000,
    description: 'Versatile agricultural tractor perfect for farming operations. Powerful engine with smooth transmission.',
    seller: {
      name: 'AgriTech Ghana',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
        path: 'products/demo/tractor-1.jpg',
        order: 0
      }
    ],
    specs: [
      { key: 'Engine Power', value: '75 HP' },
      { key: 'Transmission', value: 'PowrReverser' },
      { key: 'Lift Capacity', value: '2,200 kg' },
      { key: 'PTO Power', value: '63 HP' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    slug: 'mercedes-benz-actros-truck',
    name: 'Mercedes-Benz Actros 2545',
    category: {
      main: 'Vehicles',
      sub: 'Trucks'
    },
    price: 95000,
    description: 'Premium heavy-duty truck for long-distance haulage. Excellent fuel economy and driver comfort.',
    seller: {
      name: 'West Africa Motors',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
        path: 'products/demo/truck-1.jpg',
        order: 0
      }
    ],
    specs: [
      { key: 'Engine', value: 'OM 471, 6-cylinder' },
      { key: 'Power Output', value: '450 HP' },
      { key: 'GVW', value: '25,000 kg' },
      { key: 'Transmission', value: 'PowerShift 3' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    slug: 'honda-generator-eu70is',
    name: 'Honda Generator EU70iS',
    category: {
      main: 'Machines',
      sub: 'Generators'
    },
    price: 5500,
    description: 'Portable inverter generator with exceptional fuel efficiency. Perfect for backup power and outdoor events.',
    seller: {
      name: 'PowerGen Solutions',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?w=800',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?w=800',
        path: 'products/demo/generator-1.jpg',
        order: 0
      }
    ],
    specs: [
      { key: 'Max Output', value: '7000W' },
      { key: 'Rated Output', value: '5500W' },
      { key: 'Fuel Tank', value: '5.1 Liters' },
      { key: 'Runtime', value: '6.5 hours @ 50% load' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    slug: 'toyota-land-cruiser-pickup',
    name: 'Toyota Land Cruiser Pickup',
    category: {
      main: 'Vehicles',
      sub: 'Commercial Vehicles'
    },
    price: 68000,
    description: 'Rugged and reliable pickup truck built for tough terrain. Ideal for construction sites and rural areas.',
    seller: {
      name: 'Toyota Ghana',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        path: 'products/demo/pickup-1.jpg',
        order: 0
      }
    ],
    specs: [
      { key: 'Engine', value: '4.5L V8 Diesel' },
      { key: 'Power', value: '202 HP' },
      { key: 'Drive Type', value: '4WD' },
      { key: 'Payload', value: '1,200 kg' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    slug: 'bobcat-skid-steer-s570',
    name: 'Bobcat Skid Steer S570',
    category: {
      main: 'Machines',
      sub: 'Construction Equipment'
    },
    price: 38000,
    description: 'Compact and maneuverable skid-steer loader. Perfect for tight spaces and versatile applications.',
    seller: {
      name: 'Ghana Heavy Equipment Ltd.',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d42e4e0e48f?w=800',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1581093458791-9d42e4e0e48f?w=800',
        path: 'products/demo/skid-1.jpg',
        order: 0
      }
    ],
    specs: [
      { key: 'Operating Capacity', value: '1,134 kg' },
      { key: 'Engine Power', value: '61 HP' },
      { key: 'Operating Weight', value: '3,402 kg' },
      { key: 'Bucket Width', value: '1.8 m' }
    ],
    createdAt: new Date().toISOString()
  }
];

export async function seedDatabase(): Promise<void> {
  const productsCollection = collection(db, 'products');
  
  for (const product of seedProducts) {
    await addDoc(productsCollection, product);
  }
}
