import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center mt-40">
      <div className="w-20 h-20 border-4 border-transparent border-t-red-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
