import { useEffect, useState } from "react";

import {
    getUsers,
    deleteUser,
    updateUser,
} from "../services/userService";

import type { UserData } from "../models/UserData";
import type { UserUpdate } from "../models/UserUpdate";

const UsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState<UserUpdate | null>(null);

    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteUser(id);

        setUsers((prev) =>
            prev.filter((u) => u.id !== id)
        );
    };

    const handleUpdate = async () => {
        if (!editUser) return;

        await updateUser(editUser);

        setEditUser(null);
        fetchUsers();
    };

    if (loading) {
        return (
            <div className="container page">
                Loading...
            </div>
        );
    }

    // 🔎 FILTER USERS (search by name)
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container page">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="title">
                    Users Management
                </h1>

                {/* COUNT */}
                <div className="text-slate-300 bg-slate-800 px-4 py-2 rounded-xl">
                    Total: {users.length}
                </div>

            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

                <table className="w-full text-left bg-slate-900 rounded-xl overflow-hidden">

                    <thead className="bg-slate-800 text-slate-300">
                    <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Created</th>
                        <th className="p-3"></th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.map((u) => (
                        <tr
                            key={u.id}
                            className="border-t border-slate-800"
                        >
                            <td className="p-3">
                                {u.name}
                            </td>

                            <td className="p-3 text-slate-400">
                                {u.email}
                            </td>

                            <td className="p-3">
                                    <span className="px-2 py-1 rounded bg-slate-700 text-sm">
                                        {u.role}
                                    </span>
                            </td>

                            <td className="p-3 text-slate-400">
                                {new Date(u.createdAt).toLocaleDateString()}
                            </td>

                            <td className="p-3 flex gap-2">

                                <button
                                    onClick={() =>
                                        setEditUser({
                                            id: u.id,
                                            name: u.name,
                                            email: u.email,
                                            role: u.role ,
                                        })
                                    }
                                    className="px-3 py-1 bg-blue-600 rounded text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(u.id)
                                    }
                                    className="px-3 py-1 bg-red-600 rounded text-sm"
                                >
                                    Delete
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

            {/* EDIT MODAL */}
            {editUser && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

                    <div className="bg-slate-900 p-6 rounded-xl w-100 space-y-4">

                        <h2 className="text-xl font-bold">
                            Edit User
                        </h2>

                        <input
                            className="w-full p-2 rounded bg-slate-800 text-white"
                            value={editUser.name}
                            onChange={(e) =>
                                setEditUser({
                                    ...editUser,
                                    name: e.target.value,
                                })
                            }
                        />

                        <input
                            className="w-full p-2 rounded bg-slate-800 text-white"
                            value={editUser.email}
                            onChange={(e) =>
                                setEditUser({
                                    ...editUser,
                                    email: e.target.value,
                                })
                            }
                        />

                        <select
                            className="w-full p-2 rounded bg-slate-800 text-white"
                            value={editUser.role}
                            onChange={(e) =>
                                setEditUser({
                                    ...editUser,
                                    role: e.target.value,
                                })
                            }
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>

                        <div className="flex gap-2">

                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-green-600 p-2 rounded"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setEditUser(null)}
                                className="flex-1 bg-slate-700 p-2 rounded"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default UsersPage;