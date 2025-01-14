'use client'
import React from "react";

function GoBackButton({className}) {
  
  // Navigate to the previous page
  const navigateBack = () => {
    window.history.back();
  };

  return (
   
      
      <button onClick={navigateBack} className={className}>Go Back</button>
    
  );
}

export default GoBackButton;
