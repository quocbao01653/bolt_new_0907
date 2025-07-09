import { NextResponse } from 'next/server';

// Mock testimonials endpoint - you can later connect this to a real database
export async function GET() {
  try {
    // This would typically fetch from your database
    // For now, returning mock data that matches the expected format
    const testimonials = [
      {
        id: '1',
        name: "Sarah Johnson",
        role: "Verified Customer",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
        rating: 5,
        comment: "Amazing quality products and super fast delivery! I've been shopping here for over a year and never had a bad experience. Highly recommend!",
        date: "2 weeks ago"
      },
      {
        id: '2',
        name: "Michael Chen",
        role: "Verified Customer",
        avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100",
        rating: 5,
        comment: "The customer service is outstanding. When I had an issue with my order, they resolved it within hours. The product quality exceeded my expectations.",
        date: "1 month ago"
      },
      {
        id: '3',
        name: "Emily Rodriguez",
        role: "Verified Customer",
        avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100",
        rating: 5,
        comment: "Love the variety of products available. Found exactly what I was looking for at a great price. The website is easy to navigate too!",
        date: "3 weeks ago"
      }
    ];

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}