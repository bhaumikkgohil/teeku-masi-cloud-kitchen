import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-green-800 to-green-500 text-white py-4 px-4 text-center"
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-sm text-green-100"
        >
          &copy; {new Date().getFullYear()} Teeku Masi's Tiffin. All rights
          reserved.
        </motion.p>

        <motion.div
          className="flex justify-center space-x-3 mt-2 text-xs text-green-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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
            Contact
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
}
