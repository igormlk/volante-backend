import db from "../config/database.js";
import {DataTypes} from "sequelize";

export const CustomerVehicle = db.define('customer_vehicles', {
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    vehicle_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
}, {
    tableName: 'customer_vehicles',
    timestamps: true
});

