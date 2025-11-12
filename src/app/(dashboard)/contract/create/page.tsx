"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/reservation/button";
import { Input } from "@/components/reutilizables/input";
import { Textarea } from "@/components/reutilizables/text-area";
import { Label } from "@/components/reutilizables/label";
import { Switch } from "@/components/reutilizables/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/reservation/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/reutilizables/seletc";
import { Checkbox } from "@/components/reutilizables/checkbox";
import { ArrowLeft, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import DocumentManager from "@/components/reutilizables/big-documents";

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

interface Category {
  id: string;
  name: string;
}

export default function CreateContractPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data para categorías
  const [categories] = useState<Category[]>([
    { id: "1", name: "Arrendamiento" },
    { id: "2", name: "Servicios" },
    { id: "3", name: "Compra-Venta" },
    { id: "4", name: "Mantenimiento" },
    { id: "5", name: "Consultoría" },
  ]);
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    template_url: "",
    type: "automatic",
    required: true,
    active: true,
    category_ids: [] as string[]
  });

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

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

  const handleDocumentSelect = (document: Document | null) => {
    setSelectedDocument(document);
    if (document) {
      // Actualizar la URL de la plantilla con la URL del documento seleccionado
      handleInputChange("template_url", document.url);
    } else {
      // Limpiar la URL de la plantilla si no hay documento seleccionado
      handleInputChange("template_url", "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular creación de contrato
    setTimeout(() => {
      console.log("Contrato creado:", {
        name: formData.name,
        description: formData.description,
        template_url: formData.template_url,
        type: formData.type,
        required: formData.required,
        active: formData.active,
        category_ids: formData.category_ids
      });
      
      toast.success("Contrato creado exitosamente");
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
          <h1 className="text-2xl font-bold text-gray-900">Crear Contrato</h1>
          <p className="text-gray-600">Agrega un nuevo contrato al sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contrato</CardTitle>
          <CardDescription>
            Completa los detalles básicos del contrato. Las variables se pueden agregar después de crear el contrato.
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
                  <div className="border-t border-gray-200 p-4 space-y-3 max-h-60 overflow-y-auto">
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">ℹ</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Variables del Contrato
                  </h4>
                  <p className="text-sm text-blue-700">
                    Primero sube el documento de plantilla. Después de crear el contrato, 
                    podrás editar para detectar variables automáticamente desde la plantilla 
                    o crear variables manualmente.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
                {isLoading ? "Creando..." : "Crear Contrato"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 