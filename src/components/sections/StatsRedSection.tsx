import React from "react";
import { motion } from "framer-motion";
import { StatRedCard } from "../ui/StatRedCard";
import { FiUsers, FiMap, FiAirplay, FiBookOpen } from "react-icons/fi";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export const StatsRedSection: React.FC = () => {
  const stats = [
    { icon: <FiUsers />, value: "15 Ribu+", label: "Klien Puas" },
    { icon: <FiAirplay />, value: "90+", label: "Destinasi" },
    { icon: <FiMap />, value: "10 Ribu+", label: "Pelanggan" },
    { icon: <FiBookOpen />, value: "10 Ribu+", label: "Tempat Wisata" },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <motion.div
        className="max-w-7xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {stats.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <StatRedCard
                icon={item.icon}
                value={item.value}
                label={item.label}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
