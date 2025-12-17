import { LoadingFreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const LoaderScreen = () => {
  return (
    <div className="min-h-svh  flex items-center justify-center border border-dashed border-t-0 border-b-0 max-w-4xl mx-auto">
      <div className="text-center flex flex-col items-center ">
        <HugeiconsIcon icon={LoadingFreeIcons} strokeWidth={2} />
      </div>
    </div>
  );
};

export default LoaderScreen;
