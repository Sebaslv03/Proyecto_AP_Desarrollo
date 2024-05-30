import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
const CommentCarousel = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState({});
  useEffect(() => {
    
    const fetchComments = async () => {
      const { data, error } = await supabase
        .rpc('getreviewsbymovieid', { movie_id: id });
      if (error) {
        console.error(error);
      }
      if (data) {
        setComments(data);
      }
    }
    fetchComments();
  }, [id]);
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === comments.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? comments.length - 1 : prevIndex - 1));
  };

  return (
    <div className="comment-carousel bg-[#333] p-4 rounded-md shadow-md items-center justify-center inline-block">

      {/*<div className="comment rounded-md mx-3 my-3 bg-[#ff0000] px-1 py-1 w-40 ">
        <h3 className="text-lg font-semibold text-black">{comments[currentIndex].starts}</h3>
        <p className="text-white">{comments[currentIndex].description}</p>
  </div>*/}
      {comments[currentIndex] && (
        <div className="comment rounded-md mx-3 my-3 bg-[#ff0000] px-1 py-1 w-40 ">
          <h3 className="text-lg font-semibold text-black">{comments[currentIndex].starts} Stars</h3>
          <p className="text-white">{comments[currentIndex].description}</p>
        </div>
      )}
      <button className="bg-[#141414] text-white p-2 rounded-md mx-3 my-3 w-20 hover:text-white" onClick={goToPrevSlide}>Prev</button>
      <button className="bg-[#141414] text-white p-2 rounded-md mx-3 my-3 w-20 hover:text-white" onClick={goToNextSlide}>Next</button>
    </div>
  );
};

export default CommentCarousel;