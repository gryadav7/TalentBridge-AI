import { useEffect, useState } from "react";
import { Save, ShieldCheck, User } from "lucide-react";

import api from "../services/api";

const Profile = () => {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        location: "",
        yearsOfExperience: 0
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // -----------------------------------------
    // Get Profile
    // -----------------------------------------

    const getProfile = async () => {
        try {
            setError("");

            const response = await api.get(
                "/candidate/profile"
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load profile"
                );
            }

            const data = response.data.profile;

            setProfile(data);

            setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                phone: data.phone || "",
                location: data.location || "",
                yearsOfExperience:
                    data.yearsOfExperience || 0
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    // -----------------------------------------
    // Handle Change
    // -----------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setMessage("");
        setError("");
    };

    // -----------------------------------------
    // Update Profile
    // -----------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await api.put(
                "/candidate/profile",
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    location: formData.location,
                    yearsOfExperience:
                        Number(
                            formData.yearsOfExperience
                        )
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Profile update failed"
                );
            }

            setProfile(response.data.profile);

            setMessage(
                "Profile updated successfully"
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Profile update failed"
            );
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------------
    // Loading
    // -----------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-slate-500">
                    Loading profile...
                </p>
            </div>
        );
    }

    // -----------------------------------------
    // Error / No Profile
    // -----------------------------------------

    if (!profile) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-red-600">
                    {error || "Profile not found"}
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <User size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            My Profile
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your personal information
                        </p>
                    </div>

                </div>

            </div>

            {/* Messages */}

            {message && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    ✓ {message}
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Main Form */}

                <div className="lg:col-span-2">

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Keep your information up to date.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-6"
                        >

                            {/* First + Last Name */}

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={
                                            formData.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="Enter first name"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="Enter last name"
                                    />
                                </div>

                            </div>

                            {/* Phone + Location */}

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="City / Location"
                                    />
                                </div>

                            </div>

                            {/* Experience */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Years of Experience
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="yearsOfExperience"
                                    value={
                                        formData.yearsOfExperience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="0"
                                />

                            </div>

                            {/* Save */}

                            <div className="flex justify-end border-t border-slate-200 pt-5">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={18} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                {/* Side Information */}

                <div className="space-y-6">

                    {/* Verification */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <ShieldCheck size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Verification Status
                                </p>

                                <p className="mt-1 font-semibold text-green-600">
                                    {profile.verificationStatus ||
                                        "PENDING"}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Email */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <p className="text-sm text-slate-500">
                            Email
                        </p>

                        <p className="mt-2 break-words font-medium text-slate-900">
                            {profile.email ||
                                "Not available"}
                        </p>

                    </div>

                    {/* Profile Info */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h3 className="font-semibold text-slate-900">
                            Profile Tips
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Keep your profile complete and
                            accurate to improve job matching.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Profile;