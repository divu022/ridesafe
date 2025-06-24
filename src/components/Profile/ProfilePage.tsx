import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Shield, Star, Clock, Award, Camera } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
  });

  const handleSave = () => {
    if (state.user) {
      const updatedUser = { ...state.user, ...editForm };
      dispatch({ type: 'SET_USER', payload: updatedUser });
      setIsEditing(false);
    }
  };

  const rideStats = [
    { icon: MapPin, label: 'Total Rides', value: '127', color: 'text-blue-600' },
    { icon: Star, label: 'Rating', value: '4.9', color: 'text-yellow-600' },
    { icon: Shield, label: 'Safety Score', value: '98%', color: 'text-green-600' },
    { icon: Clock, label: 'On Time', value: '95%', color: 'text-purple-600' },
  ];

  const achievements = [
    { icon: Award, title: 'Safe Rider', description: '100+ safe rides completed' },
    { icon: Star, title: 'Top Rated', description: 'Maintained 4.9+ rating' },
    { icon: Shield, title: 'Safety Champion', description: 'Zero safety incidents' },
  ];

  const recentRides = [
    {
      date: '2024-01-15',
      from: 'Downtown Plaza',
      to: 'Airport Terminal',
      driver: 'Sarah Johnson',
      rating: 5,
      fare: '$25.50',
    },
    {
      date: '2024-01-12',
      from: 'Home',
      to: 'Shopping Mall',
      driver: 'Michael Chen',
      rating: 5,
      fare: '$12.00',
    },
    {
      date: '2024-01-10',
      from: 'Office Building',
      to: 'Restaurant District',
      driver: 'Emma Rodriguez',
      rating: 4,
      fare: '$18.75',
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Profile Header */}
        <div className={`p-6 rounded-xl mb-8 ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <User className={`w-12 h-12 ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Phone"
                  />
                </div>
              ) : (
                <>
                  <h1 className={`text-2xl font-bold ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {state.user?.name}
                  </h1>
                  <div className={`mt-2 space-y-1 ${
                    state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{state.user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{state.user?.phone}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`px-4 py-2 rounded-lg border ${
                      state.theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ride Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {rideStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                  state.theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                } shadow-lg`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <div className={`text-2xl font-bold ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className={`p-6 rounded-xl mb-8 ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    state.theme === 'dark' 
                      ? 'border-gray-700 bg-gray-700' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Icon className="w-8 h-8 text-yellow-600 mb-2" />
                  <h3 className={`font-semibold mb-1 ${
                    state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Rides */}
        <div className={`p-6 rounded-xl ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Rides
          </h2>
          <div className="space-y-4">
            {recentRides.map((ride, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-colors ${
                  state.theme === 'dark' 
                    ? 'border-gray-700 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className={`font-medium ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {ride.from}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className={`font-medium ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {ride.to}
                      </span>
                    </div>
                    <div className={`text-sm ${
                      state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Driver: {ride.driver} • {ride.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {ride.fare}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < ride.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;