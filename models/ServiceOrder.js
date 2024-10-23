import { DataTypes } from "sequelize";
import db from "../config/database.js";
import { Customer } from "./Customer.js";
import { Vehicle } from "./Vehicle.js";
import { InsuranceCompany } from "./InsuranceCompany.js"

export const ServiceOrder = db.define("ServiceOrder", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    },
    customerId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Customer,
            key: 'id'
        }
    },
    vehicleId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Vehicle,
            key: 'id'
        }
    },
    insuranceCompanyId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: InsuranceCompany,
            key: 'id'
        }
    },
    startAt:{
        type: DataTypes.DATE,
        allowNull: true
    },
    endAt:{
        type: DataTypes.DATE,
        allowNull: true
    },
    note:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'service_orders'
})

ServiceOrder.belongsTo(Customer)
ServiceOrder.belongsTo(Vehicle)