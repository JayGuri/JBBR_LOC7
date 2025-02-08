import { Navbar } from "../components/Navbar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function UploadPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Top Left Receipt */}
        <img
          src="./Left.png"
          alt=""
          className="absolute top-10 left-10 w-20 h-20 opacity-80"
          aria-hidden="true"
        />

        {/* Bottom Left Receipt */}
        <img
          src="./Bottom.png"
          alt=""
          className="absolute bottom-20 left-20 w-48 h-48 opacity-80"
          aria-hidden="true"
        />

        {/* Bottom Right Receipt */}
        <img
          src="./Expanded.png"
          alt=""
          className="absolute bottom-40 right-20 w-24 h-24 opacity-80"
          aria-hidden="true"
        />

        {/* Main Content */}
        <div className="max-w-3xl w-full text-center space-y-6">
          <h1 className="text-[64px] font-normal leading-tight text-[#000000]">Upload your receipts</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Load your receipt by selecting a file—our system will instantly process and analyse it for accuracy and
            fraud detection. You will provided with a report soon.
          </p>
          <div className="mt-8">
            <label htmlFor="receipt-upload">
              <Button className="bg-[#161a34] hover:bg-[#161a34]/90 text-white px-8 py-6 text-lg rounded-full">
                <Upload className="mr-2 h-5 w-5" />
                Select your receipts
              </Button>
            </label>
            <input
              id="receipt-upload"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                // Handle file upload here
                const file = e.target.files?.[0]
                if (file) {
                  console.log("File selected:", file)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

