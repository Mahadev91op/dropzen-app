import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  telegramLink: {
    type: String,
    default: 'https://t.me/dropzen_support',
  },
  instagramLink: {
    type: String,
    default: 'https://instagram.com/dropzen_official',
  },
  announcementText: {
    type: String,
    default: 'Welcome to Dropzen! Verified Meesho & COD Dropshipping Customer Leads delivered in Excel spreadsheets.',
  },
  announcementActive: {
    type: Boolean,
    default: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  globalDiscount: {
    type: Number,
    default: 0, // percentage discount
  },
  upiId: {
    type: String,
    default: 'mahadevtanti191@okaxis',
  },
  usdToInrRate: {
    type: Number,
    default: 83,
  },
  globalMinQuantity: {
    type: Number,
    default: 1,
    min: 1,
  }
}, {
  timestamps: true,
  strict: false
});

if (mongoose.models && mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
