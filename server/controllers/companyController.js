import Company from "../models/Company.js";
import cloudinary from "../config/cloudinary.js";




// Create Company Profile
const createCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check existing company profile
        const existingCompany = await Company.findOne({
            userId
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: "Company profile already exists"
            });
        }

        const {
            companyName,
            officialEmail,
            mobile,
            website,
            industry,
            companySize,
            location,
            gstCin,
            recruiterName,
            recruiterDesignation,
            companyProfile,
            logo,
            verificationDocuments
        } = req.body;

        // Required fields
        if (!companyName || !officialEmail) {
            return res.status(400).json({
                success: false,
                message: "Company name and official email are required"
            });
        }

        // Create company
        const company = await Company.create({
            userId,
            companyName,
            officialEmail,
            mobile,
            website,
            industry,
            companySize,
            location,
            gstCin,
            recruiterName,
            recruiterDesignation,
            companyProfile,
            logo,
            verificationDocuments
        });

        return res.status(201).json({
            success: true,
            message: "Company profile created successfully",
            company
        });

    } catch (error) {
        console.error("Create company profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get Company Profile
const getCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const company = await Company.findOne({
            userId
        }).populate("userId", "email role");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        console.error("Get company profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update Company Profile
const updateCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const allowedFields = [
            "companyName",
            "officialEmail",
            "mobile",
            "website",
            "industry",
            "companySize",
            "location",
            "gstCin",
            "recruiterName",
            "recruiterDesignation",
            "companyProfile",
            "logo",
            "verificationDocuments"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                company[field] = req.body[field];
            }
        });

        await company.save();

        return res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            company
        });

    } catch (error) {
        console.error("Update company profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// companyLogo

const uploadCompanyLogo = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Logo file is required"
            });
        }

        const company = await Company.findOne({ userId });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "technical-talent-portal/company-logos",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        company.logo = uploadResult.secure_url;

        await company.save();

        return res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully",
            logo: company.logo
        });

    } catch (error) {
        console.error("Company logo upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Company logo upload failed"
        });
    }
};


// uploadVerificationDocuments

const uploadVerificationDocuments = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Verification document is required"
            });
        }

        const company = await Company.findOne({ userId });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const uploadedDocuments = [];

     for (const file of req.files) {
    const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "technical-talent-portal/company-documents",
                resource_type: "raw"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(file.buffer);
    });

    uploadedDocuments.push(uploadResult.secure_url);
}
        company.verificationDocuments.push(...uploadedDocuments);

        await company.save();

        return res.status(200).json({
            success: true,
            message: "Verification documents uploaded successfully",
            documents: company.verificationDocuments
        });

    } catch (error) {
        console.error(
            "Verification documents upload error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Verification document upload failed"
        });
    }
};


export {
    createCompanyProfile,
    getCompanyProfile,
    updateCompanyProfile,
    uploadCompanyLogo,
    uploadVerificationDocuments
};