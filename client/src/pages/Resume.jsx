import { useEffect, useRef, useState } from "react";
import {
    FileText,
    Upload,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Trash2
} from "lucide-react";

import api from "../services/api";

const Resume = () => {
    const fileInputRef = useRef(null);

    const [resume, setResume] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // -----------------------------------------
    // Get existing resume
    // -----------------------------------------

    const getResume = async () => {
        try {
            setError("");

            const response = await api.get(
                "/candidate/profile"
            );
            console.log("PROFILE RESPONSE:", response.data);

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load resume"
                );
            }

            const profile = response.data.profile;
            console.log("RESUME DATA:", profile?.resume);

            setResume(profile?.resume || null);
            

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load resume"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getResume();
    }, []);

    // -----------------------------------------
    // File select
    // -----------------------------------------

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        setMessage("");
        setError("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Only PDF, DOC and DOCX files are allowed."
            );

            e.target.value = "";
            setSelectedFile(null);
            return;
        }

        // Optional 5 MB check
        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Resume size must be less than 5 MB."
            );

            e.target.value = "";
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    // -----------------------------------------
    // Upload
    // -----------------------------------------

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please select a resume first.");
            return;
        }

        setUploading(true);
        setMessage("");
        setError("");

        try {
            const formData = new FormData();

            formData.append(
                "resume",
                selectedFile
            );

            const response = await api.post(
                "/candidate/resume",
                formData
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Resume upload failed"
                );
            }

            const uploadedResume =
                response.data.resume ||
                response.data.data?.resume ||
                response.data.profile?.resume ||
                null;

            setResume(uploadedResume);

            setMessage(
                "Resume uploaded successfully."
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Refresh actual profile data
            await getResume();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Resume upload failed"
            );
        } finally {
            setUploading(false);
        }
    };

    // -----------------------------------------
    // Helpers
    // -----------------------------------------
const getResumeUrl = () => {
    if (!resume) {
        return "";
    }

    if (typeof resume === "string") {
        return "";
    }

    let url =
        resume.fileUrl ||
        resume.url ||
        resume.secure_url ||
        resume.resumeUrl ||
        resume.fileUrl ||
        "";

    if (!url) {
        return "";
    }

    // Cloudinary PDF URL ko explicit PDF delivery URL banao
    if (
        url.includes("res.cloudinary.com") &&
        !url.toLowerCase().endsWith(".pdf")
    ) {
        url = `${url}.pdf`;
    }

    return url;
};
    const getResumeName = () => {
        if (!resume) {
            return "";
        }

        if (typeof resume === "string") {
            return "Uploaded Resume";
        }

        return (
            resume.originalName ||
            resume.filename ||
            resume.name ||
            "Uploaded Resume"
        );
    };

    // -----------------------------------------
    // Loading
    // -----------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-slate-500">
                    Loading resume...
                </p>
            </div>
        );
    }

    const resumeUrl = getResumeUrl();
    const resumeName = getResumeName();

    return (
        <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <FileText size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            My Resume
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Upload and manage your latest resume
                        </p>
                    </div>

                </div>

            </div>

            {/* Messages */}

            {message && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    <CheckCircle2 size={18} />
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Upload Card */}

                <div className="lg:col-span-2">

                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                        <h2 className="text-xl font-semibold text-slate-900">
                            Upload Resume
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Upload your latest PDF, DOC or DOCX resume.
                        </p>

                        <form
                            onSubmit={handleUpload}
                            className="mt-8"
                        >

                            <div
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
                            >

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Upload size={26} />
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                                    Choose your resume
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Click to browse files
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    PDF, DOC or DOCX · Max 5 MB
                                </p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                            </div>

                            {/* Selected file */}

                            {selectedFile && (
                                <div className="mt-5 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">

                                    <div className="flex min-w-0 items-center gap-3">

                                        <FileText
                                            size={20}
                                            className="shrink-0 text-blue-600"
                                        />

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                {selectedFile.name}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {(
                                                    selectedFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(null);

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value =
                                                    "";
                                            }
                                        }}
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>
                            )}

                            {/* Upload button */}

                            <div className="mt-6 flex justify-end">

                                <button
                                    type="submit"
                                    disabled={
                                        uploading ||
                                        !selectedFile
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Upload size={18} />

                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Resume"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

                {/* Current Resume */}

                <div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Current Resume
                        </h2>

                        {resumeUrl ? (
                            <div className="mt-6">

                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                        <FileText size={21} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {resumeName}
                                        </p>

                                        <p className="mt-1 text-xs text-green-600">
                                            Resume available
                                        </p>
                                    </div>

                                </div>

                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    View Resume
                                    <ExternalLink size={16} />
                                </a>

                            </div>
                        ) : (
                            <div className="mt-6 rounded-xl bg-slate-50 p-5 text-center">

                                <FileText
                                    size={30}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-sm font-medium text-slate-600">
                                    No resume uploaded
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Upload your resume to get started.
                                </p>

                            </div>
                        )}

                    </div>

                    {/* Tip */}

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                        <h3 className="font-semibold text-slate-900">
                            Resume Tip
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Keep your resume updated with your
                            latest skills, projects and experience
                            to improve your job matching.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Resume;