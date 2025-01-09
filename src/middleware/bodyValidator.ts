import Joi from "joi";

// Middleware for validation
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: () => void) => {
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
