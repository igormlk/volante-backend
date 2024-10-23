import { DataTypes } from "sequelize";
import db from "../config/database.js";

export const Vehicle = db.define('vehicle', {
    plate: {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    km: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fuel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chassi: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'vehicles'
})