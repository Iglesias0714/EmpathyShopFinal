import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-[#4a9c2d]">
        Contáctanos
      </h2>
      <p className="text-center mb-8 text-gray-700 leading-7">
        Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta o información adicional.
      </p>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center space-y-6 md:space-y-0 md:space-x-10">
        {/* Sección de contacto */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
          <h3 className="text-2xl font-bold text-[#4a9c2d] mb-4">Información de Contacto</h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong className="block text-[#4a9c2d]">Correo Electrónico:</strong>
              <span>contacto@empathyshop.com</span>
            </p>
            <p className="text-gray-700">
              <strong className="block text-[#4a9c2d]">Teléfono:</strong>
              <span>+52 313 138 59 85</span>
            </p>
            <p className="text-gray-700">
              <strong className="block text-[#4a9c2d]">Dirección:</strong>
              <span>Calle Vasectomia #123, Colonia Centro, Ciudad, País</span>
            </p>
          </div>
        </div>
        {/* Sección de imagen */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src=".\public\logo.png" // Reemplaza con la ruta de tu imagen
            alt="Contacto"
            className="w-80 h-80 object-cover rounded-full shadow-lg border-4 border-[#4a9c2d]"
          />
        </div>
      </div>
      {/* Llamado a la acción */}
      <div className="text-center mt-10">
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#4a9c2d] to-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105"
          onClick={() => window.location.href = 'mailto:contacto@empathyshop.com'}
        >
          Escríbenos
        </button>
      </div>
    </div>
  );
};

export default Contact;
