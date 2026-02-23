import React from "react";
import { motion } from "framer-motion";
import PesawatLanding from "../../assets/images/pesawatlanding.jpeg";

const imageVariants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const textContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const textItem = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          className="w-full"
          variants={imageVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <img
            src={PesawatLanding}
            alt="Pesawat Landing"
            className="w-full h-auto rounded-3xl shadow-lg object-cover"
          />
        </motion.div>
        <motion.div
          variants={textContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            variants={textItem}
          >
            Tentang Ezytix
          </motion.h2>

          <motion.p
            className="text-gray-600 leading-relaxed mb-4"
            variants={textItem}
          >
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor.
          </motion.p>

          <motion.p
            className="text-gray-600 leading-relaxed"
            variants={textItem}
          >
            Pulvinar vivamus fringilla lacus nec metus bibendum egestas. lacus
            massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
            semper vel class eget praesent. Auctor id tortor torquent per conubia
            nostra inceptos himenaeos.
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
};
