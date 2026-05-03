import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-white/20">
      <div 
        className="font-geist font-bold text-xl cursor-pointer flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <span className="text-[#373a46]">Selefe Sualihin</span>
        <span className="font-instrument italic text-green-700">Sports</span>
      </div>

      <div className="hidden md:flex items-center gap-8 font-geist text-sm text-[#373a46] font-medium opacity-80">
        <a href="#facilities" className="hover:text-black transition-colors">Facilities</a>
        <a href="#rules" className="hover:text-black transition-colors">Rules</a>
        <a href="#contact" className="hover:text-black transition-colors">Contact</a>
      </div>

      <button
        onClick={() => navigate('/book')}
        className="bg-[#121212] text-white font-geist font-medium px-5 py-2.5 rounded-full text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        Book Now
      </button>
    </nav>
  );
};

export default Navbar;
