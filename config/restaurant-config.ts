export const restaurantInfo = {
  name: "የኢትዮጵያ ምግብ ቤት",
  address: "አዲስ አበባ, ኢትዮጵያ",
  phone: "+251-11-123-4567",
  email: "info@ethiopianrestaurant.com",
  logo: "/placeholder-logo.svg",
}

export const diningModes = [
  {
    id: "dine-in",
    name: "በቤት ውስጥ",
    icon: "utensils",
  },
  {
    id: "takeaway",
    name: "ይዘው ይሂዱ",
    icon: "shopping-bag",
  },
  {
    id: "delivery",
    name: "ማድረስ",
    icon: "truck",
  },
]

export const foodCategories = ["ሁሉም", "ዋና ምግቦች", "ፈጣን ምግቦች", "መጠጦች", "ጣፋጭ ምግቦች", "ሳላጣዎች"]

export const foodItems = [
  {
    id: "1",
    name: "ዶሮ ወጥ",
    category: "ዋና ምግቦች",
    price: 250,
    image: "/placeholder.jpg",
    description: "ባህላዊ የኢትዮጵያ ዶሮ ወጥ",
    available: true,
  },
  {
    id: "2",
    name: "ክትፎ",
    category: "ዋና ምግቦች",
    price: 180,
    image: "/placeholder.jpg",
    description: "ጥሬ የበሬ ሥጋ ከሚጣ ጋር",
    available: true,
  },
  {
    id: "3",
    name: "ሻይ",
    category: "መጠጦች",
    price: 25,
    image: "/placeholder.jpg",
    description: "ባህላዊ የኢትዮጵያ ሻይ",
    available: true,
  },
  {
    id: "4",
    name: "ቡና",
    category: "መጠጦች",
    price: 35,
    image: "/placeholder.jpg",
    description: "ትኩስ የኢትዮጵያ ቡና",
    available: true,
  },
  {
    id: "5",
    name: "ሃምበርገር",
    category: "ፈጣን ምግቦች",
    price: 120,
    image: "/placeholder.jpg",
    description: "ክላሲክ ሃምበርገር",
    available: true,
  },
]

export const tableNumbers = Array.from({ length: 20 }, (_, i) => i + 1)

export const paymentMethods = ["ጥሬ ገንዘብ", "ካርድ", "ሞባይል ገንዘብ", "ባንክ ዝውውር"]
