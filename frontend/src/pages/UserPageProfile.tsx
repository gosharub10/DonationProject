import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { getUserById, updateUser } from "../services/userService";
import type { UserData } from "../models/UserData";
import MetaMaskConnect from "../components/MetaMaskConnect.tsx";

type Donation = {
    id: string;
    projectTitle: string;
    amount: number;
    createdAt: string;
};

const UserProfilePage = () => {
    const { user } = useAuth();

    const [profile, setProfile] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [donations] = useState<Donation[]>([]);

    useEffect(() => {
        const load = async () => {
            if (!user) return;

            const data = await getUserById(user.id);
            setProfile(data);

            setLoading(false);
        };

        load();
    }, [user]);

    const handleUpdate = async () => {
        if (!profile) return;

        await updateUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
        });

        alert("Updated");
    };

    if (loading || !profile) {
        return (
            <div className="container page">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="container page space-y-6">

            <h1 className="title">My Profile</h1>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: PROFILE */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">

                    <h2 className="text-xl font-bold">
                        Account
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <input
                            className="p-3 rounded bg-slate-800 text-white"
                            value={profile.name}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Name"
                        />

                        <input
                            className="p-3 rounded bg-slate-800 text-white"
                            value={profile.email}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    email: e.target.value,
                                })
                            }
                            placeholder="Email"
                        />

                    </div>

                    <div className="text-slate-400 text-sm">
                        Role: {profile.role}
                    </div>

                    <button
                        onClick={handleUpdate}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
                    >
                        Save Changes
                    </button>

                </div>

                {/* RIGHT: QUICK ACTIONS */}
                <div className="space-y-6">

                    {/* WALLET */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h2 className="text-lg font-bold mb-2">
                            Wallet
                        </h2>

                        <MetaMaskConnect />
                    </div>

                    {/* STATS CARD */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">

                        <h2 className="text-lg font-bold mb-2">
                            Stats
                        </h2>

                        <div className="text-slate-300 text-sm space-y-2">
                            <div>Donations: {donations.length}</div>
                        </div>

                    </div>

                </div>

            </div>

            {/* DONATIONS FULL WIDTH */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">

                <h2 className="text-xl font-bold mb-4">
                    Donation History
                </h2>

                {donations.length === 0 ? (
                    <p className="text-slate-400">
                        No donations yet
                    </p>
                ) : (
                    <div className="grid gap-3">
                        {donations.map((d) => (
                            <div
                                key={d.id}
                                className="flex justify-between bg-slate-800 p-4 rounded-xl"
                            >
                                <div>
                                    <div className="font-semibold">
                                        {d.projectTitle}
                                    </div>
                                    <div className="text-slate-400 text-sm">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="text-green-400 font-bold">
                                    +{d.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
};

export default UserProfilePage;