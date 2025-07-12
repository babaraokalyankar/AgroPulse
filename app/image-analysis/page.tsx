import ImageDiseasePredictor from "@/components/image-disease-predictor"

export default function ImageAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Turmeric Plant Image Analysis</h1>
        <p className="text-gray-600 mb-8">
          Upload an image of your turmeric plant to detect diseases and get recommendations
        </p>

        <ImageDiseasePredictor />

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">How It Works</h2>
          <p className="text-sm text-gray-700">
            Our system uses a Convolutional Neural Network (CNN) trained on thousands of turmeric plant images to
            identify common diseases. The model analyzes visual patterns in your uploaded image and compares them to
            known disease signatures. For best results, upload clear, well-lit images showing the affected parts of the
            plant.
          </p>
        </div>
      </div>
    </div>
  )
}
