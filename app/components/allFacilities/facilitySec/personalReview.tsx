import ReviewCard from "../../mainComponents/reviewCard";


export default function ReviewsList() {
  const reviews = [
    {
      name: "Alexa Rawles",
      email: "alexa@email.com",
      avatar: "/herosec.jpg",
      review: "Room was very clean and looked just like the photo.",
      rating: 5,
      date: "4 days ago",
      nights: 2,
    },
    {
      name: "John Doe",
      email: "john@email.com",
      avatar: "/herosec.jpg",
      review: "Great experience, but sometimes noisy at night.",
      rating: 4,
      date: "1 week ago",
      nights: 3,
    },
     {
      name: "John Doe",
      email: "john@email.com",
      avatar: "/herosec.jpg",
      review: "Great experience, but sometimes noisy at night.",
      rating: 4,
      date: "1 week ago",
      nights: 3,
    },
     {
      name: "John Doe",
      email: "john@email.com",
      avatar: "/herosec.jpg",
      review: "Great experience, but sometimes noisy at night.",
      rating: 4,
      date: "1 week ago",
      nights: 3,
    },
     {
      name: "John Doe",
      email: "john@email.com",
      avatar: "/herosec.jpg",
      review: "Great experience, but sometimes noisy at night.",
      rating: 4,
      date: "1 week ago",
      nights: 3,
    },
     {
      name: "John Doe",
      email: "john@email.com",
      avatar: "/herosec.jpg",
      review: "Great experience, but sometimes noisy at night.",
      rating: 4,
      date: "1 week ago",
      nights: 3,
    },
     {
      name: "John Doe",
      email: "john@email.com",
      avatar: "/herosec.jpg",
      review: "Great experience, but sometimes noisy at night.",
      rating: 4,
      date: "1 week ago",
      nights: 3,
    },
  ];

  return (
    <div>
    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
      {reviews.map((r, i) => (
        <ReviewCard key={i} {...r} />
      ))}
    </div>
    <p className="border-b-2 border-b-blue-700 mt-10"/>
    </div>
  );
}