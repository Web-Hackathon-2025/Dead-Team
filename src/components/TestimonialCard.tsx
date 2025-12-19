import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  rating: number
  text: string
  location?: string
}

const TestimonialCard = ({ name, role, rating, text, location }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
          {location && (
            <p className="text-xs text-gray-500 mt-1">{location}</p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">"{text}"</p>
    </div>
  )
}

export default TestimonialCard

