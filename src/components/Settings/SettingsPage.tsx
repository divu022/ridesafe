import React, { useState } from 'react';
import { Moon, Sun, Shield, Bell, MapPin, User, Mic, Camera, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const SettingsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [sosCode, setSosCode] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [voiceActivation, setVoiceActivation] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleThemeToggle = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const handleSosCodeSave = () => {
    if (sosCode.length >= 3) {
      localStorage.setItem('sosCode', sosCode);
      if (state.user) {
        const updatedUser = { ...state.user, sosCode };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
      alert('SOS code saved successfully!');
    } else {
      alert('SOS code must be at least 3 characters long');
    }
  };

  const testVoiceActivation = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const savedCode = localStorage.getItem('sosCode')?.toLowerCase();
        
        if (savedCode && transcript.includes(savedCode)) {
          dispatch({ type: 'ACTIVATE_SOS' });
          recognition.stop();
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      
      // Stop after 10 seconds for demo
      setTimeout(() => {
        recognition.stop();
      }, 10000);
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const settingSections = [
    {
      title: 'Appearance',
      settings: [
        {
          icon: state.theme === 'dark' ? Sun : Moon,
          label: 'Theme',
          description: `Currently using ${state.theme} mode`,
          action: (
            <button
              onClick={handleThemeToggle}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                state.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform absolute top-1 ${
                  state.theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Safety & Security',
      settings: [
        {
          icon: Shield,
          label: 'SOS Voice Code',
          description: 'Set a secret phrase for voice-activated SOS',
          action: (
            <div className="flex space-x-2">
              <input
                type="password"
                placeholder="Enter SOS code"
                value={sosCode}
                onChange={(e) => setSosCode(e.target.value)}
                className={`px-3 py-1 rounded border text-sm ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={handleSosCodeSave}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          ),
        },
        {
          icon: Mic,
          label: 'Voice Activation',
          description: 'Test voice SOS activation',
          action: (
            <button
              onClick={testVoiceActivation}
              disabled={isListening}
              className={`px-4 py-2 rounded transition-colors ${
                isListening
                  ? 'bg-red-600 text-white'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isListening ? 'Listening...' : 'Test Voice SOS'}
            </button>
          ),
        },
        {
          icon: Bell,
          label: 'Emergency Notifications',
          description: 'Notify emergency contacts',
          action: (
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                notifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform absolute top-1 ${
                  notifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          ),
        },
        {
          icon: MapPin,
          label: 'Location Sharing',
          description: 'Share real-time location with contacts',
          action: (
            <button
              onClick={() => setLocationSharing(!locationSharing)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                locationSharing ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform absolute top-1 ${
                  locationSharing ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Privacy',
      settings: [
        {
          icon: Camera,
          label: 'Camera Permissions',
          description: 'Allow camera access for SOS features',
          action: (
            <button
              onClick={async () => {
                try {
                  await navigator.mediaDevices.getUserMedia({ video: true });
                  alert('Camera permission granted');
                } catch (error) {
                  alert('Camera permission denied');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Grant Access
            </button>
          ),
        },
        {
          icon: User,
          label: 'Profile Privacy',
          description: 'Control who can see your profile',
          action: (
            <select className={`px-3 py-1 rounded border ${
              state.theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          ),
        },
      ],
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <h1 className={`text-3xl font-bold mb-8 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Settings
        </h1>

        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`p-6 rounded-xl ${
                state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-xl font-semibold mb-6 ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {section.title}
              </h2>

              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => {
                  const Icon = setting.icon;
                  return (
                    <div
                      key={settingIndex}
                      className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className={`w-6 h-6 ${
                          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <div>
                          <h3 className={`font-semibold ${
                            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {setting.label}
                          </h3>
                          <p className={`text-sm ${
                            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">{setting.action}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Emergency Information */}
          <div className={`p-6 rounded-xl border-l-4 border-red-600 ${
            state.theme === 'dark' ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className={`font-semibold mb-2 ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Emergency Information
                </h3>
                <p className={`text-sm mb-4 ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  In case of emergency, RideSafe will automatically:
                </p>
                <ul className={`text-sm space-y-1 ${
                  state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <li>• Share your live location with emergency contacts</li>
                  <li>• Start silent video recording</li>
                  <li>• Alert local emergency services</li>
                  <li>• Send automated messages to your trusted contacts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;