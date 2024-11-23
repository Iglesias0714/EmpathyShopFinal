import React from 'react';

interface MercadoPagoButtonProps {
  amount: number; // Total a pagar
  label?: string; // Texto del botón (opcional)
  onClick?: () => void; // Evento opcional al hacer clic
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ amount, label = 'Pagar con Mercado Pago', onClick }) => {
  const handlePayment = () => {
    if (onClick) onClick(); // Dispara el evento onClick si está definido
    const paymentUrl = `https://link.mercadopago.com.mx/empathyshop`; // Tu enlace de Mercado Pago
    window.open(paymentUrl, '_blank'); // Abre el enlace de pago en una nueva pestaña
  };

  return (
    <button
      onClick={handlePayment}
      className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold text-lg rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-600 hover:shadow-xl transition-transform transform hover:scale-105 focus:outline-none"
    >
      {label}
    </button>
  );
};

export default MercadoPagoButton;
