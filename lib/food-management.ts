export interface FoodItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  ingredients?: string[]
  preparationTime?: number
  available: boolean
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

// Mock data storage
const foodItems: FoodItem[] = [
  {
    id: "1",
    name: "ዶሮ ወጥ",
    description: "ባህላዊ የኢትዮጵያ ዶሮ ወጥ በቅመም እና በቤርቤሬ የተቀመመ",
    price: 180,
    category: "main-dishes",
    ingredients: ["ዶሮ", "ቤርቤሬ", "ሽንኩርት", "ነጭ ሽንኩርት", "ዘንጋዳ"],
    preparationTime: 25,
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "ሽሮ ወጥ",
    description: "የተፈጨ አተር በቅመም የተቀመመ ወጥ",
    price: 65,
    category: "main-dishes",
    ingredients: ["ሽሮ", "ሽንኩርት", "ቅመም", "ዘይት"],
    preparationTime: 15,
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "ቅጤ ፍርፍር",
    description: "ትኩስ ቅጤ በሽንኩርት እና በቅመም የተቀመመ",
    price: 85,
    category: "main-dishes",
    ingredients: ["ቅጤ", "ሽንኩርት", "ቅመም", "ዘይት"],
    preparationTime: 20,
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "ኢንጀራ",
    description: "ባህላዊ የኢትዮጵያ እንጀራ",
    price: 15,
    category: "sides",
    ingredients: ["ጤፍ"],
    preparationTime: 5,
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "ሻይ",
    description: "ባህላዊ የኢትዮጵያ ሻይ",
    price: 12,
    category: "beverages",
    ingredients: ["ሻይ", "ስኳር", "ወተት"],
    preparationTime: 5,
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "ቡና",
    description: "ትኩስ የተጠበሰ የኢትዮጵያ ቡና",
    price: 18,
    category: "beverages",
    ingredients: ["ቡና", "ስኳር"],
    preparationTime: 10,
    available: true,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export async function getAllFoodItems(): Promise<FoodItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...foodItems]
}

export async function getFoodItemById(id: string): Promise<FoodItem | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return foodItems.find((item) => item.id === id) || null
}

export async function addFoodItem(item: Omit<FoodItem, "id">): Promise<FoodItem> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newItem: FoodItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  foodItems.push(newItem)
  return newItem
}

export async function updateFoodItem(updatedItem: FoodItem): Promise<FoodItem> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = foodItems.findIndex((item) => item.id === updatedItem.id)
  if (index === -1) {
    throw new Error("Food item not found")
  }

  foodItems[index] = {
    ...updatedItem,
    updatedAt: new Date(),
  }

  return foodItems[index]
}

export async function deleteFoodItem(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = foodItems.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Food item not found")
  }

  foodItems.splice(index, 1)
}

export async function getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return foodItems.filter((item) => item.category === category)
}

export async function searchFoodItems(query: string): Promise<FoodItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const lowercaseQuery = query.toLowerCase()

  return foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      (item.description && item.description.toLowerCase().includes(lowercaseQuery)) ||
      (item.ingredients && item.ingredients.some((ingredient) => ingredient.toLowerCase().includes(lowercaseQuery))),
  )
}
