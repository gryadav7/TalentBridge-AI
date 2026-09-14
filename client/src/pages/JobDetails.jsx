import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    MapPin,
    Briefcase,
    Clock3,
    IndianRupee,
    CheckCircle2,
    Send,
    X,
    AlertCircle
} from "lucide-react";

import api from "../services/api";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    // =========================================
    // Job state
    // =========================================

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // Application state
    // =========================================

    const [showApplyForm, setShowApplyForm] =
        useState(false);

    const [coverLetter, setCoverLetter] =
        useState("");

    const [applying, setApplying] =
        useState(false);

    const [applyMessage, setApplyMessage] =
        useState("");

    const [applyError, setApplyError] =
        useState("");

    // =========================================
    // Get Job Details
    // =========================================

    const getJobDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/candidate/jobs/${jobId}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load job details"
                );
            }

            setJob(response.data.job);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load job details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getJobDetails();
    }, [jobId]);

    // =========================================
    // Open Apply Form
    // =========================================

    const openApplyForm = () => {
        setShowApplyForm(true);
        setApplyMessage("");
        setApplyError("");

        setTimeout(() => {
            document
                .getElementById("apply-form")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }, 100);
    };

    // =========================================
    // Close Apply Form
    // =========================================

    const closeApplyForm = () => {
        if (applying) {
            return;
        }

        setShowApplyForm(false);
        setApplyMessage("");
        setApplyError("");
    };

    // =========================================
    // Submit Application
    // =========================================

    const handleApply = async (e) => {
        e.preventDefault();

        setApplying(true);
        setApplyMessage("");
        setApplyError("");

        try {
            const response = await api.post(
                `/applications/jobs/${job._id}/apply`,
                {
                    coverLetter: coverLetter.trim()
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Application failed"
                );
            }

            setApplyMessage(
                response.data.message ||
                "Application submitted successfully."
            );

            setCoverLetter("");

        } catch (err) {
            setApplyError(
                err.response?.data?.message ||
                err.message ||
                "Application failed"
            );
        } finally {
            setApplying(false);
        }
    };

    // =========================================
    // Loading
    // =========================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-slate-500">
                    Loading job details...
                </p>
            </div>
        );
    }

    // =========================================
    // Error
    // =========================================

    if (error) {
        return (
            <div className="mx-auto max-w-4xl">

                <button
                    type="button"
                    onClick={() => navigate("/jobs")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={17} />
                    Back to Jobs
                </button>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
                    {error}
                </div>

            </div>
        );
    }

    if (!job) {
        return null;
    }

    return (
        <div className="mx-auto max-w-6xl">

            {/* =========================================
                BACK
            ========================================= */}

            <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft size={18} />
                Back to Jobs
            </button>

            {/* =========================================
                JOB HEADER
            ========================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                <div className="flex flex-col justify-between gap-6 md:flex-row">

                    <div className="min-w-0">

                        <h1 className="text-3xl font-bold text-slate-900">
                            {job.title}
                        </h1>

                        <p className="mt-2 text-lg font-semibold text-blue-600">
                            {job.company?.name || "Company"}
                        </p>

                        {job.company?.industry && (
                            <p className="mt-1 text-sm text-slate-500">
                                {job.company.industry}
                            </p>
                        )}

                    </div>

                    {/* TOP APPLY BUTTON */}

                    <button
                        type="button"
                        onClick={openApplyForm}
                        className="inline-flex h-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Send size={17} />
                        Apply Now
                    </button>

                </div>

                {/* =========================================
                    JOB SUMMARY
                ========================================= */}

                <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Location */}

                    <div className="rounded-xl bg-slate-50 p-4">

                        <MapPin
                            size={19}
                            className="text-blue-600"
                        />

                        <p className="mt-3 text-xs text-slate-400">
                            Location
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {job.location?.join(", ") ||
                                "Not specified"}
                        </p>

                    </div>

                    {/* Work Mode */}

                    <div className="rounded-xl bg-slate-50 p-4">

                        <Briefcase
                            size={19}
                            className="text-blue-600"
                        />

                        <p className="mt-3 text-xs text-slate-400">
                            Work Mode
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {job.workMode ||
                                "Not specified"}
                        </p>

                    </div>

                    {/* Employment */}

                    <div className="rounded-xl bg-slate-50 p-4">

                        <Clock3
                            size={19}
                            className="text-blue-600"
                        />

                        <p className="mt-3 text-xs text-slate-400">
                            Employment
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {job.employmentType ||
                                "Not specified"}
                        </p>

                    </div>

                    {/* Salary */}

                    <div className="rounded-xl bg-slate-50 p-4">

                        <IndianRupee
                            size={19}
                            className="text-blue-600"
                        />

                        <p className="mt-3 text-xs text-slate-400">
                            Salary
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {job.salaryRange ||
                                "Not disclosed"}
                        </p>

                    </div>

                </div>

            </div>

            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">

                <div className="space-y-6">

                    {/* Description */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-xl font-semibold text-slate-900">
                            Job Description
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {job.description ||
                                "No description available."}
                        </p>

                    </div>

                    {/* Responsibilities */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-xl font-semibold text-slate-900">
                            Responsibilities
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {job.responsibilities ||
                                "No responsibilities specified."}
                        </p>

                    </div>

                    {/* Requirements */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-xl font-semibold text-slate-900">
                            Requirements
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {job.requirements ||
                                "No specific requirements provided."}
                        </p>

                    </div>

                    {/* Required Skills */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h2 className="text-xl font-semibold text-slate-900">
                            Required Skills
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">

                            {job.requiredSkills?.map(
                                (skill) => (
                                    <span
                                        key={skill._id}
                                        className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                                    >
                                        {skill.name}
                                    </span>
                                )
                            )}

                            {(!job.requiredSkills ||
                                job.requiredSkills.length === 0) && (
                                <p className="text-sm text-slate-500">
                                    No required skills listed.
                                </p>
                            )}

                        </div>

                    </div>

                </div>

                {/* =========================================
                    SIDEBAR
                ========================================= */}

                <aside className="space-y-6">

                    {/* Experience */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h3 className="text-lg font-semibold text-slate-900">
                            Experience
                        </h3>

                        <p className="mt-3 text-sm text-slate-600">
                            {job.experience?.min ?? 0} -{" "}
                            {job.experience?.max ?? 0} years
                        </p>

                    </div>

                    {/* Company */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <h3 className="text-lg font-semibold text-slate-900">
                            About Company
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {job.company?.name ||
                                "Company"}
                        </p>

                        {job.company?.industry && (
                            <p className="mt-2 text-sm text-slate-500">
                                {job.company.industry}
                            </p>
                        )}

                    </div>

                    {/* APPLICATION CTA */}

                    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

                        <div className="flex items-center gap-2">

                            <CheckCircle2
                                size={20}
                                className="text-green-600"
                            />

                            <h3 className="font-semibold text-green-800">
                                Ready to Apply?
                            </h3>

                        </div>

                        <p className="mt-3 text-sm leading-6 text-green-700">
                            Review the requirements and
                            submit your application.
                        </p>

                        {/* SECOND APPLY BUTTON */}
                        {/* Same operation as top button */}

                        <button
                            type="button"
                            onClick={openApplyForm}
                            className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Apply Now
                        </button>

                    </div>

                </aside>

            </div>

            {/* =========================================
                APPLICATION FORM
            ========================================= */}

            {showApplyForm && (
                <div
                    id="apply-form"
                    className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                    {/* Form Header */}

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                        <div>

                            <h2 className="text-xl font-semibold text-slate-900">
                                Apply for this job
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Submit your application to{" "}
                                {job.company?.name ||
                                    "this company"}.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={closeApplyForm}
                            disabled={applying}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>

                    </div>

                    {/* Messages */}

                    {applyMessage && (
                        <div className="mx-6 mt-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            <CheckCircle2 size={18} />
                            {applyMessage}
                        </div>
                    )}

                    {applyError && (
                        <div className="mx-6 mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            <AlertCircle size={18} />
                            {applyError}
                        </div>
                    )}

                    {/* Form */}

                    <form
                        onSubmit={handleApply}
                        className="space-y-6 p-6"
                    >

                        {/* Resume */}

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                            <div className="flex items-start gap-3">

                                <CheckCircle2
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>

                                    <p className="text-sm font-semibold text-blue-800">
                                        Resume
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-blue-700">
                                        Your uploaded resume
                                        will be automatically
                                        attached to this
                                        application.
                                    </p>

                                    <p className="mt-2 text-xs text-blue-600">
                                        You do not need to upload
                                        your resume again.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Cover Letter */}

                        <div>

                            <label
                                htmlFor="coverLetter"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Cover Letter
                            </label>

                            <textarea
                                id="coverLetter"
                                rows="7"
                                value={coverLetter}
                                onChange={(e) =>
                                    setCoverLetter(
                                        e.target.value
                                    )
                                }
                                placeholder="Tell the employer why you are a good fit for this position..."
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                Keep your cover letter clear and
                                relevant to this role.
                            </p>

                        </div>

                        {/* Form Actions */}

                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                            <button
                                type="button"
                                onClick={closeApplyForm}
                                disabled={applying}
                                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={applying}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <Send size={17} />

                                {applying
                                    ? "Submitting..."
                                    : "Submit Application"}

                            </button>

                        </div>

                    </form>

                </div>
            )}

        </div>
    );
};

export default JobDetails;