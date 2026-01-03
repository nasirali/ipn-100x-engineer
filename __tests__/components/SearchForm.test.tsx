import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchForm from '@/components/SearchForm';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

(global.navigator as any).geolocation = mockGeolocation;

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockGeolocation.getCurrentPosition.mockClear();
  });

  it('renders the search form', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByLabelText(/enter your location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find restaurants/i })).toBeInTheDocument();
  });

  it('renders the geolocation button', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByText(/my location/i)).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted with valid input', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/enter address/i);
    const button = screen.getByRole('button', { name: /find restaurants/i });

    fireEvent.change(input, { target: { value: 'San Francisco' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('San Francisco');
  });

  it('does not call onSearch when input is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole('button', { name: /find restaurants/i });
    fireEvent.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('disables submit button when input is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole('button', { name: /find restaurants/i });
    expect(button).toBeDisabled();
  });

  it('disables submit button when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText(/enter address/i);
    fireEvent.change(input, { target: { value: 'San Francisco' } });

    const button = screen.getByRole('button', { name: /searching/i });
    expect(button).toBeDisabled();
  });

  it('displays loading text when isLoading is true', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('disables input when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText(/enter address/i);
    expect(input).toBeDisabled();
  });

  it('trims whitespace from input before calling onSearch', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/enter address/i);
    const button = screen.getByRole('button', { name: /find restaurants/i });

    fireEvent.change(input, { target: { value: '  San Francisco  ' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('San Francisco');
  });

  it('handles geolocation success', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      });
    });

    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const geoButton = screen.getByTitle(/use my current location/i);
    fireEvent.click(geoButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('37.7749,-122.4194');
    });
  });

  it('handles geolocation permission denied', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1, // PERMISSION_DENIED
        message: 'User denied geolocation',
      });
    });

    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const geoButton = screen.getByTitle(/use my current location/i);
    fireEvent.click(geoButton);

    await waitFor(() => {
      expect(screen.getByText(/location permission denied/i)).toBeInTheDocument();
    });
  });

  it('handles geolocation unavailable', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 2, // POSITION_UNAVAILABLE
        message: 'Position unavailable',
      });
    });

    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const geoButton = screen.getByTitle(/use my current location/i);
    fireEvent.click(geoButton);

    await waitFor(() => {
      expect(screen.getByText(/location information unavailable/i)).toBeInTheDocument();
    });
  });

  it('handles geolocation timeout', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 3, // TIMEOUT
        message: 'Timeout',
      });
    });

    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const geoButton = screen.getByTitle(/use my current location/i);
    fireEvent.click(geoButton);

    await waitFor(() => {
      expect(screen.getByText(/location request timed out/i)).toBeInTheDocument();
    });
  });

  it('disables geolocation button when getting location', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      // Don't call success or error to simulate pending state
    });

    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const geoButton = screen.getByTitle(/use my current location/i);
    fireEvent.click(geoButton);

    await waitFor(() => {
      expect(geoButton).toBeDisabled();
    });
  });
});
