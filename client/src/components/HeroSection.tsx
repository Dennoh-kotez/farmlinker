import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="pt-10 sm:pt-16 lg:pt-24 bg-gradient-to-r from-primary/10 to-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">The Future of</span>
              <span className="block text-primary">Product Innovation</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              LaunchPad helps teams build better products faster. Our intuitive platform streamlines your workflow, enhances collaboration, and accelerates your time to market.
            </p>
            <div className="mt-8 sm:mt-10">
              <div className="rounded-md shadow">
                <a href="#waitlist">
                  <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10">
                    Join the Waitlist
                  </Button>
                </a>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-sm text-gray-500">Be among the first to experience LaunchPad</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Team collaborating on a project using LaunchPad"
                className="w-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center mt-16 sm:mt-24">
          <span className="px-3 bg-gray-50 text-lg font-medium text-gray-500">Trusted by innovative teams</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-1 flex justify-center items-center">
            <div className="text-gray-400 font-semibold">Company A</div>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <div className="text-gray-400 font-semibold">Company B</div>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <div className="text-gray-400 font-semibold">Company C</div>
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <div className="text-gray-400 font-semibold">Company D</div>
          </div>
        </div>
      </div>
    </section>
  );
}
