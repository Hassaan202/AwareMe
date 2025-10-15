"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ParentNavbar from "../navbar/Navbar";
import { resourcesAPI } from "@/app/utils/api";

export default function ParentResources() {
    const [search, setSearch] = useState("");
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch resources from backend
        const fetchResources = async () => {
            try {
                const response = await resourcesAPI.getResources();
                if (response.success) {
                    setResources(response.resources);
                }
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const filtered = resources.filter(
        (r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleCounselingRequest = async () => {
        try {
            const response = await resourcesAPI.requestCounseling();
            if (response.success) {
                alert(response.message);
            }
        } catch (error) {
            console.error('Error requesting counseling:', error);
            alert('Unable to submit request. Please try again.');
        }
    };

    return (<>
    <ParentNavbar />
        <div className="min-h-screen bg-off-white text-black p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Parent Resource Center
            </h1>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full max-w-md p-3 rounded-2xl bg-peach  border border-teal focus:outline-none focus:ring-2 focus:ring-teal-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Resources Grid */}
            {loading ? (
                <div className="text-center py-10">
                    <p className="text-xl">Loading resources...</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((res) => (
                        <div
                            key={res.id}
                            className="bg-peach border-2 border-teal rounded-2xl p-5 shadow hover:shadow-[#33dfbc]/30 transition"
                        >
                            <h2 className="text-xl font-semibold mb-2">{res.title}</h2>
                            <p className="text-sm mb-3">{res.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs bg-teal px-3 py-1 rounded-full">
                                    {res.category}
                                </span>
                                {res.category === 'Counseling' ? (
                                    <button
                                        onClick={handleCounselingRequest}
                                        className="text-teal-400 hover:underline text-sm"
                                    >
                                        Request →
                                    </button>
                                ) : (
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-teal-400 hover:underline text-sm"
                                    >
                                        {res.category === 'Hotline' ? 'Call' : 'Read More'} →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Emergency Helplines */}
            <div className="mt-10 bg-peach border-2 border-teal rounded-2xl p-6 text-center">
                <h2 className="text-2xl font-semibold mb-2">Emergency Helplines</h2>
                <p className="text-gray-700 mb-4">
                    If you believe your child is in danger, contact these trusted
                    organizations:
                </p>
                <ul className="space-y-2 text-sm">
                    <li>
                        📞 <strong>Child Helpline:</strong> 1098 (Pakistan)
                    </li>
                    <li>
                        📞 <strong>Cyber Crime Unit (FIA):</strong> 1991
                    </li>
                    <li>
                        🌐 <a href="https://www.unicef.org" className="underline text-teal-400">UNICEF Help Center</a>
                    </li>
                </ul>
            </div>

            {/* Guides & Counselling */}
            <div className="mt-10 grid md:grid-cols-2 gap-6">
                {/* Guide */}
                <div className="bg-peach border-2 border-teal rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-2">Download Parenting Guide</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        A free PDF with essential tips on keeping children safe online and
                        emotionally supported.
                    </p>
                    <a
                        href="/sample-guide.pdf"
                        download
                        className="bg-teal text-[#202020] px-5 py-2 rounded-full font-semibold hover:bg-teal-400 cursor-pointer transition"
                    >
                        ⬇ Download Guide
                    </a>
                </div>

                {/* Counselling */}
                <div className="bg-peach border-2 border-teal rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-2">
                        Need Counselling Support?
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                        You can request a session with our certified AI counsellor.
                    </p>
                    <Link href='/parent/chat'>
                        <button
                            className="bg-teal text-[#202020] px-5 py-2 rounded-full font-semibold hover:bg-teal-400 cursor-pointer transition"
                        >
                            💬 Start Counselling
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        </>

    );
}
