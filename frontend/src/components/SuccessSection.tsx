import { CheckCircle } from "lucide-react"

export function SuccessSection() {
  return (
    <div className="bg-[#40e99d] py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-white mb-8">You are AI approved!</h2>
        <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
          <CheckCircle className="w-16 h-16 text-[#40e99d] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Verification Complete</h3>
          <p className="text-gray-600">You cleared all the following verifications:</p>
          <ul className="mt-4 text-left text-gray-600">
            <li className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#40e99d]" />
              Receipt authenticity verified
            </li>
            <li className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#40e99d]" />
              No duplicate submissions found
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#40e99d]" />
              Amount and details validated
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

