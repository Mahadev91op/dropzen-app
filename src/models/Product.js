import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Home & Kitchen',
    },
    recordsCount: {
      type: Number,
      default: 5000,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 2999,
    },
    discount: {
      type: String,
      default: '50% OFF',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 150,
    },
    badge: {
      type: String,
      default: '🔥 Trending',
    },
    deliveryTime: {
      type: String,
      default: '5 - 10 Mins Automated',
    },
    freshness: {
      type: String,
      default: 'Updated Sept 2026',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    meeshoCost: {
      type: Number,
      default: 199,
    },
    resellPrice: {
      type: Number,
      default: 899,
    },
    minQuantity: {
      type: Number,
      default: 10,
    },
    highlightFeatures: {
      type: [String],
      default: [],
    },
    sampleRows: {
      type: [
        {
          id: Number,
          name: String,
          phone: String,
          city: String,
          state: String,
          pincode: String,
          product: String,
          amount: String,
          payment: String,
          date: String,
        },
      ],
      default: [],
    },
    customerLeads: {
      type: [
        {
          name: String,
          phone: String,
          address: String,
          city: String,
          state: String,
          pincode: String,
          product: String,
          amount: String,
          payment: String,
          status: String,
          date: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'products', // Explicitly maps to existing 'products' collection in dropzen DB
  }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
