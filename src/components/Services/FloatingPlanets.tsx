
const FloatingPlanets = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Small planet */}
      <div className="absolute top-[15%] right-[10%] w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 floating" 
        style={{ animationDelay: '0s' }} />
      
      {/* Medium planet */}
      <div className="absolute top-[40%] left-[5%] w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 floating" 
        style={{ animationDelay: '1s' }} />

      {/* Medium planet bottom added */}
      <div className="absolute top-[70%] left-[25%] w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 floating" 
        style={{ animationDelay: '1s' }} />
      
      {/* Tiny planet top added*/}
      <div className="absolute top-[15%] left-[45%] w-6 h-6 rounded-full bg-gradient-to-br from-purple-300 to-pink-500 floating" 
        style={{ animationDelay: '2s' }} />

      {/* Tiny planet */}
      <div className="absolute bottom-[30%] right-[15%] w-6 h-6 rounded-full bg-gradient-to-br from-purple-300 to-pink-500 floating" 
        style={{ animationDelay: '2s' }} />

      {/* Ring planet */}
      <div className="absolute top-[60%] right-[25%] floating" style={{ animationDelay: '1.5s' }}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 relative">
          <div className="absolute -inset-2 border-4 border-purple-400/30 rounded-full transform -rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPlanets;
