import { Search, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

const HeroSearch = () => {
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to service listing page with search params
    window.location.href = `/services?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
        {/* Service Input */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
          <Search className="text-gray-400 mr-3 flex-shrink-0" size={20} />
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="What service do you need?"
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Location Input */}
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
          <MapPin className="text-gray-400 mr-3 flex-shrink-0" size={20} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your area or city"
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          size="lg"
          className="whitespace-nowrap rounded-xl"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

export default HeroSearch

