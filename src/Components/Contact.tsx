import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#4a9c2d]">Contacto</h2>
      <p className="text-center mb-8 text-gray-700">Ponte en contacto con nosotros para más información o cualquier consulta.</p>
      <div className="text-left">
        <p><strong>Correo electrónico:</strong> contacto@empathyshop.com</p>
        <p><strong>Teléfono:</strong> +52 313 138 59 85</p>
        <p><strong>Dirección:</strong> Calle Vasectomia  #123, Colonia Centro, Ciudad, País</p>
      </div>
    </div>
  );
};

export default Contact;
