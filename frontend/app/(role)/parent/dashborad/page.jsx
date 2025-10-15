"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profileAPI, emergencyAPI } from "@/app/utils/api";

export default function ParentDashboard() {
    const pathname = usePathname();
    const isDashboardRoot = pathname === '/parent/dashborad';

    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [childEmail, setChildEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [emergencyAlerts, setEmergencyAlerts] = useState([]);
    const [alertsLoading, setAlertsLoading] = useState(true);

    // Fetch children on component mount
    useEffect(() => {
        fetchChildren();
        fetchEmergencyAlerts();
    }, []);

    const fetchChildren = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getChildren();
            if (response.success) {
                setChildren(response.children);
            }
        } catch (err) {
            console.error('Error fetching children:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmergencyAlerts = async () => {
        try {
            setAlertsLoading(true);
            const response = await emergencyAPI.getAlerts();
            if (response.success) {
                setEmergencyAlerts(response.alerts || []);
            }
        } catch (err) {
            console.error('Error fetching emergency alerts:', err);
        } finally {
            setAlertsLoading(false);
        }
    };

    const handleAddChild = async () => {
        if (!childEmail.trim()) {
            setError("Please enter a valid email");
            return;
        }

        setError("");
        setSuccessMessage("");

        try {
            const response = await profileAPI.linkChild(childEmail);

            if (response.success) {
                setSuccessMessage(response.message);
                setChildEmail("");
                setShowAddForm(false);
                // Refresh children list
                fetchChildren();
            } else {
                setError(response.message || "Failed to link child");
            }
        } catch (err) {
            console.error('Error linking child:', err);
            setError("Unable to connect to server. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAlertColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved':
                return 'bg-green-100 border-green-400 text-green-800';
            case 'pending':
                return 'bg-yellow-100 border-yellow-400 text-yellow-800';
            case 'active':
            default:
                return 'bg-red-100 border-red-400 text-red-800';
        }
    };

    return (
        <>
            <div className="min-h-screen bg-off-white text-black p-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">Parent Dashboard</h1>
                    <p className="text-lg">
                        Manage your children's learning and safety progress
                    </p>
                </div>

                {/* Add Child Section */}
                <div className="flex justify-center mb-8 px-4">
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setError("");
                            setSuccessMessage("");
                        }}
                        className="bg-teal text-black font-semibold px-6 py-3 rounded-2xl hover:bg-[#29bfa0] transition flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{showAddForm ? "Cancel" : "Add Child"}</span>
                    </button>

                    {isDashboardRoot && (
                        <Link href="/parent">
                            <button className="bg-teal text-black font-semibold mx-6 px-6 py-3 rounded-2xl hover:bg-[#29bfa0] transition flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Go Back</span>
                            </button>
                        </Link>
                    )}
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="max-w-md mx-auto mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center">
                        {successMessage}
                    </div>
                )}

                {/* Add Child Form */}
                {showAddForm && (
                    <div className="max-w-md mx-auto bg-off-white border-2 border-teal rounded-3xl p-6 mb-8 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">Link Child Account</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter child's email address"
                                value={childEmail}
                                onChange={(e) => setChildEmail(e.target.value)}
                                className="text-black w-full px-4 py-3 rounded-xl bg-peach border border-teal/40 focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                            <button
                                onClick={handleAddChild}
                                className="w-full bg-teal text-black font-bold py-3 rounded-2xl hover:bg-[#29bfa0] transition"
                            >
                                Link Child
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-3 text-center">
                            The child must already have a registered account
                        </p>
                    </div>
                )}

                {/* Children Section */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">My Children</h2>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                            <p className="mt-4 text-lg">Loading children...</p>
                        </div>
                    ) : children.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl mb-4">No children linked yet.</p>
                            <p className="text-gray-600">Click "Add Child" to link a child account</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {children.map((child) => (
                                <div
                                    key={child.id}
                                    className="bg-peach border-teal border-2 rounded-3xl p-6 hover:scale-105 transition-transform shadow-lg"
                                >
                                    <div className="text-center mb-4">
                                        <div className="flex justify-center mb-2">
                                            <svg className="w-20 h-20 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{child.name}</h3>
                                        <p className="text-lg">Age: {child.age}</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Email:</span> {child.email}
                                        </p>
                                    </div>

                                    <div className="flex justify-center mt-6">
                                        <Link href="/parent/child-progress">
                                            <button className="px-6 py-2 bg-teal text-black rounded-xl font-semibold hover:bg-[#28bda1] transition flex items-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>More Information</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Emergency Alerts Section */}
                <div className="max-w-6xl mx-auto mt-12 bg-off-white border-2 border-red-500 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center space-x-2">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Emergency Alerts</span>
                        </h2>
                        <button
                            onClick={fetchEmergencyAlerts}
                            className="text-sm bg-teal text-black px-4 py-2 rounded-xl hover:bg-[#28bda1] transition flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Refresh</span>
                        </button>
                    </div>

                    {alertsLoading ? (
                        <div className="text-center py-6">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                            <p className="mt-2 text-sm">Loading alerts...</p>
                        </div>
                    ) : emergencyAlerts.length === 0 ? (
                        <div className="text-center py-6">
                            <svg className="w-16 h-16 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-700 font-semibold">No emergency alerts</p>
                            <p className="text-sm text-gray-600 mt-1">All children are safe</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {emergencyAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`border-2 rounded-xl p-4 ${getAlertColor(alert.status)}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-base">
                                                {alert.child_name || 'Unknown Child'}
                                            </h3>
                                            <p className="text-sm opacity-80 mt-1">
                                                {alert.message}
                                            </p>
                                        </div>
                                        <span className="ml-4 px-3 py-1 bg-white/50 rounded-full text-xs font-semibold uppercase">
                                            {alert.status || 'Active'}
                                        </span>
                                    </div>
                                    {alert.location && (
                                        <p className="text-xs opacity-75 mt-2 flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Location: {alert.location}</span>
                                        </p>
                                    )}
                                    <p className="text-xs opacity-75 mt-1 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{formatDate(alert.created_at)}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
