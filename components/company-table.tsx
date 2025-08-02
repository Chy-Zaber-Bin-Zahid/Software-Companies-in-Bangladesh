"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ExternalLink, MapPin, Code, Globe, Building2, ChevronUp, ChevronDown, Facebook, Linkedin, Twitter } from "lucide-react"
import type { Company } from "@/lib/types"

interface CompanyTableProps {
  companies: Company[]
}

const ITEMS_PER_PAGE = 15

/**
 * Renders an icon based on the social media platform in the label.
 * @param label The label of the website link (e.g., "Website", "Facebook").
 * @returns A Lucide React icon component.
 */
const getLinkIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('facebook')) {
    return <Facebook className="h-3 w-3" />;
  }
  if (lowerLabel.includes('linkedin')) {
    return <Linkedin className="h-3 w-3" />;
  }
  if (lowerLabel.includes('twitter')) {
    return <Twitter className="h-3 w-3" />;
  }
  // Default icon for general websites.
  return <Globe className="h-3 w-3" />;
};


export function CompanyTable({ companies }: CompanyTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  // This effect resets the current page to 1 whenever the list of companies changes (e.g., due to searching).
  // This ensures that search results are always displayed starting from the first page.
  useEffect(() => {
    setCurrentPage(1)
  }, [companies])

  const sortedCompanies = [...companies].sort((a, b) => {
    return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentCompanies = sortedCompanies.slice(startIndex, endIndex)

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const SortIcon = () => {
    return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (companies.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No companies found matching your criteria.</div>
  }

  return (
    <div className="space-y-6">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1}-{Math.min(endIndex, sortedCompanies.length)} of {sortedCompanies.length} companies
        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={toggleSort}>
                <div className="flex items-center gap-2">Company Name <SortIcon /></div>
              </TableHead>
              <TableHead>Office Location</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Web Presence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCompanies.map((company, index) => (
              <TableRow key={startIndex + index} className="hover:bg-muted/50">
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
                    {company.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                  {company.websites.length > 0 ? (
                    company.websites.map((site, siteIndex) => (
                      <Button key={siteIndex} variant="outline" size="sm" asChild>
                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          {getLinkIcon(site.label)}
                          {site.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {currentCompanies.map((company, index) => (
          <Card key={startIndex + index}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{company.name}</h3>
                   <div className="flex flex-col items-end space-y-2">
                    {company.websites.map((site, siteIndex) => (
                        <Button key={siteIndex} variant="outline" size="sm" asChild>
                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            {getLinkIcon(site.label)}
                            {site.label}
                            <ExternalLink className="h-3 w-3" />
                        </a>
                        </Button>
                    ))}
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{company.location}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Technologies:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page as number)
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
