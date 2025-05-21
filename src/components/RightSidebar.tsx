import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { Trash2Icon } from 'lucide-react';

interface TaskDetail {
    id: string;
    shortDesc: string;
    longDesc?: string;
    dueDate: string;
    createdAt: string;
    completed: boolean;
}

//Right sidebar showing detailed info for a selected task, and appears only when a task is selected
export const RightSidebar: React.FC = () => {
    const { listId, taskId } = useParams<{ listId: string; taskId: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<TaskDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    // Fetch task details
    useEffect(() => {
        if (!taskId) return;
        api.get<TaskDetail>(`/tasks/${taskId}`)
            .then(res => setTask(res.data))
            .catch(() => setError('Failed to load task details'));
    }, [taskId]);

    // Handle delete confirm
    const confirmDelete = () => {
        if (!taskId) return;
        api.delete(`/tasks/${taskId}`)
            .then(() => {
                setDeleteModal(false);
                navigate(`/lists/${listId}`);
            })
            .catch(() => setError('Failed to delete task'));
    };

    if (!taskId || !task) return null;

    return (
        <aside className="w-80 h-screen bg-white border-l border-gray-200 shadow-lg flex flex-col transition-all">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
                <div
                    onClick={() => setDeleteModal(true)}
                    className="transition-colors text-red-600 hover:text-white hover:bg-red-600 focus:outline-none border border-red-600 rounded cursor-pointer p-2 bg-white"
                    aria-label="Delete task"
                >
                    <Trash2Icon className="w-5 h-5" />
                </div>
            </header>

            {/* Content */}
            <div className="p-4 flex-1 overflow-y-auto">
                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="text-xl font-semibold">{task.shortDesc}</div>
                <p className="text-sm text-gray-600 my-2">{task.longDesc || 'No description provided'}</p>
                <p className="text-sm italic text-gray-500">Created on: {new Date(task.createdAt).toLocaleDateString()}</p>
                <p className="text-sm italic text-gray-500">Due on: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <p className="mb-4">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <div onClick={() => setDeleteModal(false)} className="px-4 py-2 transition-colors bg-gray-200 hover:bg-gray-300 rounded cursor-pointer">Cancel</div>
                            <div onClick={confirmDelete} className="px-4 py-2 transition-colors bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer">Delete</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};
