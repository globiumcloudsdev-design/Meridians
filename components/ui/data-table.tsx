'use client';

import { useState, useMemo, ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Settings2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
} from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface DataTableAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary' | 'link';
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  filters?: DataTableFilter[];
  actions?: DataTableAction<T>[];
  searchPlaceholder?: string;
  onExport?: (data: T[]) => void;
  rowKey: keyof T;
  initialPageSize?: number;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  customFilters?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  actions = [],
  searchPlaceholder = 'Search...',
  onExport,
  rowKey,
  initialPageSize = 10,
  enableSelection = false,
  onSelectionChange,
  customFilters,
}: DataTableProps<T>) {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  // Filter and sort logic
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const searchableColumns = columns.filter((col) => col.searchable !== false);

      result = result.filter((row) =>
        searchableColumns.some((col) => {
          const value = row[col.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        })
      );
    }

    // Apply custom filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((row) => String(row[key]) === value);
      }
    });

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, filterValues, sortField, sortOrder, columns]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Sort handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Row selection handlers
  const isAllSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelected = new Set(paginatedData.map((row) => String(row[rowKey])));
      setSelectedRows(newSelected);
      onSelectionChange?.(Array.from(newSelected));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  // Export handler
  const handleExport = () => {
    if (onExport) {
      onExport(filteredAndSortedData);
    } else {
      // Default CSV export
      const headers = columns.filter((col) => columnVisibility[col.key]).map((col) => col.label);
      const rows = filteredAndSortedData.map((row) =>
        columns
          .filter((col) => columnVisibility[col.key])
          .map((col) => {
            const value = row[col.key];
            return value !== null && value !== undefined ? String(value) : '';
          })
      );

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterValues({});
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || Object.values(filterValues).some((v) => v && v !== 'all');

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const visibleColumns = columns.filter((col) => columnVisibility[col.key]);

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Dynamic Filters */}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] || 'all'}
              onValueChange={(value) => {
                setFilterValues({ ...filterValues, [filter.key]: value });
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Custom Filters Slot */}
          {customFilters}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters} size="icon" className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.size > 0
                ? `${selectedRows.size} selected`
                : `${filteredAndSortedData.length} items`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Export */}
            {onExport !== undefined && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-50">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={columnVisibility[col.key]}
                    onCheckedChange={(checked) =>
                      setColumnVisibility({ ...columnVisibility, [col.key]: checked })
                    }
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table with Auto Horizontal Scroll */}
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="min-w-full inline-block align-middle">
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  {enableSelection && (
                    <TableHead className="w-12 sticky left-0 bg-card z-10">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                  )}
                  {visibleColumns.map((col) => (
                    <TableHead key={col.key} className={col.className}>
                      {col.sortable !== false ? (
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(col.key)}
                          className="hover:bg-transparent p-0 h-auto font-semibold"
                        >
                          {col.label}
                          <SortIcon field={col.key} />
                        </Button>
                      ) : (
                        <span className="font-semibold">{col.label}</span>
                      )}
                    </TableHead>
                  ))}
                  {actions.length > 0 && (
                    <TableHead className="text-right sticky right-0 bg-card z-10 w-32">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={(enableSelection ? 1 : 0) + visibleColumns.length + (actions.length > 0 ? 1 : 0)}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => {
                    const rowId = String(row[rowKey]);
                    return (
                      <TableRow
                        key={rowId}
                        className={selectedRows.has(rowId) ? 'bg-muted/50' : ''}
                      >
                        {enableSelection && (
                          <TableCell className="sticky left-0 bg-card z-10">
                            <Checkbox
                              checked={selectedRows.has(rowId)}
                              onCheckedChange={() => handleSelectRow(rowId)}
                              aria-label={`Select row ${rowId}`}
                            />
                          </TableCell>
                        )}
                        {visibleColumns.map((col) => (
                          <TableCell key={col.key} className={col.className}>
                            {col.render ? col.render(row) : String(row[col.key] ?? '')}
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell className="text-right sticky right-0 bg-card z-10">
                            <div className="flex items-center justify-end gap-2">
                              {actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  variant={action.variant || 'ghost'}
                                  size="sm"
                                  onClick={() => action.onClick(row)}
                                  className={action.className}
                                  title={action.label}
                                >
                                  {action.icon}
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

