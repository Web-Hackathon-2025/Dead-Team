import { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  icon: LucideIcon
  title: string
  description?: string
  href?: string
}

const CategoryCard = ({ icon: Icon, title, description, href = '#' }: CategoryCardProps) => {
  return (
    <a
      href={href}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary transition-all duration-300 flex flex-col items-center text-center"
    >
      <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="text-primary" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      <span className="mt-4 text-primary font-medium text-sm group-hover:underline">
        Browse {title} →
      </span>
    </a>
  )
}

export default CategoryCard

