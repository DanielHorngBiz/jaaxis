import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQ_DATA = [
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

const FAQ = () => {

  return (
    <section id="faq" className="py-24 px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 mb-4">
            <span className="text-xs font-medium text-foreground">FAQ</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Jaaxis.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card hover:border-primary/20 transition-colors"
            >
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
};

export default FAQ;
