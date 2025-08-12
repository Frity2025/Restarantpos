import type { Food } from "@/types/order"

// Sample food data with barcodes for testing
export const sampleFoods: Food[] = [
  {
    id: "1",
    name: "Doro Wot",
    nameAmharic: "ዶሮ ወጥ",
    description: "Traditional Ethiopian chicken stew with berbere spice",
    descriptionAmharic: "የኢትዮጵያ ባህላዊ የዶሮ ወጥ በቤርቤሬ ቅመም",
    price: 350,
    category: "main-dishes",
    image: "/placeholder.svg?height=200&width=200&text=ዶሮ+ወጥ",
    preparationTime: 45,
    spiceLevel: "hot",
    isVegetarian: false,
    isAvailable: true,
    barcode: "0210000001234",
    ingredients: ["chicken", "berbere", "onions", "garlic", "oil", "eggs"],
    allergens: ["eggs"],
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 28,
    },
  },
  {
    id: "2",
    name: "Injera",
    nameAmharic: "እንጀራ",
    description: "Traditional Ethiopian sourdough flatbread",
    descriptionAmharic: "የኢትዮጵያ ባህላዊ እንጀራ",
    price: 25,
    category: "sides",
    image: "/placeholder.svg?height=200&width=200&text=እንጀራ",
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: true,
    isAvailable: true,
    barcode: "0520000002345",
    ingredients: ["teff flour", "water"],
    allergens: [],
    nutritionalInfo: {
      calories: 180,
      protein: 6,
      carbs: 36,
      fat: 1,
    },
  },
  {
    id: "3",
    name: "Ethiopian Coffee",
    nameAmharic: "የኢትዮጵያ ቡና",
    description: "Traditional Ethiopian coffee ceremony",
    descriptionAmharic: "የኢትዮጵያ ባህላዊ ቡና",
    price: 45,
    category: "beverages",
    image: "/placeholder.svg?height=200&width=200&text=ቡና",
    preparationTime: 10,
    spiceLevel: "mild",
    isVegetarian: true,
    isAvailable: true,
    barcode: "0430000003456",
    ingredients: ["coffee beans", "sugar"],
    allergens: [],
    nutritionalInfo: {
      calories: 50,
      protein: 1,
      carbs: 12,
      fat: 0,
    },
  },
  {
    id: "4",
    name: "Tibs",
    nameAmharic: "ጥብስ",
    description: "Sautéed meat with vegetables and spices",
    descriptionAmharic: "በቅመማ ቅመም የተቀመመ ጥብስ",
    price: 280,
    category: "main-dishes",
    image: "/placeholder.svg?height=200&width=200&text=ጥብስ",
    preparationTime: 25,
    spiceLevel: "medium",
    isVegetarian: false,
    isAvailable: true,
    barcode: "0240000004567",
    ingredients: ["beef", "onions", "peppers", "tomatoes", "spices"],
    allergens: [],
    nutritionalInfo: {
      calories: 380,
      protein: 28,
      carbs: 12,
      fat: 25,
    },
  },
  {
    id: "5",
    name: "Honey Wine",
    nameAmharic: "ጠጅ",
    description: "Traditional Ethiopian honey wine",
    descriptionAmharic: "የኢትዮጵያ ባህላዊ ጠጅ",
    price: 120,
    category: "beverages",
    image: "/placeholder.svg?height=200&width=200&text=ጠጅ",
    preparationTime: 5,
    spiceLevel: "mild",
    isVegetarian: true,
    isAvailable: true,
    barcode: "0450000005678",
    ingredients: ["honey", "water", "hops"],
    allergens: [],
    nutritionalInfo: {
      calories: 150,
      protein: 0,
      carbs: 15,
      fat: 0,
    },
  },
  {
    id: "6",
    name: "Vegetarian Combo",
    nameAmharic: "የቬጀቴሪያን ጥምር",
    description: "Assorted vegetarian dishes",
    descriptionAmharic: "የተለያዩ የቬጀቴሪያን ምግቦች",
    price: 220,
    category: "main-dishes",
    image: "/placeholder.svg?height=200&width=200&text=ቬጀቴሪያን",
    preparationTime: 30,
    spiceLevel: "medium",
    isVegetarian: true,
    isAvailable: true,
    barcode: "0260000006789",
    ingredients: ["lentils", "cabbage", "carrots", "potatoes", "spices"],
    allergens: [],
    nutritionalInfo: {
      calories: 320,
      protein: 18,
      carbs: 45,
      fat: 8,
    },
  },
  {
    id: "7",
    name: "Baklava",
    nameAmharic: "ባክላቫ",
    description: "Sweet pastry with nuts and honey",
    descriptionAmharic: "በማር እና ለውዝ የተሰራ ጣፋጭ",
    price: 85,
    category: "desserts",
    image: "/placeholder.svg?height=200&width=200&text=ባክላቫ",
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: true,
    isAvailable: true,
    barcode: "0370000007890",
    ingredients: ["phyllo dough", "nuts", "honey", "butter"],
    allergens: ["nuts", "gluten"],
    nutritionalInfo: {
      calories: 280,
      protein: 6,
      carbs: 35,
      fat: 14,
    },
  },
  {
    id: "8",
    name: "Fresh Juice",
    nameAmharic: "ትኩስ ጭማቂ",
    description: "Freshly squeezed fruit juice",
    descriptionAmharic: "ትኩስ የፍራፍሬ ጭማቂ",
    price: 35,
    category: "beverages",
    image: "/placeholder.svg?height=200&width=200&text=ጭማቂ",
    preparationTime: 5,
    spiceLevel: "mild",
    isVegetarian: true,
    isAvailable: true,
    barcode: "0480000008901",
    ingredients: ["fresh fruits", "water"],
    allergens: [],
    nutritionalInfo: {
      calories: 120,
      protein: 1,
      carbs: 30,
      fat: 0,
    },
  },
]

export const categories = [
  { id: "appetizers", name: "Appetizers", nameAmharic: "ክፍተት ምግቦች" },
  { id: "main-dishes", name: "Main Dishes", nameAmharic: "ዋና ምግቦች" },
  { id: "desserts", name: "Desserts", nameAmharic: "ጣፋጭ ምግቦች" },
  { id: "beverages", name: "Beverages", nameAmharic: "መጠጦች" },
  { id: "sides", name: "Side Dishes", nameAmharic: "ተጨማሪ ምግቦች" },
  { id: "specials", name: "Chef's Specials", nameAmharic: "ልዩ ምግቦች" },
]

export type FoodItem = Food

class FoodService {
  private foods: Food[] = [...sampleFoods]

  getAllFoods(): Food[] {
    return this.foods
  }

  getFoodById(id: string): Food | undefined {
    return this.foods.find((food) => food.id === id)
  }

  getFoodByBarcode(barcode: string): Food | undefined {
    return this.foods.find((food) => food.barcode === barcode)
  }

  getFoodsByCategory(category: string): Food[] {
    if (category === "all") return this.foods
    return this.foods.filter((food) => food.category === category)
  }

  getAvailableFoods(): Food[] {
    return this.foods.filter((food) => food.isAvailable)
  }

  searchFoods(query: string): Food[] {
    const lowercaseQuery = query.toLowerCase()
    return this.foods.filter(
      (food) =>
        food.name.toLowerCase().includes(lowercaseQuery) ||
        food.nameAmharic.toLowerCase().includes(lowercaseQuery) ||
        food.description?.toLowerCase().includes(lowercaseQuery) ||
        food.descriptionAmharic?.toLowerCase().includes(lowercaseQuery) ||
        food.barcode?.includes(query),
    )
  }

  addFood(food: Omit<Food, "id">): boolean {
    try {
      const newFood: Food = {
        ...food,
        id: Date.now().toString(),
      }
      this.foods.push(newFood)
      return true
    } catch (error) {
      console.error("Failed to add food:", error)
      return false
    }
  }

  updateFood(id: string, updates: Partial<Food>): boolean {
    try {
      const index = this.foods.findIndex((food) => food.id === id)
      if (index === -1) return false

      this.foods[index] = { ...this.foods[index], ...updates }
      return true
    } catch (error) {
      console.error("Failed to update food:", error)
      return false
    }
  }

  deleteFood(id: string): boolean {
    try {
      const index = this.foods.findIndex((food) => food.id === id)
      if (index === -1) return false

      this.foods.splice(index, 1)
      return true
    } catch (error) {
      console.error("Failed to delete food:", error)
      return false
    }
  }

  toggleAvailability(id: string): boolean {
    try {
      const food = this.getFoodById(id)
      if (!food) return false

      return this.updateFood(id, { isAvailable: !food.isAvailable })
    } catch (error) {
      console.error("Failed to toggle availability:", error)
      return false
    }
  }
}

export const foodService = new FoodService()

// Legacy exports for backward compatibility
export const foodItems = sampleFoods
export const addFoodItem = (food: Omit<Food, "id">): Food => {
  const newFood: Food = {
    ...food,
    id: Date.now().toString(),
  }
  foodService.addFood(food)
  return newFood
}
export const updateFoodItem = (id: string, updates: Partial<Food>): Food => {
  foodService.updateFood(id, updates)
  return foodService.getFoodById(id)!
}
export const deleteFoodItem = (id: string): void => {
  foodService.deleteFood(id)
}
