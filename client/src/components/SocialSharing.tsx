import { motion } from "framer-motion";
import { Twitter, Facebook, Linkedin } from "lucide-react";

export default function SocialSharing() {
  const pageUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent("I just joined the waitlist for LaunchPad, the ultimate product development platform. Check it out!");

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Excited about LaunchPad? Share with your network
          </h2>
          <div className="mt-6 flex justify-center space-x-6">
            <motion.a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 transition-colors"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </motion.a>
            <motion.a
              href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 transition-colors"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </motion.a>
            <motion.a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 transition-colors"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
