import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function UploadSection() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-[#161a34] mb-6">Upload your receipts</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Load your receipt by selecting a file—our system will instantly process and analyse it for accuracy and fraud
          detection. You will provided with a report soon.
        </p>
        <Button size="lg" className="bg-[#161a34] text-white hover:bg-[#161a34]/90">
          <Upload className="mr-2 h-5 w-5" />
          Select your receipts
        </Button>
        <div className="mt-12 flex justify-center">
          <img src="/placeholder.svg?height=300&width=300" alt="Receipt illustration" className="max-w-md" />
        </div>
      </div>
    </div>
  )
}

