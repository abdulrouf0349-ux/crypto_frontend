'use client'
import React, { useState } from 'react';
import { FaFacebookF, FaWhatsapp, FaTwitter } from 'react-icons/fa'; // Import social media icons
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const ShareButton = ({ title, url }) => {
  const [showIcons, setShowIcons] = useState(false); // State to toggle the visibility of icons

  const handleClick = () => {
    setShowIcons(!showIcons); // Toggle the visibility of icons on button click
  };

  return (
    <div className="relative">
   
      <button
        onClick={handleClick}
        className="flex items-center space-x-2  hover:text-blue-700"
      >
       
        <FontAwesomeIcon icon={faShareAlt} width={20} />
        </button>

      {showIcons && (
        <div className="absolute bottom-4 left-0 bg-white shadow-lg rounded-lg p-2 flex flex-col items-center space-y-2 mt-2 z-10">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            aria-label="Share on Facebook"
          >
            <FaFacebookF className="text-xl" />
          </a>
          <a
            href={`https://wa.me/?text=${title}%20${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp className="text-xl" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
            aria-label="Share on Twitter"
          >
            <FaTwitter className="text-xl" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
