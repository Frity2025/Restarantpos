// ቀለም ለመቀየር የሚያገለግል ፋንክሽን
export function updateThemeColors(primaryColor: string, secondaryColor: string) {
  // ይህ ፋንክሽን በተግባር ላይ ሲውል ቀለሞችን በCSS ተለዋዋጭ ይቀይራል
  document.documentElement.style.setProperty("--primary-color", primaryColor)
  document.documentElement.style.setProperty("--secondary-color", secondaryColor)
}

// ለተለያዩ ምግብ ቤቶች የሚያገለግል የቀለም ቴማዎች
export const restaurantThemes = {
  default: {
    primary: "green",
    secondary: "orange",
  },
  ethiopian: {
    primary: "yellow",
    secondary: "red",
  },
  italian: {
    primary: "red",
    secondary: "green",
  },
  asian: {
    primary: "blue",
    secondary: "gold",
  },
  mexican: {
    primary: "green",
    secondary: "red",
  },
}

// የምግብ ቤት ስም እና ሎጎ ለመቀየር የሚያገለግል ፋንክሽን
export function updateRestaurantInfo(name: string, logoUrl: string) {
  // በተግባር ላይ ሲውል የምግብ ቤት መረጃን ይቀይራል
  return {
    name,
    logo: logoUrl,
  }
}
