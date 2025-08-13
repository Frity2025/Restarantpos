export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    orders: "Orders",
    menu: "Menu",
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
    total: "Total",
    subtotal: "Subtotal",
    tax: "Tax",
    discount: "Discount",

    // Food Management
    addFood: "Add Food",
    editFood: "Edit Food",
    foodName: "Food Name",
    description: "Description",
    price: "Price",
    category: "Category",
    image: "Image",
    available: "Available",
    unavailable: "Unavailable",

    // Categories
    appetizers: "Appetizers",
    mains: "Main Courses",
    desserts: "Desserts",
    beverages: "Beverages",
    specials: "Specials",

    // Orders
    newOrder: "New Order",
    orderHistory: "Order History",
    orderStatus: "Order Status",
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    cancelled: "Cancelled",

    // Payment
    cash: "Cash",
    card: "Card",
    mobile: "Mobile Payment",
    totalAmount: "Total Amount",
    paymentMethod: "Payment Method",

    // Stats
    totalRevenue: "Total Revenue",
    totalOrders: "Total Orders",
    averageOrder: "Average Order",
    topItems: "Top Items",

    // Dining
    dineIn: "Dine In",
    takeout: "Takeout",
    delivery: "Delivery",

    // Inventory
    stockLevel: "Stock Level",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    reorderLevel: "Reorder Level",

    // Barcode
    scanBarcode: "Scan Barcode",
    barcodeScanner: "Barcode Scanner",
    scanProduct: "Scan Product",
    scanInventory: "Scan Inventory",

    // Currency
    currency: "ETB",
    currencySymbol: "ETB",
  },
  am: {
    // Navigation
    dashboard: "ዳሽቦርድ",
    orders: "ትዕዛዞች",
    menu: "ምናሌ",
    inventory: "ዕቃ ዝርዝር",
    employees: "ሰራተኞች",
    reports: "ሪፖርቶች",
    settings: "ቅንብሮች",
    logout: "ውጣ",

    // Common
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    delete: "ሰርዝ",
    edit: "አርም",
    add: "አክል",
    search: "ፈልግ",
    filter: "ማጣሪያ",
    total: "ጠቅላላ",
    subtotal: "ንዑስ ጠቅላላ",
    tax: "ግብር",
    discount: "ቅናሽ",

    // Food Management
    addFood: "ምግብ አክል",
    editFood: "ምግብ አርም",
    foodName: "የምግብ ስም",
    description: "መግለጫ",
    price: "ዋጋ",
    category: "ምድብ",
    image: "ምስል",
    available: "ይገኛል",
    unavailable: "አይገኝም",

    // Categories
    appetizers: "ማነሻ ምግቦች",
    mains: "ዋና ምግቦች",
    desserts: "ጣፋጭ ምግቦች",
    beverages: "መጠጦች",
    specials: "ልዩ ምግቦች",

    // Orders
    newOrder: "አዲስ ትዕዛዝ",
    orderHistory: "የትዕዛዝ ታሪክ",
    orderStatus: "የትዕዛዝ ሁኔታ",
    pending: "በመጠባበቅ ላይ",
    preparing: "በዝግጅት ላይ",
    ready: "ዝግጁ",
    served: "ተቀርቧል",
    cancelled: "ተሰርዟል",

    // Payment
    cash: "ጥሬ ገንዘብ",
    card: "ካርድ",
    mobile: "ሞባይል ክፍያ",
    totalAmount: "ጠቅላላ መጠን",
    paymentMethod: "የክፍያ መንገድ",

    // Stats
    totalRevenue: "ጠቅላላ ገቢ",
    totalOrders: "ጠቅላላ ትዕዛዞች",
    averageOrder: "አማካይ ትዕዛዝ",
    topItems: "ተወዳጅ ምግቦች",

    // Dining
    dineIn: "በሬስቶራንት ውስጥ",
    takeout: "ይዘው ይሂዱ",
    delivery: "ማድረስ",

    // Inventory
    stockLevel: "የአክሲዮን ደረጃ",
    lowStock: "ዝቅተኛ አክሲዮን",
    outOfStock: "አክሲዮን አልቋል",
    reorderLevel: "እንደገና የማዘዝ ደረጃ",

    // Barcode
    scanBarcode: "ባርኮድ ስካን ያድርጉ",
    barcodeScanner: "ባርኮድ ስካነር",
    scanProduct: "ምርት ስካን ያድርጉ",
    scanInventory: "ዕቃ ዝርዝር ስካን ያድርጉ",

    // Currency
    currency: "ብር",
    currencySymbol: "ብር",
  },
}

export type TranslationKey = keyof typeof translations.en
export type Language = keyof typeof translations
