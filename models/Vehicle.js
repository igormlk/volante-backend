import { DataTypes } from "sequelize";
import db from "../config/database.js";
import {Tenant} from "./Tenant.js";
import {User} from "./User.js";

export const Vehicle = db.define('vehicle', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
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
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: Tenant,
            key: 'id',

        }
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    tableName: 'vehicles'
})

Vehicle.belongsTo(Tenant, { foreignKey: 'tenantId', allowNull: true })