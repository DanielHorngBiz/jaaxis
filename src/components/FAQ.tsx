import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Jaaxis?",
      answer:
        "Jaaxis is an advanced AI-powered customer support chatbot platform that helps businesses automate customer interactions, provide instant responses, and scale their support operations efficiently.",
    },
    {
      question: "Is Jaaxis free to use?",
      answer:
        "We offer a free trial to get you started. After that, we have flexible pricing plans starting from $10/month for small businesses to enterprise solutions for larger organizations.",
    },
    {
      question: "Do I need to install software to use Jaaxis?",
      answer:
        "No installation required! Jaaxis is a cloud-based solution that works directly in your web browser. Simply embed our chatbot widget on your website or integrate with your preferred platforms.",
    },
    {
      question: "How secure is my data in Jaaxis?",
      answer:
        "Security is our top priority. We use bank-grade encryption, comply with industry standards like GDPR and SOC 2, and ensure your data is protected with advanced security measures.",
    },
    {
      question: "Will I own questions?",
      answer:
        "Yes, absolutely! You retain full ownership of all your data, conversations, and content. We never use your data to train models for other customers.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2">❓ FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Got Questions? <br />
            We've Got Answers!
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Jaaxis and how it can help your business.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <Button size="lg">Get Started</Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
