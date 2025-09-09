import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const RentalModel = sequelize.define(
    "Rental", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },

        dvdId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Dvd',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },

        rentalDate:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // ver
        },

        returnDate: {
            type: DataTypes.DATE,
            allowNull: true
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'rented' // rented, returned, late ver tb
        },

        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true // pq true
        },

        lateDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        lateFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        }


    },

    {
        tableName: 'Rental',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default RentalModel;