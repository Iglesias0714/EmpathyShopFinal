import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { loginUser } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Estado para el mensaje de éxito
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await loginUser(email, password);
      console.log('Inicio de sesión exitoso');
      setSuccess('Inicio de sesión exitoso. Redirigiendo...');

      // Redirige al usuario a la página principal después de unos segundos
      setTimeout(() => {
        navigate('/');
      }, 3000); // Espera de 3 segundos
    } catch (err) {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <UserCircle className="mx-auto h-16 w-16 text-[#4a9c2d]" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>} {/* Mensaje de éxito */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Correo Electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#4a9c2d] focus:border-[#4a9c2d] focus:z-10 sm:text-sm"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#4a9c2d] focus:border-[#4a9c2d] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-[#4a9c2d] hover:text-[#3a7c22]">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4a9c2d] hover:bg-[#3a7c22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a9c2d] transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-[#3a7c2d] group-hover:text-[#2a5c12]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Iniciar Sesión
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Eres usuario nuevo?{' '}
            <Link to="/register" className="font-medium text-[#4a9c2d] hover:text-[#3a7c22]">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
