
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionFilters } from "@/types";
import { 
  CalendarIcon, 
  ChevronDown, 
  Filter, 
  RotateCcw, 
  ArrowUpDown 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getSchools } from "@/lib/api";
import { School } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  filters: Partial<TransactionFilters>;
  onFilterChange: (filters: Partial<TransactionFilters>) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Status options
  const statusOptions = [
    { label: "Success", value: "success" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" }
  ];
  
  // Load schools data
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await getSchools();
        setSchools(response.data || []);
      } catch (error) {
        toast.error("Failed to load schools");
        console.error(error);
      }
    };
    
    fetchSchools();
  }, []);
  
  // Handle status selection
  const handleStatusChange = (value: string, checked: boolean) => {
    const currentStatus = filters.status || [];
    const newStatus = checked 
      ? [...currentStatus, value]
      : currentStatus.filter(s => s !== value);
    
    onFilterChange({ status: newStatus });
  };
  
  // Handle school selection
  const handleSchoolChange = (value: string, checked: boolean) => {
    const currentSchools = filters.school_ids || [];
    const newSchools = checked
      ? [...currentSchools, value]
      : currentSchools.filter(s => s !== value);
    
    onFilterChange({ school_ids: newSchools });
  };
  
  // Handle date selection
  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    onFilterChange({ [field]: date });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sort, order] = value.split('-');
    onFilterChange({ sort, order: order as 'asc' | 'desc' });
  };
  
  // Reset all filters
  const handleReset = () => {
    onFilterChange({
      status: [],
      school_ids: [],
      startDate: null,
      endDate: null,
      sort: 'payment_time',
      order: 'desc'
    });
  };
  
  // Count active filters
  const activeFilterCount = 
    (filters.status?.length || 0) + 
    (filters.school_ids?.length || 0) + 
    (filters.startDate ? 1 : 0) + 
    (filters.endDate ? 1 : 0);
  
  // Selected schools display names
  const selectedSchoolNames = schools
    .filter(school => filters.school_ids?.includes(school._id))
    .map(school => school.name);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                Status
                <ChevronDown className="h-4 w-4" />
                {filters.status && filters.status.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1 min-w-5 min-h-5 flex items-center justify-center">
                    {filters.status.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`status-${status.value}`}
                      checked={(filters.status || []).includes(status.value)}
                      onCheckedChange={(checked) => 
                        handleStatusChange(status.value, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`status-${status.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* School Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                School
                <ChevronDown className="h-4 w-4" />
                {filters.school_ids && filters.school_ids.length > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1 min-w-5 min-h-5 flex items-center justify-center">
                    {filters.school_ids.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60" align="start">
              <div className="max-h-60 overflow-auto space-y-2">
                {schools.map((school) => (
                  <div key={school._id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`school-${school._id}`}
                      checked={(filters.school_ids || []).includes(school._id)}
                      onCheckedChange={(checked) => 
                        handleSchoolChange(school._id, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`school-${school._id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {school.name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Start Date Filter */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[190px] justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "PP") : <span>Start Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate || undefined}
                onSelect={(date) => {
                  handleDateChange('startDate', date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          {/* End Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[190px] justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "PP") : <span>End Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate || undefined}
                onSelect={(date) => handleDateChange('endDate', date)}
                disabled={(date) => 
                  filters.startDate ? date < filters.startDate : false
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          {/* Sort by */}
          <Select 
            value={`${filters.sort || 'payment_time'}-${filters.order || 'desc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment_time-desc">Date (Newest First)</SelectItem>
              <SelectItem value="payment_time-asc">Date (Oldest First)</SelectItem>
              <SelectItem value="order_amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="order_amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="gateway-asc">Gateway (A-Z)</SelectItem>
              <SelectItem value="status-asc">Status (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto flex gap-2">
            {/* Active filter indicators */}
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                className="gap-2" 
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
                Clear filters
                <Badge variant="secondary" className="ml-1 rounded-full">{activeFilterCount}</Badge>
              </Button>
            )}
          </div>
        </div>

        {/* Display selected filters */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status && filters.status.length > 0 && (
              <Badge variant="outline" className="gap-1 text-xs">
                Status: {filters.status.join(", ")}
              </Badge>
            )}
            
            {filters.school_ids && filters.school_ids.length > 0 && (
              <Badge variant="outline" className="gap-1 text-xs">
                Schools: {selectedSchoolNames.length > 0 ? selectedSchoolNames.join(", ") : filters.school_ids.join(", ")}
              </Badge>
            )}
            
            {filters.startDate && (
              <Badge variant="outline" className="gap-1 text-xs">
                From: {format(filters.startDate, "PP")}
              </Badge>
            )}
            
            {filters.endDate && (
              <Badge variant="outline" className="gap-1 text-xs">
                To: {format(filters.endDate, "PP")}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
