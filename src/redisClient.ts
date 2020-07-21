import redis from "redis";
import { redisUrl } from "./config";
import util from "util";

export const client = redis.createClient(redisUrl);
export const getData = util.promisify(client.get.bind(client));

export const removeKey = (key: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    client.del(key.toString(), (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

client.on("error", (x) => {
  console.log("Error On Client", x);
});
