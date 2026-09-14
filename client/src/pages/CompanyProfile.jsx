import { useEffect, useState } from "react";
import api from "../services/api";

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompanyProfile = async () => {
    try {
      const response = await api.get("/company/profile");

      if (response.data.success) {
        setCompany(response.data.company);
      }
    } catch (error) {
      console.error("Fetch company profile error:", error);

      if (error.response?.status === 404) {
        setError("Company profile not created yet.");
      } else {
        setError("Failed to load company profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  if (loading) {
    return <p className="p-6">Loading company profile...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Company Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-3">
        <p>
          <strong>Company Name:</strong> {company?.companyName}
        </p>

        <p>
          <strong>Official Email:</strong> {company?.officialEmail}
        </p>

        <p>
          <strong>Mobile:</strong> {company?.mobile || "Not provided"}
        </p>

        <p>
          <strong>Website:</strong> {company?.website || "Not provided"}
        </p>

        <p>
          <strong>Industry:</strong> {company?.industry || "Not provided"}
        </p>

        <p>
          <strong>Company Size:</strong>{" "}
          {company?.companySize || "Not provided"}
        </p>

        <p>
          <strong>Location:</strong> {company?.location || "Not provided"}
        </p>

        <p>
          <strong>GST/CIN:</strong> {company?.gstCin || "Not provided"}
        </p>

        <p>
          <strong>Recruiter:</strong> {company?.recruiterName || "Not provided"}
        </p>

        <p>
          <strong>Recruiter Designation:</strong>{" "}
          {company?.recruiterDesignation || "Not provided"}
        </p>

        <p>
          <strong>Status:</strong> {company?.status}
        </p>
      </div>
    </div>
  );
};

export default CompanyProfile;
