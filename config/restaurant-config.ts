import {
  Menu,
  TableIcon,
  CalendarRange,
  Calculator,
  Settings,
  Coffee,
  Grid,
  Utensils,
  ShoppingBag,
  TruckIcon,
  Cookie,
  Cake,
} from "lucide-react"

// ዋና የምግብ ቤት መረጃ
export const restaurantInfo = {
  name: "ቺሊ ምግብ ቤት",
  logo: "/placeholder.svg?height=64&width=64",
  address: "አዲስ አበባ, ኢትዮጵያ",
  phone: "+251-11-123-4567",
  email: "info@chilirestaurant.com",
  currency: "ብር",
  taxRate: 0.15, // 15% VAT
  serviceCharge: 0.1, // 10% service charge
}

// የመመገቢያ ዘዴዎች
export const diningModes = [
  {
    id: "dine-in",
    name: "በቤት ውስጥ",
    icon: Utensils,
    description: "ደንበኞች በምግብ ቤቱ ውስጥ ይመገባሉ",
  },
  {
    id: "takeaway",
    name: "ይዘው ይሂዱ",
    icon: ShoppingBag,
    description: "ደንበኞች ምግብ ይዘው ይሄዳሉ",
  },
  {
    id: "delivery",
    name: "ማድረስ",
    icon: TruckIcon,
    description: "ምግብ ወደ ደንበኛው ቤት ይደርሳል",
  },
]

// የጎን ማውጫ ምናሌዎች
export const navItems = [
  { icon: Menu, label: "ምናሌ", color: `text-${restaurantInfo.primaryColor}-600` },
  { icon: TableIcon, label: "የጠረጴዛ አገልግሎቶች", color: "text-gray-600" },
  { icon: CalendarRange, label: "ቦታ ማስያዝ", color: "text-gray-600" },
  { icon: TruckIcon, label: "ማድረስ", color: "text-gray-600" },
  { icon: Calculator, label: "ሂሳብ", color: "text-gray-600" },
  { icon: Settings, label: "ቅንብሮች", color: "text-gray-600" },
]

// የምግብ ምድቦችን ለኢትዮጵያ ምድቦች ተስማሚ እናድርግ
export const categories = [
  { id: "all", name: "ሁሉም", icon: Grid },
  { id: "appetizers", name: "ቅድመ ምግብ", icon: Cookie },
  { id: "main-dishes", name: "ዋና ምግብ", icon: Utensils },
  { id: "beverages", name: "መጠጦች", icon: Coffee },
  { id: "desserts", name: "ጣፋጭ", icon: Cake },
]

// የምግብ አይነቶችን እናሻሽል
export const foodTypes = {
  VEG: { label: "አትክልታዊ", color: "bg-green-500" },
  NON_VEG: { label: "ስጋ", color: "bg-red-500" },
  FISH: { label: "ዓሳ", color: "bg-blue-500" },
  DAIRY: { label: "የወተት ተዋጽኦ", color: "bg-yellow-500" },
  SPICY: { label: "ቅመም", color: "bg-orange-500" },
}

// የኢትዮጵያ ምግቦች ዝርዝር
export const foodItems = [
  // ዋና ምግቦች
  {
    id: "1",
    name: "ዶሮ ወጥ",
    category: "main-dishes",
    price: 250,
    image: "/placeholder.svg?height=200&width=200",
    description: "ባህላዊ የኢትዮጵያ ዶሮ ወጥ",
    available: true,
  },
  {
    id: "2",
    name: "ክትፎ",
    category: "main-dishes",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    description: "ጥሬ ስጋ በቅቤ እና በሚጥሚጥ",
    available: true,
  },
  {
    id: "3",
    name: "ሻይ",
    category: "beverages",
    price: 25,
    image: "/placeholder.svg?height=200&width=200",
    description: "ባህላዊ የኢትዮጵያ ሻይ",
    available: true,
  },
  {
    id: "4",
    name: "ቡና",
    category: "beverages",
    price: 35,
    image: "/placeholder.svg?height=200&width=200",
    description: "ትኩስ የኢትዮጵያ ቡና",
    available: true,
  },
]

// የክፍያ ዘዴዎች
export const paymentMethods = [
  { id: "cash", label: "ጥሬ ገንዘብ" },
  { id: "card", label: "ክሬዲት/ዴቢት ካርድ" },
  { id: "qr", label: "ኪውአር ኮድ" },
]
