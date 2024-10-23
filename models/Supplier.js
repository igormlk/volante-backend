import { DataTypes } from "sequelize";
import db from "../config/database.js";

export const Supplier = db.define('Supplier', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(18),
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
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact_person: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'suppliers'
});
