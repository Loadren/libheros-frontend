import React, { useState, useEffect, type FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

// Task interface
interface TaskItem {
    id: string;
    shortDesc: string;
    longDesc?: string;
    dueDate: string; // ISO string
    completed: boolean;
}

const TasksPage: React.FC = () => {
    const { listId } = useParams<{ listId: string }>();
    const location = useLocation();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [newShort, setNewShort] = useState<string>('');
    const [newLong, setNewLong] = useState<string>('');
    const [newDate, setNewDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showCompleted, setShowCompleted] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchTasks = async (completed?: boolean) => {
        const params = completed !== undefined ? { params: { completed } } : {};
        try {
            const res = await api.get<TaskItem[]>(`/lists/${listId}/tasks`, params);
            return res.data;
        } catch {
            setError('Failed to load tasks');
            return [];
        }
    };

    const loadAll = async () => {
        setError(null);
        const active = await fetchTasks(false);
        let completedList: TaskItem[] = [];
        if (showCompleted) {
            completedList = await fetchTasks(true);
        }
        setTasks([...active, ...completedList]);
    };

    useEffect(() => {
        loadAll();
    }, [listId, showCompleted, location.key]);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!newShort.trim() || !newDate) {
            setError('Short description and due date are required');
            return;
        }
        try {
            await api.post<TaskItem>(`/lists/${listId}/tasks`, {
                shortDesc: newShort,
                longDesc: newLong || undefined,
                dueDate: newDate,
            });
            setNewShort(''); setNewLong(''); setNewDate('');
            loadAll();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message as string);
            }
            else {
                setError('Failed to create task');
            }
        }
    };

    const toggleComplete = async (task: TaskItem) => {
        try {
            await api.patch<TaskItem>(`/tasks/${task.id}`, { completed: !task.completed });
            loadAll();
        } catch {
            setError('Failed to update task');
        }
    };

    return (
        <div className="p-6 flex-1 overflow-auto max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Create Task Form */}
            <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Description*</label>
                        <input
                            type="text"
                            value={newShort}
                            onChange={e => setNewShort(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date*</label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Long Description</label>
                        <textarea
                            value={newLong}
                            onChange={e => setNewLong(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Create Task
                </button>
            </form>

            {/* Active Tasks */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
                <ul className="space-y-2">
                    {tasks.filter(t => !t.completed).map(task => (
                        <li key={task.id} className="flex justify-between items-center">
                            <div className="w-full mr-5 transition-all hover:bg-gray-100 rounded-md p-2 cursor-pointer" onClick={() => navigate(`/lists/${listId}/tasks/${task.id}`)}>
                                <p className="font-medium">{task.shortDesc}</p>
                                {task.longDesc && <p className="text-sm text-gray-600 text-nowrap text-ellipsis">{task.longDesc.substring(0, 25) + (task.longDesc.length > 26 ? "..." : "")}</p>}
                                <p className="text-sm text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={() => toggleComplete(task)}
                                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >Done</button>
                        </li>
                    ))}
                    {tasks.filter(t => !t.completed).length === 0 && <p className="text-gray-500">No active tasks.</p>}
                </ul>
            </div>

            {/* Completed Tasks Toggle */}
            <button
                onClick={() => setShowCompleted(v => !v)}
                className="mb-4 text-sm text-white hover:underline"
            >
                {showCompleted ? 'Hide' : 'Show'} Completed Tasks
            </button>

            {/* Completed Tasks */}
            {showCompleted && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
                    <ul className="space-y-2">
                        {tasks.filter(t => t.completed).map(task => (
                            <li key={task.id} className="flex justify-between items-center">
                                <div className="w-full mr-5 transition-all hover:bg-gray-100 rounded-md p-2 cursor-pointer" onClick={() => navigate(`/lists/${listId}/tasks/${task.id}`)}>
                                    <p className="font-medium line-through text-gray-500">{task.shortDesc}</p>
                                    {task.longDesc && <p className="text-sm text-gray-400 italic">{task.longDesc}</p>}
                                </div>
                                <button
                                    onClick={() => toggleComplete(task)}
                                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                >Undo</button>
                            </li>
                        ))}
                        {tasks.filter(t => t.completed).length === 0 && <p className="text-gray-500">No completed tasks.</p>}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TasksPage;