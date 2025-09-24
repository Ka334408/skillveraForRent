import { Compass, Cpu, Wrench, Rocket } from "lucide-react";
export const features = [
    { key: "planning", icon: Compass, side: "left", top: "top-[15%]" },
    { key: "prototype", icon: Cpu, side: "left", top: "bottom-[15%]" },
    { key: "refinement", icon: Wrench, side: "right", top: "top-[15%]" },
    { key: "scale", icon: Rocket, side: "right", top: "bottom-[15%]" },
];

export const faqs = [
    {
        question: "How Many Steps To Get A Rent Done?",
        answer:
            "Et lectus viverra aenean malesuada praesent. Egestas praesent quam auctor amet ac, ac vel. Euismod proin massa feugiat gravida tellus auctor ac, vitae justo.",
    },
    {
        question: "Do We Get Electronic Invoice?",
        answer:
            "Yes, you will receive an electronic invoice immediately after completing the rent process.",
    },
    {
        question: "Can We Reschedule The Rent Date?",
        answer:
            "Yes, you can reschedule your rent date by contacting our support team in advance.",
    },
    {
        question: "Can We Rent More Than One Facility?",
        answer:
            "Of course, you can rent multiple facilities at the same time depending on availability.",
    },
    {
        question: "What Do We Need To Rent A Facility?",
        answer:
            "You only need valid identification and payment details to rent a facility.",
    },
];

export const logos = [
  "/logo1.png",
  "/logo2.png",
  "/logo3.png",
  "/logo4.png",
  "/logo5.png",
];

const categoryImages: Record<string, string> = {
  Sports: "/stadium.jpg",
  Education: "/school.jpg",
  hotal: "/hotal.jpg"
};

export const facilitiesData = Array.from({ length: 100 }, (_, i) => {
  const category = i % 3 === 0 ? "Sports" : i % 3 === 1 ? "Education" : "hotal";

  return {
    id: i + 1,
    name: `Facility ${i + 1}`,
    description: `Description for facility ${i + 1}, lorem ipsum dolor sit amet.`,
    location: i % 2 === 0 ? "Riyadh" : "Jeddah",
    price: 400 + (i % 5) * 100,
    category,
    image:
      categoryImages[category] ||
      `https://picsum.photos/200/150?random=${i}`,
    lat: 24.7136 + i * 0.01,
    lng: 46.6753 + i * 0.01,
  };
});