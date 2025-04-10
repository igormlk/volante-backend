import {DataTypes} from "sequelize";
import db from "../config/database.js";
import {Customer} from "./Customer.js";
import {Vehicle} from "./Vehicle.js";
import {InsuranceCompany} from "./InsuranceCompany.js"
import {Tenant} from "./Tenant.js";

export const ServiceOrder = db.define("ServiceOrder", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Customer,
            key: 'id'
        }
    },
    vehicleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Vehicle,
            key: 'id'
        }
    },
    insuranceCompanyId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: InsuranceCompany,
            key: 'id'
        }
    },
    startAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Tenant,
            key: 'id'
        }
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, {
    tableName: 'service_orders',
    timestamps: true
})

ServiceOrder.belongsTo(Customer)
ServiceOrder.belongsTo(Vehicle)