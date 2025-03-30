import { motion } from "framer-motion";
import { Zap, MessageSquare, LineChart, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Lightning Fast Workflow",
    description: "Automate repetitive tasks and optimize your team's productivity with our intuitive workflow tools.",
    icon: Zap,
  },
  {
    name: "Real-time Collaboration",
    description: "Work together seamlessly with your team members regardless of their location or time zone.",
    icon: MessageSquare,
  },
  {
    name: "Actionable Analytics",
    description: "Make data-driven decisions with our comprehensive analytics and reporting tools.",
    icon: LineChart,
  },
  {
    name: "Enterprise-grade Security",
    description: "Rest easy knowing your data is protected with our state-of-the-art security measures.",
    icon: ShieldCheck,
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Key Features
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to streamline your product development lifecycle
          </motion.p>
        </div>

        <motion.div
          className="mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
