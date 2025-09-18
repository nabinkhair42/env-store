import { Loader } from 'lucide-react';
import React from 'react';

const LoaderScreen = () => {
  return (
    <div className="min-h-[100svh]  flex items-center justify-center border border-dashed border-t-0 border-b-0 max-w-5xl mx-auto">
      <div className="text-center flex flex-col items-center ">
        <Loader className="h-4 w-4 animate-spin text-muted-foreground mb-4" />
      </div>
    </div>
  );
};

export default LoaderScreen;
