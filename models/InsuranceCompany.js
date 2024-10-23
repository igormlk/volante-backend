import { DataTypes } from "sequelize";
import db from "../config/database.js";

export const InsuranceCompany = db.define('InsuranceCompany', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'insurance_companies'
})