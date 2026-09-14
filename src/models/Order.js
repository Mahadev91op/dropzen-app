import mongoose from 'mongoose';

// Clear cached Order model so hot-reloads always use updated schema
if (mongoose.models && mongoose.models.Order) {
  delete mongoose.models.Order;
}

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: false,
  },
  quantity: {
    type: Number,
    default: 10,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  pricePaid: {
    type: Number,
    required: true,
  },
  utrNumber: {
    type: String,
    default: '',
    trim: true,
  },
  senderUpiId: {
    type: String,
    default: '',
    trim: true,
  },
  paymentApp: {
    type: String,
    enum: ['phonepe', 'gpay', 'paytm', 'bhim', 'other', ''],
    default: 'other',
  },
  paymentScreenshot: {
    type: String, // Base64 Data URL
    default: '',
  },
  rejectionReason: {
    type: String,
    default: '',
    trim: true,
  },
  excelData: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
  productSnapshot: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  cardSnapshot: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  releasedCardDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
