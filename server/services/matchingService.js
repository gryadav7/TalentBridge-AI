import Job from "../models/Job.js";
import CandidateProfile from "../models/CandidateProfile.js";


const calculateSkillMatch = (job, candidate) => {
    const requiredSkillIds = job.requiredSkills.map(
        (skill) => skill._id.toString()
    );

    const candidateSkillIds = candidate.skills.map(
        (skill) => skill.skillId._id.toString()
    );

    if (requiredSkillIds.length === 0) {
        return {
            score: 100,
            matchedSkills: [],
            missingSkills: []
        };
    }

    const matchedSkills = requiredSkillIds.filter((id) =>
        candidateSkillIds.includes(id)
    );

    const missingSkills = requiredSkillIds.filter(
        (id) => !candidateSkillIds.includes(id)
    );

    const score =
        (matchedSkills.length / requiredSkillIds.length) * 100;

    return {
        score: Math.round(score),
        matchedSkills,
        missingSkills
    };
};


const calculateExperienceMatch = (job, candidate) => {
    const candidateExperience = candidate.totalExperience || 0;

    const minExperience = job.experienceMin ?? 0;
    const maxExperience = job.experienceMax ?? minExperience;

    if (candidateExperience >= minExperience &&
        candidateExperience <= maxExperience) {
        return 100;
    }

    if (candidateExperience < minExperience) {
        if (minExperience === 0) {
            return 100;
        }

        return Math.max(
            0,
            Math.round(
                (candidateExperience / minExperience) * 100
            )
        );
    }

    return 100;
};


const calculateRoleMatch = (job, candidate) => {
    const jobTitle = (job.title || "").toLowerCase();

    const candidateDesignation = (
        candidate.currentDesignation ||
        candidate.designation ||
        ""
    ).toLowerCase();

    if (!jobTitle || !candidateDesignation) {
        return 0;
    }

    if (jobTitle === candidateDesignation) {
        return 100;
    }

    const jobWords = jobTitle.split(/\s+/).filter(Boolean);

    const matchedWords = jobWords.filter((word) =>
        candidateDesignation.includes(word)
    );

    if (matchedWords.length === 0) {
        return 0;
    }

    return Math.round(
        (matchedWords.length / jobWords.length) * 100
    );
};


const calculateLocationMatch = (job, candidate) => {
    const candidateLocations = [
        candidate.location,
        candidate.currentLocation,
        ...(candidate.preferredLocations || [])
    ]
        .filter(Boolean)
        .map((location) => location.toLowerCase());

    const jobLocations = (job.location || [])
        .map((location) => location.toLowerCase());

    if (
        candidateLocations.length === 0 ||
        jobLocations.length === 0
    ) {
        return 0;
    }

    const matched = jobLocations.some((jobLocation) =>
        candidateLocations.some(
            (candidateLocation) =>
                candidateLocation === jobLocation ||
                candidateLocation.includes(jobLocation) ||
                jobLocation.includes(candidateLocation)
        )
    );

    return matched ? 100 : 0;
};


const calculateQualificationMatch = (job, candidate) => {
    const requiredQualification = (
        job.qualification || ""
    ).toLowerCase();

    const candidateQualification = (
        candidate.qualification || ""
    ).toLowerCase();

    if (
        !requiredQualification ||
        !candidateQualification
    ) {
        return 0;
    }

    return candidateQualification.includes(
        requiredQualification
    ) ||
    requiredQualification.includes(candidateQualification)
        ? 100
        : 0;
};


const calculateWorkModeMatch = (job, candidate) => {
    const jobWorkMode = (job.workMode || "").toLowerCase();
    const candidateWorkMode = (candidate.workMode || "").toLowerCase();

    if (!jobWorkMode || !candidateWorkMode) {
        return 0;
    }

    return jobWorkMode === candidateWorkMode ? 100 : 0;
};


const calculateOtherRequirementsMatch = (job, candidate) => {
    /*
      The specification defines a 5% "Other Requirements"
      weight, but does not define a structured candidate field
      for it.

      For this initial implementation, no extra candidate
      requirement field is assumed, so this dimension is neutral.
    */
    return 100;
};





const calculateOverallMatch = ({
    skillMatch,
    experienceMatch,
    roleMatch,
    locationMatch,
    qualificationMatch,
    workModeMatch,
    otherRequirementsMatch
}) => {
    const overall =
        skillMatch * 0.40 +
        experienceMatch * 0.20 +
        roleMatch * 0.15 +
        locationMatch * 0.10 +
        qualificationMatch * 0.05 +
        workModeMatch * 0.05 +
        otherRequirementsMatch * 0.05;

    return Math.round(overall);
};


const calculateJobCandidateMatch = async (
    jobId,
    candidateId
) => {
  const job = await Job.findById(jobId)
    .populate("requiredSkills")
    .populate("preferredSkills");

if (!job) {
    throw new Error("Job not found");
}

if (
    job.approvalStatus !== "APPROVED" ||
    job.status !== "PUBLISHED"
) {
    throw new Error(
        "Job is not approved or published"
    );
}

const candidate = await CandidateProfile
    .findById(candidateId)
    .populate("skills.skillId");

if (!candidate) {
    throw new Error("Candidate not found");
}

if (candidate.verificationStatus !== "APPROVED") {
    throw new Error(
        "Candidate is not approved"
    );
}

    const skillResult = calculateSkillMatch(
        job,
        candidate
    );

    const experienceMatch = calculateExperienceMatch(
        job,
        candidate
    );

    const roleMatch = calculateRoleMatch(
        job,
        candidate
    );

    const locationMatch = calculateLocationMatch(
        job,
        candidate
    );

    const qualificationMatch = calculateQualificationMatch(
        job,
        candidate
    );

    const workModeMatch = calculateWorkModeMatch(
        job,
        candidate
    );

    const otherRequirementsMatch =
        calculateOtherRequirementsMatch(
            job,
            candidate
        );

    const overallMatch = calculateOverallMatch({
        skillMatch: skillResult.score,
        experienceMatch,
        roleMatch,
        locationMatch,
        qualificationMatch,
        workModeMatch,
        otherRequirementsMatch
    });

    return {
        jobId: job._id,
        candidateId: candidate._id,

        skillMatch: skillResult.score,
        experienceMatch,
        locationMatch,
        qualificationMatch,
        overallMatch,

        roleMatch,
        workModeMatch,
        otherRequirementsMatch,

        matchedSkills: skillResult.matchedSkills,
        missingSkills: skillResult.missingSkills
    };
};

export {
    calculateJobCandidateMatch
};