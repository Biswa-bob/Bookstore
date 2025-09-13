'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Book } from '@/lib/books';
import { booksAPI } from '@/lib/books';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';

export default function BookDetailPage() {
	const params = useParams();
	const [book, setBook] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const { addItem } = useCart();
	const { toast } = useToast();

	useEffect(() => {
		const loadBook = async () => {
			if (!params.id || typeof params.id !== 'string') return;

			setLoading(true);
			try {
				const fetchedBook = await booksAPI.getBook(params.id);
				setBook(fetchedBook);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to load book details',
					variant: 'destructive',
				});
			} finally {
				setLoading(false);
			}
		};

		loadBook();
	}, [params.id, toast]);

	const handleAddToCart = () => {
		if (!book) return;

		addItem(book, quantity);
		toast({
			title: 'Added to Cart',
			description: `${quantity} copy${quantity > 1 ? 'ies' : ''} of "${book.title}" added to cart`,
		});
	};

	const handleAddToWishlist = () => {
		if (!book) return;

		toast({
			title: 'Added to Wishlist',
			description: `"${book.title}" has been added to your wishlist`,
		});
	};

	if (loading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='animate-pulse'>
					<div className='flex gap-8'>
						<div className='w-80 aspect-[3/4] bg-muted rounded-lg' />
						<div className='flex-1 space-y-4'>
							<div className='h-8 bg-muted rounded w-3/4' />
							<div className='h-6 bg-muted rounded w-1/2' />
							<div className='h-4 bg-muted rounded w-1/4' />
							<div className='h-20 bg-muted rounded' />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!book) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='text-center py-16'>
					<h1 className='text-2xl font-bold mb-4'>Book Not Found</h1>
					<p className='text-muted-foreground mb-8'>The book you're looking for doesn't exist.</p>
					<Button asChild>
						<Link href='/books'>Browse Books</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Back Button */}
			<Button variant='ghost' asChild className='mb-6'>
				<Link href='/books'>
					<ArrowLeft className='h-4 w-4 mr-2' />
					Back to Books
				</Link>
			</Button>

			<div className='grid lg:grid-cols-2 gap-12'>
				{/* Book Cover */}
				<div className='space-y-4'>
					<div className='relative aspect-[3/4] max-w-md mx-auto lg:mx-0'>
						<Image
							src={'/placeholder.svg'}
							alt={`${book.title} cover`}
							fill
							className='object-cover rounded-lg shadow-lg'
						/>
						{book.originalPrice && (
							<Badge variant='destructive' className='absolute top-4 right-4'>
								Sale
							</Badge>
						)}
						{!book.inStock && (
							<Badge variant='secondary' className='absolute top-4 left-4'>
								Out of Stock
							</Badge>
						)}
					</div>
				</div>

				{/* Book Details */}
				<div className='space-y-6'>
					<div>
						<h1 className='text-3xl font-bold mb-2'>{book.title}</h1>
						<p className='text-xl text-muted-foreground mb-4'>by {book.author}</p>

						<div className='flex items-center gap-4 mb-4'>
							<div className='flex items-center gap-1'>
								<Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
								{/* <span className="font-medium">{book.rating}</span> */}
								{/* <span className="text-muted-foreground">({book.reviewCount.toLocaleString()} reviews)</span> */}
							</div>
							<Badge variant='outline'>{book.category}</Badge>
						</div>

						<div className='flex items-center gap-3 mb-6'>
							<span className='text-3xl font-bold text-primary'>${book.price_cents}</span>
							{book.originalPrice && (
								<span className='text-xl text-muted-foreground line-through'>
									${book.originalPrice}
								</span>
							)}
						</div>
					</div>

					<Separator />

					{/* Description */}
					<div>
						<h3 className='text-lg font-semibold mb-3'>Description</h3>
						<p className='text-muted-foreground leading-relaxed'>{book.description}</p>
					</div>

					<Separator />

					{/* Purchase Actions */}
					<div className='space-y-4'>
						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-2'>
								<label htmlFor='quantity' className='text-sm font-medium'>
									Quantity:
								</label>
								<select
									id='quantity'
									value={quantity}
									onChange={(e) => setQuantity(Number(e.target.value))}
									className='border rounded px-3 py-1 bg-background'
									// disabled={!book.inStock}
								>
									{[...Array(Math.min(book.stock, 10))].map((_, i) => (
										<option key={i + 1} value={i + 1}>
											{i + 1}
										</option>
									))}
								</select>
							</div>
							{book.inStock && (
								<span className='text-sm text-muted-foreground'>{book.stock} in stock</span>
							)}
						</div>

						<div className='flex gap-3'>
							<Button size='lg' className='flex-1' onClick={handleAddToCart} disabled={!book.inStock}>
								<ShoppingCart className='h-5 w-5 mr-2' />
								{book.inStock ? 'Add to Cart' : 'Out of Stock'}
							</Button>
							<Button variant='outline' size='lg' onClick={handleAddToWishlist}>
								<Heart className='h-5 w-5' />
							</Button>
							<Button variant='outline' size='lg'>
								<Share2 className='h-5 w-5' />
							</Button>
						</div>
					</div>

					<Separator />

					{/* Book Details */}
					<Card>
						<CardContent className='p-6'>
							<h3 className='text-lg font-semibold mb-4'>Book Details</h3>
							<div className='grid grid-cols-2 gap-4 text-sm'>
								<div>
									<span className='font-medium'>ISBN:</span>
									<p className='text-muted-foreground'>{book.isbn}</p>
								</div>
								<div>
									<span className='font-medium'>Publisher:</span>
									{/* <p className='text-muted-foreground'>{book.publisher}</p> */}
								</div>
								<div>
									<span className='font-medium'>Published:</span>
									<p className='text-muted-foreground'>
										{/* {new Date(book.publishedDate).toLocaleDateString()} */}
									</p>
								</div>
								<div>
									<span className='font-medium'>Pages:</span>
									{/* <p className='text-muted-foreground'>{book.pages}</p> */}
								</div>
								<div>
									<span className='font-medium'>Language:</span>
									{/* <p className='text-muted-foreground'>{book.language}</p> */}
								</div>
								<div>
									<span className='font-medium'>Tags:</span>
									<div className='flex flex-wrap gap-1 mt-1'>
										{book.tags.map((tag) => (
											<Badge key={tag} variant='secondary' className='text-xs'>
												{tag}
											</Badge>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
