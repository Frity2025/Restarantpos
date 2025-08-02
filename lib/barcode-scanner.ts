export interface BarcodeResult {
  text: string
  format: string
}

export class BarcodeScanner {
  private video: HTMLVideoElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | null = null
  private stream: MediaStream | null = null
  private scanning = false
  private onResult: ((result: BarcodeResult) => void) | null = null

  async initialize(videoElement: HTMLVideoElement, onResult: (result: BarcodeResult) => void) {
    this.video = videoElement
    this.onResult = onResult
    this.canvas = document.createElement("canvas")
    this.context = this.canvas.getContext("2d")

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      this.video.srcObject = this.stream
      await this.video.play()

      this.canvas.width = this.video.videoWidth
      this.canvas.height = this.video.videoHeight

      return true
    } catch (error) {
      console.error("Failed to initialize camera:", error)
      return false
    }
  }

  startScanning() {
    if (!this.video || !this.canvas || !this.context || this.scanning) return

    this.scanning = true
    this.scanFrame()
  }

  stopScanning() {
    this.scanning = false
  }

  destroy() {
    this.stopScanning()
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
    if (this.video) {
      this.video.srcObject = null
    }
  }

  private scanFrame() {
    if (!this.scanning || !this.video || !this.canvas || !this.context) return

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvas.width = this.video.videoWidth
      this.canvas.height = this.video.videoHeight

      this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)

      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)

      // Simple barcode detection simulation
      // In a real implementation, you would use a library like QuaggaJS or ZXing
      const result = this.detectBarcode(imageData)

      if (result && this.onResult) {
        this.onResult(result)
        return
      }
    }

    if (this.scanning) {
      requestAnimationFrame(() => this.scanFrame())
    }
  }

  private detectBarcode(imageData: ImageData): BarcodeResult | null {
    // This is a simplified barcode detection
    // In production, use a proper barcode scanning library

    // Simulate barcode detection with a simple pattern
    const data = imageData.data
    let blackPixels = 0
    let whitePixels = 0

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (brightness < 128) {
        blackPixels++
      } else {
        whitePixels++
      }
    }

    // Very basic pattern detection - this would be much more sophisticated in reality
    const ratio = blackPixels / whitePixels
    if (ratio > 0.3 && ratio < 0.7) {
      // Generate a mock barcode based on current time for demo purposes
      const mockBarcode = `${Date.now().toString().slice(-8)}`
      return {
        text: mockBarcode,
        format: "CODE_128",
      }
    }

    return null
  }
}

export const barcodeScanner = new BarcodeScanner()
