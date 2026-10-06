export const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-cream">
      <div className="font-sans font-bold tracking-tight text-xl">EIGENCUTS®</div>
      <div className="flex gap-6 font-mono text-xs uppercase tracking-widest">
        <a href="#work" className="hover:text-accent transition-colors">Work</a>
        <a href="#about" className="hover:text-accent transition-colors">About</a>
        <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
      </div>
    </nav>
  );
};
