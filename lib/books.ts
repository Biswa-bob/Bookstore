export interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  originalPrice?: number
  category: string
  isbn: string
  publishedDate: string
  publisher: string
  pages: number
  language: string
  coverImage: string
  rating: number
  reviewCount: number
  inStock: boolean
  stockCount: number
  tags: string[]
}

export interface BookFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  search?: string
}

export type SortOption = "relevance" | "price-low" | "price-high" | "rating" | "newest" | "title"

// Mock book data
export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    price: 24.99,
    originalPrice: 29.99,
    category: "Fiction",
    isbn: "978-0525559474",
    publishedDate: "2020-08-13",
    publisher: "Viking",
    pages: 288,
    language: "English",
    coverImage: "/midnight-library-cover.png",
    rating: 4.2,
    reviewCount: 15420,
    inStock: true,
    stockCount: 25,
    tags: ["bestseller", "philosophical", "contemporary"],
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results.",
    price: 18.99,
    category: "Self-Help",
    isbn: "978-0735211292",
    publishedDate: "2018-10-16",
    publisher: "Avery",
    pages: 320,
    language: "English",
    coverImage: "/atomic-habits-inspired-cover.png",
    rating: 4.7,
    reviewCount: 28350,
    inStock: true,
    stockCount: 42,
    tags: ["bestseller", "productivity", "habits"],
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    description:
      "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    price: 16.99,
    originalPrice: 19.99,
    category: "Science Fiction",
    isbn: "978-0441172719",
    publishedDate: "1965-08-01",
    publisher: "Ace Books",
    pages: 688,
    language: "English",
    coverImage: "/dune-frank-herbert-book-cover.png",
    rating: 4.5,
    reviewCount: 45230,
    inStock: true,
    stockCount: 18,
    tags: ["classic", "epic", "space-opera"],
  },
  {
    id: "4",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description:
      "Reclusive Hollywood icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
    price: 22.99,
    category: "Fiction",
    isbn: "978-1501161933",
    publishedDate: "2017-06-13",
    publisher: "Atria Books",
    pages: 400,
    language: "English",
    coverImage: "/seven-husbands-evelyn-hugo-book-cover.png",
    rating: 4.6,
    reviewCount: 32180,
    inStock: true,
    stockCount: 31,
    tags: ["romance", "hollywood", "lgbtq"],
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    description:
      "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    price: 21.99,
    category: "Biography",
    isbn: "978-0399590504",
    publishedDate: "2018-02-20",
    publisher: "Random House",
    pages: 334,
    language: "English",
    coverImage: "/educated-tara-westover-memoir-cover.png",
    rating: 4.4,
    reviewCount: 18750,
    inStock: true,
    stockCount: 22,
    tags: ["memoir", "education", "family"],
  },
  {
    id: "6",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know.",
    price: 19.99,
    category: "Business",
    isbn: "978-0857197689",
    publishedDate: "2020-09-08",
    publisher: "Harriman House",
    pages: 256,
    language: "English",
    coverImage: "/psychology-of-money-book-cover.png",
    rating: 4.3,
    reviewCount: 12450,
    inStock: false,
    stockCount: 0,
    tags: ["finance", "psychology", "investing"],
  },
  {
    id: "7",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description:
      "A lone astronaut must save the earth and humanity in this new science fiction thriller from the author of The Martian.",
    price: 26.99,
    category: "Science Fiction",
    isbn: "978-0593135204",
    publishedDate: "2021-05-04",
    publisher: "Ballantine Books",
    pages: 496,
    language: "English",
    coverImage: "/project-hail-mary-andy-weir-cover.png",
    rating: 4.8,
    reviewCount: 22340,
    inStock: true,
    stockCount: 15,
    tags: ["space", "thriller", "hard-sci-fi"],
  },
  {
    id: "8",
    title: "Becoming",
    author: "Michelle Obama",
    description:
      "In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world.",
    price: 23.99,
    originalPrice: 32.5,
    category: "Biography",
    isbn: "978-1524763138",
    publishedDate: "2018-11-13",
    publisher: "Crown",
    pages: 448,
    language: "English",
    coverImage: "/becoming-michelle-obama-memoir-cover.png",
    rating: 4.7,
    reviewCount: 41250,
    inStock: true,
    stockCount: 28,
    tags: ["memoir", "politics", "inspiration"],
  },
]

export const categories = [
  "All Categories",
  "Fiction",
  "Science Fiction",
  "Biography",
  "Self-Help",
  "Business",
  "Romance",
  "Mystery",
  "History",
  "Philosophy",
]

// Mock API functions
export const booksAPI = {
  async getBooks(filters: BookFilters = {}, sort: SortOption = "relevance"): Promise<Book[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredBooks = [...mockBooks]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.description.toLowerCase().includes(searchLower) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    if (filters.category && filters.category !== "All Categories") {
      filteredBooks = filteredBooks.filter((book) => book.category === filters.category)
    }

    if (filters.minPrice !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.price <= filters.maxPrice!)
    }

    if (filters.rating !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.rating >= filters.rating!)
    }

    if (filters.inStock !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.inStock === filters.inStock)
    }

    // Apply sorting
    switch (sort) {
      case "price-low":
        filteredBooks.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredBooks.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredBooks.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filteredBooks.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        break
      case "title":
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // relevance - keep original order for now
        break
    }

    return filteredBooks
  },

  async getBook(id: string): Promise<Book | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return mockBooks.find((book) => book.id === id) || null
  },

  async getFeaturedBooks(): Promise<Book[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return mockBooks.filter((book) => book.tags.includes("bestseller")).slice(0, 4)
  },
}
