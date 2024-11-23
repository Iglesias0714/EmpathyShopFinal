import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { email, password, confirmPassword, name, gender, phone, address } = formData;

    // Validaciones
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

      // Guardar datos adicionales en Firestore
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Registro</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar Sexo</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
