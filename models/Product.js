import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  category: { type: String, index: true },
  images: { type: Array },
  hidden: { type: Boolean, default: false, index: true },
  creatorName: { type: String, index: true },
  store: { type: String },
  id: { type: String },
  viewCount: { type: Number, default: 0 }
}, {
  collection: 'mulebuy'
});

// Compound index for the most common query pattern
ProductSchema.index({ hidden: 1, category: 1 });
ProductSchema.index({ hidden: 1, creatorName: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema, 'productList');
