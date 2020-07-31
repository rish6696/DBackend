import Joi, { ObjectSchema } from "@hapi/joi";

export const loginValidator: ObjectSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const protectedRoutesValidator: ObjectSchema = Joi.object({
  authorization: Joi.string().required(),
});

export const refreshTokenRequestValidator: ObjectSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
export const validatePasswordQueryValidator: ObjectSchema = Joi.object({
  token: Joi.string().required(),
  _id: Joi.string().required(),
});

export const validatePasswordHeaderValidator: ObjectSchema = Joi.object({
  source: Joi.string().required(),
});

export const createRestaurantPasswordValidator: ObjectSchema = Joi.object({
  token: Joi.string().required(),
  _id: Joi.string().required(),
  password: Joi.string().required(),
});

export const forgotPasswordValidator: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetOwnerPasswordValidator: ObjectSchema = Joi.object({
  token: Joi.string().required(),
  _id: Joi.string().required(),
  newPassword: Joi.string().required(),
});
