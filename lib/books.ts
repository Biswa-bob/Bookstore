import { tokenStorage } from './auth';
import { apiCall } from './utils';

export interface Book {
	id: string;
	title: string;
	author: string;
	description: string;
	price_cents: number;
	originalPrice?: number;
	category: string;
	isbn: string;
	publishedDate: string;
	publisher: string;
	pages: number;
	language: string;
	stock: number;
	tags: string[];
	// coverImage: string;
	// rating: number;
	// reviewCount: number;
	inStock: boolean;
}

export interface GetAllBookResponse {
	books: Book[];
}

export interface GetBookByIDResponse {
	book: Book;
}

export interface BookFilters {
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	rating?: number;
	inStock?: boolean;
	search?: string;
}

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'title';

export const categories = [
	'All Categories',
	'Fiction',
	'Science Fiction',
	'Biography',
	'Self-Help',
	'Business',
	'Romance',
	'Mystery',
	'History',
	'Philosophy',
];

// Mock API functions
export const booksAPI = {
	async getBooks(filters: BookFilters = {}, sort: SortOption = 'relevance'): Promise<Book[]> {
		// Simulate API delay

		console.log('inside get book');

		const tokens = tokenStorage.getTokens();
		if (!tokens?.accessToken) throw new Error('No access token available');
		// let filteredBooks = [...mockBooks];

		// // Apply filters
		// if (filters.search) {
		// 	const searchLower = filters.search.toLowerCase();
		// 	filteredBooks = filteredBooks.filter(
		// 		(book) =>
		// 			book.title.toLowerCase().includes(searchLower) ||
		// 			book.author.toLowerCase().includes(searchLower) ||
		// 			book.description.toLowerCase().includes(searchLower) ||
		// 			book.tags.some((tag) => tag.toLowerCase().includes(searchLower))
		// 	);
		// }

		// if (filters.category && filters.category !== 'All Categories') {
		// 	filteredBooks = filteredBooks.filter((book) => book.category === filters.category);
		// }

		// if (filters.minPrice !== undefined) {
		// 	filteredBooks = filteredBooks.filter((book) => book.price >= filters.minPrice!);
		// }

		// if (filters.maxPrice !== undefined) {
		// 	filteredBooks = filteredBooks.filter((book) => book.price <= filters.maxPrice!);
		// }

		// if (filters.rating !== undefined) {
		// 	filteredBooks = filteredBooks.filter((book) => book.rating >= filters.rating!);
		// }

		// if (filters.inStock !== undefined) {
		// 	filteredBooks = filteredBooks.filter((book) => book.inStock === filters.inStock);
		// }

		// // Apply sorting
		// switch (sort) {
		// 	case 'price-low':
		// 		filteredBooks.sort((a, b) => a.price - b.price);
		// 		break;
		// 	case 'price-high':
		// 		filteredBooks.sort((a, b) => b.price - a.price);
		// 		break;
		// 	case 'rating':
		// 		filteredBooks.sort((a, b) => b.rating - a.rating);
		// 		break;
		// 	case 'newest':
		// 		filteredBooks.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
		// 		break;
		// 	case 'title':
		// 		filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
		// 		break;
		// 	default:
		// 		// relevance - keep original order for now
		// 		break;
		// }

		const resp = await apiCall<GetAllBookResponse>('/books', {
			method: 'GET',
			headers: { Authorization: `Bearer ${tokens.accessToken}` },
		});
		return resp.books;
		// return filteredBooks;
	},

	async getBook(id: string): Promise<Book | null> {
		// Simulate API delay
		const tokens = tokenStorage.getTokens();
		if (!tokens?.accessToken) throw new Error('No access token available');
		const resp = await apiCall<GetBookByIDResponse>(`/books/${id}`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${tokens.accessToken}` },
		});
		return resp.book;
	},

	// async getFeaturedBooks(): Promise<Book[]> {
	// 	// Simulate API delay
	// 	await new Promise((resolve) => setTimeout(resolve, 200));

	// 	return mockBooks.filter((book) => book.tags.includes('bestseller')).slice(0, 4);
	// },
};
