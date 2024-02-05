import { Car, MoreOne, User } from "@icon-park/react";
import { Badge } from "@/components/ui/badge";
import PriceTag from "@/components/ui/priceTag";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectOption from "@/components/ui/selectOptions";
import FileSelect from "@/components/ui/fileSelect";
import { CustomerSheet } from "../../components/CustomerSheet/CustomerSheet";
import { VehicleSheet } from "../../components/VehicleSheet/VehicleSheet";
import DetailCard from "@/components/ui/detailCard";
import { DataTable } from "@/components/DataTable/DataTable";
import { columns } from "./columns";
import { ServiceOrder } from "./types";
import { useForm } from "react-hook-form";

function ServiceOrderPage() {
  const [show, setShow] = useState(false)
  const { register, handleSubmit } = useForm()
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder>({
    id: "006263",
    status: "pending",
    created_at: "2024-02-02T16:50:04.793Z",
    last_saved_at: "2024-02-02T16:50:04.793Z",
    customer: {
      name: "Thailon Lucas",
      cpf: "155.511.848-89"
    },
    vehicle: {
      plate: "DRN-3J65",
      description: "Honda Fit",
      brand: "Honda",
      model: "Fit",
      year: "2014"
    },
    items: []
  })

  const onSubmit = ({description, value}: any) => {
    console.log(description)
    const newSO = serviceOrder
    newSO.items.push({
      "id": "0025",
      "tag": "pintura",
      description,
      "type": "service",
      "quantity": 1,
      value,
      "discount": 0,
      "insurance_coverage": 0,
      "total": value
    })
    setServiceOrder({...newSO})
    console.log(newSO)
  }
  

  return (
    <div className="flex flex-1 flex-row p-8 gap-10">
      {/* Left Side */}
      <div className="flex flex-1 flex-col basis-3/5">
        <div className="flex flex-row justify-items-center items-center mb-8">
          <div className="flex-col flex-1">
            <h3 className="text-2xl font-semibold">Novo orçamento</h3>
            <p className="text-sm text-muted-foreground">Último salvo {new Date(serviceOrder.last_saved_at).toLocaleString()}</p>
          </div>
          <Badge className="h-8 rounded-full" onClick={() => setShow(!show)}>{serviceOrder.status}</Badge>
        </div>

        <div className="flex mb-4 flex-wrap">
          <CustomerSheet trigger={<DetailCard side={"left"} title={serviceOrder.customer.name || "Cliente"} subtitle={serviceOrder.customer.cpf || "Clique aqui para selecionar"} fallback={<User fill={"#94A3B8"}/>} className="min-w-[300px]"/>}/>
          <VehicleSheet trigger={<DetailCard side={"right"} title={serviceOrder.vehicle.description || "Veículo"} subtitle={serviceOrder.vehicle.plate || "Clique aqui para selecionar"} fallback={<Car fill={"#94A3B8"}/>} className="min-w-[300px]"/>}/>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
          <span className="flex-1">
            <Label htmlFor="item">Item</Label>
            <Input id="description" placeholder="Digite aqui..." {...register("description")} />
          </span>
          <span>
            <Label htmlFor="price">Valor</Label>
            <Input id="price" placeholder="0,00" {...register("value")}/>
          </span>
          <Button type="submit">Adicionar</Button>
        </form>

        <DataTable columns={columns} data={[...serviceOrder.items]} className={"mt-4 mb-4 flex-1 overflow-y-scroll"}/>
        
        <div className="flex justify-between">
          <span className="flex flex-1 gap-8">
            <PriceTag id='pieces-price' label='Peças' value='R$0,00' />
            <PriceTag id='services-price' label='Serviços' value='R$0,00' />
            <PriceTag id='discounts-price' label='Descontos' value='R$0,00' />
          </span>
          <span className="flex gap-8">
            {/* <PriceTag id='insurance-price' label='Seguro' value='-R$0,00' className="text-right" /> */}
            <PriceTag id='total-price' label='Total' value='R$0,00' className="text-right" />
          </span>
        </div>
      
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col basis-1/5">
        
        <div className="flex justify-end h-[60px]">
          <Button variant={"ghost"}><MoreOne size={22}/></Button>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span>
            <Label htmlFor="insurance">Seguradora</Label>
            <SelectOption placeholder="Selecione uma seguradora..." options={['Não há', 'Allianz', 'Azul', 'Porto Seguro']}/>
          </span>
          <span>
            <Label htmlFor="duration">Duraçao Aproximada</Label>
            <span className="flex gap-1">
              <Input id="duration" placeholder="0" className="w-[100px]"/>
              <SelectOption placeholder="Selecione..." options={['Horas', 'Dias', 'Semanas', 'Meses', 'Anos']}/>
            </span>
          </span>
          <FileSelect label="Imagens"/>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant={"outline"}>Compartilhar</Button>
          <Button>Salvar</Button>
        </div>

      </div>
    </div>
  );
}

export default ServiceOrderPage;
