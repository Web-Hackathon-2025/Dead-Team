import { LucideIcon } from 'lucide-react'

interface FeatureSectionProps {
  icon: LucideIcon
  title: string
  description: string
}

const FeatureSection = ({ icon: Icon, title, description }: FeatureSectionProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-primary/10 rounded-full p-4 mb-4">
        <Icon className="text-primary" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm">{description}</p>
    </div>
  )
}

export default FeatureSection

