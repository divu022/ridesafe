import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Shield, Zap, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const HomePage: React.FC = () => {
  const { state } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [currentTime]);

  const quickStats = [
    { icon: Shield, label: 'Safe Rides', value: '10,000+', color: 'text-green-600' },
    { icon: Users, label: 'Active Drivers', value: '500+', color: 'text-blue-600' },
    { icon: Star, label: 'Safety Rating', value: '4.9', color: 'text-yellow-600' },
    { icon: Zap, label: 'Response Time', value: '< 2min', color: 'text-purple-600' },
  ];

  const safetyFeatures = [
    {
      title: 'Real-time Tracking',
      description: 'Live GPS tracking with emergency contacts',
      icon: MapPin,
    },
    {
      title: 'Driver Verification',
      description: 'Background checks and safety scores',
      icon: Shield,
    },
    {
      title: 'SOS Emergency',
      description: 'Instant emergency services activation',
      icon: Zap,
    },
    {
      title: 'Safe Routes',
      description: 'AI-powered route optimization for safety',
      icon: Clock,
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {greeting}, {state.user?.name || 'User'}!
          </h1>
          <p className={`text-lg ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ready for a safe journey?
          </p>
          <div className={`text-sm mt-2 ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {currentTime.toLocaleString()}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => {
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

        {/* Current Ride Status */}
        {state.currentRide && (
          <div className={`p-6 rounded-xl mb-8 ${
            state.theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'
          } border-l-4 border-blue-600`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Current Ride
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${state.theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                  From: {state.currentRide.pickup}
                </p>
                <p className={`${state.theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                  To: {state.currentRide.destination}
                </p>
                <p className={`text-sm ${state.theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Driver: {state.currentRide.driver.name}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                state.currentRide.status === 'ongoing' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {state.currentRide.status.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Safety Features */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Your Safety Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-200 hover:scale-105 ${
                    state.theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-50'
                  } shadow-lg`}
                >
                  <div className="flex items-start space-x-4">
                    <Icon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`${
                        state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-xl ${
          state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Book a Ride
            </button>
            <button className={`p-4 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors ${
              state.theme === 'dark' ? 'hover:bg-blue-900' : ''
            }`}>
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;