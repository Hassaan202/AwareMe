"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";



// import ParentNavbar from "../navbar/Navbar";

export default function ParentDashboard() {
    const pathname = usePathname();
    const isDashboardRoot = pathname === '/parent/dashborad';

    const [children, setChildren] = useState([
        { id: 1, name: "Ali", age: 10, progress: 80 },
        { id: 2, name: "Ayesha", age: 8, progress: 65 },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newChild, setNewChild] = useState({ email: "", name: "", age: "" });

    const handleAddChild = () => {
        if (!newChild.name || !newChild.age) return;
        const updated = [
            ...children,
            {
                id: Date.now(),
                email: newChild.email,
                name: newChild.name,
                age: parseInt(newChild.age),
                progress: 0,
            },
        ];
        setChildren(updated);
        setNewChild({ name: "", age: "", email: "" });
        setShowAddForm(false);
    };

    return (
        <>
            {/* <ParentNavbar /> */}
            <div className="min-h-screen bg-off-white text-black p-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">👨‍👩‍👧 Parent Dashboard</h1>
                    <p className="text-lg">
                        Manage your children’s learning and safety progress
                    </p>
                </div>

                {/* Add Child Section */}
                <div className="flex justify-center mb-8 px-4">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-teal text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#29bfa0] transition"
                    >
                        {showAddForm ? "Cancel" : "➕ Add Child"}
                    </button>

                    {isDashboardRoot && (
                        <Link href="/parent">
                            <button className="bg-teal text-black font-semibold mx-6 px-6 py-3 rounded-2xl hover:bg-[#29bfa0] transition">
                                Go Back
                            </button>
                        </Link>
                    )}

                </div>

                {/* Add Child Form */}
                {showAddForm && (
                    <div className="max-w-md mx-auto bg-off-white border-2 border-teal  rounded-3xl p-6 mb-8 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">Add New Child</h2>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={newChild.name}
                                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                                className="text-black w-full px-4 py-3 rounded-xl bg-peach border border-teal/40  focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                            <input
                                type="text"
                                placeholder="Enter child name"
                                value={newChild.name}
                                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                                className="text-black w-full px-4 py-3 rounded-xl bg-peach border border-teal/40  focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                            <input
                                type="number"
                                placeholder="Enter age"
                                value={newChild.age}
                                onChange={(e) => setNewChild({ ...newChild, age: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-peach border border-teal/40 text-black focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                            <button
                                onClick={handleAddChild}
                                className="w-full bg-teal text-black font-bold py-3 rounded-2xl hover:bg-[#29bfa0] transition"
                            >
                                Add Child
                            </button>
                        </div>
                    </div>
                )}

                {/* Children Section */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">👧 My Children</h2>

                    {children.length === 0 ? (
                        <p className="text-center">No children added yet.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {children.map((child) => (
                                <div
                                    key={child.id}
                                    className="bg-peach  border-teal border-2 rounded-3xl p-6 hover:scale-105 transition-transform shadow-lg"
                                >
                                    <h3 className="text-2xl font-bold mb-2">{child.name}</h3>
                                    <p className="mb-2">Age: {child.age}</p>
                                    <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                                        <div
                                            className="bg-teal h-3 rounded-full"
                                            style={{ width: `${child.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm mb-3">
                                        Progress: <span className="font-semibold">{child.progress}%</span>
                                    </p>

                                    <div className="flex justify-between">
                                        <button className="px-4 py-2 bg-teal text-black rounded-xl font-semibold hover:bg-[#28bda1] transition">
                                            💬 Chat
                                        </button>
                                        <button className="px-4 py-2  bg-teal rounded-xl font-semibold hover:bg-[#28bda1] transition">
                                            👁️ View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="max-w-6xl mx-auto mt-12 bg-off-white border border-teal rounded-3xl p-6">
                    <h2 className="text-2xl font-bold mb-4">📊 Recent Activity</h2>
                    <ul className="space-y-3 ">
                        <li>🆘 Ali pressed “Get Help” (2 hours ago)</li>
                        <li>🎓 Ayesha completed Lesson 3 today</li>
                        <li>💬 Ali chatted with the AI friend (yesterday)</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
