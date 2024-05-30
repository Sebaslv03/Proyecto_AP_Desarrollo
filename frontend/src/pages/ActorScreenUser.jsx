import React from 'react';
import { useParams } from 'react-router-dom';
import HeaderUser from '../components/HeaderUser';
import supabase from '../config/supabaseClient';

const ActorScreenUser = () => {
    const { id } = useParams(); // Assuming you're passing the actor's id via the URL
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [family, setFamily] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await fetchActor();
                await fetchMovies();
                await fetchFamilyMembers();
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchActor = async () => {
        const { data, error } = await supabase
            .from('Actor/Director')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error('Error fetching actor');
        } else {
            setActor(data);
        }
    };

    const fetchMovies = async () => {
        const { data, error } = await supabase
            .from('movieXActorDirector')
            .select('idMovie (title)') // Assuming you have a title field in your movie table
            .eq('idActor/Director', id);

        if (error) {
            throw new Error('Error fetching movies');
        } else {
            setMovies(data.map(movie => movie.idMovie.title));
        }
    };

    const fetchFamilyMembers = async () => {
        const { data, error } = await supabase
            .from('familyMember')
            .select('*')
            .eq('idActor/Director', id);

        if (error) {
            throw new Error('Error fetching family members');
        } else {
            setFamily(data);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <HeaderUser />
            <div className="container mx-auto py-4 px-4">
                <div className='flex flex-col items-center my-3'>
                    {actor.photo ? (
                        <img 
                            src={actor.photo} // Use actual photo URL
                            alt={actor.name} 
                            className="h-209 w-130 mx-auto rounded-md" 
                        />
                    ) : (
                        <div className="h-209 w-130 mx-auto rounded-md bg-gray-500" />
                    )}
                    <p className='text-xl font-semibold my-3'>{actor.name} {actor.secondName} {actor.lastName} {actor.secondLastName}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 items-start">
                    <div className="grid grid-cols-1 col-span-1 md:col-span-2 gap-6 items-center">
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="text-white">Biography</h5>
                            <p className="text-[#757070] text-base font-thin">
                                {actor.biography}
                            </p>
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="text-white">Trivia</h5>
                            <ul className="list-disc list-inside text-[#757070] text-base font-thin">
                                {actor.trivia ? actor.trivia.split('\n').map((item, index) => (
                                    <li key={index}>{item}</li>
                                )) : <li>No trivia available</li>}
                            </ul>
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="text-lg font-medium mb-2 text-white">Movies Involved In</h5>
                            <ul className="list-disc list-inside text-[#757070] text-base font-thin">
                                {movies.length > 0 ? movies.map((movie, index) => (
                                    <li key={index}>{movie}</li>
                                )) : <li>No movies available</li>}
                            </ul>
                        </div>
                    </div>
                    <div className='bg-[#262626] rounded-md px-4 py-4'>
                        <div className="mb-6">
                            <h5 className="text-white">Full Name</h5>
                            <p className="text-[#757070] text-base font-thin">{actor.name} {actor.secondName} {actor.lastName} {actor.secondLastName}</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Date of Birth</h5>
                            <p className="text-[#757070] text-base font-thin">{new Date(actor.birthDate).toLocaleDateString()}</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Birthplace</h5>
                            <p className="text-[#757070] text-base font-thin">{actor.birthPlace}</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Nationality</h5>
                            <p className="text-[#757070] text-base font-thin">{actor.nationality}</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Parents</h5>
                            <p className="text-[#757070] text-base font-thin">
                                {family.filter(member => member.relation === 'parent').map(member => member.name).join(', ') || 'No data available'}
                            </p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Children</h5>
                            <p className="text-[#757070] text-base font-thin">
                                {family.filter(member => member.relation === 'child').map(member => member.name).join(', ') || 'No data available'}
                            </p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Spouses</h5>
                            <p className="text-[#757070] text-base font-thin">
                                {family.filter(member => member.relation === 'spouse').map(member => member.name).join(', ') || 'No data available'}
                            </p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Siblings</h5>
                            <p className="text-[#757070] text-base font-thin">
                                {family.filter(member => member.relation === 'sibling').map(member => member.name).join(', ') || 'No data available'}
                            </p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Height</h5>
                            <p className="text-[#757070] text-base font-thin">{actor.height} cm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActorScreenUser;