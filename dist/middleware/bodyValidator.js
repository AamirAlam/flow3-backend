"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
// Middleware for validation
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                errors: error.details.map((detail) => ({
                    message: detail.message,
                    path: detail.path.join("."),
                })),
            });
        }
        next();
    };
};
exports.validateBody = validateBody;
