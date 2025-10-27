import { useState, useMemo, useEffect } from "react";
import React, { JSX } from "react";
import { Button } from "@/components/reservation/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table/table";
import { CloudUpload, Download, Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, X, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/table/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/table/dropdown-menu";
import * as XLSX from 'xlsx';

interface ColumnFilter {
    columnIndex: number;
    states: string[];
}

interface PrimaryTableProps {
    headers: string[];
    nametable: String;
    data: (string | JSX.Element)[][];
    onAdd?: () => void;
    onEdit?: (index: number) => void;
    enablePagination?: boolean;
    itemsPerPage?: number;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    enableSearch?: boolean;
    enableSort?: boolean;
    columnFilters?: ColumnFilter[];
    showAddButton?: boolean;
    defaultCollapsed?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export default function PrimaryTable({ 
    headers, 
    data, 
    nametable, 
    onAdd,
    onEdit,
    enablePagination = true,
    itemsPerPage = 8,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    enableSearch = true,
    enableSort = false,
    columnFilters = [],
    showAddButton = false,
    defaultCollapsed = false
}: PrimaryTableProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [activeColumnFilters, setActiveColumnFilters] = useState<Record<number, string[]>>({});
    const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

    // Actualizar página local cuando cambia la prop
    useEffect(() => {
        setLocalCurrentPage(currentPage);
    }, [currentPage]);

    // Función para manejar el cambio de página
    const handlePageChange = (newPage: number) => {
        setLocalCurrentPage(newPage);
        onPageChange?.(newPage);
    };

    // Obtener todos los estados únicos de las columnas
    const allStates = useMemo(() => {
        const states = new Set<string>();
        columnFilters.forEach(filter => {
            filter.states.forEach(state => states.add(state));
        });
        return Array.from(states);
    }, [columnFilters]);

    // Función para buscar en los datos
    const searchData = (data: (string | JSX.Element)[][]) => {
        if (!searchTerm) return data;
        
        return data.filter(row => 
            row.some(cell => {
                if (typeof cell === 'string') {
                    return cell.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (React.isValidElement(cell)) {
                    const element = cell as React.ReactElement<{ children?: React.ReactNode }>;
                    const textContent = String(element.props?.children || '');
                    return textContent.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return false;
            })
        );
    };

    // Función para filtrar por columnas
    const filterByColumns = (data: (string | JSX.Element)[][]) => {
        let filteredData = data;

        // Aplicar filtro global si está activo
        if (activeFilter) {
            filteredData = filteredData.filter(row => {
                return row.some(cell => {
                    const cellText = typeof cell === 'string' 
                        ? cell 
                        : React.isValidElement(cell) 
                            ? String((cell as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
                            : '';
                    return cellText.toLowerCase() === activeFilter.toLowerCase();
                });
            });
        }

        // Aplicar filtros de columna
        return filteredData.filter(row => {
            return Object.entries(activeColumnFilters).every(([columnIndex, states]) => {
                if (states.length === 0) return true;
                
                const cell = row[Number(columnIndex)];
                const cellText = typeof cell === 'string' 
                    ? cell 
                    : React.isValidElement(cell) 
                        ? String((cell as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
                        : '';

                return states.some(state => 
                    cellText.toLowerCase() === state.toLowerCase()
                );
            });
        });
    };

    // Función para ordenar los datos
    const sortData = (data: (string | JSX.Element)[][]) => {
        if (sortColumn === null || sortDirection === null) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            const getText = (value: string | JSX.Element): string => {
                if (typeof value === 'string') return value;
                if (React.isValidElement(value)) {
                    const element = value as React.ReactElement<{ children?: React.ReactNode }>;
                    return String(element.props?.children || '');
                }
                return '';
            };

            const aText = getText(aValue).toLowerCase();
            const bText = getText(bValue).toLowerCase();

            if (sortDirection === 'asc') {
                return aText.localeCompare(bText);
            } else {
                return bText.localeCompare(aText);
            }
        });
    };

    // Función para manejar el ordenamiento
    const handleSort = (columnIndex: number) => {
        if (!enableSort) return;

        if (sortColumn === columnIndex) {
            setSortDirection(current => {
                if (current === 'asc') return 'desc';
                if (current === 'desc') return null;
                return 'asc';
            });
        } else {
            setSortColumn(columnIndex);
            setSortDirection('asc');
        }
    };

    // Función para manejar filtros de columna
    const handleColumnFilter = (columnIndex: number, state: string) => {
        setActiveColumnFilters(prev => {
            const currentFilters = prev[columnIndex] || [];
            const newFilters = currentFilters.includes(state)
                ? currentFilters.filter(f => f !== state)
                : [...currentFilters, state];
            
            return {
                ...prev,
                [columnIndex]: newFilters
            };
        });
    };

    // Aplicar búsqueda, filtros de columna, ordenamiento y paginación
    const filteredData = enableSearch ? searchData(data) : data;
    const columnFilteredData = filterByColumns(filteredData);
    const sortedData = enableSort ? sortData(columnFilteredData) : columnFilteredData;
    
    // Calcular el total de páginas basado en itemsPerPage
    const calculatedTotalPages = Math.ceil(sortedData.length / itemsPerPage);
    
    // Asegurarse de que la página actual sea válida
    const validCurrentPage = Math.min(Math.max(1, localCurrentPage), calculatedTotalPages || 1);
    
    // Aplicar paginación
    const paginatedData = enablePagination 
        ? sortedData.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage)
        : sortedData;

    const handleExportToExcel = () => {
        // Preparar los datos para Excel
        const excelData = data.map(row => {
            return row.map(cell => {
                if (typeof cell === 'string') return cell;
                if (React.isValidElement(cell)) {
                    const element = cell as React.ReactElement<{ children?: React.ReactNode }>;
                    return String(element.props?.children || '');
                }
                return '';
            });
        });

        // Crear un libro de Excel
        const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");

        // Generar el archivo Excel
        XLSX.writeFile(wb, `${nametable}.xlsx`);
    };

    return (<>
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div 
                    className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-all hover-scale"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                {isCollapsed ? (
                                    <ChevronRight size={18} className="text-gray-500 transition-all" />
                                ) : (
                                    <ChevronDown size={18} className="text-gray-500 transition-all" />
                                )}
                                <span className="text-base font-medium text-gray-800 capitalize">
                                    {nametable}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium transition-all hover-glow">
                                    {data.length} {data.length === 1 ? 'registro' : 'registros'}
                                </span>
                                <div className={`flex items-center gap-1.5 transition-all ${isCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                                    {data.slice(0, 4).map((row, index) => {
                                        const firstCell = row[0];
                                        if (React.isValidElement(firstCell) && 
                                            firstCell.type === 'div' && 
                                            typeof firstCell.props === 'object' &&
                                            firstCell.props !== null &&
                                            'className' in firstCell.props &&
                                            typeof firstCell.props.className === 'string' &&
                                            firstCell.props.className.includes('flex items-center justify-center')) {
                                            const cellProps = firstCell.props as { children?: React.ReactNode };
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg bg-white overflow-hidden hover-scale hover-glow ${isCollapsed ? 'animate-slide-in' : 'animate-slide-out'}`}
                                                    style={{
                                                        transitionDelay: `${index * 30}ms`
                                                    }}
                                                >
                                                    {cellProps.children}
            </div>
                                            );
                                        }
                                        return null;
                                    })}
                                    {data.length > 4 && (
                                        <div 
                                            className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium hover-scale hover-glow ${isCollapsed ? 'animate-slide-in' : 'animate-slide-out'}`}
                                            style={{
                                                transitionDelay: '120ms'
                                            }}
                        >
                                            +{data.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!isCollapsed && (
                    <div className="border-t border-gray-200">
                        <div className="flex flex-col gap-4 p-6 border-b border-gray-100">
                            {/* Barra de búsqueda y filtros */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1 max-w-md">
                                    {enableSearch && (
                                        <div className="relative group">
                                            <Input 
                                                placeholder="Buscar en todos los campos..." 
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 rounded-xl transition-all duration-300 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-gray-100/50"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-500" />
                                            {searchTerm && (
                                                <button 
                                                    onClick={() => setSearchTerm("")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {columnFilters.length > 0 && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="px-4 py-2 rounded-xl transition-all duration-200 ease-out hover:bg-gray-100 hover:shadow-sm active:scale-[0.98] animate-fade-in"
                                                >
                                                    <Filter size={18} className="mr-2" />
                                                    Filtros
                    </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                {columnFilters.map((filter, index) => (
                                                    <div key={index} className="p-2">
                                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                                            {headers[filter.columnIndex]}
                                                        </div>
                                                        {filter.states.map((state, stateIndex) => (
                                                            <DropdownMenuCheckboxItem
                                                                key={stateIndex}
                                                                checked={activeColumnFilters[filter.columnIndex]?.includes(state)}
                                                                onCheckedChange={() => handleColumnFilter(filter.columnIndex, state)}
                                                                className="cursor-pointer"
                                                            >
                                                                {state}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </div>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                    {(showAddButton || onAdd) && (
                                        <Button
                                            onClick={onAdd}
                                            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 pl-2 rounded-xl transition-all duration-200 ease-out hover:shadow-sm active:scale-[0.98] animate-fade-in"
                                        >
                                            <Plus size={18}  />
                                            Nuevo
                    </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={handleExportToExcel}
                                        className="px-4 py-2 rounded-xl transition-all duration-200 ease-out hover:bg-gray-100 hover:shadow-sm active:scale-[0.98] animate-fade-in"
                                    >
                                        <Download size={18} className="mr-2" />
                                        Exportar
                    </Button>
                </div>
            </div>

                            {/* Filtros activos */}
                            {(activeFilter || Object.entries(activeColumnFilters).some(([_, states]) => states.length > 0)) && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-gray-500">Filtros activos:</span>
                                    {activeFilter && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                            {activeFilter}
                                            <button 
                                                onClick={() => setActiveFilter(null)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                    {Object.entries(activeColumnFilters).map(([columnIndex, states]) => 
                                        states.map(state => (
                                            <div key={`${columnIndex}-${state}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                                {state}
                                                <button 
                                                    onClick={() => handleColumnFilter(Number(columnIndex), state)}
                                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="w-full">
                            <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((header, index) => (
                                            <TableHead 
                                                key={index}
                                                className={`
                                                    ${enableSort ? "cursor-pointer hover:bg-gray-50" : ""}
                                                    transition-all duration-300 ease-in-out
                                                `}
                                                onClick={() => handleSort(index)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{header}</span>
                                                    {enableSort && sortColumn === index && (
                                                        <div className="flex items-center text-gray-500">
                                                            {sortDirection === 'asc' ? 
                                                                <ArrowUp size={14} className="transition-all" /> : 
                                                                sortDirection === 'desc' ? 
                                                                    <ArrowDown size={14} className="transition-all" /> : 
                                                                    <ArrowUpDown size={14} className="transition-all" />
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                                    {paginatedData.map((row, rowIndex) => (
                                        <TableRow 
                                            key={rowIndex} 
                                            className="hover:bg-gray-50 hover-scale animate-slide-in-row"
                                            style={{
                                                transitionDelay: `${rowIndex * 30}ms`
                                            }}
                                        >
                                {row.map((cell, cellIndex) => (
                                                <TableCell 
                                                    key={cellIndex} 
                                                    className={`
                                                        ${cellIndex === 0 ? "w-[50px] text-center py-1 pl-6" : "py-0"}
                                                        ${cellIndex === 1 && onEdit ? "cursor-pointer hover:text-blue-600 transition-all hover-glow" : ""}
                                                    `}
                                                    onClick={() => {
                                                        if (cellIndex === 1 && onEdit) {
                                                            onEdit(rowIndex);
                                                        }
                                                    }}
                                                >
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
                        {enablePagination && calculatedTotalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t">
                                <div className="text-sm text-gray-600">
                                    Mostrando {((validCurrentPage - 1) * itemsPerPage) + 1} - {Math.min(validCurrentPage * itemsPerPage, sortedData.length)} de {sortedData.length} registros
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(validCurrentPage - 1)}
                                        disabled={validCurrentPage === 1}
                                        className="hover-scale animate-fade-in"
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: calculatedTotalPages }, (_, i) => i + 1)
                                            .filter(page => {
                                                if (page === 1 || page === calculatedTotalPages) return true;
                                                return Math.abs(page - validCurrentPage) <= 1;
                                            })
                                            .map((page, index, array) => {
                                                const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsis && (
                                                            <span className="px-2 text-gray-500">...</span>
                                                        )}
                                                        <Button
                                                            variant={page === validCurrentPage ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handlePageChange(page)}
                                                            className="hover-scale animate-fade-in"
                                                        >
                                                            {page}
                                                        </Button>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(validCurrentPage + 1)}
                                        disabled={validCurrentPage === calculatedTotalPages}
                                        className="hover-scale animate-fade-in"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        <style jsx>{`
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateX(20px) scale(0.9);
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes slideInRow {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `}</style>
    </>);
}
