import Joi from "joi";

export const userRegisterBody = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Name should be a text value.",
    "string.min": "Name must be at least 3 characters long.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  organization: Joi.string().min(2).required().messages({
    "string.base": "Organization should be a text value.",
    "string.min": "Organization must be at least 3 characters long.",
    "any.required": "Organization is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a text value.",
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

export const forgetPasswordBody = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
});

export const resetPasswordBody = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 characters long.",
    "any.required": "OTP is required.",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.base": "Password should be a text value.",
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});
