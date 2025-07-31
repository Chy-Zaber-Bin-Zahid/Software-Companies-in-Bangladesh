"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, MapPin, Code, Users, Globe, Building2 } from "lucide-react"
import type { Company } from "@/lib/types"

interface CompanyTableProps {
  companies: Company[]
}

export function CompanyTable({ companies }: CompanyTableProps) {
  const [sortBy, setSortBy] = useState<keyof Company>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortedCompanies = [...companies].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    if (sortBy === "engineers") {
      aValue = typeof aValue === "number" ? aValue : 0
      bValue = typeof bValue === "number" ? bValue : 0
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const handleSort = (column: keyof Company) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  if (companies.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No companies found matching your criteria.</div>
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                Company Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("location")}>
                Office Location {sortBy === "location" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Web Presence</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("engineers")}>
                Engineers {sortBy === "engineers" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompanies.map((company, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {company.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{company.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {company.technologies.slice(0, 3).map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {company.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {company.website ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {typeof company.engineers === "number" ? `${company.engineers}+` : company.engineers}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedCompanies.map((company, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{company.name}</h3>
                  {company.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{company.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {typeof company.engineers === "number" ? `${company.engineers}+ Engineers` : company.engineers}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Technologies:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
