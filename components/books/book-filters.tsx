"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import type { BookFilters } from "@/lib/books"
import { categories } from "@/lib/books"

interface BookFiltersProps {
  filters: BookFilters
  onFiltersChange: (filters: BookFilters) => void
  onClearFilters: () => void
}

export function BookFiltersComponent({ filters, onFiltersChange, onClearFilters }: BookFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 50])

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category === "All Categories" ? undefined : category })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      minPrice: values[0] === 0 ? undefined : values[0],
      maxPrice: values[1] === 50 ? undefined : values[1],
    })
  }

  const handleRatingChange = (rating: string) => {
    onFiltersChange({ ...filters, rating: rating === "all" ? undefined : Number(rating) })
  }

  const handleStockChange = (checked: boolean) => {
    onFiltersChange({ ...filters, inStock: checked ? true : undefined })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== "")

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={filters.category || "All Categories"} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider value={priceRange} onValueChange={handlePriceChange} max={50} min={0} step={1} className="w-full" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <Select value={filters.rating?.toString() || "all"} onValueChange={handleRatingChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox id="inStock" checked={filters.inStock || false} onCheckedChange={handleStockChange} />
          <Label htmlFor="inStock" className="text-sm">
            In Stock Only
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
