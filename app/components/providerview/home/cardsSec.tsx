import Image from "next/image";

export default function CardsSection() {
  return (
    <section className="py-16 px-8">
      {/* Title + button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Title</h2>
        <button className="text-sm px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
          See all
        </button>
      </div>

      {/* Grid */}
      <div
        className="
          grid gap-4
          grid-cols-2 md:grid-cols-3
          auto-rows-[150px] md:auto-rows-[200px]
        "
      >
        {/* العمود الأول */}
        <div className="col-span-1 row-span-1">
          <Image
            src="/herosec.png"
            alt="image"
            width={400}
            height={200}
            className="w-full h-full object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
          />
        </div>
        <div className="col-span-1 row-span-1">
          <Image
            src="/herosec.jpg"
            alt="image"
            width={400}
            height={200}
            className="w-full h-full object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
          />
        </div>
 <div className="col-span-2 md:col-span-1 md:row-span-2">
          <Image
            src="/stadium.jpg"
            alt="image"
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
          />
        </div>
        {/* العمود الثاني */}
        <div className="col-span-1 row-span-1">
          <Image
            src="/hotal.jpg"
            alt="image"
            width={400}
            height={200}
            className="w-full h-full object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
          />
        </div>
        
        <div className="col-span-1 row-span-1">
          <Image
            src="/school.jpg"
            alt="image"
            width={400}
            height={200}
            className="w-full h-full object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
          />
        </div>

        {/* العمود الثالث (يمتد صفين) */}
       
      </div>
    </section>
  );
}