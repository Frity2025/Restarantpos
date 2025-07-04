export interface RestaurantInfo {
  name: string
  address: string
  phone: string
  email: string
  logo: string
}

export interface DiningMode {
  id: string
  name: string
  icon: string
  description: string
}

export interface FoodCategory {
  id: string
  name: string
  description: string
  icon: string
}

export interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  preparationTime: number
}

export const restaurantInfo: RestaurantInfo = {
  name: "ቺሊ ምግብ ቤት",
  address: "አዲስ አበባ፣ ኢትዮጵያ",
  phone: "+251-11-123-4567",
  email: "info@chilirestaurant.com",
  logo: "/placeholder-logo.png",
}

export const diningModes: DiningMode[] = [
  {
    id: "dine-in",
    name: "በቤት ውስጥ",
    icon: "utensils",
    description: "በምግብ ቤት ውስጥ መመገብ",
  },
  {
    id: "takeaway",
    name: "ይዘው መሄድ",
    icon: "shopping-bag",
    description: "ይዘው ወደ ቤት መሄድ",
  },
  {
    id: "delivery",
    name: "ማድረስ",
    icon: "truck",
    description: "ወደ ቤት ማድረስ",
  },
]

export const foodCategories: FoodCategory[] = [
  {
    id: "appetizers",
    name: "ማነሻ ምግቦች",
    description: "ለመጀመሪያ የሚቀርቡ ምግቦች",
    icon: "cookie",
  },
  {
    id: "main-dishes",
    name: "ዋና ምግቦች",
    description: "ዋና ዋና ምግቦች",
    icon: "utensils",
  },
  {
    id: "beverages",
    name: "መጠጦች",
    description: "ሙቅ እና ቀዝቃዛ መጠጦች",
    icon: "coffee",
  },
  {
    id: "desserts",
    name: "ጣፋጭ ምግቦች",
    description: "ከምግብ በኋላ የሚቀርቡ ጣፋጭ ምግቦች",
    icon: "cake",
  },
]

export const foodItems: FoodItem[] = [
  {
    id: "1",
    name: "ዶሮ ወጥ",
    description: "ባህላዊ የኢትዮጵያ ዶሮ ወጥ በእንጀራ",
    price: 250,
    category: "main-dishes",
    image: "/placeholder.jpg",
    available: true,
    preparationTime: 25,
  },
  {
    id: "2",
    name: "ክትፎ",
    description: "ጥሬ ስጋ በሚጣ እና አያይብ",
    price: 180,
    category: "main-dishes",
    image: "/placeholder.jpg",
    available: true,
    preparationTime: 15,
  },
  {
    id: "3",
    name: "ሻይ",
    description: "ባህላዊ የኢትዮጵያ ሻይ",
    price: 25,
    category: "beverages",
    image: "/placeholder.jpg",
    available: true,
    preparationTime: 5,
  },
  {
    id: "4",
    name: "ቡና",
    description: "ትኩስ የኢትዮጵያ ቡና",
    price: 35,
    category: "beverages",
    image: "/placeholder.jpg",
    available: true,
    preparationTime: 10,
  },
  {
    id: "5",
    name: "ሳምቡሳ",
    description: "የተጠበሰ ሳምቡሳ በስጋ ወይም በአትክልት",
    price: 15,
    category: "appetizers",
    image: "/placeholder.jpg",
    available: true,
    preparationTime: 8,
  },
  {
    id: "6",
    name: "ሙዝ ኬክ",
    description: "ቤት ውስጥ የተሰራ ሙዝ ኬክ",
    price: 45,
    category: "desserts",
    image: "/placeholder.jpg",
    available: true,
    preparationTime: 5,
  },
]
