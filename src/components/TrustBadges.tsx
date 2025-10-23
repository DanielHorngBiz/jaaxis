const TrustBadges = () => {
  const logos = [
    "Careem",
    "BankMusl",
    "Collinear",
    "Swvl",
    "Udrive",
    "Cryvit",
  ];

  return (
    <section className="py-16 px-6 lg:px-8 border-y border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-10 font-medium">
          Trusted by innovative companies worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
            >
              <span className="text-lg font-semibold text-foreground">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
