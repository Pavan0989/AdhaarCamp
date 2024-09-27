import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import * as Label from "@radix-ui/react-label";
import { IconUser, IconLock } from "@tabler/icons-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8081/login', formData);
      console.log(response.data);
      
      if (response.status === 200) {
        // Show toast for successful login
        toast.success("Login successful! Redirecting...");

        // Redirect after short delay to allow user to see the toast
        setTimeout(() => navigate("/main"), 1500); 
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          Welcome Back
        </motion.h1>
        <form onSubmit={handleLogin}>
          <div className={clsx("mb-6")}>
            <Label.Root htmlFor="username" className="flex items-center text-lg text-gray-600">
              <IconUser className="mr-2 text-blue-500" />
              Username
            </Label.Root>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={twMerge(
                "w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none transition-all"
              )}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className={clsx("mb-6")}>
            <Label.Root htmlFor="password" className="flex items-center text-lg text-gray-600">
              <IconLock className="mr-2 text-blue-500" />
              Password
            </Label.Root>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={twMerge(
                "w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none transition-all"
              )}
              placeholder="Enter your password"
              required
            />
          </div>
          <motion.button
            type="submit"
            className={twMerge(
              "w-full bg-blue-600 text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition-colors"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Link
              to="/register"
              className={twMerge(
                "text-blue-600 hover:underline font-medium mt-2 inline-block"
              )}
            >
              Register here
            </Link>
          </div>
        </form>
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default LoginPage;
