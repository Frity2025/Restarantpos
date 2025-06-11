import {
  Menu,
  TableIcon,
  CalendarRange,
  Truck,
  Calculator,
  Settings,
  Coffee,
  Soup,
  UtensilsCrossed,
  ChefHat,
  Sandwich,
  Grid,
} from "lucide-react"

// ዋና የምግብ ቤት መረጃ
export const restaurantInfo = {
  name: "ቺሊ POS",
  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
  primaryColor: "green", // ዋና ቀለም - green, blue, red, purple, orange, etc.
  secondaryColor: "orange", // ሁለተኛ ቀለም
}

// የጎን ማውጫ ምናሌዎች
export const navItems = [
  { icon: Menu, label: "ምናሌ", color: `text-${restaurantInfo.primaryColor}-600` },
  { icon: TableIcon, label: "የጠረጴዛ አገልግሎቶች", color: "text-gray-600" },
  { icon: CalendarRange, label: "ቦታ ማስያዝ", color: "text-gray-600" },
  { icon: Truck, label: "ማድረስ", color: "text-gray-600" },
  { icon: Calculator, label: "ሂሳብ", color: "text-gray-600" },
  { icon: Settings, label: "ቅንብሮች", color: "text-gray-600" },
]

// የምግብ ምድቦች
export const foodCategories = [
  { icon: Grid, label: "ሁሉም", items: "235 ምግቦች", active: true },
  { icon: Coffee, label: "ቁርስ", items: "19 ምግቦች" },
  { icon: Soup, label: "ሾርባዎች", items: "8 ምግቦች" },
  { icon: UtensilsCrossed, label: "ፓስታ", items: "14 ምግቦች" },
  { icon: ChefHat, label: "ዋና ምግቦች", items: "27 ምግቦች" },
  { icon: Sandwich, label: "በርገሮች", items: "13 ምግቦች" },
]

// የምግብ አይነቶች
export const foodTypes = {
  VEG: { label: "አትክልታዊ", color: "bg-green-500" },
  NON_VEG: { label: "ስጋ", color: "bg-red-500" },
}

// የመመገቢያ ዘዴዎች
export const diningModes = ["በቦታው መመገብ", "ይዞ መሄድ", "ማድረስ"]

// የምግብ ዝርዝር
export const foodItems = [
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "ጣፋጭ የአትክልት ሰላጣ ጤናማ ምግብ",
    price: 17.99,
    discount: 20,
    type: "VEG",
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "ኦሪጅናል የስጋ በርገር ከቺፕስ ጋር",
    price: 23.99,
    type: "NON_VEG",
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "ታኮስ ሳልሳ ከዶሮ ጋር",
    price: 14.99,
    type: "NON_VEG",
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "ጥራጥሬ የብርቱካን ጭማቂ",
    price: 12.99,
    type: "VEG",
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "የስጋ ሱሺ ማኪ ከቱና ጋር",
    price: 9.99,
    type: "NON_VEG",
  },
  {
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "ኦሪጅናል በርገር ከፍሬንች ፍራይስ ጋር",
    price: 10.59,
    discount: 20,
    type: "VEG",
  },
]

// የክፍያ ዘዴዎች
export const paymentMethods = [
  { id: "cash", label: "ጥሬ ገንዘብ" },
  { id: "card", label: "ክሬዲት/ዴቢት ካርድ" },
  { id: "qr", label: "ኪውአር ኮድ" },
]

// ታክስ መጠን
export const taxRate = 0.05 // 5%
