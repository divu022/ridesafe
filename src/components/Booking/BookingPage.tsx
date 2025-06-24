import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Star, Shield, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Driver {
  id: string;
  name: string;
  rating: number;
  safetyScore: number;
  vehicle: string;
  distance: number;
  price: number;
  eta: number;
  gender: 'male' | 'female';
  profileImage: string;
}

const BookingPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'safety' | 'eta'>('safety');
  const [bookingStep, setBookingStep] = useState<'location' | 'driver' | 'confirmation'>('location');

  const drivers: Driver[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 4.9,
      safetyScore: 98,
      vehicle: 'Honda Civic - White',
      distance: 0.8,
      price: 12,
      eta: 3,
      gender: 'female',
      profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 4.8,
      safetyScore: 95,
      vehicle: 'Toyota Camry - Black',
      distance: 1.2,
      price: 10,
      eta: 5,
      gender: 'male',
      profileImage: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      rating: 4.9,
      safetyScore: 97,
      vehicle: 'Hyundai Elantra - Blue',
      distance: 0.5,
      price: 15,
      eta: 2,
      gender: 'female',
      profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '4',
      name: 'David Kim',
      rating: 4.7,
      safetyScore: 92,
      vehicle: 'Nissan Altima - Gray',
      distance: 1.5,
      price: 8,
      eta: 7,
      gender: 'male',
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  const filteredAndSortedDrivers = drivers
    .filter(driver => genderFilter === 'all' || driver.gender === genderFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'price':
          return a.price - b.price;
        case 'safety':
          return b.safetyScore - a.safetyScore;
        case 'eta':
          return a.eta - b.eta;
        default:
          return 0;
      }
    });

  const handleLocationSubmit = () => {
    if (pickup && destination) {
      setShowDrivers(true);
      setBookingStep('driver');
    }
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setBookingStep('confirmation');
  };

  const handleBookRide = () => {
    if (selectedDriver) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const ride = {
        id: Date.now().toString(),
        pickup,
        destination,
        driver: selectedDriver,
        status: 'booked' as const,
        otp,
      };
      
      dispatch({ type: 'SET_RIDE', payload: ride });
      alert(`Ride booked successfully! Your OTP is: ${otp}`);
      
      // Reset form
      setPickup('');
      setDestination('');
      setSelectedDriver(null);
      setShowDrivers(false);
      setBookingStep('location');
    }
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup + ' to ' + destination)}`;
    window.open(url, '_blank');
  };

  if (bookingStep === 'confirmation' && selectedDriver) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className={`p-6 rounded-xl ${
            state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Confirm Your Ride
            </h2>

            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className={`font-medium ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    From: {pickup}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span className={`font-medium ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    To: {destination}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 border-blue-600 ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedDriver.profileImage}
                    alt={selectedDriver.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedDriver.name}
                    </h3>
                    <p className={`${
                      state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {selectedDriver.vehicle}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{selectedDriver.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{selectedDriver.safetyScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      ${selectedDriver.price}
                    </div>
                    <div className={`text-sm ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedDriver.eta} min away
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setBookingStep('driver')}
                className={`flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 ${
                  state.theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Back to Drivers
              </button>
              <button
                onClick={handleBookRide}
                className="flex-1 py-3 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
              >
                Book Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Location Input */}
        <div className={`p-6 rounded-xl mb-8 ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Where are you going?
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
              <input
                type="text"
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none`}
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none`}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={openGoogleMaps}
                className={`flex-1 py-3 px-6 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors ${
                  state.theme === 'dark' ? 'hover:bg-blue-900' : ''
                }`}
              >
                Open Maps
              </button>
              <button
                onClick={handleLocationSubmit}
                disabled={!pickup || !destination}
                className="flex-1 py-3 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Find Drivers
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        {showDrivers && (
          <>
            <div className={`p-4 rounded-xl mb-6 ${
              state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className={`font-medium ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filter:
                  </span>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                    className={`px-3 py-1 rounded-lg border transition-colors ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Drivers</option>
                    <option value="female">Female Drivers</option>
                    <option value="male">Male Drivers</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'safety' | 'eta')}
                    className={`px-3 py-1 rounded-lg border transition-colors ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="safety">Safety Score</option>
                    <option value="distance">Distance</option>
                    <option value="price">Price</option>
                    <option value="eta">ETA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Driver List */}
            <div className="space-y-4">
              {filteredAndSortedDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className={`p-6 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                    state.theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-50'
                  } shadow-lg`}
                  onClick={() => handleDriverSelect(driver)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={driver.profileImage}
                      alt={driver.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold text-lg ${
                          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {driver.name}
                        </h3>
                        <div className={`text-2xl font-bold ${
                          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${driver.price}
                        </div>
                      </div>
                      
                      <p className={`mb-3 ${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {driver.vehicle}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{driver.rating}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{driver.safetyScore}% Safe</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{driver.distance}km away</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{driver.eta} min ETA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;