import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Redirige a la página principal o donde prefieras
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100">
      <h1 className="text-4xl font-bold text-green-700 mb-4">¡Pago exitoso!</h1>
      <p className="text-lg text-gray-700">Gracias por tu compra. Hemos recibido tu pago con éxito.</p>
      <button
        onClick={handleGoBack}
        className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default SuccessPage;
