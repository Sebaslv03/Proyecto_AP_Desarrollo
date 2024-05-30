import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import HeaderAdmin from '../components/HeaderAdmin';

const AddCatalogPage = () => {
    const [genres, setGenres] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nationalities, setNationalities] = useState([]);

    const [newGenre, setNewGenre] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newNationality, setNewNationality] = useState('');

    useEffect(() => {
        fetchCatalogData();
    }, [newGenre, newCategory, newNationality]);

    const fetchCatalogData = async () => {
        try {
            const [genreResult, categoryResult, nationalityResult] = await Promise.all([
                supabase.from('genre').select('*'),
                supabase.from('category').select('*'),
                supabase.from('nationality').select('*')
            ]);

            setGenres(genreResult.data || []);
            setCategories(categoryResult.data || []);
            setNationalities(nationalityResult.data || []);
        } catch (error) {
            console.error("Error fetching catalog data", error);
            // Agregar manejo de errores en la UI si es necesario
        }
    };

    const handleAddGenre = async () => {
        if (newGenre) {
            const { data, error } = await supabase.from('genre').insert([{ name: newGenre }]);
            if (data) {
                setGenres([...genres, data[0]]);
                setNewGenre('');
            }
        }
    };

    const handleAddCategory = async () => {
        if (newCategory) {
            const { data, error } = await supabase.from('category').insert([{ nombre: newCategory }]);
            if (data) {
                setCategories([...categories, data[0]]);
                setNewCategory('');
            }
        }
    };

    const handleAddNationality = async () => {
        console.log(newNationality)
        if (newNationality) {
            const { data, error } = await supabase.from('nationality').insert([{ name: newNationality }]);
            if (data) {
                setNationalities([...nationalities, data[0]]);
                setNewNationality('');
            } else if(error)
                console.log(error)
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <HeaderAdmin />
            <div className="container mx-auto px-4">
                <h1 className="text-xl font-bold my-6">Add Catalog Items</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                        <h2 className="text-lg font-bold mb-3">Add New Genre</h2>
                        <input
                            type="text"
                            placeholder="Genre name"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                            className="input input-bordered text-black w-full mb-4"
                        />
                        <button onClick={handleAddGenre} className="btn bg-[#E50000] btn-primary">Add Genre</button>
                        <div className="mt-4">
                            <h3 className="text-sm font-bold">Existing Genres:</h3>
                            <ul>
                                {genres.map((genre, index) => (
                                    <li key={index}>{genre.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                        <h2 className="text-lg font-bold mb-3">Add New Category</h2>
                        <input
                            type="text"
                            placeholder="Category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="input input-bordered text-black w-full mb-4"
                        />
                        <button onClick={handleAddCategory} className="btn bg-[#E50000] btn-primary">Add Category</button>
                        <div className="mt-4">
                            <h3 className="text-sm font-bold">Existing Categories:</h3>
                            <ul>
                                {categories.map((category, index) => (
                                    <li key={index}>{category.nombre}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-[#1A1A1A] p-4 rounded-lg">
                        <h2 className="text-lg font-bold mb-3">Add New Nationality</h2>
                        <input
                            type="text"
                            placeholder="Nationality"
                            value={newNationality}
                            onChange={(e) => setNewNationality(e.target.value)}
                            className="input input-bordered text-black w-full mb-4"
                        />
                        <button onClick={handleAddNationality} className="btn bg-[#E50000] btn-primary">Add Nationality</button>
                        <div className="mt-4">
                            <h3 className="text-sm font-bold">Existing Nationalities:</h3>
                            <ul>
                                {nationalities.map((nationality, index) => (
                                    <li key={index}>{nationality.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCatalogPage;
