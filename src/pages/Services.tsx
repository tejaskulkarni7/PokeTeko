import Header from "@/components/Header"; // Add this import
import Footer from "@/components/Footer"; // Add Footer import
import FloatingPlanets from '../components/Services/FloatingPlanets';
import emailjs from '@emailjs/browser';
import { useRef } from 'react';
import TiltedCard from '../components/Services/TiltedCard';
import Particles from '../components/Services/Particles.tsx';
import Hydreigon from '@/assets/hydreigon.webp';

const Services = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    emailjs.sendForm(
      'service_yrfze7u',     // Replace with your EmailJS service ID
      'template_o8p2xdx',    // Replace with your EmailJS template ID
      formRef.current,
      'Lv9r80Bd7tJF3_g6q'      // Replace with your EmailJS public key
    )
    .then(() => {
      formRef.current?.reset();
    })
    .catch((error) => {
      console.error('Email send error:', error);
      alert('Failed to send message. Please try again later.');
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Add Header component */}
      <Header />
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/20 pointer-events-none z-0" />

        {/* Particles above text but below button */}
        <div className="absolute inset-0 z-20">
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={400}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
            className="absolute inset-0"
          />
        </div>

        {/* Main content container */}
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          {/* PokeTek Services Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{
                color: "hsla(270, 60%, 85%, 1.00)",
                background: "none",
                textShadow: "0 0 20px #a855f7, 0 0 40px #9333ea, 0 0 60px #7c3aed",
                filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))"
              }}
            >
              PokeTek Services
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
            Explore the Future of Web Design & AI
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your business with cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 text-center">
            Powerful Products
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "AI-Driven Data Chat/Search", description: "Delivers a powerful AI Data Discovery and Search application that helps boost conversion rates and leads." },
              { title: "AI Receptionist", description: "Stop missing calls, start capturing leads." },
              { title: "Website & Mobile App Development", description: "Launch beautiful, scalable apps that drive growth." }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/20 hover:border-purple-500/100 transition-all">
                <h3 className="text-xl font-bold mb-4 text-purple-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-black/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { title: "Step 1: Connect", description: "Contact us for a quick demo and consultation" },
                { title: "Step 2: Customize", description: "We will tailor the AI / Website experience to fit your business needs perfectly." },
                { title: "Step 3: Scale", description: "Grow effortlessly as our platform adapts to your success. Unlimited Scalability. Lifetime Support." },
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <span className="text-purple-500 text-2xl font-bold">{index + 1}.</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-fit mx-auto bg-gradient-to-br from-purple-600/20 to-black p-8 rounded-lg border border-purple-500/20 flex justify-center items-center">
              <center>
                <TiltedCard
                  imageSrc={Hydreigon}
                  containerHeight="480px"
                  containerWidth="340px"
                  imageHeight="480px"
                  imageWidth="340px"
                  rotateAmplitude={15}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                />
              </center>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-black/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 text-center">
            Get In Touch
          </h2>
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gray-400 mb-8">
              Ready to transform your website experience? Contact us today to learn more.
            </p>
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Subject"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={5}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Add Footer component */}
      <Footer />
    </div>
  );
};

export default Services;