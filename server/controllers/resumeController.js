import cloudinary from "../config/cloudinary.js";
import Resume from "../models/Resume.js";
import CandidateProfile from "../models/CandidateProfile.js";

const uploadResume = async (req, res) => {
    try {
        const userId = req.user.userId;

        // File check
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            });
        }

        // Find candidate profile
        const candidateProfile = await CandidateProfile.findOne({
            userId
        });

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        // Upload file to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "technical-talent-portal/resumes",
                    resource_type: "auto"
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

        // Check existing resume
        const existingResume = await Resume.findOne({
            candidateId: candidateProfile._id
        });

        // If resume already exists, remove old Cloudinary file
        if (existingResume) {
            try {
                await cloudinary.uploader.destroy(
                    existingResume.publicId,
                    {
                        resource_type: "raw"
                    }
                );
            } catch (error) {
                console.error(
                    "Old resume deletion failed:",
                    error.message
                );
            }

            existingResume.fileName = req.file.originalname;
            existingResume.fileUrl = uploadResult.secure_url;
            existingResume.publicId = uploadResult.public_id;

            await existingResume.save();

            candidateProfile.resume = existingResume._id;
            await candidateProfile.save();

            return res.status(200).json({
                success: true,
                message: "Resume updated successfully",
                resume: existingResume
            });
        }

        // Create new resume document
        const resume = await Resume.create({
            candidateId: candidateProfile._id,
            fileName: req.file.originalname,
            fileUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        });

        // Connect resume with candidate profile
        candidateProfile.resume = resume._id;

        await candidateProfile.save();

        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {
        console.error("Resume upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Resume upload failed"
        });
    }
};

export { uploadResume };