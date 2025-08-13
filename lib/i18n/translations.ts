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
    admin: "Admin",

    // Common
    success: "Success",
    error: "Error",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",

    // Food Management
    foodManagement: "Food Management",
    addNewFood: "Add New Food",
    totalItems: "Total Items",
    availableItems: "Available Items",
    unavailableItems: "Unavailable Items",
    categories: "Categories",
    available: "Available",
    unavailable: "Unavailable",
    itemAdded: "Item added successfully",
    itemUpdated: "Item updated successfully",
    itemDeleted: "Item deleted successfully",
    operationFailed: "Operation failed",

    // Inventory
    inventoryManagement: "Inventory Management",
    currentStock: "Current Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    stockUpdate: "Stock Update",

    // Barcode
    scanBarcode: "Scan Barcode",
    generateBarcode: "Generate Barcode",
    barcodeScanner: "Barcode Scanner",

    // Currency
    currency: "ETB",

    // Orders
    newOrder: "New Order",
    orderHistory: "Order History",
    totalRevenue: "Total Revenue",

    // Kitchen
    pendingOrders: "Pending Orders",
    inProgress: "In Progress",
    completed: "Completed",

    // Employees
    employeeManagement: "Employee Management",
    addEmployee: "Add Employee",

    // Reports
    salesReport: "Sales Report",
    inventoryReport: "Inventory Report",
    dailyReport: "Daily Report",
  },
  am: {
    // Navigation
    dashboard: "ዳሽቦርድ",
    orders: "ትዕዛዞች",
    kitchen: "ኩሽና",
    inventory: "ክምችት",
    employees: "ሰራተኞች",
    reports: "ሪፖርቶች",
    settings: "ቅንብሮች",
    admin: "አስተዳዳሪ",

    // Common
    success: "ተሳክቷል",
    error: "ስህተት",
    cancel: "ሰርዝ",
    save: "አስቀምጥ",
    delete: "ሰርዝ",
    edit: "አርትዕ",
    add: "ጨምር",
    search: "ፈልግ",
    filter: "ፍልተር",
    loading: "በመጫን ላይ...",

    // Food Management
    foodManagement: "የምግብ አስተዳደር",
    addNewFood: "አዲስ ምግብ ጨምር",
    totalItems: "ጠቅላላ እቃዎች",
    availableItems: "ይገኛሉ",
    unavailableItems: "አይገኙም",
    categories: "ምድቦች",
    available: "ይገኛል",
    unavailable: "አይገኝም",
    itemAdded: "እቃ በተሳካ ሁኔታ ተጨምሯል",
    itemUpdated: "እቃ በተሳካ ሁኔታ ተዘምኗል",
    itemDeleted: "እቃ በተሳካ ሁኔታ ተሰርዟል",
    operationFailed: "ክወናው አልተሳካም",

    // Inventory
    inventoryManagement: "የክምችት አስተዳደር",
    currentStock: "ወቅታዊ ክምችት",
    lowStock: "ዝቅተኛ ክምችት",
    outOfStock: "ከክምችት ውጭ",
    stockUpdate: "ክምችት ዘምን",

    // Barcode
    scanBarcode: "ባርኮድ ስካን",
    generateBarcode: "ባርኮድ ፍጠር",
    barcodeScanner: "ባርኮድ ስካነር",

    // Currency
    currency: "ብር",

    // Orders
    newOrder: "አዲስ ትዕዛዝ",
    orderHistory: "የትዕዛዝ ታሪክ",
    totalRevenue: "ጠቅላላ ገቢ",

    // Kitchen
    pendingOrders: "በመጠባበቅ ላይ ያሉ ትዕዛዞች",
    inProgress: "በሂደት ላይ",
    completed: "ተጠናቋል",

    // Employees
    employeeManagement: "የሰራተኛ አስተዳደር",
    addEmployee: "ሰራተኛ ጨምር",

    // Reports
    salesReport: "የሽያጭ ሪፖርት",
    inventoryReport: "የክምችት ሪፖርት",
    dailyReport: "ዕለታዊ ሪፖርት",
  },
}

export type Language = "en" | "am"
export type TranslationKey = keyof typeof translations.en
