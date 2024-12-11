import React from 'react';
import { useNavigate } from 'react-router-dom';

const FailurePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Redirige a la página principal o donde prefieras
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-100">
      <h1 className="text-4xl font-bold text-red-700 mb-4">¡Pago fallido!</h1>
      <p className="text-lg text-gray-700">Lo sentimos, no pudimos procesar tu pago.</p>
      <button
        onClick={handleGoBack}
        className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default FailurePage;
