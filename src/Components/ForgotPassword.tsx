import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { Mail } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Hemos enviado un enlace de recuperación a tu correo electrónico.');
    } catch (err) {
      console.error('Error al enviar el correo de recuperación:', err);
      setError('No se pudo enviar el correo de recuperación. Verifica tu correo electrónico.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Recupera tu contraseña
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <label htmlFor="email" className="sr-only">
              Correo electrónico
            </label>
            <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-700"
              placeholder="Correo electrónico"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150 ease-in-out"
          >
            Enviar enlace de recuperación
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-green-600 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
