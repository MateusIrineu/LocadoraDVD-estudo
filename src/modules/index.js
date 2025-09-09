import sequelize from "../config/database.js";
import UserModel from "./users/user.model.js";
import DvdModel from "./dvds/dvd.model.js";
import RentalModel from "./rentals/rental.model.js";

const models = { UserModel, DvdModel, RentalModel };

export { sequelize };
export default models;