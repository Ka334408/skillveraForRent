import Benefits from "@/app/components/aboutus/benfiets";
import Hero from "@/app/components/aboutus/hero";
import Story from "@/app/components/aboutus/story";
import Testimonials from "@/app/components/aboutus/testimonials";
import Header from "@/app/components/header";
import { useLocale } from "next-intl";


export default function AboutPage() {

  const locale = useLocale();
  const loginUrl = `/${locale}/auth/login`;
  const signupUrl = `/${locale}/auth/signUp`;
  return (
    <main>
        <Header bgColor="bg-[#f3f4f4] border-b-gray-200"    loginLink={loginUrl}
          signupLink={signupUrl} />
      <Hero />
      <Benefits />
      <Story />
      <Testimonials />
    </main>
  );
}