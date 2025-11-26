"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/reservation/card"
import { Button } from "@/components/reservation/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/reservation/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/reservation/popover"
import {    
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  StickyNote
} from "lucide-react"
import React, { useState, useEffect } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { operationController, peopleController, marinaController, vesselController, operationGroupController, activityController } from "@/components/core"
import { OperationDto } from "@/components/core/operations/dto"
import { PeopleDto } from "@/components/core/people/dto"
import { MarinaDto } from "@/components/core/marinas/dto"
import { VesselDto } from "@/components/core/vessels/dto"
import { OperationGroupDto } from "@/components/core/operation-groups/dto"
import { ParticipantDto, ParticipantCreateDto, ParticipantUpdateDto, ParticipantNoteDto, ParticipantNoteCreateDto } from "@/components/core/operation-groups/controllers/OperationGroupController"
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
  const [activitiesCatalog, setActivitiesCatalog] = useState<any[]>([])
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

  // Estados para participantes
  const [participants, setParticipants] = useState<Record<string, ParticipantDto[]>>({})
  const [loadingParticipants, setLoadingParticipants] = useState<Record<string, boolean>>({})
  const [addParticipantDialogOpen, setAddParticipantDialogOpen] = useState(false)
  const [editParticipantDialogOpen, setEditParticipantDialogOpen] = useState(false)
  const [selectedGroupForParticipant, setSelectedGroupForParticipant] = useState<OperationGroupDto | null>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantDto | null>(null)
  const [participantRole, setParticipantRole] = useState<'DIVER' | 'INSTRUCTOR' | 'CREW'>('DIVER')
  const [addingParticipant, setAddingParticipant] = useState(false)
  const [updatingParticipant, setUpdatingParticipant] = useState(false)
  
  // Estados para notas de participantes
  const [participantNotes, setParticipantNotes] = useState<Record<string, ParticipantNoteDto[]>>({})
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false)
  const [selectedParticipantForNote, setSelectedParticipantForNote] = useState<ParticipantDto | null>(null)
  const [addingNote, setAddingNote] = useState(false)
  const [noteFormData, setNoteFormData] = useState<Omit<ParticipantNoteCreateDto, 'person_id'>>({
    note: "",
    color: "#FFE599"
  })
  const [participantFormData, setParticipantFormData] = useState<ParticipantCreateDto>({
    person_id: "",
    role: "DIVER",
    tanks: undefined,
    bags: undefined,
    regulator: "",
    bcd: "",
    weightbelt: "",
    weights_kg: undefined,
    misc: "",
    snorkel_set: "",
    altimeter: "",
    suit_size: "",
    observations: "",
    value_label: "",
    invoice_reference: "",
    payment_status: ""
  })

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
      const [peopleRes, marinasRes, vesselsRes, activitiesRes] = await Promise.all([
        peopleController.getAll(),
        marinaController.getAll(),
        vesselController.getAll(),
        activityController.getAll(),
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

      if (activitiesRes?.success && activitiesRes.data) {
        setActivitiesCatalog(activitiesRes.data)
      }
    } catch (error) {
      console.error('Error al cargar catálogos:', error)
    } finally {
      setLoadingCatalogs(false)
    }
  }

  // Función helper para obtener participantes de grupos de océano con rol DIVER
  const getOceanDivers = (): ParticipantDto[] => {
    const oceanGroups = operationGroups.filter(g => g.environment === "OCEAN")
    const allParticipants: ParticipantDto[] = []
    oceanGroups.forEach(group => {
      const groupParticipants = participants[group.id]
      // Asegurar que siempre sea un array
      const participantsArray = Array.isArray(groupParticipants) ? groupParticipants : []
      const divers = participantsArray.filter(p => p.role === "DIVER")
      allParticipants.push(...divers)
    })
    return allParticipants
  }

  // Función helper para obtener participantes de grupos de piscina con rol DIVER
  const getPoolDivers = (): ParticipantDto[] => {
    const poolGroups = operationGroups.filter(g => g.environment === "POOL")
    const allParticipants: ParticipantDto[] = []
    poolGroups.forEach(group => {
      const groupParticipants = participants[group.id]
      // Asegurar que siempre sea un array
      const participantsArray = Array.isArray(groupParticipants) ? groupParticipants : []
      const divers = participantsArray.filter(p => p.role === "DIVER")
      allParticipants.push(...divers)
    })
    return allParticipants
  }

  // Función helper para obtener participantes con rol INSTRUCTOR
  const getInstructors = (): ParticipantDto[] => {
    const allParticipants: ParticipantDto[] = []
    operationGroups.forEach(group => {
      const groupParticipants = participants[group.id]
      // Asegurar que siempre sea un array
      const participantsArray = Array.isArray(groupParticipants) ? groupParticipants : []
      const instructors = participantsArray.filter(p => p.role === "INSTRUCTOR")
      allParticipants.push(...instructors)
    })
    return allParticipants
  }

  // Función helper para obtener nombre de persona
  const getParticipantName = (personId: string): string => {
    const person = peopleCatalog.find(p => p.id === personId)
    return person?.full_name || 'Sin nombre'
  }

  // Función helper para obtener el grupo de un participante
  const getParticipantGroup = (participantId: string): OperationGroupDto | null => {
    for (const group of operationGroups) {
      const groupParticipants = participants[group.id]
      if (Array.isArray(groupParticipants)) {
        const found = groupParticipants.find(p => p.id === participantId)
        if (found) return group
      }
    }
    return null
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
    // Obtener el primer grupo de océano
    const oceanGroup = operationGroups.find(g => g.environment === "OCEAN")
    if (oceanGroup) {
      openAddParticipantDialog(oceanGroup, "DIVER")
    }
  }

  const agregarNuevaPersonaPiscina = () => {
    // Obtener el primer grupo de piscina
    const poolGroup = operationGroups.find(g => g.environment === "POOL")
    if (poolGroup) {
      openAddParticipantDialog(poolGroup, "DIVER")
    }
  }

  // Función para cargar grupos de operación
  const loadOperationGroups = async (operationId: string) => {
    try {
      setLoadingGroups(true)
      const response = await operationGroupController.getAllByOperation(operationId)
      if (response?.success && response.data) {
        setOperationGroups(response.data)
        // Cargar participantes de cada grupo
        for (const group of response.data) {
          await loadGroupParticipants(group.id)
        }
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

  // Función para cargar participantes de un grupo
  const loadGroupParticipants = async (groupId: string) => {
    try {
      setLoadingParticipants(prev => ({ ...prev, [groupId]: true }))
      const response = await operationGroupController.getParticipants(groupId)
      if (response.success && response.data) {
        // Asegurar que siempre sea un array
        const participantsArray = Array.isArray(response.data) ? response.data : []
        setParticipants(prev => ({ ...prev, [groupId]: participantsArray }))
      } else {
        setParticipants(prev => ({ ...prev, [groupId]: [] }))
      }
    } catch (error) {
      console.error('Error al cargar participantes:', error)
      setParticipants(prev => ({ ...prev, [groupId]: [] }))
    } finally {
      setLoadingParticipants(prev => ({ ...prev, [groupId]: false }))
    }
  }

  // Función para abrir diálogo de agregar participante
  const openAddParticipantDialog = (group: OperationGroupDto, role: 'DIVER' | 'INSTRUCTOR' | 'CREW') => {
    setSelectedGroupForParticipant(group)
    setParticipantRole(role)
    setParticipantFormData({
      person_id: "",
      role: role,
      tanks: undefined,
      bags: undefined,
      regulator: "",
      bcd: "",
      weightbelt: "",
      weights_kg: undefined,
      misc: "",
      snorkel_set: "",
      altimeter: "",
      suit_size: "",
      observations: "",
      value_label: "",
      invoice_reference: "",
      payment_status: ""
    })
    setAddParticipantDialogOpen(true)
  }

  // Función para agregar participante
  const handleAddParticipant = async () => {
    if (!selectedGroupForParticipant || !participantFormData.person_id) return

    try {
      setAddingParticipant(true)
      const response = await operationGroupController.addParticipant(
        selectedGroupForParticipant.id,
        participantFormData
      )

      if (response.success) {
        // Recargar participantes del grupo
        await loadGroupParticipants(selectedGroupForParticipant.id)
        setAddParticipantDialogOpen(false)
        setSelectedGroupForParticipant(null)
      } else {
        alert(response.message || 'Error al agregar participante')
      }
    } catch (error) {
      console.error('Error al agregar participante:', error)
      alert('Error al agregar participante')
    } finally {
      setAddingParticipant(false)
    }
  }

  // Función para abrir diálogo de editar participante
  const openEditParticipantDialog = (participant: ParticipantDto, group: OperationGroupDto) => {
    setSelectedParticipant(participant)
    setSelectedGroupForParticipant(group)
    setParticipantRole(participant.role)
    setParticipantFormData({
      person_id: participant.person_id,
      role: participant.role,
      activity_id: participant.activity_id,
      highlight_color: participant.highlight_color,
      tanks: participant.tanks,
      bags: participant.bags,
      regulator: participant.regulator || "",
      bcd: participant.bcd || "",
      weightbelt: participant.weightbelt || "",
      weights_kg: participant.weights_kg,
      misc: participant.misc || "",
      snorkel_set: participant.snorkel_set || "",
      altimeter: participant.altimeter || "",
      suit_size: participant.suit_size || "",
      observations: participant.observations || "",
      value_label: participant.value_label || "",
      invoice_reference: participant.invoice_reference || "",
      payment_status: participant.payment_status || ""
    })
    setEditParticipantDialogOpen(true)
  }

  // Función para actualizar participante
  const handleUpdateParticipant = async () => {
    if (!selectedParticipant || !selectedParticipant.id) return

    try {
      setUpdatingParticipant(true)
      
      // Preparar datos de actualización (sin person_id ya que no se puede cambiar)
      const updateData: ParticipantUpdateDto = {
        activity_id: participantFormData.activity_id,
        role: participantFormData.role,
        highlight_color: participantFormData.highlight_color,
        tanks: participantFormData.tanks,
        bags: participantFormData.bags,
        regulator: participantFormData.regulator || undefined,
        bcd: participantFormData.bcd || undefined,
        weightbelt: participantFormData.weightbelt || undefined,
        weights_kg: participantFormData.weights_kg,
        misc: participantFormData.misc || undefined,
        snorkel_set: participantFormData.snorkel_set || undefined,
        altimeter: participantFormData.altimeter || undefined,
        suit_size: participantFormData.suit_size || undefined,
        observations: participantFormData.observations || undefined,
        value_label: participantFormData.value_label || undefined,
        invoice_reference: participantFormData.invoice_reference || undefined,
        payment_status: participantFormData.payment_status || undefined
      }

      const response = await operationGroupController.updateParticipant(
        selectedParticipant.id,
        updateData
      )

      if (response.success && selectedGroupForParticipant) {
        // Recargar participantes del grupo
        await loadGroupParticipants(selectedGroupForParticipant.id)
        setEditParticipantDialogOpen(false)
        setSelectedParticipant(null)
        setSelectedGroupForParticipant(null)
      } else {
        alert(response.message || 'Error al actualizar participante')
      }
    } catch (error) {
      console.error('Error al actualizar participante:', error)
      alert('Error al actualizar participante')
    } finally {
      setUpdatingParticipant(false)
    }
  }

  // Función para abrir diálogo de agregar nota
  const openAddNoteDialog = (participant: ParticipantDto) => {
    setSelectedParticipantForNote(participant)
    setNoteFormData({
      note: "",
      color: "#FFE599"
    })
    setAddNoteDialogOpen(true)
  }

  // Función para agregar nota a un participante
  const handleAddNote = async () => {
    if (!selectedParticipantForNote || !selectedParticipantForNote.id || !noteFormData.note.trim() || !selectedParticipantForNote.person_id) return

    try {
      setAddingNote(true)
      const response = await operationGroupController.addParticipantNote(
        selectedParticipantForNote.id,
        {
          ...noteFormData,
          person_id: selectedParticipantForNote.person_id
        }
      )

      if (response.success && response.data) {
        // Agregar la nota al estado
        const participantId = selectedParticipantForNote.id
        setParticipantNotes(prev => ({
          ...prev,
          [participantId]: [...(prev[participantId] || []), response.data!]
        }))
        setAddNoteDialogOpen(false)
        setSelectedParticipantForNote(null)
        setNoteFormData({
          note: "",
          color: "#FFE599"
        })
      } else {
        alert(response.message || 'Error al agregar nota')
      }
    } catch (error) {
      console.error('Error al agregar nota:', error)
      alert('Error al agregar nota')
    } finally {
      setAddingNote(false)
    }
  }

  // Función helper para obtener notas de un participante
  const getParticipantNotes = (participantId: string): ParticipantNoteDto[] => {
    return participantNotes[participantId] || []
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

  // Verificar qué tipos de grupos existen
  const hasOceanGroups = operationGroups.some(group => group.environment === "OCEAN")
  const hasPoolGroups = operationGroups.some(group => group.environment === "POOL")

  return (
    <div className="flex-1 space-y-6 px-6 md:px-12 py-6">
      {/* Header con selector de fecha */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Fecha y selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{formatearFecha(fechaSeleccionada)}</h1>
              <Popover open={calendarioAbierto} onOpenChange={setCalendarioAbierto}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
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
            </div>
            
            {/* Información de operación */}
          <div className="space-y-4">
              {loadingOperation ? (
              <div className="text-sm text-gray-500 py-4">Cargando operación...</div>
              ) : operation ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    operation.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    operation.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {operation.status}
                  </span>
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Capitán</div>
                    <div className="text-base font-medium text-gray-900">{getPersonName(operation.captain_id)}</div>
                    </div>
                  <div className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Segundo</div>
                    <div className="text-base font-medium text-gray-900">{getPersonName(operation.first_officer_id)}</div>
                    </div>
                  <div className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Marina</div>
                    <div className="text-base font-medium text-gray-900">{getMarinaName(operation.marina_id)}</div>
                    </div>
                  <div className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Embarcación</div>
                    <div className="text-base font-medium text-gray-900">{getVesselName(operation.vessel_id)}</div>
                    </div>
                  <div className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Clima</div>
                    <div className="text-base font-medium text-gray-900">{operation.weather || 'Sin definir'}</div>
                    </div>
                  <div className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notas</div>
                    <div className="text-base font-medium text-gray-900">{operation.general_notes || 'Sin notas'}</div>
                    </div>
                  </div>
              </div>
              ) : (
              <div className="space-y-3 py-4">
                  <div className="text-sm text-gray-600">
                    No hay operación activa para esta fecha
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={openCreateDialog}
                    disabled={loadingCatalogs}
                  >
                  <Plus className="mr-2 h-4 w-4" />
                    Crear operación
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Botones para crear grupos */}
      {operation && operationId && (
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCreateGroupDialog("OCEAN")}
            disabled={loadingGroups}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Crear Grupo Océano
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCreateGroupDialog("POOL")}
            disabled={loadingGroups}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Crear Grupo Piscina
          </Button>
        </div>
      )}

      {/* Tabla de buzos - Solo se muestra si hay grupos de OCÉANO */}
      {operation && operationId && hasOceanGroups && (
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Registro de Buzos</CardTitle>
          <CardDescription className="mt-1">
            Control de equipos y actividades de buceo
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Información de grupos de océano */}
          <div className="mb-6 space-y-3">
            {operationGroups
              .filter(group => group.environment === "OCEAN")
              .map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 bg-blue-50/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          OCÉANO
                        </span>
                        {group.label && (
                          <span className="text-sm font-semibold text-gray-900">{group.label}</span>
                        )}
                      </div>
                      {(group.start_time || group.end_time) && (
                        <div className="text-sm text-gray-700 mb-1">
                          {group.start_time && <span className="font-medium">Inicio: {group.start_time}</span>}
                          {group.start_time && group.end_time && <span className="mx-2">-</span>}
                          {group.end_time && <span className="font-medium">Fin: {group.end_time}</span>}
                        </div>
                      )}
                      {group.comments && (
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Comentarios:</span> {group.comments}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAddParticipantDialog(group, "DIVER")}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Agregar Buzo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditGroupDialog(group)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="space-y-4">
            {/* Tabla 1: Identificación */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs w-20">No</th>
                    <th className="border-r border-gray-200 p-2 text-left font-semibold text-xs">BUZOS</th>
                    <th className="p-2 text-center font-semibold text-xs w-20">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {getOceanDivers().length > 0 ? (
                    getOceanDivers().map((participant, index) => {
                      const group = getParticipantGroup(participant.id || "")
                      return (
                        <tr key={participant.id || index} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-2 text-xs text-center">{index + 1}</td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="flex items-center gap-2">
                              <div className="px-2 py-1 font-medium text-xs">
                                {getParticipantName(participant.person_id)}
                              </div>
                              {getParticipantNotes(participant.id || "").length > 0 && (
                                <span 
                                  className="px-1.5 py-0.5 rounded-full text-xs font-medium cursor-pointer"
                                  style={{ 
                                    backgroundColor: getParticipantNotes(participant.id || "")[0]?.color || "#FFE599",
                                    color: "#000"
                                  }}
                                  title={`${getParticipantNotes(participant.id || "").length} nota(s)`}
                                >
                                  📝 {getParticipantNotes(participant.id || "").length}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {group && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openAddNoteDialog(participant)}
                                    className="h-6 w-6 p-0"
                                    title="Agregar nota"
                                  >
                                    <StickyNote className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditParticipantDialog(participant, group)}
                                    className="h-6 w-6 p-0"
                                    title="Editar"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No hay buzos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tabla 2: Equipos */}
            <div className="overflow-x-auto">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
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
                    {getOceanDivers().length > 0 ? (
                      getOceanDivers().map((participant, index) => (
                        <tr key={participant.id || index} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-center text-xs">
                              {participant.tanks || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-center text-xs">
                              {participant.bags || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.regulator || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.bcd || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.weightbelt || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.weights_kg ? `${participant.weights_kg}kg` : "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.misc || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.snorkel_set || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.altimeter || "-"}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="w-full px-2 py-1 text-xs text-center">
                              {participant.suit_size || "-"}
                            </div>
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
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Actividad</th>
                      <th className="border-r border-gray-200 p-2 text-left font-semibold text-xs">Observaciones</th>
                      <th className="border-r border-gray-200 p-2 text-center font-semibold text-xs">Valor</th>
                      <th className="p-2 text-center font-semibold text-xs">Factura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOceanDivers().length > 0 ? (
                      getOceanDivers().map((participant, index) => (
                        <tr key={participant.id || index} className="border-b border-gray-200">
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs text-center">
                              {participant.activity_id ? "Actividad" : "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs">
                              {participant.observations || "-"}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-2">
                            <div className="w-full px-2 py-1 text-xs text-center">
                              {participant.value_label || "-"}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="w-full px-2 py-1 text-xs text-center">
                              {participant.invoice_reference || "-"}
                            </div>
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
      )}

      {/* Botón para agregar nueva fila - Solo se muestra si hay grupos de OCÉANO */}
      {operation && operationId && hasOceanGroups && (
      <div className="flex justify-center py-2">
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
      )}

      {/* Tabla de Instructores - Se muestra siempre que haya operación */}
      {operation && operationId && (
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Instructores</CardTitle>
              <CardDescription className="mt-1">
                Registro de instructores y personal de apoyo
              </CardDescription>
            </div>
            {operationGroups.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAddParticipantDialog(operationGroups[0], "INSTRUCTOR")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Instructor
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">No</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Nombre</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Tanque</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Equipos</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Actividad</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Observaciones</th>
                  <th className="p-1 sm:p-2 text-center font-semibold text-xs sm:text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {getInstructors().length > 0 ? (
                  getInstructors().map((participant, index) => {
                    const group = getParticipantGroup(participant.id || "")
                    const highlightColor = participant.highlight_color || "#FFFFFF"
                    return (
                      <tr 
                        key={participant.id || index} 
                        className="border-b border-gray-200"
                        style={{ backgroundColor: highlightColor }}
                      >
                        <td className="border-r border-gray-200 p-1 sm:p-2 text-xs sm:text-sm">{index + 1}</td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-32 sm:w-40 px-1 sm:px-2 py-1 font-medium text-xs sm:text-sm">
                              {getParticipantName(participant.person_id)}
                            </div>
                            {getParticipantNotes(participant.id || "").length > 0 && (
                              <span 
                                className="px-1.5 py-0.5 rounded-full text-xs font-medium cursor-pointer"
                                style={{ 
                                  backgroundColor: getParticipantNotes(participant.id || "")[0]?.color || "#FFE599",
                                  color: "#000"
                                }}
                                title={`${getParticipantNotes(participant.id || "").length} nota(s)`}
                              >
                                📝 {getParticipantNotes(participant.id || "").length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">
                            {participant.tanks || "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-32 sm:w-48 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.misc || "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.activity_id ? "Actividad" : "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-24 sm:w-32 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.observations || "-"}
                          </div>
                        </td>
                        <td className="p-1 sm:p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAddNoteDialog(participant)}
                              className="h-6 w-6 p-0"
                              title="Agregar nota"
                            >
                              <StickyNote className="h-3 w-3" />
                            </Button>
                            {group && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditParticipantDialog(participant, group)}
                                className="h-6 w-6 p-0"
                                title="Editar"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No hay instructores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Tabla de Piscina - Solo se muestra si hay grupos de PISCINA */}
      {operation && operationId && hasPoolGroups && (
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-center">PISCINA</CardTitle>
          <CardDescription className="mt-1 text-center">
            Registro de actividades en piscina
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Información de grupos de piscina */}
          <div className="mb-6 space-y-3">
            {operationGroups
              .filter(group => group.environment === "POOL")
              .map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 bg-green-50/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                          PISCINA
                        </span>
                        {group.label && (
                          <span className="text-sm font-semibold text-gray-900">{group.label}</span>
                        )}
                      </div>
                      {(group.start_time || group.end_time) && (
                        <div className="text-sm text-gray-700 mb-1">
                          {group.start_time && <span className="font-medium">Inicio: {group.start_time}</span>}
                          {group.start_time && group.end_time && <span className="mx-2">-</span>}
                          {group.end_time && <span className="font-medium">Fin: {group.end_time}</span>}
                        </div>
                      )}
                      {group.comments && (
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Comentarios:</span> {group.comments}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAddParticipantDialog(group, "DIVER")}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Agregar Persona
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditGroupDialog(group)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
                <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">No</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Nombre</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Tanque</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Equipos</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Actividad</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Ubicación</th>
                  <th className="border-r border-gray-200 p-1 sm:p-2 text-left font-semibold text-xs sm:text-sm">Observaciones</th>
                  <th className="p-1 sm:p-2 text-center font-semibold text-xs sm:text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {getPoolDivers().length > 0 ? (
                  getPoolDivers().map((participant, index) => {
                    const group = getParticipantGroup(participant.id || "")
                    return (
                      <tr key={participant.id || index} className="border-b border-gray-200">
                        <td className="border-r border-gray-200 p-1 sm:p-2 text-xs sm:text-sm">{index + 1}</td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-24 sm:w-32 px-1 sm:px-2 py-1 font-medium text-xs sm:text-sm">
                              {getParticipantName(participant.person_id)}
                            </div>
                            {getParticipantNotes(participant.id || "").length > 0 && (
                              <span 
                                className="px-1.5 py-0.5 rounded-full text-xs font-medium cursor-pointer"
                                style={{ 
                                  backgroundColor: getParticipantNotes(participant.id || "")[0]?.color || "#FFE599",
                                  color: "#000"
                                }}
                                title={`${getParticipantNotes(participant.id || "").length} nota(s)`}
                              >
                                📝 {getParticipantNotes(participant.id || "").length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-xs sm:text-sm">
                            {participant.tanks || "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-20 sm:w-24 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.misc || "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.activity_id ? "Actividad" : "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-16 sm:w-20 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.misc || "-"}
                          </div>
                        </td>
                        <td className="border-r border-gray-200 p-1 sm:p-2">
                          <div className="w-24 sm:w-32 px-1 sm:px-2 py-1 text-xs sm:text-sm">
                            {participant.observations || "-"}
                          </div>
                        </td>
                        <td className="p-1 sm:p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAddNoteDialog(participant)}
                              className="h-6 w-6 p-0"
                              title="Agregar nota"
                            >
                              <StickyNote className="h-3 w-3" />
                            </Button>
                            {group && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditParticipantDialog(participant, group)}
                                className="h-6 w-6 p-0"
                                title="Editar"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No hay actividades de piscina registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Botón para agregar nueva fila a PISCINA - Solo se muestra si hay grupos de PISCINA */}
      {operation && operationId && hasPoolGroups && (
      <div className="flex justify-center py-2">
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
      )}

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

      {/* Diálogo para agregar participante */}
      <Dialog open={addParticipantDialogOpen} onOpenChange={setAddParticipantDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar {participantRole === "DIVER" ? "Buzo" : participantRole === "INSTRUCTOR" ? "Instructor" : "Tripulación"}</DialogTitle>
            <DialogDescription>
              Agregue una persona al grupo {selectedGroupForParticipant?.label || ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Persona */}
            <div className="space-y-2">
              <Label htmlFor="participant-person">Persona *</Label>
              <Select
                value={participantFormData.person_id || undefined}
                onValueChange={(value) => setParticipantFormData({ ...participantFormData, person_id: value || "" })}
              >
                <SelectTrigger id="participant-person">
                  <SelectValue placeholder="Seleccione una persona" />
                </SelectTrigger>
                <SelectContent>
                  {peopleCatalog
                    .filter(person => {
                      if (participantRole === "INSTRUCTOR") {
                        return person.default_role === "INSTRUCTOR"
                      } else {
                        return person.default_role === "DIVER" || person.default_role === "CREW"
                      }
                    })
                    .filter(person => person.is_active)
                    .map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.full_name} {person.default_role ? `(${person.default_role})` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actividad */}
            <div className="space-y-2">
              <Label htmlFor="participant-activity">Actividad (opcional)</Label>
              <Select
                value={participantFormData.activity_id || undefined}
                onValueChange={(value) => setParticipantFormData({ ...participantFormData, activity_id: value || undefined })}
              >
                <SelectTrigger id="participant-activity">
                  <SelectValue placeholder="Seleccione una actividad" />
                </SelectTrigger>
                <SelectContent>
                  {activitiesCatalog
                    .filter(activity => activity.is_active)
                    .map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name || activity.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-tanks">Tanques</Label>
                <Input
                  id="participant-tanks"
                  type="number"
                  value={participantFormData.tanks || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, tanks: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-bags">Maletas</Label>
                <Input
                  id="participant-bags"
                  type="number"
                  value={participantFormData.bags || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, bags: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-regulator">Regulador</Label>
                <Input
                  id="participant-regulator"
                  value={participantFormData.regulator || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, regulator: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-bcd">Chaleco (BCD)</Label>
                <Input
                  id="participant-bcd"
                  value={participantFormData.bcd || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, bcd: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-weightbelt">Cinturón</Label>
                <Input
                  id="participant-weightbelt"
                  value={participantFormData.weightbelt || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, weightbelt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-weights">Pesas (kg)</Label>
                <Input
                  id="participant-weights"
                  type="number"
                  step="0.1"
                  value={participantFormData.weights_kg || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, weights_kg: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-misc">Máscara (Msc)</Label>
                <Input
                  id="participant-misc"
                  value={participantFormData.misc || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, misc: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-snorkel">Snorkel</Label>
                <Input
                  id="participant-snorkel"
                  value={participantFormData.snorkel_set || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, snorkel_set: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-altimeter">Altímetro (Alt)</Label>
                <Input
                  id="participant-altimeter"
                  value={participantFormData.altimeter || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, altimeter: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-suit">Traje</Label>
                <Input
                  id="participant-suit"
                  value={participantFormData.suit_size || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, suit_size: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participant-observations">Observaciones</Label>
              <Textarea
                id="participant-observations"
                value={participantFormData.observations || ""}
                onChange={(e) => setParticipantFormData({ ...participantFormData, observations: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-value">Valor</Label>
                <Input
                  id="participant-value"
                  value={participantFormData.value_label || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, value_label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-invoice">Factura</Label>
                <Input
                  id="participant-invoice"
                  value={participantFormData.invoice_reference || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, invoice_reference: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participant-payment">Estado de Pago</Label>
              <Input
                id="participant-payment"
                value={participantFormData.payment_status || ""}
                onChange={(e) => setParticipantFormData({ ...participantFormData, payment_status: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setAddParticipantDialogOpen(false)
                setSelectedGroupForParticipant(null)
              }}
              disabled={addingParticipant}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddParticipant}
              disabled={addingParticipant || !participantFormData.person_id}
            >
              {addingParticipant ? "Agregando..." : "Agregar Participante"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar participante */}
      <Dialog open={editParticipantDialogOpen} onOpenChange={setEditParticipantDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar {participantRole === "DIVER" ? "Buzo" : participantRole === "INSTRUCTOR" ? "Instructor" : "Tripulación"}</DialogTitle>
            <DialogDescription>
              Modifique los datos del participante en el grupo {selectedGroupForParticipant?.label || ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Persona (solo lectura en edición) */}
            <div className="space-y-2">
              <Label htmlFor="edit-participant-person">Persona</Label>
              <Input
                id="edit-participant-person"
                value={selectedParticipant ? getParticipantName(selectedParticipant.person_id) : ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="edit-participant-role">Rol</Label>
              <Select
                value={participantFormData.role}
                onValueChange={(value: 'DIVER' | 'INSTRUCTOR' | 'CREW') => setParticipantFormData({ ...participantFormData, role: value })}
              >
                <SelectTrigger id="edit-participant-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIVER">DIVER</SelectItem>
                  <SelectItem value="INSTRUCTOR">INSTRUCTOR</SelectItem>
                  <SelectItem value="CREW">CREW</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actividad */}
            <div className="space-y-2">
              <Label htmlFor="edit-participant-activity">Actividad (opcional)</Label>
              <Select
                value={participantFormData.activity_id || undefined}
                onValueChange={(value) => setParticipantFormData({ ...participantFormData, activity_id: value || undefined })}
              >
                <SelectTrigger id="edit-participant-activity">
                  <SelectValue placeholder="Seleccione una actividad" />
                </SelectTrigger>
                <SelectContent>
                  {activitiesCatalog
                    .filter(activity => activity.is_active)
                    .map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name || activity.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-participant-tanks">Tanques</Label>
                <Input
                  id="edit-participant-tanks"
                  type="number"
                  value={participantFormData.tanks || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, tanks: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-participant-bags">Maletas</Label>
                <Input
                  id="edit-participant-bags"
                  type="number"
                  value={participantFormData.bags || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, bags: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-participant-regulator">Regulador</Label>
                <Input
                  id="edit-participant-regulator"
                  value={participantFormData.regulator || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, regulator: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-participant-bcd">Chaleco (BCD)</Label>
                <Input
                  id="edit-participant-bcd"
                  value={participantFormData.bcd || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, bcd: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-participant-weightbelt">Cinturón</Label>
                <Input
                  id="edit-participant-weightbelt"
                  value={participantFormData.weightbelt || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, weightbelt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-participant-weights">Pesas (kg)</Label>
                <Input
                  id="edit-participant-weights"
                  type="number"
                  step="0.1"
                  value={participantFormData.weights_kg || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, weights_kg: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-participant-misc">Máscara (Msc)</Label>
                <Input
                  id="edit-participant-misc"
                  value={participantFormData.misc || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, misc: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-participant-snorkel">Snorkel</Label>
                <Input
                  id="edit-participant-snorkel"
                  value={participantFormData.snorkel_set || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, snorkel_set: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-participant-altimeter">Altímetro (Alt)</Label>
                <Input
                  id="edit-participant-altimeter"
                  value={participantFormData.altimeter || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, altimeter: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-participant-suit">Traje</Label>
                <Input
                  id="edit-participant-suit"
                  value={participantFormData.suit_size || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, suit_size: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-participant-observations">Observaciones</Label>
              <Textarea
                id="edit-participant-observations"
                value={participantFormData.observations || ""}
                onChange={(e) => setParticipantFormData({ ...participantFormData, observations: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-participant-value">Valor</Label>
                <Input
                  id="edit-participant-value"
                  value={participantFormData.value_label || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, value_label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-participant-invoice">Factura</Label>
                <Input
                  id="edit-participant-invoice"
                  value={participantFormData.invoice_reference || ""}
                  onChange={(e) => setParticipantFormData({ ...participantFormData, invoice_reference: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-participant-payment">Estado de Pago</Label>
              <Input
                id="edit-participant-payment"
                value={participantFormData.payment_status || ""}
                onChange={(e) => setParticipantFormData({ ...participantFormData, payment_status: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setEditParticipantDialogOpen(false)
                setSelectedParticipant(null)
                setSelectedGroupForParticipant(null)
              }}
              disabled={updatingParticipant}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateParticipant}
              disabled={updatingParticipant}
            >
              {updatingParticipant ? "Actualizando..." : "Actualizar Participante"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para agregar nota a participante */}
      <Dialog open={addNoteDialogOpen} onOpenChange={setAddNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nota</DialogTitle>
            <DialogDescription>
              Agregue una nota para {selectedParticipantForNote ? getParticipantName(selectedParticipantForNote.person_id) : "el participante"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="note-text">Nota *</Label>
              <Textarea
                id="note-text"
                value={noteFormData.note}
                onChange={(e) => setNoteFormData({ ...noteFormData, note: e.target.value })}
                placeholder="Escriba la nota aquí..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-color">Color (opcional)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="note-color"
                  type="color"
                  value={noteFormData.color || "#FFE599"}
                  onChange={(e) => setNoteFormData({ ...noteFormData, color: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={noteFormData.color || "#FFE599"}
                  onChange={(e) => setNoteFormData({ ...noteFormData, color: e.target.value })}
                  placeholder="#FFE599"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Mostrar notas existentes si hay */}
            {selectedParticipantForNote && getParticipantNotes(selectedParticipantForNote.id || "").length > 0 && (
              <div className="space-y-2">
                <Label>Notas existentes</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                  {getParticipantNotes(selectedParticipantForNote.id || "").map((note) => (
                    <div
                      key={note.id}
                      className="p-2 rounded text-sm"
                      style={{ backgroundColor: note.color || "#FFE599", color: "#000" }}
                    >
                      <div className="font-medium">{note.note}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {format(new Date(note.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setAddNoteDialogOpen(false)
                setSelectedParticipantForNote(null)
                setNoteFormData({
                  note: "",
                  color: "#FFE599"
                })
              }}
              disabled={addingNote}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddNote}
              disabled={addingNote || !noteFormData.note.trim()}
            >
              {addingNote ? "Agregando..." : "Agregar Nota"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

