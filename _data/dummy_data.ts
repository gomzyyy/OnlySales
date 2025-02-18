import type { Customer, Product } from "../types";
import {QuantityType} from "../enums"

type DummyData={
  totalSales:string;
  totalUdhars:string;
  customers:Customer[]
}

const sampleProducts: Product[] = [
  {
    id: '101',
    name: 'Rice',
    image: null,
    basePrice: '50',
    discountedPrice: '45',
    quantity: '5',
    measurementType: QuantityType.KILOGRAMS,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '102',
    name: 'Milk',
    image: null,
    basePrice: '60',
    discountedPrice: '55',
    quantity: '2',
    measurementType: QuantityType.LITRE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '103',
    name: 'Sugar',
    image: null,
    basePrice: '40',
    discountedPrice: '38',
    quantity: '3',
    measurementType: QuantityType.KILOGRAMS,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const d:DummyData = {
  totalSales: '3240',
  totalUdhars: '980',
  customers: [
    { id: '1', fullName: 'Rohit Kumar', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', fullName: 'Amit Sharma', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '3', fullName: 'Neha Verma', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '4', fullName: 'Vikas Gupta', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '5', fullName: 'Priya Singh', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '6', fullName: 'Manish Yadav', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '7', fullName: 'Anjali Mehta', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '8', fullName: 'Suresh Patel', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '9', fullName: 'Ritu Chawla', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '10', fullName: 'Sanjay Thakur', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
    { id: '11', fullName: 'Kavita Joshi', image: null, unpaidPayments: sampleProducts, paidPayments: [], createdAt: new Date(), updatedAt: new Date() },
  ]
};

export {d,sampleProducts};
