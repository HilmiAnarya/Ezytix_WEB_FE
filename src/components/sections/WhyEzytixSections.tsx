import React from "react";
import { FeatureCard } from "../ui/FeatureCard";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const WhyEzytixSection: React.FC = () => {
  const features = [
    {
      icon: <FiCheckCircle />,
      title: "Diversity in choice",
      description:
        "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
    },
    {
      icon: <FiCheckCircle />,
      title: "Diversity in choice",
      description:
        "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
    },
    {
      icon: <FiCheckCircle />,
      title: "Diversity in choice",
      description:
        "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
    },
    {
      icon: <FiCheckCircle />,
      title: "Diversity in choice",
      description:
        "Lorem ipsum dolor sit amet consectetur. Libero amet diam pellentesque gravida.",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-900"
          variants={itemVariants}
        >
          Kenapa Harus Ezytix?
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {features.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
