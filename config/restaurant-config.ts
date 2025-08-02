export interface RestaurantConfig {
  name: string
  nameEn: string
  address: string
  phone: string
  email: string
  website: string
  currency: string
  taxRate: number
  serviceCharge: number
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  tableCount: number
  maxPartySize: number
  reservationSettings: {
    advanceBookingDays: number
    minBookingHours: number
    maxBookingHours: number
    requireDeposit: boolean
    depositAmount: number
  }
  paymentMethods: string[]
  languages: string[]
  features: {
    onlineOrdering: boolean
    delivery: boolean
    takeaway: boolean
    reservations: boolean
    waitlist: boolean
    loyaltyProgram: boolean
  }
}

export const foodCategories = [
  {
    id: "appetizers",
    name: "ቅድመ ምግብ",
    nameEn: "Appetizers",
    description: "የምግብ ቅድመ ዝግጅት",
    icon: "🥗",
    order: 1,
  },
  {
    id: "main-dishes",
    name: "ዋና ምግቦች",
    nameEn: "Main Dishes",
    description: "ዋና የምግብ ዓይነቶች",
    icon: "🍽️",
    order: 2,
  },
  {
    id: "traditional",
    name: "ባህላዊ ምግቦች",
    nameEn: "Traditional Foods",
    description: "የኢትዮጵያ ባህላዊ ምግቦች",
    icon: "🇪🇹",
    order: 3,
  },
  {
    id: "beverages",
    name: "መጠጦች",
    nameEn: "Beverages",
    description: "ሙቅ እና ቀዝቃዛ መጠጦች",
    icon: "🥤",
    order: 4,
  },
  {
    id: "desserts",
    name: "ጣፋጭ ምግቦች",
    nameEn: "Desserts",
    description: "ጣፋጭ የመጨረሻ ምግቦች",
    icon: "🍰",
    order: 5,
  },
]

export const restaurantConfig: RestaurantConfig = {
  name: "የባህል ምግብ ቤት",
  nameEn: "Cultural Restaurant",
  address: "አዲስ አበባ, ኢትዮጵያ",
  phone: "+251-11-123-4567",
  email: "info@culturalrestaurant.et",
  website: "www.culturalrestaurant.et",
  currency: "ብር",
  taxRate: 0.15,
  serviceCharge: 0.1,
  openingHours: {
    monday: { open: "08:00", close: "22:00", closed: false },
    tuesday: { open: "08:00", close: "22:00", closed: false },
    wednesday: { open: "08:00", close: "22:00", closed: false },
    thursday: { open: "08:00", close: "22:00", closed: false },
    friday: { open: "08:00", close: "23:00", closed: false },
    saturday: { open: "08:00", close: "23:00", closed: false },
    sunday: { open: "09:00", close: "21:00", closed: false },
  },
  tableCount: 20,
  maxPartySize: 12,
  reservationSettings: {
    advanceBookingDays: 30,
    minBookingHours: 2,
    maxBookingHours: 720, // 30 days
    requireDeposit: false,
    depositAmount: 100,
  },
  paymentMethods: ["ጥሬ ገንዘብ", "ክሬዲት ካርድ", "ሞባይል ክፍያ", "ባንክ ዝውውር"],
  languages: ["አማርኛ", "English"],
  features: {
    onlineOrdering: true,
    delivery: true,
    takeaway: true,
    reservations: true,
    waitlist: true,
    loyaltyProgram: false,
  },
}

export const diningModes = [
  {
    id: "dine-in",
    name: "በሬስቶራንት ውስጥ",
    nameEn: "Dine In",
    description: "በሬስቶራንት ውስጥ ይመገቡ",
    icon: "🍽️",
    available: true,
  },
  {
    id: "takeaway",
    name: "ይዘው ይሂዱ",
    nameEn: "Takeaway",
    description: "ምግብ ይዘው ይሂዱ",
    icon: "🥡",
    available: true,
  },
  {
    id: "delivery",
    name: "ማድረስ",
    nameEn: "Delivery",
    description: "ወደ ቤትዎ እናደርሳለን",
    icon: "🚚",
    available: restaurantConfig.features.delivery,
  },
]

export const paymentTypes = [
  {
    id: "cash",
    name: "ጥሬ ገንዘብ",
    nameEn: "Cash",
    icon: "💵",
    available: true,
  },
  {
    id: "card",
    name: "ክሬዲት ካርድ",
    nameEn: "Credit Card",
    icon: "💳",
    available: true,
  },
  {
    id: "mobile",
    name: "ሞባይል ክፍያ",
    nameEn: "Mobile Payment",
    icon: "📱",
    available: true,
  },
  {
    id: "bank",
    name: "ባንክ ዝውውር",
    nameEn: "Bank Transfer",
    icon: "🏦",
    available: true,
  },
]

export const orderStatuses = [
  {
    id: "pending",
    name: "በመጠባበቅ ላይ",
    nameEn: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    description: "ትዕዛዝ ተቀብሏል እና በመጠባበቅ ላይ ነው",
  },
  {
    id: "confirmed",
    name: "ተረጋግጧል",
    nameEn: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    description: "ትዕዛዝ ተረጋግጧል",
  },
  {
    id: "preparing",
    name: "እየተዘጋጀ",
    nameEn: "Preparing",
    color: "bg-orange-100 text-orange-800",
    description: "ምግብ እየተዘጋጀ ነው",
  },
  {
    id: "ready",
    name: "ዝግጁ",
    nameEn: "Ready",
    color: "bg-green-100 text-green-800",
    description: "ምግብ ዝግጁ ነው",
  },
  {
    id: "served",
    name: "ተቀርቧል",
    nameEn: "Served",
    color: "bg-purple-100 text-purple-800",
    description: "ምግብ ለደንበኛ ተቀርቧል",
  },
  {
    id: "completed",
    name: "ተጠናቅቋል",
    nameEn: "Completed",
    color: "bg-gray-100 text-gray-800",
    description: "ትዕዛዝ ተጠናቅቋል",
  },
  {
    id: "cancelled",
    name: "ተሰርዟል",
    nameEn: "Cancelled",
    color: "bg-red-100 text-red-800",
    description: "ትዕዛዝ ተሰርዟል",
  },
]

export const tableStatuses = [
  {
    id: "available",
    name: "ይገኛል",
    nameEn: "Available",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "occupied",
    name: "ተይዟል",
    nameEn: "Occupied",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "reserved",
    name: "ተያዟል",
    nameEn: "Reserved",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "cleaning",
    name: "እየተጸዳ",
    nameEn: "Cleaning",
    color: "bg-yellow-100 text-yellow-800",
  },
]

export const spicyLevels = [
  { level: 0, name: "ምንም አይደለም", nameEn: "None", icon: "⚪" },
  { level: 1, name: "ቀላል", nameEn: "Mild", icon: "🟡" },
  { level: 2, name: "መካከለኛ", nameEn: "Medium", icon: "🟠" },
  { level: 3, name: "ጠንካራ", nameEn: "Hot", icon: "🔴" },
  { level: 4, name: "በጣም ጠንካራ", nameEn: "Very Hot", icon: "🌶️" },
  { level: 5, name: "እሳት", nameEn: "Fire", icon: "🔥" },
]

export const allergens = ["እንቁላል", "ወተት", "ግሉተን", "ለውዝ", "ሶያ", "ዓሳ", "ሼልፊሽ", "ሰሊጥ"]

export const dietaryPreferences = [
  { id: "vegetarian", name: "ቬጀቴሪያን", nameEn: "Vegetarian" },
  { id: "vegan", name: "ቪጋን", nameEn: "Vegan" },
  { id: "gluten-free", name: "ግሉተን ነጻ", nameEn: "Gluten Free" },
  { id: "halal", name: "ሃላል", nameEn: "Halal" },
  { id: "kosher", name: "ኮሸር", nameEn: "Kosher" },
]
