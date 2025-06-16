import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #D6E9FF, #A4D3FF)', // Lighter blue gradient
            color: '#fff',
        }}
        >
        <div
            style={{
            textAlign: 'center',
            backgroundColor: '#ffffffdd',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            width: '90%',
            maxWidth: '800px', // Increased width
            }}
        >
            <h1 style={{ fontSize: '3.5rem', color: '#007BFF', marginBottom: '1.5rem' }}>
            Welcome to Learning Tracker
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#333', marginBottom: '2.5rem' }}>
            Empower your learning journey with personalized tracking, insights,
            and progress monitoring. Take control of your goals and achieve
            success.
            </p>
            <button
            onClick={() => navigate('/login')}
            style={{
                padding: '1.2rem 2.5rem',
                fontSize: '1.1rem',
                color: '#fff',
                backgroundColor: '#007BFF',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0px 3px 6px rgba(0, 123, 255, 0.5)',
                transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
            Login
            </button>
        </div>
        </div>
    );
};

export default LandingPage;
