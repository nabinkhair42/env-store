import { Loader } from 'lucide-react';
import React from 'react';

const LoaderScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center flex flex-col items-center ">
        <Loader className="h-4 w-4 animate-spin text-muted-foreground mb-4" />
      </div>
    </div>
  );
};

export default LoaderScreen;
