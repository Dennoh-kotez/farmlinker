import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Sign Up for Early Access",
    description: "Join our waitlist to be among the first to experience the power of LaunchPad."
  },
  {
    number: "2",
    title: "Get Onboarded by Our Team",
    description: "Our specialists will guide you through the setup process and help you optimize LaunchPad for your specific needs."
  },
  {
    number: "3",
    title: "Customize Your Workflow",
    description: "Tailor LaunchPad to match your team's existing process and requirements."
  },
  {
    number: "4",
    title: "Invite Team Members",
    description: "Easily add your colleagues to collaborate on projects in real time."
  },
  {
    number: "5",
    title: "Launch Your First Project",
    description: "Start creating and managing your product development with unparalleled efficiency."
  },
  {
    number: "6",
    title: "Track & Optimize",
    description: "Use our analytics to monitor progress and continuously improve your product development process."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            LaunchPad simplifies your product development process in just a few steps
          </motion.p>
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="lg:grid lg:grid-cols-2 lg:gap-6">
              {/* Left column steps */}
              <div className="relative">
                <div className="relative flex flex-col space-y-10">
                  {steps.slice(0, 3).map((step, index) => (
                    <motion.div 
                      key={step.number} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <span className="text-lg font-medium">{step.number}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                        <p className="mt-1 text-base text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right column steps */}
              <div className="relative mt-10 lg:mt-0">
                <div className="relative flex flex-col space-y-10">
                  {steps.slice(3).map((step, index) => (
                    <motion.div 
                      key={step.number} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <span className="text-lg font-medium">{step.number}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                        <p className="mt-1 text-base text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
