import { useState, useMemo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  MoreHorizontal, Trash2, Phone, Mail, Calendar, Eye, Edit3
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import type { Lead } from "@shared/schema";

interface AdvancedLeadsTableProps {
  data: Lead[];
  filters?: {
    source: string;
    status: string;
    license: string;
  };
}

// Inline editing cell component
const EditableCell = ({ 
  getValue, 
  row, 
  column, 
  table 
}: {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const onBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id, value);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBlur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus
      className="h-8 text-xs bg-slate-800/50 border-slate-600 focus:border-cyan-500 text-white"
    />
  ) : (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-slate-700/30 p-1 rounded text-xs text-slate-300 min-h-6 flex items-center"
      title="Click to edit"
    >
      {initialValue || "—"}
    </div>
  );
};

// Status badge component with inline editing
const StatusBadge = ({ status, onEdit }: { status: string; onEdit: (newStatus: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30';
      case 'qualified': return 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30';
      case 'enrolled': return 'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30';
      case 'opt_out': return 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50 hover:bg-slate-500/30';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Badge className={`${getStatusColor(status)} cursor-pointer text-xs px-2 py-1 border transition-all duration-200`}>
          {status.replace('_', ' ')}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        {['new', 'contacted', 'qualified', 'enrolled', 'opt_out'].map((s) => (
          <DropdownMenuItem 
            key={s}
            onClick={() => {
              onEdit(s);
              setIsOpen(false);
            }}
            className="text-slate-300 hover:bg-slate-700"
          >
            <Badge className={`${getStatusColor(s)} text-xs`}>
              {s.replace('_', ' ')}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// License goal badge component with inline editing
const LicenseBadge = ({ license, onEdit }: { license: string; onEdit: (newLicense: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getLicenseColor = (license: string) => {
    switch (license) {
      case '2-15': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30';
      case '2-40': return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 hover:bg-fuchsia-500/30';
      case '2-14': return 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50 hover:bg-slate-500/30';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Badge className={`${getLicenseColor(license)} cursor-pointer text-xs px-2 py-1 border transition-all duration-200`}>
          {license}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        {['2-15', '2-40', '2-14'].map((l) => (
          <DropdownMenuItem 
            key={l}
            onClick={() => {
              onEdit(l);
              setIsOpen(false);
            }}
            className="text-slate-300 hover:bg-slate-700"
          >
            <Badge className={`${getLicenseColor(l)} text-xs`}>
              {l}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Source badge component with inline editing
const SourceBadge = ({ source, onEdit }: { source: string; onEdit: (newSource: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'voice_agent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30';
      case 'website': return 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30';
      case 'referral': return 'bg-violet-500/20 text-violet-400 border-violet-500/50 hover:bg-violet-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50 hover:bg-slate-500/30';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Badge className={`${getSourceColor(source)} cursor-pointer text-xs px-2 py-1 border transition-all duration-200`}>
          {source.replace('_', ' ')}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        {['voice_agent', 'website', 'referral'].map((s) => (
          <DropdownMenuItem 
            key={s}
            onClick={() => {
              onEdit(s);
              setIsOpen(false);
            }}
            className="text-slate-300 hover:bg-slate-700"
          >
            <Badge className={`${getSourceColor(s)} text-xs`}>
              {s.replace('_', ' ')}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Action buttons component
const ActionButtons = ({ lead }: { lead: Lead }) => {
  const handleCall = () => {
    toast({ 
      title: "Initiating call", 
      description: `Calling ${lead.firstName} ${lead.lastName} at ${lead.phone}`,
      duration: 3000
    });
  };

  const handleEmail = () => {
    window.open(`mailto:${lead.email}?subject=Insurance License Information`);
  };

  const handleView = () => {
    toast({ 
      title: "Viewing lead details", 
      description: `Opening details for ${lead.firstName} ${lead.lastName}`,
      duration: 2000 
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleView}
        className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCall}
        className="h-8 w-8 p-0 text-slate-400 hover:text-green-400 hover:bg-green-500/10"
        title="Call Lead"
      >
        <Phone className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEmail}
        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
        title="Send Email"
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function AdvancedLeadsTable({ data, filters }: AdvancedLeadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const queryClient = useQueryClient();

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Lead> }) => 
      apiRequest(`/api/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({ title: "Lead updated successfully", duration: 2000 });
    },
    onError: () => {
      toast({ title: "Failed to update lead", variant: "destructive" });
    },
  });

  // Update data handler
  const updateData = useCallback((rowIndex: number, columnId: string, value: any) => {
    const lead = table.getRowModel().rows[rowIndex].original;
    updateLeadMutation.mutate({ 
      id: lead.id, 
      data: { [columnId]: value } 
    });
  }, [updateLeadMutation]);

  // Column definitions
  const columnHelper = createColumnHelper<Lead>();
  
  const columns = useMemo<ColumnDef<Lead>[]>(() => [
    columnHelper.accessor('firstName', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          First Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: (props) => <EditableCell {...props} />,
      size: 120,
    }),
    columnHelper.accessor('lastName', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Last Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: (props) => <EditableCell {...props} />,
      size: 120,
    }),
    columnHelper.accessor('phone', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Phone
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: (props) => <EditableCell {...props} />,
      size: 140,
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: (props) => <EditableCell {...props} />,
      size: 200,
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <StatusBadge 
          status={getValue()} 
          onEdit={(newStatus) => updateData(row.index, 'status', newStatus)}
        />
      ),
      size: 120,
    }),
    columnHelper.accessor('licenseGoal', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          License
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <LicenseBadge 
          license={getValue()} 
          onEdit={(newLicense) => updateData(row.index, 'licenseGoal', newLicense)}
        />
      ),
      size: 100,
    }),
    columnHelper.accessor('source', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Source
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ getValue, row }) => (
        <SourceBadge 
          source={getValue()} 
          onEdit={(newSource) => updateData(row.index, 'source', newSource)}
        />
      ),
      size: 120,
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Created
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ getValue }) => (
        <div className="text-xs text-slate-400">
          {new Date(getValue()).toLocaleDateString()}
        </div>
      ),
      size: 100,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ActionButtons lead={row.original} />,
      size: 120,
    }),
  ], [updateData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData,
    },
    debugTable: false,
  });

  return (
    <div className="w-full">
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search leads..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => 
              setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))
            }
          >
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()} className="text-white hover:bg-slate-700">
                  Show {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-slate-400">
          Total: {table.getFilteredRowModel().rows.length} leads
        </div>
      </div>

      {/* Table */}
      <div className="card-glass backdrop-blur-lg border-slate-700/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/70 border-b border-slate-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left p-3 font-medium text-slate-300">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700/50 bg-slate-800/30">
          <div className="text-sm text-slate-400">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-slate-400">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}