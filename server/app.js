import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import adminCandidateRoutes from "./routes/adminCandidateRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import adminCompanyRoutes from "./routes/adminCompanyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminJobRoutes from "./routes/adminJobRoutes.js";
import jobMatchRoutes from "./routes/jobMatchRoutes.js";
import candidateJobRoutes from "./routes/candidateJobRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import companyApplicationRoutes
    from "./routes/companyApplicationRoutes.js";

const app = express();


// Security headers
app.use(express.static("public"));


app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "https://checkout.razorpay.com"
                ],

                scriptSrcElem: [
                    "'self'",
                    "https://checkout.razorpay.com"
                ],

                frameSrc: [
                    "'self'",
                    "https://checkout.razorpay.com",
                    "https://api.razorpay.com"
                ],

                connectSrc: [
                    "'self'",
                    "https://checkout.razorpay.com",
                    "https://api.razorpay.com"
                ],

                imgSrc: [
                    "'self'",
                    "data:",
                    "https:"
                ],

                styleSrc: [
                    "'self'",
                    "'unsafe-inline'"
                ]
            }
        }
    })
);


// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);


// Parse JSON
app.use(express.json());


// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));


// Parse cookies
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin/candidates", adminCandidateRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin/companies", adminCompanyRoutes);
app.use("/api/company/jobs", jobRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/matching", jobMatchRoutes);
app.use(
    "/api/candidate/jobs",
    candidateJobRoutes
);
app.use(
    "/api/subscriptions",
    subscriptionRoutes
);
app.use(
    "/api/applications",
    jobApplicationRoutes
);
app.use(
    "/api/applications",
    companyApplicationRoutes
);


export default app;