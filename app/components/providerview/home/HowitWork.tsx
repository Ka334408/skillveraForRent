import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="py-16 px-8 text-center my-5">
      <h2 className="text-2xl md:text-3xl font-bold mb-12">HOW IT WORKS</h2>

      {/* الصف الأول: 3 كروت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Image
          src="/herosec.png"
          alt="step 1"
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
        />
        <Image
          src="/herosec.png"
          alt="step 2"
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
        />
        <Image
          src="/herosec.png"
          alt="step 3"
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
        />
      </div>

      {/* الصف الثاني: كرت عريض */}
      <div>
        <Image
          src="/hotal.jpg"
          alt="full width"
          width={900}
          height={250}
          className="w-full h-56 object-cover rounded-xl border-2 border-transparent hover:border-blue-500 hover:scale-105 transition"
        />
      </div>
    </section>
  );
}