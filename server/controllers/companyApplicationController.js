import JobApplication from "../models/JobApplication.js";
import Company from "../models/Company.js";


// Company gets applications for its jobs
const getCompanyApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find company owned by logged-in user
        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        // Get applications for company's jobs
        const applications = await JobApplication.find()
            .populate({
                path: "jobId",
                match: {
                    companyId: company._id
                },
                select:
                    "title department location salaryRange workMode status"
            })
            .populate({
                path: "candidateId",
                select:
                    "userId firstName lastName phone email location verificationStatus"
            })
            .sort({
                createdAt: -1
            });

        // populate(match) can leave jobId null
        const companyApplications =
            applications.filter(
                (application) =>
                    application.jobId !== null
            );

        return res.status(200).json({
            success: true,
            count: companyApplications.length,
            applications: companyApplications
        });

    } catch (error) {
        console.error(
            "Get company applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Company gets applications for one specific job
const getJobApplications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { jobId } = req.params;

        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const applications =
            await JobApplication.find({
                jobId
            })
                .populate({
                    path: "jobId",
                    match: {
                        companyId: company._id
                    },
                    select:
                        "title department location salaryRange workMode status"
                })
                .populate({
                    path: "candidateId",
                    select:
                        "userId firstName lastName phone email location verificationStatus"
                })
                .sort({
                    createdAt: -1
                });

        if (
            applications.length > 0 &&
            applications[0].jobId === null
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not own this job"
            });
        }

        const validApplications =
            applications.filter(
                (application) =>
                    application.jobId !== null
            );

        return res.status(200).json({
            success: true,
            count: validApplications.length,
            applications: validApplications
        });

    } catch (error) {
        console.error(
            "Get job applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    getCompanyApplications,
    getJobApplications
};