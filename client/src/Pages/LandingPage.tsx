import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
const navigate = useNavigate();

return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-white">
    <div className="text-center bg-white/90 p-12 rounded-3xl shadow-xl w-11/12 max-w-3xl">
    <h1 className="text-5xl font-bold text-blue-600 mb-6">
    Welcome to Learning Tracker
    </h1>
    <p className="text-lg text-gray-700 mb-10">
        Empower your learning journey with personalized tracking, insights,
        and progress monitoring. Take control of your goals and achieve
        success.
    </p>
    <button
        onClick={() => navigate('/login')}
        className="px-8 py-3 text-white bg-blue-600 rounded-xl shadow-md hover:scale-105 transform transition-transform duration-300"
        >
        Login
    </button>
    </div>
    </div>
    );
};

export default LandingPage;