import sequelize from "../config/database.js";
import UserModel from "./users/user.model.js";

const models = { UserModel };

export { sequelize };
export default models;