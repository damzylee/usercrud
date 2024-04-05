import { body, query, param } from "express-validator";
import Validator from "../middleware/validator";

const registrationValidationRule = [
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role value should either be user or admin"),
];

const updateUserValidationRule = [
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail(),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role value should either be user or admin"),
];

const loginValidationRule = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];

export const registerUserRequest = Validator(registrationValidationRule);
export const userLoginRequest = Validator(loginValidationRule);
export const updateUserRequest = Validator(updateUserValidationRule);
