import { foodItems } from "@/config/restaurant-config"

// የምግብ አስተዳደር ክላስ
export class FoodManager {
  private foods = [...foodItems]

  // ሁሉንም ምግቦች ማግኘት
  getAllFoods() {
    return this.foods.filter((food) => food.available)
  }

  // በምድብ ምግቦችን ማግኘት
  getFoodsByCategory(category: string) {
    if (category === "ሁሉም") {
      return this.getAllFoods()
    }
    return this.foods.filter((food) => food.category === category && food.available)
  }

  // በአይዲ ምግብ ማግኘት
  getFoodById(id: string) {
    return this.foods.find((food) => food.id === id)
  }

  // ምግብ መፈለግ
  searchFoods(query: string) {
    const searchTerm = query.toLowerCase()
    return this.foods.filter(
      (food) =>
        food.available &&
        (food.title.toLowerCase().includes(searchTerm) ||
          food.description.toLowerCase().includes(searchTerm) ||
          food.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm))),
    )
  }

  // አዲስ ምግብ መጨመር
  addFood(newFood: any) {
    const food = {
      ...newFood,
      id: `food-${Date.now()}`,
      available: true,
    }
    this.foods.push(food)
    return food
  }

  // ምግብ ማስተካከል
  updateFood(id: string, updates: any) {
    const index = this.foods.findIndex((food) => food.id === id)
    if (index !== -1) {
      this.foods[index] = { ...this.foods[index], ...updates }
      return this.foods[index]
    }
    return null
  }

  // ምግብ ማጥፋት (በእውነቱ available = false ማድረግ)
  deleteFood(id: string) {
    const index = this.foods.findIndex((food) => food.id === id)
    if (index !== -1) {
      this.foods[index].available = false
      return true
    }
    return false
  }

  // በዋጋ ክልል ምግቦችን ማግኘት
  getFoodsByPriceRange(minPrice: number, maxPrice: number) {
    return this.foods.filter((food) => food.available && food.price >= minPrice && food.price <= maxPrice)
  }

  // በቅመም ደረጃ ምግቦችን ማግኘት
  getFoodsBySpicyLevel(level: number) {
    return this.foods.filter((food) => food.available && food.spicyLevel === level)
  }

  // በምግብ አይነት ማግኘት
  getFoodsByType(type: string) {
    return this.foods.filter((food) => food.available && food.type === type)
  }
}

// ግሎባል የምግብ አስተዳዳሪ
export const foodManager = new FoodManager()
