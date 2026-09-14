import { useEffect, useState } from "react";
import {
    Code2,
    Plus,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

import api from "../services/api";

const emptyForm = {
    skillId: "",
    proficiency: "Beginner",
    yearsOfExperience: 0,
    lastUsed: "",
    certification: "",
    projectExperience: ""
};

const Skills = () => {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingSkill, setEditingSkill] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState(emptyForm);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // -----------------------------------------
    // Get available skills
    // -----------------------------------------

    const getAvailableSkills = async () => {
        try {
            const response = await api.get("/skills");

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load available skills"
                );
            }

            setAvailableSkills(
                response.data.skills || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load available skills"
            );
        }
    };

    // -----------------------------------------
    // Get candidate skills
    // -----------------------------------------

    const getSkills = async () => {
        try {
            const response = await api.get(
                "/candidate/skills"
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Failed to load skills"
                );
            }

            setSkills(
                response.data.skills || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load skills"
            );
        }
    };

    // -----------------------------------------
    // Initial load
    // -----------------------------------------

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    getAvailableSkills(),
                    getSkills()
                ]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // -----------------------------------------
    // Form change
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
    // Open Add form
    // -----------------------------------------

    const openAddForm = () => {
        setEditingSkill(null);
        setFormData(emptyForm);
        setShowForm(true);
        setMessage("");
        setError("");
    };

    // -----------------------------------------
    // Open Edit form
    // -----------------------------------------

    const openEditForm = (item) => {
        setEditingSkill(item);

        setFormData({
            skillId:
                item.skillId?._id ||
                item.skillId ||
                "",

            proficiency:
                item.proficiency ||
                "Beginner",

            yearsOfExperience:
                item.yearsOfExperience || 0,

            lastUsed:
                item.lastUsed || "",

            certification:
                item.certification || "",

            projectExperience:
                item.projectExperience || ""
        });

        setShowForm(true);
        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // -----------------------------------------
    // Close form
    // -----------------------------------------

    const closeForm = () => {
        setShowForm(false);
        setEditingSkill(null);
        setFormData(emptyForm);
        setMessage("");
        setError("");
    };

    // -----------------------------------------
    // Add / Update
    // -----------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            // -------------------------------------
            // UPDATE
            // -------------------------------------

            if (editingSkill) {
                const skillId =
                    editingSkill.skillId?._id ||
                    editingSkill.skillId;

                const response = await api.put(
                    `/candidate/skills/${skillId}`,
                    {
                        proficiency:
                            formData.proficiency,

                        yearsOfExperience:
                            Number(
                                formData.yearsOfExperience
                            ),

                        lastUsed:
                            formData.lastUsed,

                        certification:
                            formData.certification,

                        projectExperience:
                            formData.projectExperience
                    }
                );

                if (!response.data.success) {
                    throw new Error(
                        response.data.message ||
                        "Skill update failed"
                    );
                }

                setMessage(
                    "Skill updated successfully"
                );
            }

            // -------------------------------------
            // ADD
            // -------------------------------------

            else {
                if (!formData.skillId) {
                    setError(
                        "Please select a skill"
                    );
                    return;
                }

                const response = await api.post(
                    "/candidate/skills",
                    {
                        skillId:
                            formData.skillId,

                        proficiency:
                            formData.proficiency,

                        yearsOfExperience:
                            Number(
                                formData.yearsOfExperience
                            ),

                        lastUsed:
                            formData.lastUsed,

                        certification:
                            formData.certification,

                        projectExperience:
                            formData.projectExperience
                    }
                );

                if (!response.data.success) {
                    throw new Error(
                        response.data.message ||
                        "Skill could not be added"
                    );
                }

                setMessage(
                    "Skill added successfully"
                );
            }

            setFormData(emptyForm);
            setEditingSkill(null);
            setShowForm(false);

            await getSkills();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------------
    // Delete
    // -----------------------------------------

    const handleDelete = async (candidateSkillId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            const response = await api.delete(
                `/candidate/skills/${candidateSkillId}`
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Skill could not be deleted"
                );
            }

            setMessage(
                "Skill deleted successfully"
            );

            await getSkills();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Skill could not be deleted"
            );
        }
    };

    // -----------------------------------------
    // Loading
    // -----------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-slate-500">
                    Loading skills...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Code2 size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            My Skills
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your technical skills and experience
                        </p>
                    </div>

                </div>

                {!showForm && (
                    <button
                        type="button"
                        onClick={openAddForm}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Skill
                    </button>
                )}

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

            {/* Add / Edit Form */}
            {showForm && (
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                {editingSkill
                                    ? "Edit Skill"
                                    : "Add New Skill"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingSkill
                                    ? "Update your skill information"
                                    : "Add a technical skill to your profile"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 p-6"
                    >

                        {/* Skill + Proficiency */}
                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Skill
                                </label>

                                <select
                                    name="skillId"
                                    value={formData.skillId}
                                    onChange={handleChange}
                                    disabled={!!editingSkill}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                                >
                                    <option value="">
                                        Select Skill
                                    </option>

                                    {availableSkills.map(
                                        (skill) => (
                                            <option
                                                key={skill._id}
                                                value={skill._id}
                                            >
                                                {skill.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Proficiency
                                </label>

                                <select
                                    name="proficiency"
                                    value={formData.proficiency}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="Beginner">
                                        Beginner
                                    </option>

                                    <option value="Intermediate">
                                        Intermediate
                                    </option>

                                    <option value="Advanced">
                                        Advanced
                                    </option>

                                    <option value="Expert">
                                        Expert
                                    </option>
                                </select>
                            </div>

                        </div>

                        {/* Experience + Last Used */}
                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Years of Experience
                                </label>

                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    min="0"
                                    value={
                                        formData.yearsOfExperience
                                    }
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Last Used
                                </label>

                                <input
                                    type="text"
                                    name="lastUsed"
                                    placeholder="e.g. 2026"
                                    value={formData.lastUsed}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>

                        {/* Certification */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Certification
                            </label>

                            <input
                                type="text"
                                name="certification"
                                placeholder="Optional"
                                value={
                                    formData.certification
                                }
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Project Experience */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Project Experience
                            </label>

                            <textarea
                                name="projectExperience"
                                rows="4"
                                placeholder="Describe how you have used this skill..."
                                value={
                                    formData.projectExperience
                                }
                                onChange={handleChange}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {editingSkill
                                    ? <Pencil size={17} />
                                    : <Plus size={17} />}

                                {saving
                                    ? "Saving..."
                                    : editingSkill
                                    ? "Update Skill"
                                    : "Add Skill"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* Skills List */}
            <div>

                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Your Skills
                    </h2>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {skills.length} skill
                        {skills.length !== 1
                            ? "s"
                            : ""}
                    </span>
                </div>

                {skills.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                        <Code2
                            size={40}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 text-lg font-semibold text-slate-700">
                            No skills added yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your technical skills to improve job matching.
                        </p>

                        <button
                            onClick={openAddForm}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Your First Skill
                        </button>

                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">

                        {skills.map((item) => (
                            <div
                                key={item._id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >

                                {/* Skill Header */}
                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {item.skillId?.name ||
                                                "Unknown Skill"}
                                        </h3>

                                        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {item.proficiency}
                                        </span>
                                    </div>

                                    <Code2
                                        size={22}
                                        className="text-slate-300"
                                    />

                                </div>

                                {/* Details */}
                                <div className="mt-5 grid grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Experience
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-700">
                                            {item.yearsOfExperience}{" "}
                                            year
                                            {item.yearsOfExperience !== 1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Last Used
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-700">
                                            {item.lastUsed ||
                                                "N/A"}
                                        </p>
                                    </div>

                                </div>

                                {/* Certification */}
                                {item.certification && (
                                    <div className="mt-4">

                                        <p className="text-xs text-slate-400">
                                            Certification
                                        </p>

                                        <p className="mt-1 text-sm text-slate-700">
                                            {item.certification}
                                        </p>

                                    </div>
                                )}

                                {/* Project */}
                                {item.projectExperience && (
                                    <div className="mt-4">

                                        <p className="text-xs text-slate-400">
                                            Project Experience
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            {item.projectExperience}
                                        </p>

                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEditForm(
                                                item
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Pencil size={15} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
    handleDelete(
        item.skillId?._id ||
        item.skillId
    )
}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        <Trash2 size={15} />
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
};

export default Skills;