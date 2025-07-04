import { foodItems } from "@/config/restaurant-config"

// የምግብ አስተዳደር ክላስ
export class FoodManager {
  private foods = [...foodItems]

  // ሁሉንም ምግቦች ማግኘት
  getAllFoods() {
    try {
      return this.foods.filter((food) => food && food.available !== false) || []
    } catch (error) {
      console.error("Error getting all foods:", error)
      return []
    }
  }

  // በምድብ ምግቦችን ማግኘት
  getFoodsByCategory(category: string) {
    try {
      if (category === "ሁሉም") {
        return this.getAllFoods()
      }
      return this.foods.filter((food) => food && food.category === category && food.available !== false) || []
    } catch (error) {
      console.error("Error getting foods by category:", error)
      return []
    }
  }

  // በአይዲ ምግብ ማግኘት
  getFoodById(id: string) {
    try {
      return this.foods.find((food) => food && food.id === id)
    } catch (error) {
      console.error("Error getting food by ID:", error)
      return null
    }
  }

  // ምግብ መፈለግ
  searchFoods(query: string) {
    try {
      if (!query || query.trim() === "") {
        return this.getAllFoods()
      }

      const searchTerm = query.toLowerCase()
      return (
        this.foods.filter(
          (food) =>
            food &&
            food.available !== false &&
            (food.title?.toLowerCase().includes(searchTerm) ||
              food.description?.toLowerCase().includes(searchTerm) ||
              (food.ingredients &&
                Array.isArray(food.ingredients) &&
                food.ingredients.some((ingredient) => ingredient && ingredient.toLowerCase().includes(searchTerm)))),
        ) || []
      )
    } catch (error) {
      console.error("Error searching foods:", error)
      return []
    }
  }

  // አዲስ ምግብ መጨመር
  addFood(newFood: any) {
    try {
      const food = {
        ...newFood,
        id: `food-${Date.now()}`,
        available: true,
        ingredients: newFood.ingredients || [],
        title: newFood.title || "Untitled",
        description: newFood.description || "",
        price: newFood.price || 0,
        category: newFood.category || "ሌላ",
        type: newFood.type || "VEG",
        spicyLevel: newFood.spicyLevel || 0,
        preparationTime: newFood.preparationTime || 15,
      }
      this.foods.push(food)
      return food
    } catch (error) {
      console.error("Error adding food:", error)
      return null
    }
  }

  // ምግብ ማስተካከል
  updateFood(id: string, updates: any) {
    try {
      const index = this.foods.findIndex((food) => food && food.id === id)
      if (index !== -1) {
        this.foods[index] = {
          ...this.foods[index],
          ...updates,
          ingredients: updates.ingredients || this.foods[index].ingredients || [],
        }
        return this.foods[index]
      }
      return null
    } catch (error) {
      console.error("Error updating food:", error)
      return null
    }
  }

  // ምግብ ማጥፋት (በእውነቱ available = false ማድረግ)
  deleteFood(id: string) {
    try {
      const index = this.foods.findIndex((food) => food && food.id === id)
      if (index !== -1) {
        this.foods[index].available = false
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting food:", error)
      return false
    }
  }

  // በዋጋ ክልል ምግቦችን ማግኘት
  getFoodsByPriceRange(minPrice: number, maxPrice: number) {
    try {
      return (
        this.foods.filter(
          (food) => food && food.available !== false && food.price >= minPrice && food.price <= maxPrice,
        ) || []
      )
    } catch (error) {
      console.error("Error getting foods by price range:", error)
      return []
    }
  }

  // በቅመም ደረጃ ምግቦችን ማግኘት
  getFoodsBySpicyLevel(level: number) {
    try {
      return this.foods.filter((food) => food && food.available !== false && food.spicyLevel === level) || []
    } catch (error) {
      console.error("Error getting foods by spicy level:", error)
      return []
    }
  }

  // በምግብ አይነት ማግኘት
  getFoodsByType(type: string) {
    try {
      return this.foods.filter((food) => food && food.available !== false && food.type === type) || []
    } catch (error) {
      console.error("Error getting foods by type:", error)
      return []
    }
  }
}

// ግሎባል የምግብ አስተዳዳሪ
export const foodManager = new FoodManager()
