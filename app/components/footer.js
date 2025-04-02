import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 px-6 text-center"
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-sm"
        >
          &copy; {new Date().getFullYear()} Teeku Masi's Cloud Kitchen. All
          rights reserved.
        </motion.p>

        <motion.div
          className="flex justify-center space-x-4 mt-4 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">
            Contact Us
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
}
