export const translations = {
  en: {
    // Navigation
    home: "Home",
    admin: "Admin",
    kitchen: "Kitchen",
    employees: "Employees",
    stats: "Statistics",
    inventory: "Inventory",
    suppliers: "Suppliers",
    tables: "Tables",
    reservations: "Reservations",
    orders: "Orders",
    payments: "Payments",
    reports: "Reports",
    settings: "Settings",

    // Common
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Loading",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",

    // Food Management
    foodName: "Food Name",
    description: "Description",
    price: "Price",
    category: "Category",
    available: "Available",
    unavailable: "Unavailable",
    addFood: "Add Food",
    editFood: "Edit Food",
    deleteFood: "Delete Food",

    // Categories
    appetizers: "Appetizers",
    mainCourse: "Main Course",
    desserts: "Desserts",
    beverages: "Beverages",
    specials: "Specials",

    // Order Management
    newOrder: "New Order",
    orderNumber: "Order Number",
    customerName: "Customer Name",
    orderStatus: "Order Status",
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",

    // Cart
    cart: "Cart",
    addToCart: "Add to Cart",
    removeFromCart: "Remove from Cart",
    quantity: "Quantity",
    subtotal: "Subtotal",
    total: "Total",
    checkout: "Checkout",

    // Dining
    dineIn: "Dine In",
    takeout: "Takeout",
    delivery: "Delivery",

    // Stats
    totalRevenue: "Total Revenue",
    totalOrders: "Total Orders",
    averageOrder: "Average Order",
    topItems: "Top Items",

    // Inventory
    stockLevel: "Stock Level",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    reorderLevel: "Reorder Level",

    // Currency
    currency: "ETB",
    currencySymbol: "ETB",
  },
  am: {
    // Navigation
    home: "ቤት",
    admin: "አስተዳዳሪ",
    kitchen: "ኩሽና",
    employees: "ሰራተኞች",
    stats: "ስታቲስቲክስ",
    inventory: "ዕቃ ዝርዝር",
    suppliers: "አቅራቢዎች",
    tables: "ጠረጴዛዎች",
    reservations: "ቦታ ማስያዝ",
    orders: "ትዕዛዞች",
    payments: "ክፍያዎች",
    reports: "ሪፖርቶች",
    settings: "ቅንብሮች",

    // Common
    search: "ፈልግ",
    add: "አክል",
    edit: "አርም",
    delete: "ሰርዝ",
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    confirm: "አረጋግጥ",
    loading: "በመጫን ላይ",
    error: "ስህተት",
    success: "ተሳክቷል",
    warning: "ማስጠንቀቂያ",
    info: "መረጃ",

    // Food Management
    foodName: "የምግብ ስም",
    description: "መግለጫ",
    price: "ዋጋ",
    category: "ምድብ",
    available: "ያለ",
    unavailable: "የሌለ",
    addFood: "ምግብ አክል",
    editFood: "ምግብ አርም",
    deleteFood: "ምግብ ሰርዝ",

    // Categories
    appetizers: "ማነሻ ምግቦች",
    mainCourse: "ዋና ምግቦች",
    desserts: "ጣፋጭ ምግቦች",
    beverages: "መጠጦች",
    specials: "ልዩ ምግቦች",

    // Order Management
    newOrder: "አዲስ ትዕዛዝ",
    orderNumber: "የትዕዛዝ ቁጥር",
    customerName: "የደንበኛ ስም",
    orderStatus: "የትዕዛዝ ሁኔታ",
    pending: "በመጠባበቅ ላይ",
    preparing: "በዝግጅት ላይ",
    ready: "ዝግጁ",
    completed: "ተጠናቋል",
    cancelled: "ተሰርዟል",

    // Cart
    cart: "ጋሪ",
    addToCart: "ወደ ጋሪ አክል",
    removeFromCart: "ከጋሪ አስወግድ",
    quantity: "መጠን",
    subtotal: "ንዑስ ድምር",
    total: "ድምር",
    checkout: "ክፍያ",

    // Dining
    dineIn: "በቤት ውስጥ",
    takeout: "ይዘው መሄድ",
    delivery: "ማድረስ",

    // Stats
    totalRevenue: "አጠቃላይ ገቢ",
    totalOrders: "አጠቃላይ ትዕዛዞች",
    averageOrder: "አማካይ ትዕዛዝ",
    topItems: "ተወዳጅ ምግቦች",

    // Inventory
    stockLevel: "የአክሲዮን ደረጃ",
    lowStock: "ዝቅተኛ አክሲዮን",
    outOfStock: "አክሲዮን አልቋል",
    reorderLevel: "እንደገና የማዘዝ ደረጃ",

    // Currency
    currency: "ብር",
    currencySymbol: "ብር",
  },
}

export type TranslationKey = keyof typeof translations.en
export type Language = keyof typeof translations
