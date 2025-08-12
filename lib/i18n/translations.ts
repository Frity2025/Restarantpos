export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    orders: "Orders",
    kitchen: "Kitchen",
    inventory: "Inventory",
    employees: "Employees",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",

    // Currency
    currency: "ETB",
    revenue: "Revenue",
    total: "Total",
    subtotal: "Subtotal",
    tax: "Tax",
    discount: "Discount",

    // Food Management
    foodManagement: "Food Management",
    addNewFood: "Add New Food",
    foodName: "Food Name",
    description: "Description",
    price: "Price",
    category: "Category",
    available: "Available",
    unavailable: "Unavailable",
    ingredients: "Ingredients",
    allergens: "Allergens",

    // Categories
    appetizers: "Appetizers",
    mainDishes: "Main Dishes",
    desserts: "Desserts",
    beverages: "Beverages",
    sides: "Side Dishes",
    specials: "Chef's Specials",

    // Order Status
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    cancelled: "Cancelled",

    // Stats
    totalItems: "Total Items",
    availableItems: "Available",
    unavailableItems: "Unavailable",
    categories: "Categories",

    // Time
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",

    // Messages
    itemAdded: "Item added successfully",
    itemUpdated: "Item updated successfully",
    itemDeleted: "Item deleted successfully",
    operationFailed: "Operation failed",

    // Validation
    required: "This field is required",
    invalidEmail: "Invalid email address",
    passwordTooShort: "Password must be at least 6 characters",

    // Login
    login: "Login",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",

    // Roles
    admin: "Administrator",
    cashier: "Cashier",
    kitchen: "Kitchen Staff",
    waiter: "Waiter",
  },
  am: {
    // Navigation
    dashboard: "ዳሽቦርድ",
    orders: "ትዕዛዞች",
    kitchen: "ኩሽና",
    inventory: "ዕቃ ዝርዝር",
    employees: "ሰራተኞች",
    reports: "ሪፖርቶች",
    settings: "ቅንብሮች",
    logout: "ውጣ",

    // Common
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    delete: "ሰርዝ",
    edit: "አርትዕ",
    add: "ጨምር",
    search: "ፈልግ",
    filter: "ማጣሪያ",
    loading: "በመጫን ላይ...",
    error: "ስህተት",
    success: "ተሳክቷል",
    confirm: "አረጋግጥ",

    // Currency
    currency: "ብር",
    revenue: "ገቢ",
    total: "ጠቅላላ",
    subtotal: "ንዑስ ጠቅላላ",
    tax: "ግብር",
    discount: "ቅናሽ",

    // Food Management
    foodManagement: "የምግብ አስተዳደር",
    addNewFood: "አዲስ ምግብ ጨምር",
    foodName: "የምግብ ስም",
    description: "መግለጫ",
    price: "ዋጋ",
    category: "ምድብ",
    available: "ይገኛል",
    unavailable: "አይገኝም",
    ingredients: "ንጥረ ነገሮች",
    allergens: "አለርጂ አስነሳሾች",

    // Categories
    appetizers: "ክፍተት ምግቦች",
    mainDishes: "ዋና ምግቦች",
    desserts: "ጣፋጭ ምግቦች",
    beverages: "መጠጦች",
    sides: "ተጨማሪ ምግቦች",
    specials: "ልዩ ምግቦች",

    // Order Status
    pending: "በመጠባበቅ ላይ",
    preparing: "በዝግጅት ላይ",
    ready: "ዝግጁ",
    served: "ተቀርቧል",
    cancelled: "ተሰርዟል",

    // Stats
    totalItems: "ጠቅላላ ምግቦች",
    availableItems: "ይገኛሉ",
    unavailableItems: "አይገኙም",
    categories: "ምድቦች",

    // Time
    today: "ዛሬ",
    yesterday: "ትናንት",
    thisWeek: "በዚህ ሳምንት",
    thisMonth: "በዚህ ወር",

    // Messages
    itemAdded: "ምግብ በተሳካ ሁኔታ ተጨምሯል",
    itemUpdated: "ምግብ በተሳካ ሁኔታ ተዘምኗል",
    itemDeleted: "ምግብ በተሳካ ሁኔታ ተሰርዟል",
    operationFailed: "ክወናው አልተሳካም",

    // Validation
    required: "ይህ ሜዳ ያስፈልጋል",
    invalidEmail: "ልክ ያልሆነ ኢሜይል አድራሻ",
    passwordTooShort: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል",

    // Login
    login: "ግባ",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    forgotPassword: "የይለፍ ቃልዎን ረሱት?",
    rememberMe: "አስታውሰኝ",

    // Roles
    admin: "አስተዳዳሪ",
    cashier: "ገንዘብ ተቀባይ",
    kitchen: "የኩሽና ሰራተኛ",
    waiter: "አስተናጋጅ",
  },
}

export type Language = "en" | "am"
export type TranslationKey = keyof typeof translations.en

export function getTranslation(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.en[key] || key
}
