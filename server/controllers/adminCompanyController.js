import Company from "../models/Company.js";
import AdminAction from "../models/AdminAction.js";


// Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company
            .find()
            .populate("userId", "name email role");

        return res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });

    } catch (error) {
        console.error("Get all companies error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get single company
const getCompanyById = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company
            .findById(companyId)
            .populate("userId", "name email role");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        console.error("Get company error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update company verification status
const updateCompanyStatus = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { status, note } = req.body;

        const allowedStatuses = [
            "VERIFIED",
            "REJECTED",
            "SUSPENDED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company status"
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.status = status;

        await company.save();

        await AdminAction.create({
            adminId: req.user.userId,
            companyId: company._id,
            action: "VERIFY_COMPANY",
            note: note || `Company status changed to ${status}`
        });

        return res.status(200).json({
            success: true,
            message: "Company status updated successfully",
            status: company.status
        });

    } catch (error) {
        console.error("Update company status error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    getAllCompanies,
    getCompanyById,
    updateCompanyStatus
};