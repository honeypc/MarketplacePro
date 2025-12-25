import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { destinations as initialDestinations, Destination } from '@/data/destinations';

interface DestinationInput extends Partial<Destination> {
  attractionsInput?: string;
}

interface DestinationsState {
  destinations: Destination[];
  addDestination: (destination: DestinationInput) => Destination;
  getDestinationById: (id: number) => Destination | undefined;
}

const defaultCoordinates = { lat: 0, lng: 0 };
const placeholderImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop';

export const useDestinationsStore = create<DestinationsState>()(
  persist(
    (set, get) => ({
      destinations: initialDestinations,
      addDestination: (destination) => {
        const attractions = destination.attractionsInput
          ? destination.attractionsInput
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : destination.attractions || [];

        const newDestination: Destination = {
          id: destination.id || Date.now(),
          name: destination.name || destination.nameEn || 'New Destination',
          nameEn: destination.nameEn || destination.name || 'New Destination',
          location: destination.location || 'Unknown location',
          coordinates: destination.coordinates || defaultCoordinates,
          image: destination.image || placeholderImage,
          description: destination.description || 'No description provided.',
          rating: destination.rating || 4.5,
          reviews: destination.reviews || 0,
          category: destination.category || 'General',
          bestTime: destination.bestTime || 'Year-round',
          avgStay: destination.avgStay || '2-3 days',
          attractions,
          hotels: destination.hotels || [],
        };

        const updatedDestinations = [newDestination, ...get().destinations];
        set({ destinations: updatedDestinations });
        return newDestination;
      },
      getDestinationById: (id) => get().destinations.find((dest) => dest.id === id),
    }),
    { name: 'destinations-store' }
  )
);
