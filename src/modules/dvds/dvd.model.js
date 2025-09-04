import { DataTypes } from "sequelize";
import sequelize from "../../config/database";

const DvdModel = sequelize.define(
    "Dvd", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        releaseYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1900,
                max: new Date().getFullYear()
            }
        },

        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        rentedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    },

    {
        tableName: 'Dvd',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
    }
);

export default DvdModel;