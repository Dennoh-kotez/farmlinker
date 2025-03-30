// API Configuration
export const API_URL = 'http://10.0.2.2:3000'; // Android emulator uses 10.0.2.2 to connect to host machine

// M-Pesa Configuration
export const MPESA_CONFIG = {
  CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || '',
  CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || '',
  SHORTCODE: process.env.MPESA_SHORTCODE || '',
  PASSKEY: process.env.MPESA_PASSKEY || '',
  CALLBACK_URL: `${API_URL}/api/mpesa/callback`,
};

// File Sizes
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB max image size

// Kenya Specific Data
export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 
  'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 
  'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 
  'Vihiga', 'Wajir', 'West Pokot'
];

// Product Categories Specific to Kenyan Agriculture
export const PRODUCT_CATEGORIES = [
  'Cereals', // Maize, wheat, rice, millet, sorghum
  'Vegetables', // Kales, spinach, cabbage, tomatoes, onions, etc.
  'Fruits', // Bananas, mangoes, oranges, avocadoes, etc.
  'Tubers', // Potatoes, sweet potatoes, cassava, etc.
  'Pulses', // Beans, peas, lentils, etc.
  'Dairy', // Milk, cheese, yogurt, etc.
  'Poultry', // Eggs, chicken, etc.
  'Livestock', // Cattle, goats, sheep, etc.
  'Fish', // Tilapia, Nile perch, etc.
  'Cash Crops', // Tea, coffee, sugarcane, etc.
  'Nuts & Seeds', // Groundnuts, macadamia, etc.
  'Herbs & Spices', // Coriander, rosemary, basil, etc.
  'Honey & Beekeeping', // Honey and beekeeping products
  'Farm Equipment', // Agricultural tools and machinery
  'Farm Inputs', // Seeds, fertilizers, pesticides
  'Other'
];

// Measurement Units
export const MEASUREMENT_UNITS = [
  'kg', // Kilograms - for weights
  'g', // Grams - for small weights
  'ton', // Tonnes - for large weights
  'l', // Liters - for liquids
  'ml', // Milliliters - for small liquid volumes
  'piece', // Individual items (e.g., eggs, fruits)
  'dozen', // Set of 12 items
  'bunch', // Bundle of items (e.g., bananas, vegetables)
  'crate', // Container (e.g., tomatoes)
  'bag', // Sack (e.g., potatoes, maize)
  'box', // Container (e.g., fruits)
  'tray', // Container (e.g., eggs)
  'acre', // Land measurement
  'hectare', // Land measurement
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment Methods
export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CASH_ON_DELIVERY: 'cash_on_delivery'
};