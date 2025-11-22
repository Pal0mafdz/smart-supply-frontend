import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, ShoppingCart, ClipboardList } from "lucide-react";

const navItems = [
  { title: "Mesas", url: "/tables", icon: Utensils },
  { title: "Carrito", url: "/menu-cart", icon: ShoppingCart },
  { title: "Órdenes", url: "/waiter-orders", icon: ClipboardList },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.nav
        key="bottom-nav"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="fixed bottom-0 left-0 right-0 bg-black text-stone-300 border-t border-stone-700 shadow-lg"
      >
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-white" : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <span className="text-xs">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default BottomNav;

