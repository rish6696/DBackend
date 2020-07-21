import Joi, { ObjectSchema } from "@hapi/joi";

export const loginRestaurantValidator: ObjectSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const protectedRoutesValidator: ObjectSchema = Joi.object({
  authorization: Joi.string().required(),
});

export const refreshTokenRequestValidator: ObjectSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
