import { Search, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  tableNumber?: string
  customerName?: string
}

export function Header({ tableNumber = "4", customerName = "ፍሎይድ ማይልስ" }: HeaderProps) {
  return (
    <div className="bg-white p-4 flex items-center gap-4 border-b">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input type="text" placeholder="ምግብ ፈልግ..." className="pl-10 w-full" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">ጠረጴዛ {tableNumber}</span>
        <span className="text-gray-500 text-sm">{customerName}</span>
      </div>
      <Button variant="ghost" size="icon">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
