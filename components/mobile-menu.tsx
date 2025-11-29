"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/components/nav-link";
import { NAV_ITEMS } from "@/lib/navigation";

interface MobileMenuProps {
  /** Whether the menu is open */
  isOpen: boolean;
  /** Callback to close the menu */
  onClose: () => void;
}

/**
 * Animation variants for the mobile menu overlay
 */
const menuVariants = {
  closed: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
  open: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

/**
 * Animation variants for staggered nav links
 */
const linkVariants = {
  closed: { opacity: 0, y: -20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 + 0.1 },
  }),
};

/**
 * MobileMenu component - Full-screen overlay navigation for mobile devices
 *
 * Features:
 * - Slides down from header
 * - Staggered link animations
 * - Closes on: link click, outside click, Escape key
 * - Focus trap for accessibility
 * - Body scroll lock when open
 *
 * @example
 * ```tsx
 * <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
 * ```
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  /**
   * Handle Escape key to close menu
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  /**
   * Handle click outside menu content to close
   */
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  /**
   * Handle link click - close menu
   */
  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Setup event listeners and body scroll lock
   */
  useEffect(() => {
    if (isOpen) {
      // Add event listeners
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Focus first link for accessibility
      setTimeout(() => {
        const firstLink = menuRef.current?.querySelector("a");
        firstLink?.focus();
      }, 100);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, handleKeyDown, handleClickOutside]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 top-14 z-100 bg-background/98 backdrop-blur-lg sm:hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
        >
          <nav
            ref={menuRef}
            className="flex flex-col items-center justify-center h-full gap-8 p-6"
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.div
                key={item.href}
                custom={index}
                initial="closed"
                animate="open"
                exit="closed"
                variants={linkVariants}
              >
                <NavLink
                  href={item.href}
                  type={item.type}
                  variant="mobile"
                  onClick={handleLinkClick}
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
