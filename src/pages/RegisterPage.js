import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Label from '@radix-ui/react-label';
import { IconUser, IconLock, IconMail, IconPhone } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          ContactNo: phone,
          Username: username,
          PasswordHash: password,
          ConfirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Show success toast
      toast.success('Registered Successfully!');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      toast.error('Error during registration: ' + error.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="register-container bg-white p-8 rounded-lg shadow-lg w-full max-w-sm relative">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl font-bold mb-6 text-center"
        >
          Register
        </motion.h1>
        <form onSubmit={handleSubmit}>
          <div className={clsx('form-group', 'mb-4')}>
            <Label.Root htmlFor="firstName" className="flex items-center text-lg">
              <IconUser className="mr-2" />
              First Name:
            </Label.Root>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className={clsx('form-group', 'mb-4')}>
            <Label.Root htmlFor="lastName" className="flex items-center text-lg">
              <IconUser className="mr-2" />
              Last Name:
            </Label.Root>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className={clsx('form-group', 'mb-4')}>
            <Label.Root htmlFor="email" className="flex items-center text-lg">
              <IconMail className="mr-2" />
              Email ID:
            </Label.Root>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className={clsx('form-group', 'mb-4')}>
            <Label.Root htmlFor="username" className="flex items-center text-lg">
              <IconUser className="mr-2" />
              Username:
            </Label.Root>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className={clsx('form-group', 'mb-4')}>
            <Label.Root htmlFor="phone" className="flex items-center text-lg">
              <IconPhone className="mr-2" />
              Phone Number:
            </Label.Root>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className={clsx('form-group', 'mb-4')}>
            <Label.Root htmlFor="password" className="flex items-center text-lg">
              <IconLock className="mr-2" />
              Password:
            </Label.Root>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className={clsx('form-group', 'mb-6')}>
            <Label.Root htmlFor="confirmPassword" className="flex items-center text-lg">
              <IconLock className="mr-2" />
              Confirm Password:
            </Label.Root>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={twMerge('input-field w-full mt-2 px-4 py-2 border border-gray-300 rounded-md')}
              required
            />
          </div>
          <div className="button-container flex flex-col gap-4">
            <motion.button
              type="submit"
              className={twMerge('submit-button bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register
            </motion.button>
            <Link
              to="/"
              className={twMerge('login-button text-blue-500 hover:underline text-center')}
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
