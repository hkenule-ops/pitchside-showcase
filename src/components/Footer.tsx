const Footer = () => (
  <footer className="py-12 px-4 bg-secondary border-t border-border">
    <div className="container mx-auto text-center">
      <h3 className="font-display text-2xl font-bold uppercase tracking-wider">
        <span className="text-gradient-primary">Naija Stars</span> FC
      </h3>
      <p className="mt-2 text-muted-foreground text-sm">Raising the Next Generation of Football Stars</p>
      <p className="mt-6 text-muted-foreground text-xs">&copy; {new Date().getFullYear()} Naija Stars Football Academy. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
