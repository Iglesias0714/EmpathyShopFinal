import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook useNavigate

const About: React.FC = () => {
  const navigate = useNavigate(); // Inicializamos useNavigate

  const handleExploreProducts = () => {
    navigate('/productos'); // Redirige a la página de productos
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-[#4a9c2d]">
        Acerca de <span className="text-blue-600">EmpathyShop</span>
      </h2>
      <div className="flex flex-col md:flex-row items-center">
        {/* Sección de texto */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="mb-6 text-gray-700 leading-7">
            En <span className="font-semibold text-[#4a9c2d]">EmpathyShop</span>, creemos en la accesibilidad para todos. Somos un marketplace web especializado en la venta de productos adaptativos y de asistencia para personas con discapacidad. 
            Nuestra misión es ofrecer soluciones prácticas y de alta calidad que mejoren la calidad de vida de nuestros usuarios.
          </p>
          <p className="mb-6 text-gray-700 leading-7">
            Nos esforzamos por ser más que una tienda en línea: queremos ser un punto de apoyo y un recurso confiable para quienes buscan productos que se adapten a sus necesidades específicas.
            Desde sillas de ruedas innovadoras hasta dispositivos auditivos y tecnologías de asistencia, estamos comprometidos con la inclusión y la igualdad de oportunidades para todos.
          </p>
          <p className="text-gray-700 leading-7">
            Únete a nuestra comunidad y descubre cómo podemos ayudarte a encontrar los productos perfectos para ti o tus seres queridos. En <span className="font-semibold text-[#4a9c2d]">EmpathyShop</span>, ¡estamos aquí para apoyarte en cada paso del camino!
          </p>
        </div>
        {/* Sección de imagen */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            src="\logo.png" 
            alt="Sobre EmpathyShop"
            className="w-80 h-80 object-cover rounded-full shadow-lg border-4 border-[#4a9c2d]"
          />
        </div>
      </div>
      {/* Llamado a la acción */}
      <div className="text-center mt-10">
        <button
          onClick={handleExploreProducts}
          className="px-6 py-3 bg-gradient-to-r from-[#4a9c2d] to-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105"
        >
          Explorar Productos
        </button>
      </div>
    </div>
  );
};

export default About;
