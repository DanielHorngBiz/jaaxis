const TrustBadges = () => {
  const logos = [
    { name: "Careem", color: "text-green-600" },
    { name: "BankMusl", color: "text-blue-600" },
    { name: "Collinear", color: "text-red-600" },
    { name: "Swvl", color: "text-orange-600" },
    { name: "Udrive", color: "text-green-500" },
    { name: "Cryvit", color: "text-purple-600" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider">
          Breaking Your Digital World
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className={`text-2xl font-bold ${logo.color}`}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
