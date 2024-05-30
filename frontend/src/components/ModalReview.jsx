import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
export default function ModalReview(id) {
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState('1'); // Estado para almacenar el rating
    const [reviewText, setReviewText] = useState(''); // Estado para almacenar el texto de la revisión
    const handleReviewSubmit = async () => {
        const { data, error } = await supabase
            .rpc('addmoviereview', {
                description: reviewText,
                movie_id: id.id,
                starts: parseInt(rating)
            })
        if (error) console.error(error)
        else console.log(data)
        setShowModal(false);
    }
    return (
        <>
            <button className='bg-[#333] text-white p-2 rounded-md mx-3 my-3' onClick={() => setShowModal(true)}>Add Review</button>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-sm">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#000000] outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold text-[#757070]">
                                        Review
                                    </h3>
                                    <button
                                        className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {/*body*/}
                                {/**Select 5 start */}
                                <div className="flex justify-center items-center p-6">
                                    <label className="text-white">Rating:</label>
                                    <select id="rating" className="w-auto p-2 my-3 mx-3 rounded bg-[#222] border border-[#333] text-white"
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <textarea className="w-full h-24 p-2 rounded bg-[#222] border border-[#333] text-white" placeholder="Write your review here"
                                        onChange={(e) => setReviewText(e.target.value)}
                                    ></textarea>
                                </div>

                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleReviewSubmit()}
                                    >
                                        Add Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>*/}
                </>
            ) : null}
        </>
    );
}