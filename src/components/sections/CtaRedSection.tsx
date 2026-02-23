import React from "react";
import { motion } from "framer-motion";
import PlaneImage from "../../assets/images/pesawat-terbang-removebg-preview.png";
import LaptopMockup from "../../assets/images/asset-laptop-removebg-preview.png";
const leftVariants = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const textContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const textItem = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const CtaRedSection: React.FC = () => {
  return (
    <section className="relative w-full bg-red-600 pt-24 pb-64 overflow-hidden">
      <div className="relative z-30 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-white">
        <motion.div
          className="flex justify-center md:justify-start"
          variants={leftVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <img
            src={LaptopMockup}
            alt="Laptop Mockup"
            className="w-[90%] md:w-[420px] object-contain drop-shadow-2xl"
          />
        </motion.div>
        <motion.div
          variants={textContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h3
            className="text-sm font-semibold tracking-widest mb-2"
            variants={textItem}
          >
            CEPAT DAN AMAN
          </motion.h3>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={textItem}
          >
            Lorem Ipsum
          </motion.h2>

          <motion.p
            className="text-white/90 leading-relaxed mb-4"
            variants={textItem}
          >
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
            Quisque faucibus ex sapien vitae pellentesque sem placerat.
          </motion.p>

          <motion.p
            className="text-white/90 leading-relaxed"
            variants={textItem}
          >
            Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
          </motion.p>
        </motion.div>
      </div>
      <div
        className="
          absolute 
          left-1/2 
          -translate-x-1/2
          bottom-[-50px]
          z-20
          w-[95%] 
          md:w-[70%] 
          lg:w-[35%]
          pointer-events-none
        "
      >
        <motion.img
          src={PlaneImage}
          alt="Pesawat Terbang"
          className="w-full object-contain drop-shadow-2xl"
          animate={{ y: [0, -14, 0] }}
          transition={{
            duration: 3.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{ willChange: "transform" }}
        />
      </div>
      <div
        className="
          absolute 
          bottom-0 
          left-0 
          w-full 
          h-[160px]
          bg-white
          rotate-[-4deg]
          origin-bottom-left
          z-10
        "
      />
    </section>
  );
};
