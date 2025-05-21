import React, { createContext, useState, useEffect } from 'react';
import { ChevronFirst, ChevronLast, LogOut, Plus, Trash2Icon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

// Sidebar expansion context
// eslint-disable-next-line react-refresh/only-export-components
export const SidebarContext = createContext<{ expanded: boolean }>({ expanded: false });

// Types
type User = {
    firstName: string;
    lastName: string;
    email: string;
};

type ListItem = {
    id: string;
    name: string;
};

export const LeftSidebar: React.FC = () => {
    const [expanded, setExpanded] = useState<boolean>(true);
    const navigate = useNavigate();
    const { listId } = useParams<{ listId: string }>();

    // Profile
    const [user, setUser] = useState<User>({ firstName: '', lastName: '', email: '' });
    useEffect(() => {
        api.get<User>('/users/profile')
            .then(res => setUser(res.data))
            .catch(err => console.error('Error fetching profile', err));
    }, []);

    const [lists, setLists] = useState<ListItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch lists
    const fetchLists = () => {
        api.get<ListItem[]>('/lists')
            .then(res => setLists(res.data))
            .catch(err => {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    setError(err.response.data.message as string);
                }
                else {
                    setError('Failed to load lists');
                }
            });
    };
    useEffect(() => { fetchLists(); }, []);

    // Create List Modal
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const openCreate = () => { setNewName(''); setCreateModal(true); setError(null); };
    const closeCreate = () => setCreateModal(false);
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!newName.trim()) {
            setError('List name cannot be empty');
            return;
        }
        api.post<ListItem>('/lists', { name: newName })
            .then(() => {
                fetchLists();
                closeCreate();
            })
            .catch(err => setError(err.response?.data?.message || 'Failed to create list'));
    };

    // Modal to delete list item
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [toDelete, setToDelete] = useState<ListItem | null>(null);

    // Confirm delete
    const confirmDelete = () => {
        if (!toDelete) return;
        api.delete(`/lists/${toDelete.id}`)
            .then(() => {
                setModalOpen(false);
                setToDelete(null);
                fetchLists();

                // Redirect to lists page if the deleted list was the current one
                if (toDelete.id === listId) {
                    navigate('/lists');
                }
            })
            .catch(err => {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    setError(err.response.data.message as string);
                } else {
                    setError('Failed to delete list');
                }
            });
    };

    // Cancel delete
    const cancelDelete = () => {
        setModalOpen(false);
        setToDelete(null);
    };

    // Disconnect user
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <aside className={`flex flex-col bg-white shadow-lg transition-all ${expanded ? 'w-64' : 'w-16'} h-full`}>
            {/* Header */}
            <div className="p-4 pb-2 flex justify-between items-center">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className={`overflow-hidden bg-gray-200 rounded-lg shadow transition-all ${expanded ? 'w-12' : 'w-0'}`}
                />
                <div onClick={() => setExpanded(v => !v)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
                    {expanded ? <ChevronFirst /> : <ChevronLast />}
                </div>
            </div>

            {/* Lists & create form */}
            <SidebarContext.Provider value={{ expanded }}>

                <div className={`flex-1 flex py-3`}>
                    <ul className={`overflow-y-auto overflow-x-hidden px-3 space-y-2 ${expanded ? 'w-full' : 'w-0'}`}>
                        <li className={`relative flex items-center py-2 px-3 my-1 font-medium`}>
                            <span className="overflow-hidden transition-all font-semibold whitespace-nowrap text-nowrap text-xl">Your Lists</span>
                        </li>
                        {lists.map(item => (
                            <li key={item.id} className={`flex justify-between items-center hover:bg-gray-200 rounded-md p-2 transition-all group ${item.id === listId && expanded ? 'bg-gray-100' : ''}`}>
                                <div
                                    onClick={() => navigate(`/lists/${item.id}`)}
                                    className={`text-left text-gray-800 flex-1 overflow-hidden whitespace-nowrap text-nowrap text-ellipsis transition cursor-pointer ${item.id === listId ? 'font-semibold pl-2' : 'pl-0'}`}
                                >
                                    {item.name}
                                </div>
                                <div
                                    onClick={() => { setToDelete(item); setModalOpen(true); }}
                                    className={`ml-2 text-red-500 hover:text-red-700 transition cursor-pointer group-hover:opacity-100 opacity-0 ${expanded ? 'h-full' : 'h-0'}`}
                                    aria-label={`Delete ${item.name}`}
                                >
                                    <Trash2Icon className="w-5 h-5" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {error && <p className="px-3 text-red-500 text-sm">{error}</p>}
                <div className={`flex pr-3 py-3 items-center`}>
                    <div onClick={openCreate} className={`transition-all overflow-hidden ml-3 ${expanded ? 'w-full' : 'w-9'}`}>
                        <div
                            className="mt-2 w-full bg-green-800 hover:bg-green-700 text-white font-semibold rounded-lg transition focus:outline-none text-nowrap cursor-pointer flex items-center justify-center p-2"
                        >
                            <Plus className="w-5 h-5 inline-block" />
                        </div>
                    </div>
                </div>

            </SidebarContext.Provider>

            {/* Footer: profile */}
            <div className="border-t border-gray-200 flex p-3 items-center">
                <div className={`flex items-center overflow-hidden transition-all ${expanded ? 'w-full ml-3' : 'w-0'}`}>
                    <div className="leading-4">
                        <h4 className="font-semibold">{user.firstName} {user.lastName}</h4>
                        <span className="text-xs text-gray-600">{user.email}</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-2 transition-colors hover:bg-gray-200 rounded-lg p-2 cursor-pointer" onClick={handleLogout}>
                        <LogOut />
                    </div>
                </div>
            </div>

            {/* Create List Modal */}
            {createModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50" onClick={closeCreate}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80" onClick={e => e.stopPropagation()}>
                        <h5 className="text-lg font-semibold mb-4">New List</h5>
                        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                        <input
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="List name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <div className="flex justify-end space-x-2 mt-4">
                            <div onClick={closeCreate} className="px-4 py-2 transition-colors bg-gray-200 hover:bg-gray-300 rounded cursor-pointer">Cancel</div>
                            <div onClick={handleCreate} className="px-4 py-2 transition-colors bg-green-800 hover:bg-green-700 text-white rounded cursor-pointer">Create</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {modalOpen && toDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <p className="mb-4">
                            Delete list "{toDelete.name}" and all its tasks?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <div onClick={cancelDelete} className="px-4 py-2 transition-colors bg-gray-200 hover:bg-gray-300 rounded cursor-pointer">Cancel</div>
                            <div onClick={confirmDelete} className="px-4 py-2 transition-colors bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer">Delete</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};
