import { motion } from 'motion/react'

interface ServiceCardProps {
  title: string
  subtitle: string
  image?: string
  href?: string
}

const ServiceCard = ({ title, subtitle, image, href = '#' }: ServiceCardProps) => {
  return (
    <motion.a
      href={href}
      className="group relative block h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Placeholder pattern if no image */}
        {!image && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
          </div>
        )}
      </motion.div>

      {/* Dark Overlay at Bottom - matches image style */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm md:text-base text-white/90 font-medium drop-shadow-md">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Hover Overlay Effect - subtle primary tint */}
      <motion.div
        className="absolute inset-0 bg-primary/0 pointer-events-none"
        whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  )
}

export default ServiceCard

