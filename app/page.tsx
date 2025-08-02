'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Github } from 'lucide-react';
import { CompanyTable } from '@/components/company-table';
import { fetchCompaniesData } from '@/lib/api';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
              {new Date(dataUpdatedAt).toLocaleDateString()}
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
                href="https://github.com/Chy-Zaber-Bin-Zahid/Software-Companies-in-Bangladesh"
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
