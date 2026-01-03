import Benefits from "@/app/components/aboutus/benfiets";
import Hero from "@/app/components/aboutus/hero";
import Story from "@/app/components/aboutus/story";
import Testimonials from "@/app/components/aboutus/testimonials";
import Header from "@/app/components/header";


export default function AboutPage() {
  return (
    <main>
        <Header bgColor="bg-[#f3f4f4] border-b-gray-200"    loginLink="/auth/login"
        signupLink="/auth/signUp" />
      <Hero />
      <Benefits />
      <Story />
      <Testimonials />
    </main>
  );
}