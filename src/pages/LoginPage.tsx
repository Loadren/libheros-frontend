// src/pages/LoginPage.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

// Response type
interface LoginResponse { access_token: string; }

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Handle form submission, and showing error messages if any to user
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            setToken(response.data.access_token);
            navigate('/');
        } catch (err: unknown) {
            console.log(err)
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message as string);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                <div className={`${error ? "bg-red-100" : "bg-transparent"} text-red-700 p-3 rounded my-2`}>
                    {error}
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                        </div>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500"> Signup here!</a>
                </p>
            </div>
        </div>
    );
};
