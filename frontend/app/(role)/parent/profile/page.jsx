"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ParentNavbar from "../navbar/Navbar";
import { profileAPI } from "@/app/utils/api";

export default function ParentProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getProfile();
                setProfile(response);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Unable to load profile. Please try again.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <>
            <ParentNavbar />
            <div className="min-h-screen bg-off-white text-black p-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">👤 My Profile</h1>
                    <p className="text-lg">
                        View and manage your account information
                    </p>
                </div>

                {/* Back Button */}
                <div className="flex justify-center mb-8">
                    <Link href="/parent">
                        <button className="bg-teal text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#29bfa0] transition">
                            ⬅ Back to Dashboard
                        </button>
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                        <p className="mt-4 text-lg">Loading profile...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl text-center">
                            <p className="font-semibold">{error}</p>
                        </div>
                    </div>
                )}

                {/* Profile Content */}
                {!loading && !error && profile && (
                    <div className="max-w-3xl mx-auto">
                        {/* Profile Card */}
                        <div className="bg-peach border-2 border-teal rounded-3xl p-8 shadow-lg mb-6">
                            {/* Profile Header */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="bg-blue rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
                                    <span className="text-5xl">👨‍👩‍👧</span>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-6">
                                {/* Name */}
                                <div className="bg-off-white border-2 border-teal/30 rounded-2xl p-5">
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                                        Full Name
                                    </label>
                                    <p className="text-xl font-bold text-gray-800">
                                        {profile.name}
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="bg-off-white border-2 border-teal/30 rounded-2xl p-5">
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                                        Email Address
                                    </label>
                                    <p className="text-xl font-bold text-gray-800">
                                        {profile.email}
                                    </p>
                                </div>

                                {/* Role */}
                                <div className="bg-off-white border-2 border-teal/30 rounded-2xl p-5">
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                                        Account Type
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <span className="inline-block bg-blue text-white px-4 py-2 rounded-full font-bold text-lg capitalize">
                                            {profile.role}
                                        </span>
                                    </div>
                                </div>

                                {/* User ID */}
                                <div className="bg-off-white border-2 border-teal/30 rounded-2xl p-5">
                                    <label className="text-sm font-semibold text-gray-600 block mb-2">
                                        User ID
                                    </label>
                                    <p className="text-sm font-mono text-gray-600 break-all">
                                        {profile.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            {/* Manage Children */}
                            <Link href="/parent/dashborad">
                                <div className="bg-peach border-2 border-teal rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
                                    <div className="text-center">
                                        <div className="text-4xl mb-3">👶</div>
                                        <h3 className="text-xl font-bold mb-2">Manage Children</h3>
                                        <p className="text-sm text-gray-600">
                                            View and add linked children
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Resources */}
                            <Link href="/parent/resources">
                                <div className="bg-peach border-2 border-teal rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
                                    <div className="text-center">
                                        <div className="text-4xl mb-3">📚</div>
                                        <h3 className="text-xl font-bold mb-2">Safety Resources</h3>
                                        <p className="text-sm text-gray-600">
                                            Access parenting guides
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Chat Support */}
                            <Link href="/parent/chat">
                                <div className="bg-peach border-2 border-teal rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
                                    <div className="text-center">
                                        <div className="text-4xl mb-3">💬</div>
                                        <h3 className="text-xl font-bold mb-2">Parent Assistant</h3>
                                        <p className="text-sm text-gray-600">
                                            Get AI-powered guidance
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Settings Placeholder */}
                            <div className="bg-peach border-2 border-teal rounded-2xl p-6 opacity-60">
                                <div className="text-center">
                                    <div className="text-4xl mb-3">⚙️</div>
                                    <h3 className="text-xl font-bold mb-2">Settings</h3>
                                    <p className="text-sm text-gray-600">
                                        Coming soon
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-3 text-center">ℹ️ Account Information</h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>• Your profile information is securely stored</p>
                                <p>• You can link multiple children to your account</p>
                                <p>• Access child safety resources anytime</p>
                                <p>• Get instant emergency alerts from linked children</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

