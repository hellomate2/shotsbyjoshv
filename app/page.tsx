import { ClientWrapper } from "@/components/ClientWrapper";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { About } from "@/components/About";
import { Faq } from "@/components/Faq";
import { InstagramBand } from "@/components/InstagramBand";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <ClientWrapper>
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Faq />
      <InstagramBand />
      <Footer />
    </ClientWrapper>
  );
}
