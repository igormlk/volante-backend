import { DataTypes } from "sequelize";
import db from "../config/database.js";

export const Employee = db.define('Employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf:{
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'employees'
})