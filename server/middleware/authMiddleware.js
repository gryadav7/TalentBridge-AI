import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {    
    try {
        // Get token from cookie
        const token = req.cookies.token;

        // Token not found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach decoded user information to request
        req.user = decoded;

        // Continue to next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};




export { authenticate };