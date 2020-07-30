import Joi, { ObjectSchema, required } from "@hapi/joi";

export const createRestaurantValidator: ObjectSchema = Joi.object({
  restaurantId: Joi.string().required(),
  brandName: Joi.string().required(),
  restaurantName: Joi.string().required(),
  restaurantType: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(new RegExp("^[0-9]{10}$")).required(),
  ownerName: Joi.string().required(),
  addresses: Joi.array().items(
    Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      pin: Joi.string().required(),
    })
  ),
  themeColor: Joi.string().required(),
  restaurantLogo: Joi.string().required(),
  brandLogo: Joi.string().required(),
  backgroundVideo: Joi.string().required(),
});
