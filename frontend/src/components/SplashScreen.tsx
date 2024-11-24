import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      <img src="/daybreaklogo.png" alt="App Logo" className="animate-fadeIn" />
    </div>
  );
};

export default SplashScreen;
