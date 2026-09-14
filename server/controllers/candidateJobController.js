import Job from "../models/Job.js";
import Skill from "../models/Skill.js";
import JobMatch from "../models/JobMatch.js";
import CandidateProfile from "../models/CandidateProfile.js";


// ======================================================
// Search and filter jobs for candidate
// ======================================================

const searchJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            search,
            skill,
            experienceMin,
            experienceMax,
            location,
            salary,
            jobType,
            workMode,
            industry,
            company,
            postedAfter,
            postedBefore,
            sort = "newest"
        } = req.query;


        // ------------------------------------------------
        // Candidate profile
        // ------------------------------------------------

        const candidate = await CandidateProfile.findOne({
            userId
        });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }


        // ------------------------------------------------
        // Only approved + published jobs
        // ------------------------------------------------

        const query = {
            status: "PUBLISHED",
            approvalStatus: "APPROVED"
        };


        // ------------------------------------------------
        // Search by title / department
        // ------------------------------------------------

        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    department: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        // ------------------------------------------------
        // Experience filter
        // ------------------------------------------------

        if (
            experienceMin !== undefined ||
            experienceMax !== undefined
        ) {
            const min = Number(experienceMin);
            const max = Number(experienceMax);

            query.experienceMin = {
                ...(Number.isFinite(max) && {
                    $lte: max
                }),
                ...(Number.isFinite(min) && {
                    $lte: min
                })
            };

            if (Number.isFinite(min)) {
                query.experienceMax = {
                    $gte: min
                };
            }
        }


        // ------------------------------------------------
        // Location filter
        // ------------------------------------------------

        if (location) {
            query.location = {
                $elemMatch: {
                    $regex: location,
                    $options: "i"
                }
            };
        }


        // ------------------------------------------------
        // Work mode
        // ------------------------------------------------

        if (workMode) {
            query.workMode = {
                $regex: workMode,
                $options: "i"
            };
        }


        // ------------------------------------------------
        // Employment / job type
        // ------------------------------------------------

        if (jobType) {
            query.employmentType = {
                $regex: jobType,
                $options: "i"
            };
        }


        // ------------------------------------------------
        // Posted date
        // ------------------------------------------------

        if (postedAfter || postedBefore) {
            query.createdAt = {};

            if (postedAfter) {
                query.createdAt.$gte =
                    new Date(postedAfter);
            }

            if (postedBefore) {
                query.createdAt.$lte =
                    new Date(postedBefore);
            }
        }


        // ------------------------------------------------
        // Salary filter
        // ------------------------------------------------

        if (salary) {
            query.salaryRange = {
                $regex: salary,
                $options: "i"
            };
        }


        // ------------------------------------------------
        // Skill filter
        // ------------------------------------------------

        if (skill) {
            const skillRecord = await Skill.findOne({
                name: {
                    $regex: `^${skill}$`,
                    $options: "i"
                }
            });

            if (!skillRecord) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    jobs: []
                });
            }

            query.$or = [
                {
                    requiredSkills:
                        skillRecord._id
                },
                {
                    preferredSkills:
                        skillRecord._id
                }
            ];
        }


        // ------------------------------------------------
        // Get jobs
        // ------------------------------------------------

        let filteredJobs = await Job.find(query)
            .populate(
                "companyId",
                "companyName industry location logo"
            )
            .populate(
                "requiredSkills",
                "name category"
            )
            .populate(
                "preferredSkills",
                "name category"
            );


        // ------------------------------------------------
        // Company filter
        // ------------------------------------------------

        if (company) {
            filteredJobs = filteredJobs.filter(
                (job) =>
                    job.companyId?.companyName
                        ?.toLowerCase()
                        .includes(
                            company.toLowerCase()
                        )
            );
        }


        // ------------------------------------------------
        // Industry filter
        // ------------------------------------------------

        if (industry) {
            filteredJobs = filteredJobs.filter(
                (job) =>
                    job.companyId?.industry
                        ?.toLowerCase()
                        .includes(
                            industry.toLowerCase()
                        )
            );
        }


        // ------------------------------------------------
        // Get existing match scores
        // ------------------------------------------------

        const candidateMatches =
            await JobMatch.find({
                candidateId: candidate._id
            });


        const matchMap = new Map();

        candidateMatches.forEach((match) => {
            matchMap.set(
                match.jobId.toString(),
                match
            );
        });


        // ------------------------------------------------
        // Sorting
        // ------------------------------------------------

        if (
            sort === "bestSkillMatch" ||
            sort === "highestMatch"
        ) {
            filteredJobs.sort((a, b) => {

                const matchA =
                    matchMap.get(
                        a._id.toString()
                    );

                const matchB =
                    matchMap.get(
                        b._id.toString()
                    );

                const scoreA = matchA
                    ? matchA.overallMatch
                    : 0;

                const scoreB = matchB
                    ? matchB.overallMatch
                    : 0;

                return scoreB - scoreA;
            });

        } else if (
            sort === "experienceMatch"
        ) {
            filteredJobs.sort((a, b) => {
                return (
                    (b.experienceMax || 0) -
                    (a.experienceMax || 0)
                );
            });

        } else if (
            sort === "locationMatch"
        ) {
            filteredJobs.sort((a, b) => {
                return (
                    (b.location?.length || 0) -
                    (a.location?.length || 0)
                );
            });

        } else if (sort === "salary") {
            filteredJobs.sort((a, b) => {
                return String(
                    b.salaryRange || ""
                ).localeCompare(
                    String(
                        a.salaryRange || ""
                    )
                );
            });

        } else {
            // newest
            filteredJobs.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );
        }


        // ------------------------------------------------
        // Add match information
        // ------------------------------------------------

        const result = filteredJobs.map(
            (job) => {

                const match =
                    matchMap.get(
                        job._id.toString()
                    );

                return {
                    ...job.toObject(),

                    match: match
                        ? {
                              overallMatch:
                                  match.overallMatch,

                              skillMatch:
                                  match.skillMatch,

                              experienceMatch:
                                  match.experienceMatch,

                              locationMatch:
                                  match.locationMatch
                          }
                        : null
                };
            }
        );


        // ------------------------------------------------
        // Response
        // ------------------------------------------------

        return res.status(200).json({
            success: true,
            count: result.length,
            jobs: result
        });

    } catch (error) {
        console.error(
            "Candidate job search error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ======================================================
// Get Candidate Job Details
// ======================================================

const getCandidateJobDetails = async (
    req,
    res
) => {
    try {
        const userId = req.user.userId;
        const { jobId } = req.params;


        // ------------------------------------------------
        // Candidate profile
        // ------------------------------------------------

        const candidate =
            await CandidateProfile.findOne({
                userId
            });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate profile not found"
            });
        }


        // ------------------------------------------------
        // Only approved candidates
        // ------------------------------------------------

        if (
            candidate.verificationStatus !==
            "APPROVED"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Candidate is not approved"
            });
        }


        // ------------------------------------------------
        // Only approved + published jobs
        // ------------------------------------------------

        const job = await Job.findOne({
            _id: jobId,
            status: "PUBLISHED",
            approvalStatus: "APPROVED"
        })
            .populate(
                "companyId",
                "companyName industry location logo"
            )
            .populate(
                "requiredSkills",
                "name category"
            )
            .populate(
                "preferredSkills",
                "name category"
            );


        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }


        // ------------------------------------------------
        // Job details
        // ------------------------------------------------

        const jobDetails = {
            _id: job._id,

            title: job.title,

            company: {
                name:
                    job.companyId?.companyName,

                industry:
                    job.companyId?.industry,

                location:
                    job.companyId?.location,

                logo:
                    job.companyId?.logo
            },

            location: job.location,

            experience: {
                min: job.experienceMin,

                max: job.experienceMax
            },

            requiredSkills:
                job.requiredSkills,

            preferredSkills:
                job.preferredSkills,

            workMode:
                job.workMode,

            salaryRange:
                job.salaryRange,

            employmentType:
                job.employmentType,

            department:
                job.department,

            qualification:
                job.qualification,

            vacancies:
                job.vacancies,

            description:
                job.description,

            responsibilities:
                job.responsibilities,

            requirements:
                job.requirements,

            benefits:
                job.benefits,

            applicationDeadline:
                job.applicationDeadline,

            status:
                job.status,

            approvalStatus:
                job.approvalStatus
        };


        return res.status(200).json({
            success: true,
            job: jobDetails
        });

    } catch (error) {
        console.error(
            "Get candidate job details error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    searchJobs,
    getCandidateJobDetails
};