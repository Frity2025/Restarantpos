import { foodCategories, restaurantInfo } from "@/config/restaurant-config"

export function CategoryFilter() {
  return (
    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
      {foodCategories.map((category, index) => (
        <div
          key={index}
          className={`flex flex-col items-center p-3 rounded-xl min-w-[100px] ${
            category.active
              ? `bg-${restaurantInfo.primaryColor}-50 text-${restaurantInfo.primaryColor}-600`
              : "bg-white"
          } border cursor-pointer hover:bg-${restaurantInfo.primaryColor}-50`}
        >
          <category.icon className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">{category.label}</span>
          <span className="text-xs text-gray-500">{category.items}</span>
        </div>
      ))}
    </div>
  )
}
