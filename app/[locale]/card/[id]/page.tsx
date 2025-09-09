import { notFound } from "next/navigation";
import Image from "next/image";

async function getProduct(id: string) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CardDetails({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return (
    <section className="px-6 py-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
        {/* Image */}
        <div className="flex-1 flex justify-center">
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-semibold text-blue-600 mb-2">
            ${product.price}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            ⭐ {product.rating.rate} ({product.rating.count} reviews)
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}