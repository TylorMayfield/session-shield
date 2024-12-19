import React from "react";

export default function KofiButton() {
  const openKofi = () => {
    chrome.tabs.create({ url: "https://ko-fi.com/tylormayfield" });
  };

  return (
    <div className="mt-4 text-center border-t pt-4">
      <button
        onClick={openKofi}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
      >
        <img
          src="https://storage.ko-fi.com/cdn/cup-border.png"
          alt="Ko-fi"
          className="h-4 w-4 mr-2"
        />
        Support the developer
      </button>
    </div>
  );
}
