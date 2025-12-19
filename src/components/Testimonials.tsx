import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Karigar connected me with an excellent plumber within minutes. The service was professional, on-time, and reasonably priced. Made finding local help so easy!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    name: "Priya Sharma",
    role: "Homeowner",
  },
  {
    text: "As a small business owner, I needed reliable electricians. Karigar connected me with verified professionals who understood my needs perfectly.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    name: "Rajesh Kumar",
    role: "Business Owner",
  },
  {
    text: "Found a great tutor for my daughter through Karigar. The platform is trustworthy and the reviews helped me make the right choice.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    name: "Amit Patel",
    role: "Parent",
  },
  {
    text: "The AC technician I found through Karigar was skilled and professional. The transparent pricing and easy booking made everything stress-free.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    name: "Suresh Reddy",
    role: "Homeowner",
  },
  {
    text: "Karigar's platform made it easy to find a trusted cleaner. The verification process and reviews gave me confidence in my choice.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    name: "Anjali Mehta",
    role: "Working Professional",
  },
  {
    text: "I needed urgent plumbing help and Karigar connected me with someone available immediately. Great service and reliable professionals!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    name: "Vikram Singh",
    role: "Homeowner",
  },
  {
    text: "The mechanic I found through Karigar fixed my car quickly and at a fair price. The platform's transparency is what sets it apart.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    name: "Arjun Nair",
    role: "Car Owner",
  },
  {
    text: "Karigar helped me find an excellent electrician for my home renovation. The verified profiles and reviews made decision-making easy.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    name: "Neha Desai",
    role: "Homeowner",
  },
  {
    text: "As a service provider, Karigar has helped me grow my local business. The platform connects me with customers who need my services.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    name: "Mohammed Ali",
    role: "Service Provider",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-gray-50 my-20 relative">
      <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-gray-200 py-1 px-4 rounded-lg bg-white text-gray-700 text-sm font-medium">
              Testimonials
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-gray-900 text-center">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75 text-gray-600">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

