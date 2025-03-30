import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Jane Doe",
    role: "Product Manager, Company A",
    initials: "JD",
    content: "LaunchPad has transformed how our team approaches product development. We've cut our time to market by 30%."
  },
  {
    name: "John Smith",
    role: "CTO, Company B",
    initials: "JS",
    content: "The collaboration features are incredible. Our remote team feels more connected than ever before."
  },
  {
    name: "Alice Lee",
    role: "Design Lead, Company C",
    initials: "AL",
    content: "The analytics tools have given us insights we never had before. We're making more informed decisions."
  }
];

export default function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Early Testers Say
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hear from teams who've had a sneak peek at LaunchPad
          </motion.p>
        </div>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20">
                    <span className="text-primary text-lg font-semibold">{testimonial.initials}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
