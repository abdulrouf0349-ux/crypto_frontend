import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div
        className="w-12 h-12 rounded-full animate-spin
        border-y-4 border-solid border-[#EEE40A] border-t-transparent shadow-md"
      ></div>
    </div>
  );
};

export default Loading;

