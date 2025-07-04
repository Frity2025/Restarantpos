"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  Gift,
  CheckCircle,
  XCircle,
  Receipt,
  RefreshCw,
} from "lucide-react"
import { paymentService } from "@/lib/payment-processing"
import { useAuth } from "@/contexts/auth-context"
import type { Order } from "@/types/order"
import type { PaymentMethod, PaymentProvider, Payment, PaymentRequest } from "@/types/payment"

interface PaymentProcessingProps {
  order: Order
  onPaymentComplete: (payment: Payment) => void
  onCancel: () => void
}

const paymentMethodIcons = {
  cash: Banknote,
  card: CreditCard,
  mobile_money: Smartphone,
  bank_transfer: Building2,
  credit: Gift,
  voucher: Gift,
}

const paymentMethodNames = {
  cash: "ጥሬ ገንዘብ",
  card: "ካርድ",
  mobile_money: "የሞባይል ገንዘብ",
  bank_transfer: "የባንክ ዝውውር",
  credit: "ክሬዲት",
  voucher: "ቫውቸር",
}

const providerNames = {
  telebirr: "ቴሌ ብር",
  cbe_birr: "ሲቢኢ ብር",
  awash_birr: "አዋሽ ብር",
  visa: "ቪዛ",
  mastercard: "ማስተር ካርድ",
  amex: "አሜሪካን ኤክስፕረስ",
  cash: "ጥሬ ገንዘብ",
}

export function PaymentProcessing({ order, onPaymentComplete, onCancel }: PaymentProcessingProps) {
  const { employee } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash")
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null)
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone || "")
  const [notes, setNotes] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null)

  // Get available providers for selected method
  const availableProviders = paymentService.getAvailableProviders(selectedMethod)

  // Set default provider when method changes
  useEffect(() => {
    if (availableProviders.length > 0) {
      setSelectedProvider(availableProviders[0])
    } else {
      setSelectedProvider(undefined)
    }
  }, [selectedMethod, availableProviders])

  const handlePayment = async () => {
    if (!employee) return

    setIsProcessing(true)
    setPaymentResult(null)

    const paymentRequest: PaymentRequest = {
      orderId: order.id,
      amount: order.totalAmount,
      method: selectedMethod,
      provider: selectedProvider,
      customerName: order.customerName,
      customerPhone: customerPhone || undefined,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      notes: notes || undefined,
      metadata: {
        tableNumber: order.tableNumber,
        orderType: order.orderType,
      },
    }

    try {
      const response = await paymentService.processPayment(paymentRequest)

      setPaymentResult({
        success: response.success,
        message: response.message,
      })

      if (response.success && response.payment) {
        setCompletedPayment(response.payment)
        onPaymentComplete(response.payment)
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        message: "የክፍያ ሂደት ስህተት ተፈጥሯል",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintReceipt = () => {
    if (completedPayment) {
      const receipt = paymentService.generateReceipt(completedPayment.id, order)
      if (receipt) {
        // In a real implementation, this would send to printer
        console.log("Printing receipt:", receipt)
        alert("ደረሰኝ እየታተመ ነው...")
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            ክፍያ ማስኬጃ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-2">
            <h4 className="font-medium">የትዕዛዝ ማጠቃለያ</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>ትዕዛዝ ቁጥር:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>ደንበኛ:</span>
                <span>{order.customerName || "ያልተሰየመ"}</span>
              </div>
              <div className="flex justify-between">
                <span>ጠረጴዛ:</span>
                <span>{order.tableNumber || "-"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>ንዑስ ድምር:</span>
                <span>{order.subtotal.toFixed(2)} ብር</span>
              </div>
              <div className="flex justify-between">
                <span>ታክስ:</span>
                <span>{order.tax.toFixed(2)} ብር</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ቅናሽ:</span>
                  <span>-{order.discount.toFixed(2)} ብር</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>ጠቅላላ:</span>
                <span>{order.totalAmount.toFixed(2)} ብር</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>የክፍያ ዘዴ ይምረጡ</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(paymentMethodNames).map(([method, name]) => {
                const Icon = paymentMethodIcons[method as PaymentMethod]
                const isSelected = selectedMethod === method
                return (
                  <Button
                    key={method}
                    variant={isSelected ? "default" : "outline"}
                    className="h-20 flex flex-col items-center gap-2"
                    onClick={() => setSelectedMethod(method as PaymentMethod)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Provider Selection */}
          {availableProviders.length > 1 && (
            <div className="space-y-2">
              <Label>አቅራቢ ይምረጡ</Label>
              <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}>
                <SelectTrigger>
                  <SelectValue placeholder="አቅራቢ ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  {availableProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {providerNames[provider] || provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mobile Money Phone Number */}
          {selectedMethod === "mobile_money" && (
            <div className="space-y-2">
              <Label>የደንበኛ ስልክ ቁጥር</Label>
              <Input
                type="tel"
                placeholder="+251911123456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          )}

          {/* Payment Notes */}
          <div className="space-y-2">
            <Label>ማስታወሻ (አማራጭ)</Label>
            <Textarea placeholder="የክፍያ ማስታወሻ..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>

          {/* Payment Result */}
          {paymentResult && (
            <Alert className={paymentResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {paymentResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={paymentResult.success ? "text-green-800" : "text-red-800"}>
                  {paymentResult.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
              ሰርዝ
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || (selectedMethod === "mobile_money" && !customerPhone)}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  እየተሰራ ነው...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  ክፍያ አስኬድ
                </>
              )}
            </Button>
          </div>

          {/* Receipt Button */}
          {completedPayment && (
            <div className="pt-4 border-t">
              <Button onClick={handlePrintReceipt} variant="outline" className="w-full bg-transparent">
                <Receipt className="mr-2 h-4 w-4" />
                ደረሰኝ አትም
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
