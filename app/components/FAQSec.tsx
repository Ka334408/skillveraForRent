"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-white">
      {/* Title */}
      <div className="text-center mb-8">
        <p className="text-blue-600 font-medium uppercase tracking-wide">FAQ</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Frequently Asked Question
        </h2>
        <p className="text-gray-600">
          Did you find the question as you expected?
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border rounded-xl p-4 transition-all duration-300 ${
              openIndex === index ? "bg-blue-50 border-blue-500" : "border-gray-300"
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left font-semibold text-gray-900"
            >
              {faq.question}
              {openIndex === index ? (
                <Minus className="w-5 h-5 text-blue-600" />
              ) : (
                <Plus className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {openIndex === index && (
              <div className="mt-3 text-gray-600 text-sm">
                {faq.answer}
                <p className="text-blue-600 font-medium mt-2 cursor-pointer">
                  Read More
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-8">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Give a Quote
        </button>
      </div>
    </section>
  );
}