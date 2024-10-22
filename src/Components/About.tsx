import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#4a9c2d]">Acerca de EmpathyShop</h2>
      <p className="text-center mb-8 text-gray-700">
        En <span className="font-semibold text-[#4a9c2d]">EmpathyShop</span>, creemos en la accesibilidad para todos. Somos un marketplace web especializado en la venta de productos adaptativos y de asistencia para personas con discapacidad. Nuestra misión es ofrecer soluciones prácticas y de alta calidad que mejoren la calidad de vida de nuestros usuarios, garantizando que cada persona pueda tener acceso a las herramientas que necesita para vivir de manera más independiente y cómoda.
      </p>
      <p className="text-center mb-8 text-gray-700">
        Nos esforzamos por ser más que una tienda en línea: queremos ser un punto de apoyo y un recurso confiable para quienes buscan productos que se adapten a sus necesidades específicas. Desde sillas de ruedas innovadoras hasta dispositivos auditivos y tecnologías de asistencia, <span className="font-semibold text-[#4a9c2d]">EmpathyShop</span> está comprometido con la inclusión y la igualdad de oportunidades para todos.
      </p>
      <p className="text-center mb-8 text-gray-700">
        Únete a nuestra comunidad y descubre cómo podemos ayudarte a encontrar los productos perfectos para ti o tus seres queridos. En <span className="font-semibold text-[#4a9c2d]">EmpathyShop</span>, ¡estamos aquí para apoyarte en cada paso del camino!
      </p>
    </div>
  );
};

export default About;
