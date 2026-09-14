import { useEffect, useState } from "react";
import {
    Briefcase,
    CalendarDays,
    MapPin,
    Clock3,
    FileText
} from "lucide-react";

import api from "../services/api";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/applications/my"
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load applications"
                );
            }

            setApplications(
                response.data.applications || []
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load applications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApplications();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "APPLIED":
                return "bg-blue-50 text-blue-700";

            case "SHORTLISTED":
                return "bg-yellow-50 text-yellow-700";

            case "INTERVIEW":
                return "bg-purple-50 text-purple-700";

            case "SELECTED":
                return "bg-green-50 text-green-700";

            case "JOINED":
                return "bg-emerald-50 text-emerald-700";

            case "REJECTED":
                return "bg-red-50 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-slate-500">
                    Loading applications...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">

            {/* Header */}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    My Applications
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Track jobs you have applied for.
                </p>
            </div>

            {/* Error */}

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Empty */}

            {!error && applications.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                    <Briefcase
                        size={42}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="mt-4 text-lg font-semibold text-slate-700">
                        No applications yet
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Apply for a job and your application
                        will appear here.
                    </p>

                </div>
            )}

            {/* Applications */}

            <div className="space-y-5">

                {applications.map((application) => {

                    const job = application.jobId;

                    return (
                        <div
                            key={application._id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >

                            <div className="flex flex-col justify-between gap-6 md:flex-row">

                                {/* Job information */}

                                <div className="min-w-0">

                                    <h2 className="text-xl font-semibold text-slate-900">
                                        {job?.title ||
                                            "Job"}
                                    </h2>

                                    {job?.department && (
                                        <p className="mt-1 text-sm font-medium text-blue-600">
                                            {job.department}
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">

                                        {job?.location && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <MapPin size={16} />

                                                {Array.isArray(
                                                    job.location
                                                )
                                                    ? job.location.join(
                                                          ", "
                                                      )
                                                    : job.location}
                                            </span>
                                        )}

                                        {job?.workMode && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Briefcase size={16} />
                                                {job.workMode}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays size={16} />

                                            {application.createdAt
                                                ? new Date(
                                                      application.createdAt
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </span>

                                    </div>

                                </div>

                                {/* Status */}

                                <div className="shrink-0">

                                    <span
                                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                                            application.status
                                        )}`}
                                    >
                                        {application.status ||
                                            "APPLIED"}
                                    </span>

                                </div>

                            </div>

                            {/* Application details */}

                            <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2 lg:grid-cols-3">

                                {/* Applied date */}

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Applied On
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                        {application.appliedAt
                                            ? new Date(
                                                  application.appliedAt
                                              ).toLocaleDateString()
                                            : application.createdAt
                                            ? new Date(
                                                  application.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>

                                {/* Salary */}

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Salary
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                        {job?.salaryRange ||
                                            "Not disclosed"}
                                    </p>
                                </div>

                                {/* Resume */}

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Resume
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700">

                                        <FileText
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        {application.resume?.fileName ||
                                            "Resume attached"}

                                    </div>
                                </div>

                            </div>

                            {/* Cover Letter */}

                            {application.coverLetter && (
                                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                                    <div className="flex items-center gap-2">
                                        <FileText
                                            size={17}
                                            className="text-slate-500"
                                        />

                                        <p className="text-sm font-semibold text-slate-700">
                                            Cover Letter
                                        </p>
                                    </div>

                                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {application.coverLetter}
                                    </p>

                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default Applications;