export const foodCategories = [
  {
    id: "main-dishes",
    name: "ዋና ምግቦች",
    description: "ዋና ዋና የኢትዮጵያ ምግቦች",
    icon: "🍽️",
  },
  {
    id: "sides",
    name: "ተጨማሪ ምግቦች",
    description: "ከዋና ምግብ ጋር የሚቀርቡ ምግቦች",
    icon: "🥖",
  },
  {
    id: "beverages",
    name: "መጠጦች",
    description: "ሞቅ ያሉ እና ቀዝቃዛ መጠጦች",
    icon: "☕",
  },
  {
    id: "desserts",
    name: "ጣፋጭ ምግቦች",
    description: "ጣፋጭ ምግቦች እና ፍራፍሬዎች",
    icon: "🍰",
  },
  {
    id: "appetizers",
    name: "መክሰስ",
    description: "ከዋና ምግብ በፊት የሚቀርቡ ምግቦች",
    icon: "🥗",
  },
]

export const paymentMethods = [
  {
    id: "cash",
    name: "ጥሬ ገንዘብ",
    icon: "💵",
    enabled: true,
  },
  {
    id: "card",
    name: "ካርድ",
    icon: "💳",
    enabled: true,
  },
  {
    id: "mobile",
    name: "ሞባይል ክፍያ",
    icon: "📱",
    enabled: true,
  },
]

export const tableStatuses = [
  {
    id: "available",
    name: "ክፍት",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "occupied",
    name: "የተያዘ",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "reserved",
    name: "የተያዘ",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "cleaning",
    name: "በጽዳት ላይ",
    color: "bg-blue-100 text-blue-800",
  },
]

export const orderStatuses = [
  {
    id: "pending",
    name: "በመጠባበቅ ላይ",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "preparing",
    name: "በዝግጅት ላይ",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "ready",
    name: "ዝግጁ",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "served",
    name: "ተቀርቧል",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "completed",
    name: "ተጠናቋል",
    color: "bg-gray-100 text-gray-800",
  },
  {
    id: "cancelled",
    name: "ተሰርዟል",
    color: "bg-red-100 text-red-800",
  },
]

export const restaurantSettings = {
  name: "ቺሊ ሬስቶራንት",
  address: "አዲስ አበባ, ኢትዮጵያ",
  phone: "+251-11-123-4567",
  email: "info@chilirestaurant.com",
  currency: "ብር",
  taxRate: 0.15, // 15% VAT
  serviceCharge: 0.1, // 10% service charge
  workingHours: {
    open: "08:00",
    close: "22:00",
  },
  maxTableCapacity: 8,
  defaultPreparationTime: 20, // minutes
  languages: ["am", "en"], // Amharic, English
  timezone: "Africa/Addis_Ababa",
}

export const diningModes = [
  {
    id: "dine-in",
    name: "በምግብ ቤት ውስጥ",
    description: "ደንበኞች በምግብ ቤት ውስጥ ይመገባሉ",
    icon: "🍽️",
    enabled: true,
  },
  {
    id: "takeaway",
    name: "ይዘው መሄድ",
    description: "ደንበኞች ምግብ ይዘው ይሄዳሉ",
    icon: "🥡",
    enabled: true,
  },
  {
    id: "delivery",
    name: "ማድረስ",
    description: "ምግብ ወደ ደንበኛ ቤት ይደርሳል",
    icon: "🚚",
    enabled: false,
  },
]

export const priorities = [
  {
    id: "normal",
    name: "መደበኛ",
    color: "bg-gray-100 text-gray-800",
    multiplier: 1.0,
  },
  {
    id: "high",
    name: "ከፍተኛ",
    color: "bg-orange-100 text-orange-800",
    multiplier: 0.8,
  },
  {
    id: "vip",
    name: "VIP",
    color: "bg-purple-100 text-purple-800",
    multiplier: 0.6,
  },
  {
    id: "elderly",
    name: "አረጋውያን",
    color: "bg-blue-100 text-blue-800",
    multiplier: 0.7,
  },
  {
    id: "disabled",
    name: "አካል ጉዳተኞች",
    color: "bg-green-100 text-green-800",
    multiplier: 0.7,
  },
]
