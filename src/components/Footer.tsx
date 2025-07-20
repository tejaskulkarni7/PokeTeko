import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gradient-tavern border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg shadow-glow animate-glow-pulse flex items-center justify-center">
                <div className="w-6 h-8 bg-gradient-ember rounded-sm relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-lantern-glow rounded-full animate-lantern-flicker"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary-glow">PokeTavern</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your magical destination for legendary Pokemon cards. 
              Each card tells a story waiting to be discovered.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {["Shop All Cards", "New Arrivals", "Rare Cards", "Card Sets", "Gift Cards"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Customer Service</h4>
            <ul className="space-y-2">
              {["Contact Us", "Shipping Info", "Returns", "Card Grading", "Authentication"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">123 Tavern Street, Magic City, MC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">(555) 123-POKE</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">hello@poketavern.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 PokeTavern. All rights reserved. Pokemon cards are © Nintendo/Game Freak.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;