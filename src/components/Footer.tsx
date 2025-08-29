import {Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PokeTavernLogo from "@/assets/lantern_logo.png";
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  const seeAllCards = () => {
    navigate("/all-cards");
  };

  const seeAllApparel = () => {
    navigate("/apparel");
  };

  const seeServices = () => {
    navigate("/services");
  }

  const seeCart = () => {
    navigate("/cart");
  }

  const goToContact = () => {
    navigate("/services#contact");
  }

  const goToPrivacy = () => {
    navigate("/privacy");
  }

  return (
    <footer className="bg-gradient-tavern border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, #ffd9007e 0%, transparent 90%)",
                    filter: "blur(9px)",
                    zIndex: 0,
                  }}
                />
                <img
                  src={PokeTavernLogo}
                  alt="PokeTavern Logo"
                  className="w-10 h-10 bg-transparent relative z-10"
                />
              </div>
              <h1 className="text-2xl font-bold text-white px-0 py-0">
                PokeTeko
              </h1>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your magical destination for everything Pokemon. 
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Shop All Cards", action: seeAllCards },
                { name: "Shop Apparel", action: seeAllApparel },
                { name: "PokeTeko Services", action: seeServices },
                { name: "My Cart", action: seeCart },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={link.action}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Customer Service</h4>
            <ul className="space-y-2">
              {[
                { name: "Contact Us", action: goToContact },
                { name: "Shipping Info & Returns", action: goToPrivacy },
                { name: "Terms of Service", action: goToPrivacy },
                { name: "Privacy Policy", action: goToPrivacy },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={link.action}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
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
                <span className="text-sm">Fremont, California</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">510-993-8339</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">tejkul7@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 PokeTeko. All rights reserved. Pokemon cards are © Nintendo/Game Freak.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;