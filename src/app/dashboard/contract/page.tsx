"use client"

import { useState } from "react";
import { Button } from "@/components/reservation/button";
import { FileText, Pencil, Trash2, View } from "lucide-react";
import PrimaryTable from "@/components/table/table-primary";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/reservation/dialog";
import { AppleEmptyState } from "@/components/table/apple-empty-state";
import { useRouter } from "next/navigation";


// Define una interfaz para el contrato seleccionado
interface SelectedContract {
  id: number;
  name: string;
  description: string;
  template_url: string;
  variables: string[] | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  contractVariables?: Array<{
    id: number;
    order: number;
    name: string;
    label: string;
    type: string;
    required: boolean;
    validation?: string;
  }>;
}

interface MockContract {
  id: number;
  name: string;
  description: string;
  template_url: string;
  variables: string[] | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Datos mockeados
const mockContracts: MockContract[] = [
  {
    id: 1,
    name: "Contrato de Servicios",
    description: "Contrato estándar para la prestación de servicios de asesoría y consultoría a empresas",
    template_url: "https://example.com/templates/contrato-servicios.pdf",
    variables: ["nombre_cliente", "fecha_inicio", "monto"],
    active: true,
    created_at: "2024-01-15T10:00:00",
    updated_at: "2024-01-15T10:00:00"
  },
  {
    id: 2,
    name: "Contrato de Mantenimiento",
    description: "Contrato para servicios de mantenimiento preventivo y correctivo de equipos e infraestructura",
    template_url: "https://example.com/templates/contrato-mantenimiento.pdf",
    variables: ["equipo", "frecuencia", "costo"],
    active: true,
    created_at: "2024-02-20T14:30:00",
    updated_at: "2024-02-20T14:30:00"
  },
  {
    id: 3,
    name: "Contrato de Arrendamiento",
    description: "Contrato para el arrendamiento de espacios comerciales y oficinas",
    template_url: "https://example.com/templates/contrato-arrendamiento.pdf",
    variables: ["ubicacion", "area", "canon"],
    active: false,
    created_at: "2024-03-10T09:15:00",
    updated_at: "2024-03-10T09:15:00"
  }
];

const mockVariables = [
  {
    id: 1,
    order: 1,
    name: "nombre_cliente",
    label: "Nombre del Cliente",
    type: "text",
    required: true,
    validation: "min:3"
  },
  {
    id: 2,
    order: 2,
    name: "fecha_inicio",
    label: "Fecha de Inicio",
    type: "date",
    required: true
  },
  {
    id: 3,
    order: 3,
    name: "monto",
    label: "Monto a Pagar",
    type: "number",
    required: true,
    validation: "min:0"
  }
];

export default function ContractsPage() {
  const headers = ["", "Nombre", "Descripción", "Estado", "Fecha de Creación"];

  const [contracts, setContracts] = useState<MockContract[]>(mockContracts);
  const [isEmpty, setIsEmpty] = useState(mockContracts.length === 0);

  const [selectedContract, setSelectedContract] = useState<SelectedContract>({
    id: 0,
    name: "",
    description: "",
    template_url: "",
    variables: null,
    active: false,
    created_at: "",
    updated_at: "",
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  const handleView = (contract: MockContract) => {
    setSelectedContract({
      id: contract.id,
      name: contract.name,
      description: contract.description,
      template_url: contract.template_url,
      variables: contract.variables,
      active: contract.active,
      created_at: contract.created_at,
      updated_at: contract.updated_at,
      contractVariables: mockVariables // Mock variables
    });
    setIsViewModalOpen(true);
  };

  const handleDelete = (contract: MockContract) => {
    setSelectedContract({
      id: contract.id,
      name: contract.name,
      description: contract.description,
      template_url: contract.template_url,
      variables: contract.variables,
      active: contract.active,
      created_at: contract.created_at,
      updated_at: contract.updated_at,
    });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContract) {
      setContracts(contracts.filter(c => c.id !== selectedContract.id));
      setIsEmpty(contracts.length === 1);
      setIsDeleteModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactivo
      </span>
    );
  };



  return (
    <>
      {isEmpty ? (
        <AppleEmptyState
          icon={FileText}
          title="No hay contratos"
          description="Comienza creando contratos para gestionar tus acuerdos comerciales"
          buttonText="Añadir contrato"
          onButtonClick={() => router.push('/dashboard/contract/create')}
          helpText="¿Necesitas ayuda?"
          onHelpClick={() => console.log("Guía")}
        />
      ) : (
        <>
          <PrimaryTable
            nametable="Contratos"
            headers={headers}
            data={contracts.map((contract) => [
              <div className="w-10 h-10 flex items-center justify-center border rounded-lg bg-blue-50">
                <FileText size={20} strokeWidth={1.25} className="text-blue-600" />
              </div>,
              contract.name,
              contract.description.length > 50 
                ? `${contract.description.substring(0, 50)}...` 
                : contract.description,
              getStatusBadge(contract.active),
              formatDate(contract.created_at),
              <div className="inline-flex border rounded-lg overflow-hidden">
                <Button variant="outline" className="px-2 shadow-none rounded-none border-r" onClick={() => handleView(contract)}>
                  <View className="cursor-pointer h-4 w-4" />
                </Button>
                <Button variant="outline" className="px-2 shadow-none rounded-none border-r" onClick={() => router.push(`/dashboard/contract/edit/${contract.id}`)}>
                  <Pencil className="cursor-pointer h-4 w-4" />
                </Button>
                <Button className="px-2 bg-red-500 hover:bg-red-400 shadow-none rounded-none" onClick={() => handleDelete(contract)}>
                  <Trash2 className="text-white cursor-pointer h-4 w-4" />
                </Button>
              </div>
            ])}
            onAdd={() => router.push('/dashboard/contract/create')}
            showAddButton={true}
          />

          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl">
              {selectedContract && (
                <div className="space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{selectedContract.name}</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Detalles del contrato
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedContract.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Estado</h3>
                        {getStatusBadge(selectedContract.active)}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Fecha de Creación</h3>
                        <p className="text-gray-700">{formatDate(selectedContract.created_at)}</p>
                      </div>
                    </div>
                    
                    {selectedContract.contractVariables && selectedContract.contractVariables.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Variables del Contrato</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedContract.contractVariables
                            .sort((a, b) => a.order - b.order)
                            .map((variable, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    #{variable.order}
                                  </span>
                                  <span className="font-medium text-sm">{variable.label}</span>
                                </div>
                                {variable.required && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                    Requerido
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500">Nombre: {variable.name}</p>
                                <p className="text-xs text-gray-500">Tipo: {variable.type}</p>
                                {variable.validation && (
                                  <p className="text-xs text-gray-500">Validación: {variable.validation}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedContract.template_url && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Plantilla</h3>
                        <a 
                          href={selectedContract.template_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FileText size={16} />
                          Ver plantilla
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Eliminar Contrato</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar el contrato <span className="text-red-500 font-semibold">{selectedContract?.name}</span>? <br />
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-red-500 hover:bg-red-400" onClick={confirmDelete}>
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

