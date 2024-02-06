import { CustomerSheetSchema, defaultCustomerValues } from "@/components/CustomerSheet/schema"
import { VehicleSheetSchema, defaultVehicleValues } from "@/components/VehicleSheet/schema"
import { ServiceOrder, ServiceOrderItem } from "@/features/ServiceOrder/types"

export async function getServiceOrder(): Promise<ServiceOrder>{
    return {
        id: crypto.randomUUID(),
        status: "pending",
        created_at: new Date().toJSON(),
        last_saved_at: new Date().toJSON(),
        customer: defaultCustomerValues,
        vehicle: defaultVehicleValues,
        items: []
    }
}

export async function putServiceOrderItem(_data: ServiceOrderItem){
    return 
}

export async function putServiceOrderCustomer(_data: CustomerSheetSchema){
    return 
}

export async function putServiceOrderVehicle(_data: VehicleSheetSchema){
    return 
}

export async function putServiceOrder(_data: ServiceOrder){
    return 
}