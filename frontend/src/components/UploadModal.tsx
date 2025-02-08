import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      // Handle file upload logic here
      console.log("Uploading file:", file.name)
      // Reset file and close modal after upload
      setFile(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#ffffff]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#000000]">Upload Receipt</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Upload your receipt for processing and analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="receipt" className="text-sm sm:text-base text-[#ffffff]">
              Receipt
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="receipt"
                type="file"
                className="text-sm sm:text-base text-[#ffffff]"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
              {file && (
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm sm:text-base text-[#ffffff] border-[#000000]">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file}
            className="text-sm sm:text-base bg-[#161a34] text-[#ffffff] hover:bg-[#161a34]/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

