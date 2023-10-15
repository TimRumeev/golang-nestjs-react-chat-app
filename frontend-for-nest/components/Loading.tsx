import React, { useEffect, useState } from 'react';

export const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  const [showWaitMessage, setShowWaitMessage] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (isLoading) {
      timeout = setTimeout(() => {
        setShowWaitMessage(true);
      }, 5000); // 5 seconds
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50">
      <div className="mt-8 animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-slate-500"></div>
      <div
        className={`text-sm mt-4 px-4 text-center text-slate-500 ${
          showWaitMessage ? 'opacity-100 transition-opacity duration-300 ease-in-out' : 'opacity-0'
        }`}
      >
        Please wait for a few minutes. <br />
        This backend service using free cloud, it may take some time to re-start the service.
      </div>
    </div>
  );
};

export const LoadingText = ({ isLoading }: { isLoading: boolean }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots === '...' ? '' : prevDots + '.'));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${
        isLoading ? 'block' : 'hidden'
      }`}
    >
      {isLoading && <div className="text-slate-500 text-lg font-medium">Loading{dots}</div>}
    </div>
  );
};