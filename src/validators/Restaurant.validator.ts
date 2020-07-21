import Joi, { ObjectSchema, required } from "@hapi/joi";

export const createRestaurantValidator: ObjectSchema = Joi.object({
  name: Joi.string().required(),
  emails: Joi.array().items(Joi.string()).required(),
  phones: Joi.array().items(Joi.string()).required(),
  filter: Joi.array().items(Joi.string()).required(),
  qRCode: Joi.string().required(),
  restaurantId: Joi.string().required(),
  admins: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        permissions: Joi.array().items(Joi.string()).required(),
        roleId: Joi.number().required(),
      })
    )
    .required(),
});
