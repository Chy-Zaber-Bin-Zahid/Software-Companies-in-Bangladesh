'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Search, RefreshCw, Github, ChevronDown, X, Check } from 'lucide-react';
import { CompanyTable } from '@/components/company-table';
import { fetchCompaniesData } from '@/lib/api';
import { cn, getTechColor } from '@/lib/utils';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const {
    data: companies = [],
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompaniesData,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });

  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    companies.forEach((company) => {
      company.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [companies]);

  const filteredCompanies = companies.filter((company) => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = company.name.toLowerCase().includes(searchTermLower);
    const locationMatch = company.location.toLowerCase().includes(searchTermLower);

    const technologyMatch =
      selectedTechnologies.length === 0 ||
      selectedTechnologies.every((selectedTech) =>
        company.technologies.some(
          (companyTech) =>
            companyTech.toLowerCase() === selectedTech.toLowerCase()
        )
      );

    return (nameMatch || locationMatch) && technologyMatch;
  });

  const handleTechnologyToggle = (technology: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(technology)
        ? prev.filter((t) => t !== technology)
        : [...prev, technology]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tech Companies in Bangladesh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and explore technology companies across Bangladesh. Find
            information about their locations, technologies, and online presence.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>
                        {selectedTechnologies.length > 0
                          ? `${selectedTechnologies.length} technologies selected`
                          : 'Select Technologies'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full md:w-[250px] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search technology..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {allTechnologies.map((tech) => {
                            const isSelected =
                              selectedTechnologies.includes(tech);
                            return (
                              <CommandItem
                                key={tech}
                                onSelect={() => handleTechnologyToggle(tech)}
                              >
                                <div
                                  className={cn(
                                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'opacity-50 [&_svg]:invisible'
                                  )}
                                >
                                  <Check className={cn('h-4 w-4')} />
                                </div>
                                <span>{tech}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {selectedTechnologies.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {selectedTechnologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className={getTechColor(tech)}
                  >
                    {tech}
                    <button
                      onClick={() => handleTechnologyToggle(tech)}
                      className="ml-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTechnologies([])}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Table */}
        <Card>
          <CardHeader>
            <CardTitle>Companies Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Loading companies...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading companies data. Please try refreshing.
              </div>
            ) : (
              <CompanyTable companies={filteredCompanies} />
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          {dataUpdatedAt > 0 && (
            <p>
              Data automatically updates every minute • Last updated:{' '}
              {new Date(dataUpdatedAt).toLocaleTimeString()}
            </p>
          )}
          <div className="pt-2">
            <p>
              This project is open-source. Found an issue or want to add a
              company?
            </p>
            <Button
              variant="ghost"
              asChild
              className="mt-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <a
                href="https://github.com/Chy-Zaber-Bin-Zahid/Tech-Companies-in-Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Contribute on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}