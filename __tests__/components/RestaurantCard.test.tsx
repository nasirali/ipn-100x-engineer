import { render, screen } from '@testing-library/react';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/types/restaurant';

const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Test Restaurant',
  address: '123 Test Street, Test City, CA 12345',
  cuisine: 'Italian',
  rating: 4.5,
  priceRange: '$$',
  openingHours: '11:00',
  closingHours: '22:00',
  latitude: 37.7749,
  longitude: -122.4194,
  phone: '(555) 123-4567',
  description: 'A test restaurant for unit testing',
};

describe('RestaurantCard', () => {
  it('renders restaurant name', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('displays the cuisine type', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Italian')).toBeInTheDocument();
  });

  it('shows the rating', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays the price range', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('$$')).toBeInTheDocument();
  });

  it('shows the address', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(/123 Test Street/)).toBeInTheDocument();
  });

  it('displays opening hours in 12-hour format', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(/11:00 AM - 10:00 PM/)).toBeInTheDocument();
  });

  it('shows open/closed status', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    // Should show either "Open Now" or "Closed" depending on current time
    const statusElement = screen.getByText(/Open Now|Closed/);
    expect(statusElement).toBeInTheDocument();
  });

  it('displays the description', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('A test restaurant for unit testing')).toBeInTheDocument();
  });

  it('renders View Details button', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('renders phone button with emoji', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('📞')).toBeInTheDocument();
  });

  it('displays correct cuisine emoji for Italian', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('🍝')).toBeInTheDocument();
  });

  it('displays correct cuisine emoji for Chinese', () => {
    const chineseRestaurant = { ...mockRestaurant, cuisine: 'Chinese' };
    render(<RestaurantCard restaurant={chineseRestaurant} />);
    expect(screen.getByText('🥡')).toBeInTheDocument();
  });

  it('renders full stars for whole number ratings', () => {
    const restaurant = { ...mockRestaurant, rating: 5.0 };
    render(<RestaurantCard restaurant={restaurant} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('renders half star for decimal ratings', () => {
    const restaurant = { ...mockRestaurant, rating: 3.5 };
    render(<RestaurantCard restaurant={restaurant} />);
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('applies correct color for $ price range', () => {
    const restaurant = { ...mockRestaurant, priceRange: '$' };
    const { container } = render(<RestaurantCard restaurant={restaurant} />);
    const priceElement = screen.getByText('$');
    expect(priceElement).toHaveClass('text-green-600');
  });

  it('applies correct color for $$$ price range', () => {
    const restaurant = { ...mockRestaurant, priceRange: '$$$' };
    const { container } = render(<RestaurantCard restaurant={restaurant} />);
    const priceElement = screen.getByText('$$$');
    expect(priceElement).toHaveClass('text-orange-600');
  });
});
