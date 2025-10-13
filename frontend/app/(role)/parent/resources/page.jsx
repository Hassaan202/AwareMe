"use client"
import React, { useState } from "react";
import Link from "next/link";
import ParentNavbar from "../navbar/Navbar";
export default function ParentResources() {
    const [search, setSearch] = useState("");

    const resources = [
        {
            title: "Understanding Child Safety Online",
            desc: "Learn how to protect your child from online risks, cyberbullying, and unsafe platforms.",
            link: "https://www.unicef.org/parenting/child-safety-online",
            tag: "Online Safety",
        },
        {
            title: "Good Touch & Bad Touch",
            desc: "A guide to teaching children about body safety and consent in a comfortable way.",
            link: "https://www.childlineindia.org/a/child-abuse",
            tag: "Body Safety",
        },
        {
            title: "Parent-Child Communication Tips",
            desc: "How to talk with your child about sensitive topics and build trust.",
            link: "https://www.verywellfamily.com/communication-tips-parents-and-children-4158237",
            tag: "Parenting Tips",
        },
        {
            title: "Dealing with Emotional Distress",
            desc: "Recognizing signs of anxiety or fear in children and how to offer comfort.",
            link: "https://www.apa.org/topics/children-stress",
            tag: "Mental Health",
        },
    ];

    const filtered = resources.filter(
        (r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.tag.toLowerCase().includes(search.toLowerCase())
    );

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((res, i) => (
                    <div
                        key={i}
                        className="bg-peach border-2 border-teal rounded-2xl p-5 shadow hover:shadow-[#33dfbc]/30 transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">{res.title}</h2>
                        <p className="text-sm mb-3">{res.desc}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs bg-teal px-3 py-1 rounded-full">
                                {res.tag}
                            </span>
                            <a
                                href={res.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-teal-400 hover:underline text-sm"
                            >
                                Read More →
                            </a>
                        </div>
                    </div>
                ))}
            </div>

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
