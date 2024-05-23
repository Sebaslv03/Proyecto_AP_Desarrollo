import React, { useState } from 'react';

const CommentCarousel = ({ comments }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === comments.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? comments.length - 1 : prevIndex - 1));
  };

  return (
    <div className="comment-carousel bg-[#333] p-4 rounded-md shadow-md items-center justify-center inline-block">
      
      <div className="comment rounded-md mx-3 my-3 bg-[#ff0000] px-1 py-1 w-40 ">
        <h3 className="text-lg font-semibold text-black">{comments[currentIndex].author}</h3>
        <p className="text-white">{comments[currentIndex].text}</p>
      </div>
      <button className="bg-[#141414] text-white p-2 rounded-md mx-3 my-3 w-20 hover:text-white" onClick={goToPrevSlide}>Prev</button>
      <button className="bg-[#141414] text-white p-2 rounded-md mx-3 my-3 w-20 hover:text-white" onClick={goToNextSlide}>Next</button>
    </div>
  );
};

export default CommentCarousel;