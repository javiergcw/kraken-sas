"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/reservation/card"
import { Button } from "@/components/reservation/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/reservation/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/reservation/popover"
import { Calendar } from "@/components/reservation/calendar"
import {    
  Download, 
  Plus,
  Printer,
  Calendar as CalendarIcon
} from "lucide-react"
import React, { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Componente para input con popup
function EditableCell({ 
  type = "text", 
  defaultValue = "", 
  placeholder = "-", 
  className = "w-16 px-2 py-1 border rounded text-center",
  label = "Campo",
  onValueChange
}: {
  type?: "text" | "number"
  defaultValue?: string
  placeholder?: string
  className?: string
  label?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <input
          type={type}
          value={value}
          readOnly
          className={`${className} border-0 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors`}
          placeholder={placeholder}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {label}</DialogTitle>
          <DialogDescription>
            Modifica el valor del campo {label.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Valor:</label>
            {label.toLowerCase().includes('observaciones') ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-lg min-h-[60px] resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder={placeholder}
                autoFocus
                rows={3}
              />
            ) : (
              <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder={placeholder}
                autoFocus
              />
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setValue(defaultValue)
                setIsOpen(false)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={() => {
              onValueChange?.(value)
              setIsOpen(false)
            }}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para selector de actividades
function ActivitySelector({ 
  defaultValue = "", 
  className = "w-16 px-2 py-1 text-center",
  onValueChange
}: {
  defaultValue?: string
  className?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)

  const actividades = [
    { value: "FD", label: "FD", color: "bg-red-200 text-red-800" },
    { value: "MC", label: "MC", color: "bg-yellow-200 text-yellow-800" },
    { value: "refresh", label: "refresh", color: "bg-green-200 text-green-800" },
    { value: "ADV1", label: "ADV1", color: "bg-blue-200 text-blue-800" },
    { value: "ADV2", label: "ADV2", color: "bg-blue-200 text-blue-800" },
    { value: "OW1", label: "OW1", color: "bg-purple-200 text-purple-800" },
    { value: "OW2", label: "OW2", color: "bg-purple-200 text-purple-800" },
    { value: "OW3", label: "OW3", color: "bg-purple-200 text-purple-800" },
    { value: "SNK", label: "SNK", color: "bg-green-800 text-white" },
    { value: "acompañante", label: "acompañante", color: "bg-blue-800 text-white" },
    { value: "nitrox", label: "nitrox", color: "bg-purple-800 text-white" },
    { value: "sidemount", label: "sidemount", color: "bg-amber-600 text-white" }
  ]

  const selectedActivity = actividades.find(a => a.value === value)

  return (
    <div className={className}>
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onValueChange?.(e.target.value)
        }}
        className="w-full bg-transparent border-0 text-sm focus:outline-none appearance-none"
        style={{ backgroundImage: 'none' }}
      >
        <option value="">-</option>
        {actividades.map((actividad) => (
          <option key={actividad.value} value={actividad.value}>
            {actividad.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Componente para selector de tallas
function SizeSelector({ 
  defaultValue = "", 
  className = "w-12 px-2 py-1 text-center",
  onValueChange
}: {
  defaultValue?: string
  className?: string
  onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)

  const tallas = ["XS", "S", "M", "L", "XL"]

  return (
    <div className={className}>
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onValueChange?.(e.target.value)
        }}
        className="w-full bg-transparent border-0 text-sm focus:outline-none appearance-none"
        style={{ backgroundImage: 'none' }}
      >
        <option value="">-</option>
        {tallas.map((talla) => (
          <option key={talla} value={talla}>
            {talla}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function SheetPage() {
  // Estado para manejar diferentes fechas
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date("2024-08-08"))
  const [calendarioAbierto, setCalendarioAbierto] = useState(false)
  
  // Datos por fecha - tenemos datos para el 7 y 8 de agosto
  const datosPorFecha = {
    "2024-08-07": {
      buzos: [
        { id: 1, nombre: "María González", tanque: "1", maleta: "15", regulador: "Scubapro MK25", chaleco: "L", cinturon: "4kg", pesas: "2kg", mascara: "Cressi Focus", snorkel: "Cressi", aletas: "Cressi 3000", traje: "L", actividad: "OW1", observaciones: "primera inmersión", valor: "180.000", factura: "33820" },
        { id: 2, nombre: "Roberto Silva", tanque: "2", maleta: "28", regulador: "Aqualung Calypso", chaleco: "XL", cinturon: "6kg", pesas: "4kg", mascara: "Tusa", snorkel: "Tusa", aletas: "Tusa", traje: "XL", actividad: "OW2", observaciones: "experiencia media", valor: "220.000", factura: "33821" },
        { id: 3, nombre: "Ana Rodríguez", tanque: "1", maleta: "12", regulador: "Cressi AC2", chaleco: "M", cinturon: "3kg", pesas: "1kg", mascara: "Scubapro", snorkel: "Scubapro", aletas: "Scubapro", traje: "M", actividad: "FD", observaciones: "buceo libre", valor: "150.000", factura: "33822" },
        { id: 4, nombre: "Carlos Mendoza", tanque: "2", maleta: "45", regulador: "Aqualung Legend", chaleco: "L", cinturon: "5kg", pesas: "3kg", mascara: "Atomic", snorkel: "Atomic", aletas: "Atomic", traje: "L", actividad: "ADV1", observaciones: "curso avanzado", valor: "350.000", factura: "33823" },
        { id: 5, nombre: "Laura Torres", tanque: "1", maleta: "8", regulador: "Cressi XS", chaleco: "S", cinturon: "2kg", pesas: "1kg", mascara: "Cressi", snorkel: "Cressi", aletas: "Cressi", traje: "S", actividad: "SNK", observaciones: "snorkeling", valor: "80.000", factura: "33824" }
      ],
      instructores: [
        { id: 20, nombre: "Carlos Bustamante", tanque: "2", equipos: "tabla, pizarra", actividad: "instructor", observaciones: "curso OW1" },
        { id: 21, nombre: "Luis Cardona", tanque: "1", equipos: "cámara", actividad: "fotógrafo", observaciones: "fotos submarinas" },
        { id: 22, nombre: "Edil de Andreis", tanque: "2", equipos: "equipos de rescate", actividad: "rescue", observaciones: "supervisión seguridad" },
        { id: 23, nombre: "Otto Naranjo", tanque: "1", equipos: "medidor de profundidad", actividad: "asistente", observaciones: "apoyo logístico" },
        { id: 24, nombre: "Emerson de Andreis", tanque: "2", equipos: "GPS, radio", actividad: "navegación", observaciones: "coordinación embarcación" },
        { id: 25, nombre: "Manuel D Macedo", tanque: "1", equipos: "botiquín", actividad: "médico", observaciones: "seguridad médica" }
      ],
      piscina: [
        { id: 1, nombre: "Pedro Martínez", tanque: "1", equipos: "máscara, snorkel", actividad: "OW1", ubicacion: "piscina", observaciones: "práctica básica" },
        { id: 2, nombre: "Sofia Herrera", tanque: "1", equipos: "aletas", actividad: "OW1", ubicacion: "piscina", observaciones: "técnicas de respiración" },
        { id: 3, nombre: "Diego Ramírez", tanque: "1", equipos: "chaleco", actividad: "OW2", ubicacion: "piscina", observaciones: "control de flotabilidad" }
      ]
    },
    "2024-08-08": {
      buzos: [
        { id: 1, nombre: "Jairo Álvarez", tanque: "2", maleta: "32", regulador: "Aqualung 2825", chaleco: "M", cinturon: "", pesas: "", mascara: "", snorkel: "", aletas: "", traje: "", actividad: "FD", observaciones: "nitrox", valor: "25.000", factura: "33785" },
        { id: 2, nombre: "Jonathan Milton", tanque: "2", maleta: "1", regulador: "aqualung 0078", chaleco: "M", cinturon: "", pesas: "", mascara: "11", snorkel: "", aletas: "ML", traje: "XL", actividad: "refresh", observaciones: "inglés", valor: "50.000/500.000", factura: "33818/33848" },
        { id: 3, nombre: "Juliana Munera", tanque: "2", maleta: "35", regulador: "Cressi 0044", chaleco: "XXS", cinturon: "", pesas: "", mascara: "Mistral 13", snorkel: "", aletas: "35/36", traje: "XS", actividad: "FD", observaciones: "(1.63 - 50 - 38/39)", valor: "290.000", factura: "33850" },
        { id: 4, nombre: "Claudia Medina", tanque: "2", maleta: "4", regulador: "Cressi 0241", chaleco: "XS", cinturon: "", pesas: "", mascara: "Us divers azul emerson", snorkel: "", aletas: "36/37", traje: "XS", actividad: "FD", observaciones: "(1.60 - 63 - 35/37)", valor: "290.000", factura: "33850" },
        { id: 5, nombre: "Sebastián Munera", tanque: "2", maleta: "E00", regulador: "Cressi 4680", chaleco: "M", cinturon: "", pesas: "", mascara: "Liberador", snorkel: "", aletas: "ML", traje: "L", actividad: "FD", observaciones: "(1.81 - 65 - 40/41)", valor: "290.000", factura: "33850" },
        { id: 6, nombre: "Thomas Guyot", tanque: "2", maleta: "2", regulador: "us diver 282", chaleco: "M", cinturon: "", pesas: "", mascara: "10", snorkel: "", aletas: "42", traje: "M", actividad: "MC", observaciones: "inglés", valor: "50.000/350.000", factura: "33843/33849" },
        { id: 7, nombre: "Nicolas Guyot", tanque: "", maleta: "", regulador: "", chaleco: "", cinturon: "", pesas: "", mascara: "", snorkel: "", aletas: "", traje: "", actividad: "SNK", observaciones: "sin guia 9 años", valor: "50.000/100.000", factura: "33844/33849" },
        { id: 8, nombre: "Romain Guyot", tanque: "", maleta: "", regulador: "", chaleco: "", cinturon: "", pesas: "", mascara: "", snorkel: "", aletas: "", traje: "", actividad: "SNK", observaciones: "sin guia", valor: "50.000/100.000", factura: "33845/33849" },
        { id: 9, nombre: "Andrea Garavito", tanque: "", maleta: "", regulador: "", chaleco: "", cinturon: "", pesas: "", mascara: "", snorkel: "", aletas: "", traje: "", actividad: "SNK", observaciones: "sin guia", valor: "50.000/100.000", factura: "33846/33849" },
        { id: 10, nombre: "Diemut", tanque: "2", maleta: "", regulador: "", chaleco: "", cinturon: "", pesas: "", mascara: "", snorkel: "", aletas: "", traje: "", actividad: "OW2", observaciones: "divanga", valor: "", factura: "" }
      ],
      instructores: [
        { id: 20, nombre: "Carlos Bustamante", tanque: "2", equipos: "", actividad: "oceano", observaciones: "" },
        { id: 21, nombre: "Luis Cardona", tanque: "", equipos: "", actividad: "oceano", observaciones: "no viene" },
        { id: 22, nombre: "Edil de Andreis", tanque: "", equipos: "", actividad: "oceano", observaciones: "no viene" },
        { id: 23, nombre: "Otto Naranjo", tanque: "2", equipos: "", actividad: "oceano", observaciones: "" },
        { id: 24, nombre: "Emerson de Andreis", tanque: "2", equipos: "", actividad: "oceano", observaciones: "" },
        { id: 25, nombre: "Manuel D Macedo", tanque: "2", equipos: "", actividad: "instructor", observaciones: "" }
      ],
      piscina: [
        { id: 1, nombre: "Jose Bedoya", tanque: "1", equipos: "", actividad: "ow1", ubicacion: "piscina", observaciones: "" },
        { id: 2, nombre: "", tanque: "1", equipos: "", actividad: "", ubicacion: "oceano", observaciones: "" }
      ]
    }
  }

  // Instructores estáticos - siempre los mismos nombres
  const instructoresEstaticos = [
    { id: 20, nombre: "Carlos Bustamante" },
    { id: 21, nombre: "Luis Cardona" },
    { id: 22, nombre: "Edil de Andreis" },
    { id: 23, nombre: "Otto Naranjo" },
    { id: 24, nombre: "Emerson de Andreis" },
    { id: 25, nombre: "Manuel D Macedo" }
  ]

  // Estados locales para los datos editables de la fecha actual
  const fechaString = format(fechaSeleccionada, "yyyy-MM-dd")
  const datosIniciales = datosPorFecha[fechaString as keyof typeof datosPorFecha] || { buzos: [], instructores: [], piscina: [] }
  
  const [buzos, setBuzos] = useState(datosIniciales.buzos)
  const [instructores, setInstructores] = useState(
    datosIniciales.instructores.length > 0 
      ? datosIniciales.instructores 
      : instructoresEstaticos.map(inst => ({ ...inst, tanque: "", equipos: "", actividad: "", observaciones: "" }))
  )
  const [piscina, setPiscina] = useState(datosIniciales.piscina)

  // Actualizar datos cuando cambie la fecha
  React.useEffect(() => {
    const fechaString = format(fechaSeleccionada, "yyyy-MM-dd")
    const datosActuales = datosPorFecha[fechaString as keyof typeof datosPorFecha] || { buzos: [], instructores: [], piscina: [] }
    
    setBuzos(datosActuales.buzos)
    setPiscina(datosActuales.piscina)
    
    // Para instructores: si hay datos los usa, si no mantiene nombres pero vacía otros campos
    if (datosActuales.instructores.length > 0) {
      setInstructores(datosActuales.instructores)
    } else {
      setInstructores(instructoresEstaticos.map(inst => ({ ...inst, tanque: "", equipos: "", actividad: "", observaciones: "" })))
    }
  }, [fechaSeleccionada])

  const agregarNuevoBuzo = () => {
    const nuevoId = Math.max(...buzos.map(b => b.id)) + 1
    const nuevoBuzo = {
      id: nuevoId,
      nombre: `Nuevo Buzo ${nuevoId}`,
      tanque: "",
      maleta: "",
      regulador: "",
      chaleco: "",
      cinturon: "",
      pesas: "",
      mascara: "",
      snorkel: "",
      aletas: "",
      traje: "",
      actividad: "",
      observaciones: "",
      valor: "",
      factura: ""
    }
    setBuzos([...buzos, nuevoBuzo])
  }

  const agregarNuevaPersonaPiscina = () => {
    const nuevoId = Math.max(...piscina.map(p => p.id)) + 1
    const nuevaPersona = {
      id: nuevoId,
      nombre: "",
      tanque: "",
      equipos: "",
      actividad: "",
      ubicacion: "",
      observaciones: ""
    }
    setPiscina([...piscina, nuevaPersona])
  }

  // Función para formatear fecha
  const formatearFecha = (fecha: Date) => {
    return format(fecha, "EEEE d 'de' MMMM", { locale: es })
  }

  return (
    <div className="flex-1 space-y-2 px-12 py-5">
      {/* Header con selector de fecha */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 sm:p-3 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-lg sm:text-xl font-bold">{formatearFecha(fechaSeleccionada)}</h1>
              <Popover open={calendarioAbierto} onOpenChange={setCalendarioAbierto}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Cambiar fecha
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaSeleccionada}
                    onSelect={(fecha) => {
                      if (fecha) {
                        setFechaSeleccionada(fecha)
                        setCalendarioAbierto(false)
                      }
                    }}
                    initialFocus
                    locale={es}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div>
                <span className="font-semibold">Capitán:</span> José Cantillo
              </div>
              <div>
                <span className="font-semibold">Segundo:</span> José Mojica
              </div>
              <div>
                <span className="font-semibold">SITMAR:</span> 608678
              </div>
              <div>
                <span className="font-semibold">Embarcación:</span> El Robert
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
              <span className="sm:hidden">Imprimir</span>
            </Button>
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">Exportar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de buzos */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Buzos</CardTitle>
          <CardDescription>
            Control de equipos y actividades de buceo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-[1200px]">
              {/* Tabla 1: Identificación */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">No</th>
                      <th className="p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">BUZOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buzos.length > 0 ? (
                      buzos.map((buzo, index) => (
                        <tr key={buzo.id} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-1 sm:p-2 text-xs sm:text-sm">{index + 1}</td>
                          <td className="p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.nombre} 
                              label="Nombre del Buzo"
                              className="w-24 sm:w-32 px-1 sm:px-2 py-1 font-medium text-xs sm:text-sm"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-gray-500">
                          No hay buzos registrados para esta fecha
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tabla 2: Equipos */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Tanque</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Maleta</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Reg</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Chal</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Cint</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Pesas</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Msc</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Snk</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Alt</th>
                      <th className="p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Traje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buzos.length > 0 ? (
                      buzos.map((buzo, index) => (
                        <tr key={buzo.id} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="number" 
                              defaultValue={buzo.tanque} 
                              label="Tanque"
                              className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="number" 
                              defaultValue={buzo.maleta} 
                              label="Maleta"
                              className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.regulador} 
                              label="Regulador"
                              className="w-20 sm:w-24 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.chaleco} 
                              placeholder="-"
                              label="Chaleco"
                              className="w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.cinturon} 
                              placeholder="-"
                              label="Cinturón"
                              className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.pesas} 
                              placeholder="-"
                              label="Pesas"
                              className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.mascara} 
                              placeholder="-"
                              label="Máscara"
                              className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.snorkel} 
                              placeholder="-"
                              label="Snorkel"
                              className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.aletas} 
                              placeholder="-"
                              label="Aletas"
                              className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="p-1 sm:p-2">
                            <SizeSelector 
                              defaultValue={buzo.traje} 
                              className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-4 text-center text-gray-500">
                          No hay equipos registrados para esta fecha
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tabla 3: Actividad y Facturación */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Actividad</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Observaciones</th>
                      <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Valor</th>
                      <th className="p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Factura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buzos.length > 0 ? (
                      buzos.map((buzo, index) => (
                        <tr key={buzo.id} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <ActivitySelector 
                              defaultValue={buzo.actividad} 
                              className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.observaciones} 
                              label="Observaciones"
                              className="w-24 sm:w-32 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.valor} 
                              label="Valor"
                              className="w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                          <td className="p-1 sm:p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.factura} 
                              label="Factura"
                              className="w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">
                          No hay actividades registradas para esta fecha
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón para agregar nueva fila */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
          onClick={agregarNuevoBuzo}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Agregar Nuevo Buzo</span>
        </Button>
      </div>

      {/* Tabla de Instructores */}
      <Card>
        <CardHeader>
          <CardTitle>Instructores</CardTitle>
          <CardDescription>
            Registro de instructores y personal de apoyo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">No</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Nombre</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Tanque</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Equipos</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Actividad</th>
                  <th className="p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {instructores.length > 0 ? (
                  instructores.map((instructor, index) => (
                    <tr key={instructor.id} className={`border-b border-gray-200 ${index === 0 ? 'bg-red-100' : index === 1 ? 'bg-green-100' : index === 2 ? 'bg-blue-100' : index === 3 ? 'bg-yellow-100' : index === 4 ? 'bg-purple-100' : 'bg-pink-100'}`}>
                      <td className="border-r border-gray-200 p-1 sm:p-2 text-xs sm:text-sm">{instructor.id}</td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={instructor.nombre} 
                          label="Nombre del Instructor"
                          className="w-32 sm:w-40 px-1 sm:px-2 py-1 font-medium text-xs sm:text-sm"
                      onValueChange={(value) => {
                        setInstructores(prev => prev.map(inst => 
                          inst.id === instructor.id ? { ...inst, nombre: value } : inst
                        ))
                      }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="number" 
                          defaultValue={instructor.tanque} 
                          label="Tanque"
                          className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm"
                      onValueChange={(value) => {
                        setInstructores(prev => prev.map(inst => 
                          inst.id === instructor.id ? { ...inst, tanque: value } : inst
                        ))
                      }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={instructor.equipos} 
                          label="Equipos"
                          className="w-32 sm:w-48 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                      onValueChange={(value) => {
                        setInstructores(prev => prev.map(inst => 
                          inst.id === instructor.id ? { ...inst, equipos: value } : inst
                        ))
                      }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <ActivitySelector 
                          defaultValue={instructor.actividad} 
                          className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                      onValueChange={(value) => {
                        setInstructores(prev => prev.map(inst => 
                          inst.id === instructor.id ? { ...inst, actividad: value } : inst
                        ))
                      }}
                        />
                      </td>
                      <td className="p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={instructor.observaciones} 
                          label="Observaciones"
                          className="w-24 sm:w-32 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                      onValueChange={(value) => {
                        setInstructores(prev => prev.map(inst => 
                          inst.id === instructor.id ? { ...inst, observaciones: value } : inst
                        ))
                      }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No hay instructores registrados para esta fecha
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Piscina */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">PISCINA</CardTitle>
          <CardDescription>
            Registro de actividades en piscina
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">No</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Nombre</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Tanque</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Equipos</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Actividad</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Ubicación</th>
                  <th className="p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {piscina.length > 0 ? (
                  piscina.map((persona, index) => (
                    <tr key={persona.id} className="border-b border-gray-200">
                      <td className="border-r border-gray-200 p-1 sm:p-2 text-xs sm:text-sm">{persona.id}</td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={persona.nombre} 
                          label="Nombre"
                          className="w-24 sm:w-32 px-1 sm:px-2 py-1 font-medium text-xs sm:text-sm"
                          onValueChange={(value) => {
                            setPiscina(prev => prev.map(p => 
                              p.id === persona.id ? { ...p, nombre: value } : p
                            ))
                          }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="number" 
                          defaultValue={persona.tanque} 
                          label="Tanque"
                          className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm"
                          onValueChange={(value) => {
                            setPiscina(prev => prev.map(p => 
                              p.id === persona.id ? { ...p, tanque: value } : p
                            ))
                          }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={persona.equipos} 
                          label="Equipos"
                          className="w-20 sm:w-24 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                          onValueChange={(value) => {
                            setPiscina(prev => prev.map(p => 
                              p.id === persona.id ? { ...p, equipos: value } : p
                            ))
                          }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <ActivitySelector 
                          defaultValue={persona.actividad} 
                          className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                          onValueChange={(value) => {
                            setPiscina(prev => prev.map(p => 
                              p.id === persona.id ? { ...p, actividad: value } : p
                            ))
                          }}
                        />
                      </td>
                      <td className="border-r border-gray-200 p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={persona.ubicacion} 
                          label="Ubicación"
                          className="w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                          onValueChange={(value) => {
                            setPiscina(prev => prev.map(p => 
                              p.id === persona.id ? { ...p, ubicacion: value } : p
                            ))
                          }}
                        />
                      </td>
                      <td className="p-1 sm:p-2">
                        <EditableCell 
                          type="text" 
                          defaultValue={persona.observaciones} 
                          label="Observaciones"
                          className="w-24 sm:w-32 px-1 sm:px-2 py-1 text-xs sm:text-sm"
                          onValueChange={(value) => {
                            setPiscina(prev => prev.map(p => 
                              p.id === persona.id ? { ...p, observaciones: value } : p
                            ))
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No hay actividades de piscina registradas para esta fecha
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Botón para agregar nueva fila a PISCINA */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="lg"
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
          onClick={agregarNuevaPersonaPiscina}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Agregar Nueva Persona a Piscina</span>
        </Button>
      </div>

    </div>
  )
}