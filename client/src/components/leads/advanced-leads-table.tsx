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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
      className="h-8 px-2 bg-slate-700 border-slate-600 text-white text-sm"
    />
  ) : (
    <div
      onClick={() => setIsEditing(true)}
      className="h-8 px-2 flex items-center cursor-pointer hover:bg-slate-700/50 rounded text-sm text-white"
    >
      {value || 'Click to edit'}
    </div>
  );
};

// Tooltip Pain Points Cell - Displays truncated text with hover tooltip
const PainPointsCell = ({ 
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
  const initialValue = getValue() || '';
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  // Truncate text for display
  const truncatedText = initialValue.length > 30 ? initialValue.substring(0, 30) + '...' : initialValue;

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

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus
        className="h-8 px-2 bg-slate-700 border-slate-600 text-white text-sm"
      />
    );
  }

  if (!initialValue || initialValue.trim() === '') {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="h-8 px-2 flex items-center cursor-pointer hover:bg-slate-700/50 rounded text-sm text-slate-400"
      >
        Click to edit
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => setIsEditing(true)}
            className="h-8 px-2 flex items-center cursor-pointer hover:bg-slate-700/50 rounded text-sm text-white truncate max-w-[200px]"
          >
            {truncatedText}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-slate-800 border-slate-600 text-white p-3">
          <p className="text-sm whitespace-pre-wrap">{initialValue}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Status badge component
const StatusBadge = ({ status, onEdit }: { status: string; onEdit: (newStatus: string) => void }) => {
  const statusColors = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    qualified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    enrolled: 'bg-green-500/20 text-green-400 border-green-500/30',
    opt_out: 'bg-red-500/20 text-red-400 border-red-500/30',
    follow_up: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    interested: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    not_interested: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    callback_requested: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    appointment_set: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    no_answer: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    voicemail_left: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${statusColors[status as keyof typeof statusColors]} cursor-pointer hover:opacity-80`}
        >
          {status.replace('_', ' ')}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        {Object.keys(statusColors).map((s) => (
          <DropdownMenuItem 
            key={s} 
            onClick={() => onEdit(s)}
            className="text-white hover:bg-slate-700"
          >
            {s.replace('_', ' ')}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// License badge component
const LicenseBadge = ({ license, onEdit }: { license: string; onEdit: (newLicense: string) => void }) => {
  const licenseColors = {
    '2-15': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    '2-40': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    '2-14': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    '6-20': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '2-16': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '3-18': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '4-40': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    '7-15': 'bg-red-500/20 text-red-400 border-red-500/30',
    '2-20': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    undecided: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    multiple: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${licenseColors[license as keyof typeof licenseColors]} cursor-pointer hover:opacity-80`}
        >
          {license}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        {Object.keys(licenseColors).map((l) => (
          <DropdownMenuItem 
            key={l} 
            onClick={() => onEdit(l)}
            className="text-white hover:bg-slate-700"
          >
            {l}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Source badge component
const SourceBadge = ({ source, onEdit }: { source: string; onEdit: (newSource: string) => void }) => {
  const sourceColors = {
    voice_agent: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    website: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    referral: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    social_media: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    email_campaign: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    phone_call: 'bg-green-500/20 text-green-400 border-green-500/30',
    walk_in: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    trade_show: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    google_ads: 'bg-red-500/20 text-red-400 border-red-500/30',
    facebook_ads: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    linkedin: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    direct_mail: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    partner_referral: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${sourceColors[source as keyof typeof sourceColors]} cursor-pointer hover:opacity-80`}
        >
          {source.replace('_', ' ')}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        {Object.keys(sourceColors).map((s) => (
          <DropdownMenuItem 
            key={s} 
            onClick={() => onEdit(s)}
            className="text-white hover:bg-slate-700"
          >
            {s.replace('_', ' ')}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Action buttons component
const ActionButtons = ({ lead }: { lead: Lead }) => {
  const handleView = () => {
    toast({ title: `Viewing lead ${lead.firstName} ${lead.lastName}`, duration: 2000 });
  };

  const handleCall = () => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_self');
      toast({ title: `Calling ${lead.firstName} ${lead.lastName}`, duration: 2000 });
    }
  };

  const handleEmail = () => {
    if (lead.email) {
      window.open(`mailto:${lead.email}`, '_blank');
      toast({ title: `Opening email to ${lead.firstName} ${lead.lastName}`, duration: 2000 });
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleView}
        className="h-8 w-8 p-0 text-slate-400 hover:text-green-400 hover:bg-green-500/10"
        title="View Lead"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCall}
        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
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
      apiRequest(`/api/leads/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({ title: "Lead updated successfully", duration: 2000 });
    },
    onError: () => {
      toast({ title: "Failed to update lead", variant: "destructive" });
    },
  });

  // Update data handler
  const updateDataCallback = useCallback((rowIndex: number, columnId: string, value: any) => {
    const rowData = data[rowIndex];
    if (rowData) {
      updateLeadMutation.mutate({ 
        id: rowData.id, 
        data: { [columnId]: value } 
      });
    }
  }, [updateLeadMutation, data]);

  // Column definitions using simpler approach
  const columns = useMemo<ColumnDef<Lead, any>[]>(() => [
    {
      accessorKey: 'firstName',
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
    },
    {
      accessorKey: 'lastName',
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
    },
    {
      accessorKey: 'phone',
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
    },
    {
      accessorKey: 'email',
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
    },
    {
      accessorKey: 'status',
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
          status={getValue() as string} 
          onEdit={(newStatus) => updateDataCallback(row.index, 'status', newStatus)}
        />
      ),
      size: 120,
    },
    {
      accessorKey: 'licenseGoal',
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
          license={getValue() as string} 
          onEdit={(newLicense) => updateDataCallback(row.index, 'licenseGoal', newLicense)}
        />
      ),
      size: 100,
    },
    {
      accessorKey: 'source',
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
          source={getValue() as string} 
          onEdit={(newSource) => updateDataCallback(row.index, 'source', newSource)}
        />
      ),
      size: 120,
    },
    // NEW EXPANDED LEAD FIELDS
    {
      accessorKey: 'painPoints',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Pain Points
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: (props) => <PainPointsCell {...props} />,
      size: 200,
    },
    {
      accessorKey: 'employmentStatus',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Employment
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
      size: 150,
    },
    {
      accessorKey: 'urgencyLevel',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Urgency
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
    },
    {
      accessorKey: 'paymentPreference',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Payment Pref
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
      size: 130,
    },
    {
      accessorKey: 'paymentStatus',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Payment Status
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
        <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
          getValue() === 'PAID' 
            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border-red-500/30'
        }`}>
          {getValue() as string || 'NOT_PAID'}
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'confirmationNumber',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Confirmation
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
      size: 150,
    },
    {
      accessorKey: 'agentName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Agent
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
    },
    {
      accessorKey: 'supervisor',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Supervisor
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
    },
    {
      accessorKey: 'leadSource',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Lead Source
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
      size: 130,
    },
    {
      accessorKey: 'callSummary',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Call Summary
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
        <div className="text-xs text-slate-300 max-w-[200px] truncate">
          {getValue() as string || 'No summary'}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'callDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Call Date
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
          {getValue() ? new Date(getValue() as Date).toLocaleDateString() : 'No date'}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'conversationId',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-slate-300 hover:text-white font-medium"
        >
          Conversation ID
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
        <div className="text-xs text-slate-400 font-mono">
          {getValue() as string || 'No ID'}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: 'createdAt',
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
          {new Date(getValue() as Date).toLocaleDateString()}
        </div>
      ),
      size: 100,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ActionButtons lead={row.original} />,
      size: 120,
    },
  ], [updateDataCallback]);

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
      updateData: updateDataCallback,
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
                    <th
                      key={header.id}
                      className="text-left py-3 px-4 font-medium text-slate-300"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-t border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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