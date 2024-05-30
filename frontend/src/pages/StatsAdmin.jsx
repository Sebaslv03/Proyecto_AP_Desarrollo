import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import supabase from "../config/supabaseClient";
import HeaderUser from '../components/HeaderAdmin';
import { getYear } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatisticsPage = () => {
    const [ageDistributionData, setAgeDistributionData] = useState(null);
    const [ageDistributionPercentages, setAgeDistributionPercentages] = useState([]);
    const [movieCategoryData, setMovieCategoryData] = useState(null);
    const [movieCategoryPercentages, setMovieCategoryPercentages] = useState([]);
    const [showCategoryData, setShowCategoryData] = useState(null);
    const [showCategoryPercentages, setShowCategoryPercentages] = useState([]);
    const [genderDistributionData, setGenderDistributionData] = useState(null);
    const [genderDistributionPercentages, setGenderDistributionPercentages] = useState([]);

    useEffect(() => {
        fetchAgeDistributionData();
        fetchMovieCategoryData();
        fetchShowCategoryData();
        fetchGenderDistributionData();
    }, []);

    const fetchAgeDistributionData = async () => {
        const { data, error } = await supabase.rpc('get_user_age_distribution');
        
        if (error) {
            console.error('Error fetching age distribution data:', error);
            return;
        }

        const labels = data.map(item => item.age_range);
        const counts = data.map(item => item.user_count);
        const totalCount = counts.reduce((sum, count) => sum + count, 0);
        const percentages = counts.map(count => ((count / totalCount) * 100).toFixed(2));

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'User Count',
                    data: counts,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }
            ]
        };

        setAgeDistributionData(chartData);
        setAgeDistributionPercentages(percentages);
    };

    const fetchMovieCategoryData = async () => {
        const { data: moviesData, error: moviesError } = await supabase.from('movie').select('id');
        const movieIDs = moviesData.map(movie => movie.id);

        const { data: movieCategories, error: movieCategoriesError } = await supabase
            .from('movieXcategory')
            .select('idMovie, idCategory')
            .in('idMovie', movieIDs);

        const categoryIDs = [...new Set(movieCategories.map(cat => cat.idCategory))];

        const { data: categories, error: categoriesError } = await supabase
            .from('category')
            .select('*')
            .in('id', categoryIDs);

        if (categoriesError) {
            console.error('Error fetching category names:', categoriesError);
            return;
        }

        const categoryCounts = categoryIDs.map(id => ({
            category: categories.find(category => category.id === id)?.nombre,
            count: movieCategories.filter(cat => cat.idCategory === id).length
        }));

        const totalCount = categoryCounts.reduce((sum, category) => sum + category.count, 0);
        const labels = categoryCounts.map(category => category.category);
        const counts = categoryCounts.map(category => category.count);
        const percentages = counts.map(count => ((count / totalCount) * 100).toFixed(2));

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Movie Count',
                    data: counts,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }
            ]
        };

        setMovieCategoryData(chartData);
        setMovieCategoryPercentages(percentages);
    };

    const fetchShowCategoryData = async () => {
        const { data: showsData, error: showsError } = await supabase.from('show').select('id');
        const showIDs = showsData.map(show => show.id);

        const { data: showCategories, error: showCategoriesError } = await supabase
            .from('showXcategory')
            .select('idShow, idCategory')
            .in('idShow', showIDs);

        const categoryIDs = [...new Set(showCategories.map(cat => cat.idCategory))];

        const { data: categories, error: categoriesError } = await supabase
            .from('category')
            .select('*')
            .in('id', categoryIDs);

        if (categoriesError) {
            console.error('Error fetching category names:', categoriesError);
            return;
        }

        const categoryCounts = categoryIDs.map(id => ({
            category: categories.find(category => category.id === id)?.nombre,
            count: showCategories.filter(cat => cat.idCategory === id).length
        }));

        const totalCount = categoryCounts.reduce((sum, category) => sum + category.count, 0);
        const labels = categoryCounts.map(category => category.category);
        const counts = categoryCounts.map(category => category.count);
        const percentages = counts.map(count => ((count / totalCount) * 100).toFixed(2));

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Show Count',
                    data: counts,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }
            ]
        };

        setShowCategoryData(chartData);
        setShowCategoryPercentages(percentages);
    };

    const fetchGenderDistributionData = async () => {
        const { data, error } = await supabase
            .from('person')
            .select('genre');
        if (error) {
            console.error('Error fetching gender distribution data:', error);
            return;
        }
        const genreIds = data.map(item => item.genre);
        const { data: genres, error: genresError } = await supabase
            .from('genre')
            .select('id, name')
            .in('id', genreIds);
        if (genresError) {
            console.error('Error fetching genres:', genresError);
            return;
        }

        const genreCounts = data.reduce((acc, item) => {
            const genreName = genres.find(genre => genre.id === item.genre)?.name;
            acc[genreName] = (acc[genreName] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(genreCounts);
        const values = Object.values(genreCounts);
        const total = values.reduce((acc, count) => acc + count, 0);
        const percentages = values.map(value => ((value / total) * 100).toFixed(2));

        setGenderDistributionData({
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }
            ]
        });
        setGenderDistributionPercentages(percentages);
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <HeaderUser />
            <div className="container mx-auto mt-8">
                <h1 className="text-3xl font-bold mb-8">Statistics</h1>

                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-4">User Age Distribution</h2>
                    {ageDistributionData ? (
                        <div className="w-full max-w-md mx-auto mb-8">
                            <Pie data={ageDistributionData} />
                            <div className="mt-4">
                                {ageDistributionData.labels.map((label, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{label}</span>
                                        <span>{ageDistributionPercentages[index]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-4">Movie Categories</h2>
                    {movieCategoryData ? (
                        <div className="w-full max-w-md mx-auto mb-8">
                            <Pie data={movieCategoryData} />
                            <div className="mt-4">
                                {movieCategoryData.labels.map((label, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{label}</span>
                                        <span>{movieCategoryPercentages[index]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-4">Show Categories</h2>
                    {showCategoryData ? (
                        <div className="w-full max-w-md mx-auto mb-8">
                            <Pie data={showCategoryData} />
                            <div className="mt-4">
                                {showCategoryData.labels.map((label, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{label}</span>
                                        <span>{showCategoryPercentages[index]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-4">Gender Distribution</h2>
                    {genderDistributionData ? (
                        <div className="w-full max-w-md mx-auto mb-8">
                            <Pie data={genderDistributionData} />
                            <div className="mt-4">
                                {genderDistributionData.labels.map((label, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{label}</span>
                                        <span>{genderDistributionPercentages[index]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
