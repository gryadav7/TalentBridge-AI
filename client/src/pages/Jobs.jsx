import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Briefcase,
    IndianRupee,
    Clock3,
    ChevronDown
} from "lucide-react";

import api from "../services/api";

const Jobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [workMode, setWorkMode] = useState("");
    const [jobType, setJobType] = useState("");
    const [skill, setSkill] = useState("");
    const [sort, setSort] = useState("newest");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            if (location) {
                params.append("location", location);
            }

            if (workMode) {
                params.append("workMode", workMode);
            }

            if (jobType) {
                params.append("jobType", jobType);
            }

            if (skill) {
                params.append("skill", skill);
            }

            if (sort) {
                params.append("sort", sort);
            }

            const response = await api.get(
                `/candidate/jobs?${params.toString()}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load jobs"
                );
            }

            setJobs(response.data.jobs || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [location, workMode, jobType, skill, sort]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setWorkMode("");
        setJobType("");
        setSkill("");
        setSort("newest");
    };

    return (
        <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Find Jobs
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Discover jobs that match your skills and experience.
                </p>
            </div>

            {/* Search */}
            <form
                onSubmit={handleSearch}
                className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="flex flex-col gap-3 md:flex-row">

                    <div className="relative flex-1">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search job title or department..."
                            className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Search Jobs
                    </button>

                </div>
            </form>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

                {/* Filters */}
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-5 flex items-center gap-2">
                        <SlidersHorizontal
                            size={18}
                            className="text-blue-600"
                        />

                        <h2 className="font-semibold text-slate-900">
                            Filters
                        </h2>
                    </div>

                    {/* Location */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Location
                        </label>

                        <input
                            type="text"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            placeholder="e.g. Delhi"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Skill */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Skill
                        </label>

                        <input
                            type="text"
                            value={skill}
                            onChange={(e) =>
                                setSkill(e.target.value)
                            }
                            placeholder="e.g. JavaScript"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Work Mode */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Work Mode
                        </label>

                        <select
                            value={workMode}
                            onChange={(e) =>
                                setWorkMode(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="">
                                All
                            </option>

                            <option value="Remote">
                                Remote
                            </option>

                            <option value="Hybrid">
                                Hybrid
                            </option>

                            <option value="On-site">
                                On-site
                            </option>
                        </select>
                    </div>

                    {/* Job Type */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Job Type
                        </label>

                        <select
                            value={jobType}
                            onChange={(e) =>
                                setJobType(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="">
                                All
                            </option>

                            <option value="Full Time">
                                Full Time
                            </option>

                            <option value="Part Time">
                                Part Time
                            </option>

                            <option value="Contract">
                                Contract
                            </option>

                            <option value="Internship">
                                Internship
                            </option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Sort By
                        </label>

                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="newest">
                                Newest Jobs
                            </option>

                            <option value="highestMatch">
                                Highest Match
                            </option>

                            <option value="bestSkillMatch">
                                Best Skill Match
                            </option>

                            <option value="experienceMatch">
                                Experience Match
                            </option>

                            <option value="locationMatch">
                                Location Match
                            </option>

                            <option value="salary">
                                Salary
                            </option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Clear Filters
                    </button>

                </aside>

                {/* Jobs */}
                <section>

                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            {jobs.length} job
                            {jobs.length !== 1
                                ? "s"
                                : ""} found
                        </p>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <p className="text-slate-500">
                                Loading jobs...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
                            {error}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                            <Briefcase
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-lg font-semibold text-slate-700">
                                No jobs found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >

                                    <div className="flex flex-col justify-between gap-5 md:flex-row">

                                        <div className="min-w-0">

                                            <h2 className="text-xl font-semibold text-slate-900">
                                                {job.title}
                                            </h2>

                                            <p className="mt-1 text-sm font-medium text-blue-600">
                                                {job.companyId?.companyName ||
                                                    "Company"}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">

                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={16} />
                                                    {job.location?.join(", ") ||
                                                        "Location not specified"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Briefcase size={16} />
                                                    {job.workMode ||
                                                        "Work mode not specified"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock3 size={16} />
                                                    {job.employmentType ||
                                                        "Employment type"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <IndianRupee size={16} />
                                                    {job.salaryRange ||
                                                        "Salary not disclosed"}
                                                </span>

                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">

                                                {job.requiredSkills
                                                    ?.slice(0, 6)
                                                    .map((skill) => (
                                                        <span
                                                            key={skill._id}
                                                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                                        >
                                                            {skill.name}
                                                        </span>
                                                    ))}

                                            </div>

                                        </div>

                                        {/* Match */}
                                        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">

                                            {job.match && (
                                                <div className="rounded-xl bg-green-50 px-4 py-3 text-right">
                                                    <p className="text-xs text-green-600">
                                                        Job Match
                                                    </p>

                                                    <p className="mt-1 text-2xl font-bold text-green-700">
                                                        {job.match.overallMatch}%
                                                    </p>
                                                </div>
                                            )}
<button
    type="button"
    onClick={() =>
        navigate(`/jobs/${job._id}`)
    }
    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
>
    View Job
    <ChevronDown
        size={16}
        className="-rotate-90"
    />
</button>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>

        </div>
    );
};

export default Jobs;