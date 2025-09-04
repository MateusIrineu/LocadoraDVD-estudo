import sequelize from "../config/database.js";
import UserModel from "./users/user.model.js";
import DvdModel from "./dvds/dvd.model.js";

const models = { UserModel, DvdModel };

export { sequelize };
export default models;