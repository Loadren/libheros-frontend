// src/pages/SignupPage.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

// Response type for signup
interface SignupResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [confirmEmail, setConfirmEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Client-side validation
        if (email !== confirmEmail) {
            setError('Email and confirmation email do not match.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Password and confirmation password do not match.');
            return;
        }

        try {
            await api.post<SignupResponse>('/users/signup', {
                firstName,
                lastName,
                email,
                password,
            });
            setSuccess('Account created! Redirecting to login...');
            clearForm();
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: unknown) {
            console.log(err)
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message as string);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setConfirmEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 w-sm">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Alice"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Liddell"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700">Confirm Email address</label>
                        <input
                            id="confirmEmail"
                            type="email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
                </p>
            </div>
        </div>
    );
};
