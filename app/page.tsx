"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, RefreshCw } from "lucide-react"
import { CompanyTable } from "@/components/company-table"
import { fetchCompaniesData } from "@/lib/api"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  // State to hold the timestamp, initialized to null.
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // This effect runs only on the client after the component has mounted.
  // This prevents the server and client from rendering different timestamps.
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())
  }, [])

  const {
    data: companies = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompaniesData,
    refetchInterval: 60 * 1000, // Refetch every minute
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  })

  const filteredCompanies = companies.filter((company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Companies in Bangladesh</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and explore technology companies across Bangladesh. Find information about their locations and
            technologies.
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
                <span className="ml-2 text-muted-foreground">Loading companies...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">Error loading companies data. Please try refreshing.</div>
            ) : (
              <CompanyTable companies={filteredCompanies} />
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          {/* Only render the 'Last updated' text when the state has been set on the client */}
          {lastUpdated && (
            <p>Data automatically updates every minute • Last updated: {lastUpdated}</p>
          )}
          <p className="mt-2">
            Source:{" "}
            <a
              href="https://github.com/Chy-Zaber-Bin-Zahid/Software-Companies-in-Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Chy-Zaber-Bin-Zahid/Software-Companies-in-Bangladesh
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
