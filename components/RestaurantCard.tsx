import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-yellow-400">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$':
        return 'text-green-600';
      case '$$':
        return 'text-yellow-600';
      case '$$$':
        return 'text-orange-600';
      case '$$$$':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      {/* Placeholder image area */}
      <div className="h-40 bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
        <span className="text-6xl">{getCuisineEmoji(restaurant.cuisine)}</span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {restaurant.name}
          </h3>
          <span className={`font-medium ml-2 ${getPriceColor(restaurant.priceRange)}`}>
            {restaurant.priceRange}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</p>

        <div className="flex items-center mb-2">
          {renderStars(restaurant.rating)}
          <span className="ml-2 text-sm text-gray-600">{restaurant.rating.toFixed(1)}</span>
        </div>

        <p className="text-sm text-gray-600 mb-2 truncate" title={restaurant.address}>
          📍 {restaurant.address}
        </p>

        {/* Opening Hours Display */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            🕐 {formatHours(restaurant.openingHours)} - {formatHours(restaurant.closingHours)}
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getOpenStatus(restaurant.openingHours, restaurant.closingHours).className}`}>
            {getOpenStatus(restaurant.openingHours, restaurant.closingHours).text}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{restaurant.description}</p>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            View Details
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format hours from 24-hour to 12-hour format
function formatHours(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Helper function to determine if restaurant is currently open
function getOpenStatus(openingHours: string, closingHours: string): { text: string; className: string } {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const isOpen = currentTime >= openingHours && currentTime <= closingHours;

  return {
    text: isOpen ? 'Open Now' : 'Closed',
    className: isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  };
}

// Helper function to get cuisine emoji
function getCuisineEmoji(cuisine: string): string {
  const cuisineEmojis: Record<string, string> = {
    Chinese: '🥡',
    Italian: '🍝',
    Mexican: '🌮',
    Japanese: '🍣',
    American: '🍔',
    Indian: '🍛',
    Vietnamese: '🍜',
    Mediterranean: '🥙',
    Korean: '🍲',
    French: '🥐',
    Thai: '🍜',
    Vegan: '🥗',
    Seafood: '🦐',
    Greek: '🥙',
    Ethiopian: '🍲',
    Brazilian: '🥩',
    Peruvian: '🐟',
    Spanish: '🥘',
  };

  return cuisineEmojis[cuisine] || '🍽️';
}
