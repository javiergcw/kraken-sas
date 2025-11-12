"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/reservation/button";
import { Input } from "@/components/reutilizables/input";
import { Textarea } from "@/components/reutilizables/text-area";
import { Label } from "@/components/reutilizables/label";
import { Switch } from "@/components/reutilizables/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/reservation/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/reutilizables/seletc";
import { Checkbox } from "@/components/reutilizables/checkbox";
import { ArrowLeft, Save, Upload, Loader2, Search, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import DocumentManager from "@/components/reutilizables/big-documents";

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

interface ContractVariable {
  name: string;
  label: string;
  type: string;
  required: boolean;
  validation: string;
  order: number;
}

interface Category {
  id: string;
  name: string;
}

export default function EditContractPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingVariable, setIsCreatingVariable] = useState(false);
  const [isDetectingVariables, setIsDetectingVariables] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [showCreateVariableForm, setShowCreateVariableForm] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template_url: "",
    type: "automatic",
    required: true,
    active: true,
    category_ids: [] as string[]
  });

  // Documento seleccionado
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Variables del contrato (mock data)
  const [contractVariables] = useState<ContractVariable[]>([
    { name: "nombre_cliente", label: "Nombre del Cliente", type: "text", required: true, validation: "required|min:3", order: 1 },
    { name: "cedula_cliente", label: "Cédula del Cliente", type: "text", required: true, validation: "required", order: 2 },
    { name: "fecha_inicio", label: "Fecha de Inicio", type: "date", required: true, validation: "required", order: 3 },
    { name: "direccion", label: "Dirección", type: "text", required: false, validation: "", order: 4 },
  ]);

  // Variables seleccionadas
  const [selectedVariables, setSelectedVariables] = useState<ContractVariable[]>([]);

  // Categorías (mock data)
  const [categories] = useState<Category[]>([
    { id: "1", name: "Arrendamiento" },
    { id: "2", name: "Servicios" },
    { id: "3", name: "Compra-Venta" },
    { id: "4", name: "Mantenimiento" },
    { id: "5", name: "Consultoría" },
  ]);

  // Formulario de nueva variable
  const [newVariable, setNewVariable] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    validation: "",
    order: 1
  });

  // Cargar datos iniciales
  useEffect(() => {
    // Simular carga de datos
    setFormData({
      name: "Contrato de Arrendamiento",
      description: "Contrato de arrendamiento para inmuebles comerciales",
      template_url: "https://example.com/template.docx",
      type: "automatic",
      required: true,
      active: true,
      category_ids: ["1", "2"]
    });

    // Seleccionar todas las variables por defecto
    setSelectedVariables(contractVariables);

    // Documento inicial
    setSelectedDocument({
      id: "temp-id",
      name: "plantilla.docx",
      url: "https://example.com/template.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
  }, []);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const currentIds = prev.category_ids;
      const newIds = currentIds.includes(categoryId)
        ? currentIds.filter(id => id !== categoryId)
        : [...currentIds, categoryId];
      
      return {
        ...prev,
        category_ids: newIds
      };
    });
  };

  const handleSelectVariable = (variable: ContractVariable) => {
    setSelectedVariables(prev => {
      const exists = prev.find(v => v.name === variable.name);
      if (exists) {
        return prev.filter(v => v.name !== variable.name);
      } else {
        return [...prev, variable];
      }
    });
  };

  const handleDocumentSelect = (document: Document | null) => {
    setSelectedDocument(document);
    if (document) {
      handleInputChange("template_url", document.url);
    } else {
      handleInputChange("template_url", "");
    }
  };

  const handleDetectVariables = async () => {
    if (!formData.template_url) {
      toast.error("El contrato debe tener una URL de plantilla para detectar variables");
      return;
    }

    setIsDetectingVariables(true);
    
    // Simular detección de variables
    setTimeout(() => {
      const mockVariables = [
        "nombre_cliente",
        "cedula_cliente",
        "fecha_inicio",
        "valor_mensual"
      ];
      
      toast.success(`${mockVariables.length} variables detectadas`);
      setIsDetectingVariables(false);
    }, 2000);
  };

  const handleCreateVariable = async () => {
    if (!newVariable.name || !newVariable.label) {
      toast.error("El nombre y etiqueta de la variable son requeridos");
      return;
    }

    setIsCreatingVariable(true);
    
    // Simular creación de variable
    setTimeout(() => {
      const newVar: ContractVariable = {
        name: newVariable.name,
        label: newVariable.label,
        type: newVariable.type,
        required: newVariable.required,
        validation: newVariable.validation,
        order: newVariable.order
      };

      setSelectedVariables(prev => [...prev, newVar]);
      toast.success("Variable creada exitosamente");
      
      // Resetear formulario
      setNewVariable({
        name: "",
        label: "",
        type: "text",
        required: false,
        validation: "",
        order: 1
      });
      
      setShowCreateVariableForm(false);
      setIsCreatingVariable(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular actualización
    setTimeout(() => {
      toast.success("Contrato actualizado exitosamente");
      setIsLoading(false);
      router.push("/contract");
    }, 1500);
  };

  return (
    <div className="space-y-6 px-15 py-5">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Contrato</h1>
          <p className="text-gray-600">Modifica la información del contrato</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contrato</CardTitle>
          <CardDescription>
            Modifica los detalles y configuración del contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Contrato *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Contrato de Arrendamiento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Contrato</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automático</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="template">Plantilla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe el propósito y contenido del contrato..."
                rows={4}
                required
              />
            </div>

            {/* Selector de Categorías */}
            <div className="space-y-2">
              <Label>Categorías</Label>
              <div className="border border-gray-200 rounded">
                <button
                  type="button"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-600">
                    {formData.category_ids.length > 0 
                      ? `${formData.category_ids.length} categoría(s) seleccionada(s)`
                      : "Selecciona las categorías"
                    }
                  </span>
                  {isCategoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {isCategoriesOpen && (
                  <div className="border-t p-4 space-y-3 max-h-60 overflow-y-auto">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={formData.category_ids.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <Label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No hay categorías disponibles</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="active">Estado del Contrato</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange("active", checked)}
                  />
                  <Label htmlFor="active">Contrato Activo</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="required">Contrato Obligatorio</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="required"
                    checked={formData.required}
                    onCheckedChange={(checked) => handleInputChange("required", checked)}
                  />
                  <Label htmlFor="required">Obligatorio</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Documento de Plantilla *</Label>
              <DocumentManager
                onDocumentSelect={handleDocumentSelect}
                initialDocument={selectedDocument || undefined}
                onInputChange={() => {
                  // Trigger form validation
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Variables del Contrato</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleDetectVariables}
                    disabled={!formData.template_url || isDetectingVariables}
                    className="flex items-center gap-2"
                  >
                    {isDetectingVariables ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                    {isDetectingVariables ? "Detectando..." : "Detectar Variables"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateVariableForm(!showCreateVariableForm)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Crear Variable
                  </Button>
                </div>
              </div>

              {/* Información sobre la detección de variables */}
              {formData.template_url && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">ℹ</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Gestión de Variables
                      </h4>
                      <p className="text-sm text-blue-700">
                        Puedes cambiar el documento de plantilla y luego detectar variables automáticamente 
                        desde la nueva plantilla, o crear variables manualmente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario para crear variable manualmente */}
              {showCreateVariableForm && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">Crear Variable Manualmente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="var-name">Nombre de la Variable *</Label>
                      <Input
                        id="var-name"
                        value={newVariable.name}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: nombre_cliente"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="var-label">Etiqueta *</Label>
                      <Input
                        id="var-label"
                        value={newVariable.label}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Ej: Nombre del Cliente"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="var-type">Tipo</Label>
                      <select
                        id="var-type"
                        value={newVariable.type}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="email">Email</option>
                        <option value="date">Fecha</option>
                        <option value="select">Selección</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="var-order">Orden</Label>
                      <Input
                        id="var-order"
                        type="number"
                        value={newVariable.order}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="var-validation">Validación</Label>
                      <Input
                        id="var-validation"
                        value={newVariable.validation}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, validation: e.target.value }))}
                        placeholder="Ej: required|min:3"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="var-required"
                        checked={newVariable.required}
                        onCheckedChange={(checked) => setNewVariable(prev => ({ ...prev, required: checked }))}
                      />
                      <Label htmlFor="var-required">Requerido</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateVariableForm(false)}
                      disabled={isCreatingVariable}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCreateVariable}
                      disabled={isCreatingVariable || !newVariable.name || !newVariable.label}
                      className="flex items-center gap-2"
                    >
                      {isCreatingVariable ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Plus size={16} />
                      )}
                      {isCreatingVariable ? "Creando..." : "Crear Variable"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Variables disponibles */}
              {contractVariables.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Variables del contrato ({contractVariables.length}):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contractVariables
                      .sort((a, b) => a.order - b.order)
                      .map((variable, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedVariables.find(v => v.name === variable.name)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleSelectVariable(variable)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                #{variable.order}
                              </span>
                              <p className="font-medium text-sm">{variable.label}</p>
                            </div>
                            <p className="text-xs text-gray-500">{variable.name}</p>
                            <p className="text-xs text-gray-400">Tipo: {variable.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {variable.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                Requerido
                              </span>
                            )}
                            <div className={`w-4 h-4 border-2 rounded ${
                              selectedVariables.find(v => v.name === variable.name)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-200"
                            }`}>
                              {selectedVariables.find(v => v.name === variable.name) && (
                                <div className="w-2 h-2 bg-white rounded-sm m-0.5" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variables seleccionadas */}
              {selectedVariables.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Variables seleccionadas ({selectedVariables.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVariables
                      .sort((a, b) => a.order - b.order)
                      .map((variable, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">
                          #{variable.order}
                        </span>
                        {variable.label}
                        <button
                          type="button"
                          onClick={() => handleSelectVariable(variable)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name || !formData.description || !selectedDocument}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {isLoading ? "Actualizando..." : "Actualizar Contrato"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
