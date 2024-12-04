import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { UserPlus, Mail, Lock, Phone, MapPin, User } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { email, password, confirmPassword, name, gender, phone, address } = formData;

    if (!email || !password || !name || !gender || !phone || !address) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (phone.length < 10 || isNaN(Number(phone))) {
      setError('Por favor, ingresa un número de teléfono válido.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        username: name,
        gender,
        phone,
        address,
        createdAt: serverTimestamp(),
      });

      alert('Registro exitoso.');
      navigate('/login');
    } catch (err: any) {
      console.error('Error al registrar usuario:', err);
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'El correo electrónico ya está en uso. Intenta con otro.'
          : 'Ocurrió un error al registrar el usuario. Intenta nuevamente.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <UserPlus className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crear una cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a nuestra comunidad y disfruta de nuestros servicios
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Nombre completo
              </label>
              <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="gender" className="sr-only">
                Sexo
              </label>
              <select
                id="gender"
                name="gender"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Seleccionar Sexo</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar Contraseña
              </label>
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                Teléfono
              </label>
              <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="address" className="sr-only">
                Dirección
              </label>
              <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <textarea
                id="address"
                name="address"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Dirección Completa"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                onFocus={() => setShowAddressTooltip(true)}
                onBlur={() => setShowAddressTooltip(false)}
              />
              {showAddressTooltip && (
                <div className="absolute left-0 -top-16 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  <p>Incluye: estado,                  municipio, localidad, calle y número de casa</p>
                  <div className="absolute left-5 -bottom-2 w-4 h-4 bg-gray-800 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
              </span>
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

