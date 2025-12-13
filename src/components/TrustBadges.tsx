const TRUST_LOGOS = [
  "Careem",
  "BankMusl",
  "Collinear",
  "Swvl",
  "Udrive",
  "Cryvit",
];

const TrustBadges = () => {

  return (
    <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 lg:mb-10 font-medium">
          Trusted by innovative companies worldwide
        </p>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 items-center">
          {TRUST_LOGOS.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
            >
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
