export interface FoodItem {
  id: string
  name: string
  nameEn: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
  preparationTime: number
  ingredients: string[]
  allergens: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  spicyLevel: number
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  tags: string[]
}

export interface Category {
  id: string
  name: string
  nameEn: string
  description: string
  icon: string
  order: number
}

export const categories: Category[] = [
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

export const foodItems: FoodItem[] = [
  {
    id: "1",
    name: "ዶሮ ወጥ",
    nameEn: "Doro Wot",
    description: "የኢትዮጵያ ባህላዊ የዶሮ ወጥ በቤርቤሬ ቅመም",
    price: 350,
    category: "traditional",
    available: true,
    preparationTime: 45,
    ingredients: ["ዶሮ", "ቤርቤሬ", "ሽንኩርት", "ነጭ ሽንኩርት", "ዘይት", "እንቁላል"],
    allergens: ["እንቁላል"],
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 28,
    },
    spicyLevel: 4,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    tags: ["ባህላዊ", "ዋና ምግብ", "ዶሮ"],
  },
  {
    id: "2",
    name: "ክትፎ",
    nameEn: "Kitfo",
    description: "የተፈጨ ጥሬ ስጋ በሚጣ ሚጣ እና ቅቤ",
    price: 280,
    category: "traditional",
    available: true,
    preparationTime: 15,
    ingredients: ["ስጋ", "ሚጣ ሚጣ", "ቅቤ", "አይብ"],
    allergens: ["ወተት"],
    nutritionalInfo: {
      calories: 380,
      protein: 28,
      carbs: 5,
      fat: 28,
    },
    spicyLevel: 3,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    tags: ["ባህላዊ", "ጥሬ", "ስጋ"],
  },
  {
    id: "3",
    name: "ሸክላ ዱባ",
    nameEn: "Shekla Duba",
    description: "የተጠበሰ ዱባ በሽንኩርት እና ቅመማ ቅመም",
    price: 180,
    category: "traditional",
    available: true,
    preparationTime: 25,
    ingredients: ["ዱባ", "ሽንኩርት", "ነጭ ሽንኩርት", "ዘይት", "ቅመማ ቅመም"],
    allergens: [],
    nutritionalInfo: {
      calories: 220,
      protein: 8,
      carbs: 35,
      fat: 8,
    },
    spicyLevel: 2,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    tags: ["ባህላዊ", "ቬጀቴሪያን", "ዱባ"],
  },
  {
    id: "4",
    name: "ፓስታ",
    nameEn: "Pasta",
    description: "የጣሊያን ፓስታ በቲማቲም ሶስ",
    price: 150,
    category: "main-dishes",
    available: true,
    preparationTime: 20,
    ingredients: ["ፓስታ", "ቲማቲም", "ሽንኩርት", "ነጭ ሽንኩርት", "ዘይት"],
    allergens: ["ግሉተን"],
    nutritionalInfo: {
      calories: 320,
      protein: 12,
      carbs: 58,
      fat: 6,
    },
    spicyLevel: 1,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    tags: ["ፓስታ", "ቬጀቴሪያን"],
  },
  {
    id: "5",
    name: "ሻይ",
    nameEn: "Tea",
    description: "ባህላዊ የኢትዮጵያ ሻይ",
    price: 25,
    category: "beverages",
    available: true,
    preparationTime: 5,
    ingredients: ["ሻይ", "ስኳር", "ወተት"],
    allergens: ["ወተት"],
    nutritionalInfo: {
      calories: 80,
      protein: 2,
      carbs: 18,
      fat: 1,
    },
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    tags: ["መጠጥ", "ሙቅ"],
  },
  {
    id: "6",
    name: "ቡና",
    nameEn: "Coffee",
    description: "የኢትዮጵያ ባህላዊ ቡና",
    price: 30,
    category: "beverages",
    available: true,
    preparationTime: 10,
    ingredients: ["የቡና ፍሬ", "ስኳር"],
    allergens: [],
    nutritionalInfo: {
      calories: 50,
      protein: 1,
      carbs: 12,
      fat: 0,
    },
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    tags: ["መጠጥ", "ሙቅ", "ካፌይን"],
  },
  {
    id: "7",
    name: "ሳላጣ",
    nameEn: "Salad",
    description: "ትኩስ የአትክልት ሳላጣ",
    price: 120,
    category: "appetizers",
    available: true,
    preparationTime: 10,
    ingredients: ["ሰላጣ", "ቲማቲም", "ሽንኩርት", "ካሮት", "ዘይት", "ሎሚ"],
    allergens: [],
    nutritionalInfo: {
      calories: 150,
      protein: 4,
      carbs: 12,
      fat: 10,
    },
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    tags: ["ሳላጣ", "ቬጀቴሪያን", "ጤናማ"],
  },
  {
    id: "8",
    name: "ቲራሚሱ",
    nameEn: "Tiramisu",
    description: "የጣሊያን ባህላዊ ጣፋጭ ምግብ",
    price: 180,
    category: "desserts",
    available: true,
    preparationTime: 15,
    ingredients: ["ማስካርፖኔ", "እንቁላል", "ስኳር", "ቡና", "ኮኮዋ"],
    allergens: ["እንቁላል", "ወተት", "ግሉተን"],
    nutritionalInfo: {
      calories: 320,
      protein: 8,
      carbs: 28,
      fat: 20,
    },
    spicyLevel: 0,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    tags: ["ጣፋጭ", "ቡና", "ክሬም"],
  },
]

// Food management functions
export function addFoodItem(foodData: Omit<FoodItem, "id">): FoodItem {
  const newFood: FoodItem = {
    ...foodData,
    id: Date.now().toString(),
  }
  foodItems.push(newFood)
  return newFood
}

export function updateFoodItem(id: string, foodData: Omit<FoodItem, "id">): FoodItem {
  const index = foodItems.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Food item not found")
  }

  const updatedFood: FoodItem = {
    ...foodData,
    id,
  }
  foodItems[index] = updatedFood
  return updatedFood
}

export function deleteFoodItem(id: string): void {
  const index = foodItems.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Food item not found")
  }
  foodItems.splice(index, 1)
}

export function getFoodItem(id: string): FoodItem | undefined {
  return foodItems.find((item) => item.id === id)
}

export function getFoodsByCategory(categoryId: string): FoodItem[] {
  return foodItems.filter((item) => item.category === categoryId)
}

export function getAvailableFoods(): FoodItem[] {
  return foodItems.filter((item) => item.available)
}

export function searchFoods(query: string): FoodItem[] {
  const lowercaseQuery = query.toLowerCase()
  return foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.nameEn.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
