import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSearch from "../HeroSearch";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["trusted", "verified", "skilled", "reliable", "professional"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 pt-8 pb-12 lg:pt-12 lg:pb-20 items-center justify-center flex-col">
          <div>
            <a href="/services">
              <Button variant="secondary" size="sm" className="gap-2">
                Find Local Services <MoveRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl tracking-tighter text-center font-bold">
              <div className="flex items-center justify-center gap-0 flex-nowrap">
                <span className="text-gray-900">Find</span>
                <span className="relative inline-flex items-center justify-center h-[1.2em] w-[200px] md:w-[280px] lg:w-[400px] overflow-visible ml-1">
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute left-0 font-bold text-primary whitespace-nowrap"
                      initial={{ opacity: 0, y: "-100%" }}
                      transition={{ type: "spring", stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? {
                              y: 0,
                              opacity: 1,
                            }
                          : {
                              y: titleNumber > index ? "-100%" : "100%",
                              opacity: 0,
                            }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </div>
              <div className="text-gray-900 mt-2">local services</div>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-3xl text-center mx-auto">
              Connect with verified service providers in your neighborhood. From plumbers to tutors, 
              discover skilled professionals who deliver quality work, right when you need them.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-4xl mt-4">
            <HeroSearch />
          </div>

          <div className="flex flex-row gap-3 mt-6">
            <a href="/contact">
              <Button size="lg" className="gap-2" variant="outline">
                Contact Us <PhoneCall className="w-4 h-4" />
              </Button>
            </a>
            <Link to="/signup?type=worker">
              <Button size="lg" className="gap-2">
                Become a Karigar <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };

