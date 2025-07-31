"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2, Code, Users, RefreshCw } from "lucide-react"
import { CompanyTable } from "@/components/company-table"
import { fetchCompaniesData } from "@/lib/api"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [technologyFilter, setTechnologyFilter] = useState("all")

  const {
    data: companies = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompaniesData,
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
    staleTime: 30 * 60 * 1000, // Consider data stale after 30 minutes
  })

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation =
      locationFilter === "all" || company.location.toLowerCase().includes(locationFilter.toLowerCase())

    const matchesTechnology =
      technologyFilter === "all" ||
      company.technologies.some((tech) => tech.toLowerCase().includes(technologyFilter.toLowerCase()))

    return matchesSearch && matchesLocation && matchesTechnology
  })

  const uniqueLocations = [...new Set(companies.map((c) => c.location.split(",")[0].trim()))]
  const uniqueTechnologies = [...new Set(companies.flatMap((c) => c.technologies))]

  const stats = {
    totalCompanies: companies.length,
    totalEngineers: companies.reduce((sum, company) => {
      const engineers = typeof company.engineers === "number" ? company.engineers : 0
      return sum + engineers
    }, 0),
    avgEngineers:
      companies.length > 0
        ? Math.round(
            companies.reduce((sum, company) => {
              const engineers = typeof company.engineers === "number" ? company.engineers : 0
              return sum + engineers
            }, 0) / companies.filter((c) => typeof c.engineers === "number").length,
          )
        : 0,
    topTechnologies: uniqueTechnologies.slice(0, 5),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Companies in Bangladesh</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and explore technology companies across Bangladesh. Find information about their locations,
            technologies, and team sizes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engineers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEngineers}+</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgEngineers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Technologies</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueTechnologies.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technologies</SelectItem>
                  {uniqueTechnologies.slice(0, 20).map((tech) => (
                    <SelectItem key={tech} value={tech.toLowerCase()}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => refetch()}
                disabled={isFetching}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredCompanies.length} of {companies.length} companies
              {isFetching && " • Updating..."}
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
          <p>Data automatically updates every hour • Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-2">
            Source:{" "}
            <a
              href="https://github.com/MBSTUPC/tech-companies-in-bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MBSTUPC/tech-companies-in-bangladesh
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
