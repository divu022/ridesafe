import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Phone, Camera, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const SOSButton: React.FC = () => {
  const { state, dispatch } = useApp();
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const cameraInterval = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const startSOS = async () => {
    dispatch({ type: 'ACTIVATE_SOS' });
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch({
          type: 'SET_LOCATION',
          payload: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    }

    // Start silent camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Take photos every 10 seconds
        cameraInterval.current = setInterval(() => {
          capturePhoto();
        }, 10000);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }

    // Send emergency alert
    sendEmergencyAlert();
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Store photo with timestamp
        const photos = JSON.parse(localStorage.getItem('sosPhotos') || '[]');
        photos.push({
          timestamp: new Date().toISOString(),
          image: imageData,
          location: state.location,
        });
        localStorage.setItem('sosPhotos', JSON.stringify(photos));
      }
    }
  };

  const sendEmergencyAlert = () => {
    const emergencyData = {
      userId: state.user?.id,
      timestamp: new Date().toISOString(),
      location: state.location,
      type: 'SOS_ACTIVATED',
    };

    // Store alert locally (in real app, this would send to emergency services)
    const alerts = JSON.parse(localStorage.getItem('emergencyAlerts') || '[]');
    alerts.push(emergencyData);
    localStorage.setItem('emergencyAlerts', JSON.stringify(alerts));

    // Show confirmation
    alert('Emergency services have been notified. Stay safe!');
  };

  const handleMouseDown = () => {
    setPressing(true);
    setProgress(0);
    
    longPressTimer.current = setTimeout(() => {
      startSOS();
      setPressing(false);
      setProgress(100);
    }, 3000);

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / 30); // 3 seconds = 30 intervals of 100ms
      });
    }, 100);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setPressing(false);
    setProgress(0);
  };

  const stopSOS = () => {
    dispatch({ type: 'DEACTIVATE_SOS' });
    setCameraActive(false);
    
    if (cameraInterval.current) {
      clearInterval(cameraInterval.current);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (cameraInterval.current) {
        clearInterval(cameraInterval.current);
      }
    };
  }, []);

  if (state.sosActive) {
    return (
      <div className="fixed inset-0 z-50 bg-red-600 bg-opacity-95 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <AlertTriangle className="w-24 h-24 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4">SOS ACTIVATED</h2>
          <p className="text-lg mb-6">Emergency services have been notified</p>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <MapPin className="w-6 h-6" />
            <span>Location tracking active</span>
          </div>
          {cameraActive && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Camera className="w-6 h-6" />
              <span>Silent recording active</span>
            </div>
          )}
          <button
            onClick={stopSOS}
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Stop SOS
          </button>
        </div>
        
        {/* Hidden video element for camera */}
        <video
          ref={videoRef}
          autoPlay
          muted
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`relative w-16 h-16 rounded-full transition-all duration-200 ${
          pressing ? 'bg-red-700 scale-110' : 'bg-red-600 hover:bg-red-700'
        } shadow-lg flex items-center justify-center`}
      >
        <AlertTriangle className="w-8 h-8 text-white" />
        
        {/* Progress ring */}
        {pressing && (
          <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="transition-all duration-100"
            />
          </svg>
        )}
      </button>
      
      <p className="text-center text-xs mt-2 text-gray-600">
        Hold for SOS
      </p>
    </div>
  );
};

export default SOSButton;