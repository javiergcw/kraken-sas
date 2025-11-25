"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/reservation/card"
import { Button } from "@/components/reservation/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/reservation/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/reservation/popover"
import {    
  Download, 
  Plus,
  Printer,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import React, { useState, useEffect } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { operationController, peopleController, marinaController, vesselController, operationGroupController } from "@/components/core"
import { OperationDto } from "@/components/core/operations/dto"
import { PeopleDto } from "@/components/core/people/dto"
import { MarinaDto } from "@/components/core/marinas/dto"
import { VesselDto } from "@/components/core/vessels/dto"
import { OperationGroupDto } from "@/components/core/operation-groups/dto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/reutilizables/seletc"
import { Input } from "@/components/reutilizables/input"
import { Textarea } from "@/components/reutilizables/text-area"
import { Label } from "@/components/reutilizables/label"

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
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md text-lg min-h-[60px] resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder={placeholder}
                autoFocus
                rows={3}
              />
            ) : (
              <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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

const weekDayLabels = ["L", "M", "X", "J", "V", "S", "D"]

interface CompactCalendarProps {
  selectedDate: Date
  onSelect: (date: Date) => void
}

const CompactCalendar: React.FC<CompactCalendarProps> = ({ selectedDate, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  useEffect(() => {
    setCurrentMonth(selectedDate)
  }, [selectedDate])

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  const handleSelect = (day: Date) => {
    onSelect(day)
    setCurrentMonth(day)
  }

  return (
    <div className="w-[320px] p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </div>
        <button
          type="button"
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
        {weekDayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = isSameDay(day, selectedDate)
          const today = isToday(day)

          let cellClasses =
            "w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors"

          if (isSelected) {
            cellClasses += " bg-blue-600 text-white shadow"
          } else if (today) {
            cellClasses += " border border-blue-500 text-blue-600"
          } else if (!isCurrentMonth) {
            cellClasses += " text-gray-300"
          } else {
            cellClasses += " text-gray-700 hover:bg-gray-100"
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={cellClasses}
              onClick={() => handleSelect(day)}
            >
              {format(day, "d", { locale: es })}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function SheetPage() {
  // Estado para manejar diferentes fechas
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [calendarioAbierto, setCalendarioAbierto] = useState(false)
  
  // Estados para operación
  const [operation, setOperation] = useState<OperationDto | null>(null)
  const [loadingOperation, setLoadingOperation] = useState(false)
  const [operationId, setOperationId] = useState<string | null>(null)
  const [peopleCatalog, setPeopleCatalog] = useState<PeopleDto[]>([])
  const [marinasCatalog, setMarinasCatalog] = useState<MarinaDto[]>([])
  const [vesselsCatalog, setVesselsCatalog] = useState<VesselDto[]>([])
  const [loadingCatalogs, setLoadingCatalogs] = useState(false)
  
  // Estados para diálogo de crear operación
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creatingOperation, setCreatingOperation] = useState(false)
  const [formData, setFormData] = useState({
    marina_id: "",
    vessel_id: "",
    captain_id: "",
    first_officer_id: "",
    weather: "",
    general_notes: "",
    status: "DRAFT" as "DRAFT" | "CONFIRMED" | "CLOSED"
  })

  // Estados para grupos de operación
  const [operationGroups, setOperationGroups] = useState<OperationGroupDto[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false)
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<OperationGroupDto | null>(null)
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [updatingGroup, setUpdatingGroup] = useState(false)
  const [groupFormData, setGroupFormData] = useState({
    environment: "OCEAN" as "OCEAN" | "POOL",
    label: "",
    start_time: "",
    end_time: "",
    comments: ""
  })

  // Instructores estáticos - siempre los mismos nombres
  const instructoresEstaticos = [
    { id: 20, nombre: "Carlos Bustamante" },
    { id: 21, nombre: "Luis Cardona" },
    { id: 22, nombre: "Edil de Andreis" },
    { id: 23, nombre: "Otto Naranjo" },
    { id: 24, nombre: "Emerson de Andreis" },
    { id: 25, nombre: "Manuel D Macedo" }
  ]

  // Estados locales para los datos editables - ahora vacíos
  const [buzos, setBuzos] = useState<any[]>([])
  const [instructores, setInstructores] = useState(
    instructoresEstaticos.map(inst => ({ ...inst, tanque: "", equipos: "", actividad: "", observaciones: "" }))
  )
  const [piscina, setPiscina] = useState<any[]>([])

  // Cargar operación cuando cambie la fecha
  useEffect(() => {
    const fechaString = format(fechaSeleccionada, "yyyy-MM-dd")
    loadOperationForDate(fechaString)
  }, [fechaSeleccionada])

  useEffect(() => {
    loadCatalogData()
  }, [])

  // Función para cargar operación por fecha
  const loadOperationForDate = async (date: string) => {
    try {
      setLoadingOperation(true)
      const response = await operationController.getAll(date)
      
      if (response?.success && response.data && response.data.length > 0) {
        // Si hay operaciones, tomar la primera y cargar sus detalles
        const firstOperation = response.data[0]
        setOperationId(firstOperation.id)
        
        // Cargar detalles completos de la operación
        const detailResponse = await operationController.getById(firstOperation.id)
        if (detailResponse?.success && detailResponse.data) {
          setOperation(detailResponse.data)
          // Cargar grupos de la operación
          await loadOperationGroups(firstOperation.id)
        }
      } else {
        // No hay operación para esta fecha
        setOperation(null)
        setOperationId(null)
        setOperationGroups([])
      }
    } catch (error) {
      console.error('Error al cargar operación:', error)
      setOperation(null)
      setOperationId(null)
    } finally {
      setLoadingOperation(false)
    }
  }

  // Función para abrir diálogo de crear operación
  const openCreateDialog = () => {
    setFormData({
      marina_id: "",
      vessel_id: "",
      captain_id: "",
      first_officer_id: "",
      weather: "",
      general_notes: "",
      status: "DRAFT"
    })
    setCreateDialogOpen(true)
  }

  // Función para crear una nueva operación
  const handleCreateOperation = async () => {
    try {
      setCreatingOperation(true)
      const fechaString = format(fechaSeleccionada, "yyyy-MM-dd")
      
      const operationData: any = {
        operation_date: fechaString,
        status: formData.status,
      }
      
      if (formData.marina_id) operationData.marina_id = formData.marina_id
      if (formData.vessel_id) operationData.vessel_id = formData.vessel_id
      if (formData.captain_id) operationData.captain_id = formData.captain_id
      if (formData.first_officer_id) operationData.first_officer_id = formData.first_officer_id
      if (formData.weather) operationData.weather = formData.weather
      if (formData.general_notes) operationData.general_notes = formData.general_notes
      
      const response = await operationController.create(operationData)
      
      if (response?.success && response.data) {
        setOperation(response.data)
        setOperationId(response.data.id)
        setCreateDialogOpen(false)
        // Recargar la operación para obtener los datos completos
        await loadOperationForDate(fechaString)
        // Cargar grupos de la nueva operación
        if (response.data.id) {
          await loadOperationGroups(response.data.id)
        }
      }
    } catch (error) {
      console.error('Error al crear operación:', error)
    } finally {
      setCreatingOperation(false)
    }
  }

  const loadCatalogData = async () => {
    try {
      setLoadingCatalogs(true)
      const [peopleRes, marinasRes, vesselsRes] = await Promise.all([
        peopleController.getAll(),
        marinaController.getAll(),
        vesselController.getAll(),
      ])

      if (peopleRes?.success && peopleRes.data) {
        setPeopleCatalog(peopleRes.data)
      }

      if (marinasRes?.success && marinasRes.data) {
        setMarinasCatalog(marinasRes.data)
      }

      if (vesselsRes?.success && vesselsRes.data) {
        setVesselsCatalog(vesselsRes.data)
      }
    } catch (error) {
      console.error('Error al cargar catálogos:', error)
    } finally {
      setLoadingCatalogs(false)
    }
  }

  const getPersonName = (id?: string | null) => {
    if (!id) return 'Sin asignar'
    const person = peopleCatalog.find(person => person.id === id)
    return person?.full_name ?? 'Sin asignar'
  }

  const getMarinaName = (id?: string | null) => {
    if (!id) return 'Sin asignar'
    const marina = marinasCatalog.find(item => item.id === id)
    return marina?.name ?? 'Sin asignar'
  }

  const getVesselName = (id?: string | null) => {
    if (!id) return 'Sin asignar'
    const vessel = vesselsCatalog.find(item => item.id === id)
    return vessel?.name ?? 'Sin asignar'
  }

  const agregarNuevoBuzo = () => {
    const nuevoId = buzos.length > 0 ? Math.max(...buzos.map(b => b.id)) + 1 : 1
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
    const nuevoId = piscina.length > 0 ? Math.max(...piscina.map(p => p.id)) + 1 : 1
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

  // Función para cargar grupos de operación
  const loadOperationGroups = async (operationId: string) => {
    try {
      setLoadingGroups(true)
      const response = await operationGroupController.getAllByOperation(operationId)
      if (response?.success && response.data) {
        setOperationGroups(response.data)
      } else {
        setOperationGroups([])
      }
    } catch (error) {
      console.error('Error al cargar grupos de operación:', error)
      setOperationGroups([])
    } finally {
      setLoadingGroups(false)
    }
  }

  // Función para abrir diálogo de crear grupo
  const openCreateGroupDialog = (environment: "OCEAN" | "POOL") => {
    setGroupFormData({
      environment,
      label: "",
      start_time: "",
      end_time: "",
      comments: ""
    })
    setCreateGroupDialogOpen(true)
  }

  // Función para crear un grupo
  const handleCreateGroup = async () => {
    if (!operationId) return
    
    try {
      setCreatingGroup(true)
      
      // Preparar datos: solo incluir campos con valores
      const groupData: any = {
        environment: groupFormData.environment, // requerido
      }
      
      // Solo agregar campos opcionales si tienen valores
      if (groupFormData.label && groupFormData.label.trim()) {
        groupData.label = groupFormData.label.trim()
      }
      
      if (groupFormData.start_time && groupFormData.start_time.trim()) {
        // El input type="time" ya devuelve formato HH:MM
        groupData.start_time = groupFormData.start_time.trim()
      }
      
      if (groupFormData.end_time && groupFormData.end_time.trim()) {
        // El input type="time" ya devuelve formato HH:MM
        groupData.end_time = groupFormData.end_time.trim()
      }
      
      if (groupFormData.comments && groupFormData.comments.trim()) {
        groupData.comments = groupFormData.comments.trim()
      }
      
      console.log('Enviando datos del grupo:', groupData)
      
      const response = await operationGroupController.create(operationId, groupData)
      
      if (response?.success && response.data) {
        await loadOperationGroups(operationId)
        setCreateGroupDialogOpen(false)
        // Limpiar formulario
        setGroupFormData({
          environment: "OCEAN",
          label: "",
          start_time: "",
          end_time: "",
          comments: ""
        })
      } else {
        console.error('Error en la respuesta:', response)
        alert(response?.message || 'Error al crear el grupo. Por favor, intente nuevamente.')
      }
    } catch (error) {
      console.error('Error al crear grupo:', error)
      alert('Error al crear el grupo. Por favor, verifique los datos e intente nuevamente.')
    } finally {
      setCreatingGroup(false)
    }
  }

  // Función para abrir diálogo de editar grupo
  const openEditGroupDialog = (group: OperationGroupDto) => {
    setSelectedGroup(group)
    setGroupFormData({
      environment: group.environment,
      label: group.label || "",
      start_time: group.start_time || "",
      end_time: group.end_time || "",
      comments: group.comments || ""
    })
    setEditGroupDialogOpen(true)
  }

  // Función para actualizar un grupo
  const handleUpdateGroup = async () => {
    if (!selectedGroup) return
    
    try {
      setUpdatingGroup(true)
      
      // Preparar datos: solo incluir campos con valores o que hayan cambiado
      const groupData: any = {}
      
      // Environment es requerido en la actualización
      if (groupFormData.environment) {
        groupData.environment = groupFormData.environment
      }
      
      // Solo agregar campos opcionales si tienen valores
      if (groupFormData.label !== undefined) {
        if (groupFormData.label.trim()) {
          groupData.label = groupFormData.label.trim()
        } else {
          groupData.label = null // Permitir limpiar el campo
        }
      }
      
      if (groupFormData.start_time !== undefined) {
        if (groupFormData.start_time.trim()) {
          groupData.start_time = groupFormData.start_time.trim()
        } else {
          groupData.start_time = null
        }
      }
      
      if (groupFormData.end_time !== undefined) {
        if (groupFormData.end_time.trim()) {
          groupData.end_time = groupFormData.end_time.trim()
        } else {
          groupData.end_time = null
        }
      }
      
      if (groupFormData.comments !== undefined) {
        if (groupFormData.comments.trim()) {
          groupData.comments = groupFormData.comments.trim()
        } else {
          groupData.comments = null
        }
      }
      
      const response = await operationGroupController.update(selectedGroup.id, groupData)
      
      if (response?.success && response.data && operationId) {
        await loadOperationGroups(operationId)
        setEditGroupDialogOpen(false)
        setSelectedGroup(null)
      }
    } catch (error) {
      console.error('Error al actualizar grupo:', error)
    } finally {
      setUpdatingGroup(false)
    }
  }

  // Función para formatear fecha
  const formatearFecha = (fecha: Date) => {
    return format(fecha, "EEEE d 'de' MMMM", { locale: es })
  }

  return (
    <div className="flex-1 space-y-2 px-12 py-5">
      {/* Header con selector de fecha */}
      <div className="bg-white border border-gray-200 p-2 sm:p-3 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{formatearFecha(fechaSeleccionada)}</h1>
              <Popover open={calendarioAbierto} onOpenChange={setCalendarioAbierto}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Cambiar fecha
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white !bg-white border-none shadow-none" align="start">
                  <CompactCalendar
                    selectedDate={fechaSeleccionada}
                    onSelect={(date) => {
                      setFechaSeleccionada(date)
                      setCalendarioAbierto(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Información de operación */}
            <div className="space-y-3">
              {loadingOperation ? (
                <div className="text-sm text-gray-500">Cargando operación...</div>
              ) : operation ? (
                <>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Estado:</span> {operation.status}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-700">
                    <div>
                      <span className="font-semibold">Capitán:</span> {getPersonName(operation.captain_id)}
                    </div>
                    <div>
                      <span className="font-semibold">Segundo:</span> {getPersonName(operation.first_officer_id)}
                    </div>
                    <div>
                      <span className="font-semibold">Marina:</span> {getMarinaName(operation.marina_id)}
                    </div>
                    <div>
                      <span className="font-semibold">Embarcación:</span> {getVesselName(operation.vessel_id)}
                    </div>
                    <div>
                      <span className="font-semibold">Clima:</span> {operation.weather || 'Sin definir'}
                    </div>
                    <div>
                      <span className="font-semibold">Notas:</span> {operation.general_notes || 'Sin notas'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    No hay operación activa para esta fecha
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={openCreateDialog}
                    className="text-xs"
                    disabled={loadingCatalogs}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Crear operación
                  </Button>
                </div>
              )}
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

      {/* Sección de Grupos de Operación */}
      {operation && operationId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grupos de Operación</CardTitle>
                <CardDescription>
                  Grupos de pool y océano para esta operación
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCreateGroupDialog("OCEAN")}
                  disabled={loadingGroups}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Grupo Océano
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCreateGroupDialog("POOL")}
                  disabled={loadingGroups}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Grupo Piscina
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingGroups ? (
              <div className="text-sm text-gray-500 text-center py-4">Cargando grupos...</div>
            ) : operationGroups.length > 0 ? (
              <div className="space-y-4">
                {operationGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            group.environment === "OCEAN" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {group.environment === "OCEAN" ? "OCÉANO" : "PISCINA"}
                          </span>
                          {group.label && (
                            <span className="text-sm font-medium text-gray-900">{group.label}</span>
                          )}
                        </div>
                        {(group.start_time || group.end_time) && (
                          <div className="text-sm text-gray-600 mb-2">
                            {group.start_time && <span>Inicio: {group.start_time}</span>}
                            {group.start_time && group.end_time && <span className="mx-2">-</span>}
                            {group.end_time && <span>Fin: {group.end_time}</span>}
                          </div>
                        )}
                        {group.comments && (
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">Comentarios:</span> {group.comments}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditGroupDialog(group)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No hay grupos creados. Crea un grupo de océano o piscina para comenzar.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabla de buzos */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Buzos</CardTitle>
          <CardDescription>
            Control de equipos y actividades de buceo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tabla 1: Identificación */}
            <div className="border border-gray-200 rounded overflow-hidden bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs w-20">No</th>
                    <th className="p-2 text-left font-semibold text-xs">BUZOS</th>
                  </tr>
                </thead>
                <tbody>
                  {buzos.length > 0 ? (
                    buzos.map((buzo, index) => (
                      <tr key={buzo.id} className="border-b border-gray-200">
                        <td className="border-r border-gray-200 p-2 text-xs text-center">{index + 1}</td>
                        <td className="p-2">
                          <EditableCell 
                            type="text" 
                            defaultValue={buzo.nombre} 
                            label="Nombre del Buzo"
                            className="w-full px-2 py-1 font-medium text-xs border-0 bg-transparent"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-4 text-center text-gray-500">
                        No hay buzos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tabla 2: Equipos */}
            <div className="overflow-x-auto">
              <div className="border border-gray-200 rounded overflow-hidden bg-white inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Tanque</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Maleta</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Reg</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Chal</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Cint</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Pesas</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Msc</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Snk</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Alt</th>
                      <th className="p-2 text-center font-semibold text-xs">Traje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buzos.length > 0 ? (
                      buzos.map((buzo, index) => (
                        <tr key={buzo.id} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="number" 
                              defaultValue={buzo.tanque} 
                              label="Tanque"
                              className="w-full px-2 py-1 text-center text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="number" 
                              defaultValue={buzo.maleta} 
                              label="Maleta"
                              className="w-full px-2 py-1 text-center text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.regulador} 
                              label="Regulador"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.chaleco} 
                              placeholder="-"
                              label="Chaleco"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.cinturon} 
                              placeholder="-"
                              label="Cinturón"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.pesas} 
                              placeholder="-"
                              label="Pesas"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.mascara} 
                              placeholder="-"
                              label="Máscara"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.snorkel} 
                              placeholder="-"
                              label="Snorkel"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.aletas} 
                              placeholder="-"
                              label="Aletas"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="p-2">
                            <SizeSelector 
                              defaultValue={buzo.traje} 
                              className="w-full px-2 py-1 text-xs"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-4 text-center text-gray-500">
                          No hay equipos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla 3: Actividad y Facturación */}
            <div className="overflow-x-auto">
              <div className="border border-gray-200 rounded overflow-hidden bg-white inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Actividad</th>
                      <th className="border-r border-gray-200 p-2 text-left font-semibold text-xs">Observaciones</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Valor</th>
                      <th className="p-2 text-center font-semibold text-xs">Factura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buzos.length > 0 ? (
                      buzos.map((buzo, index) => (
                        <tr key={buzo.id} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-2">
                            <ActivitySelector 
                              defaultValue={buzo.actividad} 
                              className="w-full px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.observaciones} 
                              label="Observaciones"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.valor} 
                              label="Valor"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent text-center"
                            />
                          </td>
                          <td className="p-2">
                            <EditableCell 
                              type="text" 
                              defaultValue={buzo.factura} 
                              label="Factura"
                              className="w-full px-2 py-1 text-xs border-0 bg-transparent text-center"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">
                          No hay actividades registradas
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
                      No hay instructores registrados
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
                      No hay actividades de piscina registradas
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

      {/* Diálogo para crear operación */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Operación</DialogTitle>
            <DialogDescription>
              Complete los datos de la operación para el día {format(fechaSeleccionada, "dd/MM/yyyy", { locale: es })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Marina */}
            <div className="space-y-2">
              <Label htmlFor="marina">Marina</Label>
              <Select
                value={formData.marina_id || undefined}
                onValueChange={(value) => setFormData({ ...formData, marina_id: value || "" })}
              >
                <SelectTrigger id="marina">
                  <SelectValue placeholder="Seleccione una marina" />
                </SelectTrigger>
                <SelectContent>
                  {marinasCatalog
                    .filter(marina => marina.is_active)
                    .map((marina) => (
                      <SelectItem key={marina.id} value={marina.id}>
                        {marina.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Embarcación */}
            <div className="space-y-2">
              <Label htmlFor="vessel">Embarcación</Label>
              <Select
                value={formData.vessel_id || undefined}
                onValueChange={(value) => setFormData({ ...formData, vessel_id: value || "" })}
              >
                <SelectTrigger id="vessel">
                  <SelectValue placeholder="Seleccione una embarcación" />
                </SelectTrigger>
                <SelectContent>
                  {vesselsCatalog
                    .filter(vessel => vessel.is_active)
                    .map((vessel) => (
                      <SelectItem key={vessel.id} value={vessel.id}>
                        {vessel.name} {vessel.capacity ? `(${vessel.capacity} personas)` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capitán */}
            <div className="space-y-2">
              <Label htmlFor="captain">Capitán</Label>
              <Select
                value={formData.captain_id || undefined}
                onValueChange={(value) => setFormData({ ...formData, captain_id: value || "" })}
              >
                <SelectTrigger id="captain">
                  <SelectValue placeholder="Seleccione un capitán" />
                </SelectTrigger>
                <SelectContent>
                  {peopleCatalog
                    .filter(person => person.is_active)
                    .map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.full_name} {person.default_role ? `(${person.default_role})` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Segundo */}
            <div className="space-y-2">
              <Label htmlFor="first_officer">Segundo al Mando</Label>
              <Select
                value={formData.first_officer_id || undefined}
                onValueChange={(value) => setFormData({ ...formData, first_officer_id: value || "" })}
              >
                <SelectTrigger id="first_officer">
                  <SelectValue placeholder="Seleccione un segundo al mando" />
                </SelectTrigger>
                <SelectContent>
                  {peopleCatalog
                    .filter(person => person.is_active)
                    .map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.full_name} {person.default_role ? `(${person.default_role})` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clima */}
            <div className="space-y-2">
              <Label htmlFor="weather">Clima</Label>
              <Input
                id="weather"
                placeholder="Ej: Parcialmente nublado, soleado, lluvioso..."
                value={formData.weather}
                onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
              />
            </div>

            {/* Notas generales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Generales</Label>
              <Textarea
                id="notes"
                placeholder="Ingrese notas generales sobre la operación..."
                value={formData.general_notes}
                onChange={(e) => setFormData({ ...formData, general_notes: e.target.value })}
                rows={4}
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "DRAFT" | "CONFIRMED" | "CLOSED") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="CLOSED">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={creatingOperation}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateOperation}
              disabled={creatingOperation}
            >
              {creatingOperation ? "Creando..." : "Crear Operación"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear grupo */}
      <Dialog open={createGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear Grupo de {groupFormData.environment === "OCEAN" ? "Océano" : "Piscina"}</DialogTitle>
            <DialogDescription>
              Complete los datos del grupo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Ambiente (solo lectura, ya está definido) */}
            <div className="space-y-2">
              <Label htmlFor="group-environment">Ambiente</Label>
              <Input
                id="group-environment"
                value={groupFormData.environment === "OCEAN" ? "OCÉANO" : "PISCINA"}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="group-label">Etiqueta (opcional)</Label>
              <Input
                id="group-label"
                placeholder="Ej: BUZOS, GRUPO 1..."
                value={groupFormData.label}
                onChange={(e) => setGroupFormData({ ...groupFormData, label: e.target.value })}
              />
            </div>

            {/* Hora de inicio */}
            <div className="space-y-2">
              <Label htmlFor="group-start-time">Hora de Inicio (opcional)</Label>
              <Input
                id="group-start-time"
                type="time"
                value={groupFormData.start_time}
                onChange={(e) => setGroupFormData({ ...groupFormData, start_time: e.target.value })}
              />
            </div>

            {/* Hora de fin */}
            <div className="space-y-2">
              <Label htmlFor="group-end-time">Hora de Fin (opcional)</Label>
              <Input
                id="group-end-time"
                type="time"
                value={groupFormData.end_time}
                onChange={(e) => setGroupFormData({ ...groupFormData, end_time: e.target.value })}
              />
            </div>

            {/* Comentarios */}
            <div className="space-y-2">
              <Label htmlFor="group-comments">Comentarios (opcional)</Label>
              <Textarea
                id="group-comments"
                placeholder="Ej: Salida doble tanque..."
                value={groupFormData.comments}
                onChange={(e) => setGroupFormData({ ...groupFormData, comments: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCreateGroupDialogOpen(false)}
              disabled={creatingGroup}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={creatingGroup}
            >
              {creatingGroup ? "Creando..." : "Crear Grupo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar grupo */}
      <Dialog open={editGroupDialogOpen} onOpenChange={setEditGroupDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Modifique los datos del grupo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Ambiente */}
            <div className="space-y-2">
              <Label htmlFor="edit-group-environment">Ambiente</Label>
              <Select
                value={groupFormData.environment}
                onValueChange={(value: "OCEAN" | "POOL") => setGroupFormData({ ...groupFormData, environment: value })}
              >
                <SelectTrigger id="edit-group-environment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OCEAN">OCÉANO</SelectItem>
                  <SelectItem value="POOL">PISCINA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="edit-group-label">Etiqueta (opcional)</Label>
              <Input
                id="edit-group-label"
                placeholder="Ej: BUZOS, GRUPO 1..."
                value={groupFormData.label}
                onChange={(e) => setGroupFormData({ ...groupFormData, label: e.target.value })}
              />
            </div>

            {/* Hora de inicio */}
            <div className="space-y-2">
              <Label htmlFor="edit-group-start-time">Hora de Inicio (opcional)</Label>
              <Input
                id="edit-group-start-time"
                type="time"
                value={groupFormData.start_time}
                onChange={(e) => setGroupFormData({ ...groupFormData, start_time: e.target.value })}
              />
            </div>

            {/* Hora de fin */}
            <div className="space-y-2">
              <Label htmlFor="edit-group-end-time">Hora de Fin (opcional)</Label>
              <Input
                id="edit-group-end-time"
                type="time"
                value={groupFormData.end_time}
                onChange={(e) => setGroupFormData({ ...groupFormData, end_time: e.target.value })}
              />
            </div>

            {/* Comentarios */}
            <div className="space-y-2">
              <Label htmlFor="edit-group-comments">Comentarios (opcional)</Label>
              <Textarea
                id="edit-group-comments"
                placeholder="Ej: Salida doble tanque..."
                value={groupFormData.comments}
                onChange={(e) => setGroupFormData({ ...groupFormData, comments: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setEditGroupDialogOpen(false)
                setSelectedGroup(null)
              }}
              disabled={updatingGroup}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateGroup}
              disabled={updatingGroup}
            >
              {updatingGroup ? "Actualizando..." : "Actualizar Grupo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

