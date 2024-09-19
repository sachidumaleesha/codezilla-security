import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqItems = [
    {
      question: "What is the Security Awareness Program?",
      answer: "Our Security Awareness Program is a comprehensive training initiative designed to educate individuals and organizations about cybersecurity best practices, potential threats, and how to protect digital assets effectively."
    },
    {
      question: "Who should participate in this program?",
      answer: "This program is beneficial for everyone, from individuals looking to protect their personal data to employees of organizations aiming to strengthen their overall security posture. It's particularly valuable for those handling sensitive information or working in IT-related fields."
    },
    {
      question: "How long does the program take to complete?",
      answer: "The duration of the program can vary based on the depth of content and individual learning pace. Typically, our core program can be completed in 4-6 weeks, with additional modules available for more advanced topics."
    },
    {
      question: "Is the program entirely online, or are there in-person components?",
      answer: "Our program is primarily delivered online for maximum flexibility and accessibility. However, we do offer optional in-person workshops and seminars for organizations that prefer a blended learning approach."
    },
    {
      question: "What topics are covered in the Security Awareness Program?",
      answer: "The program covers a wide range of topics including password security, phishing awareness, safe browsing practices, social engineering, data protection, mobile device security, and incident reporting, among others."
    },
    {
      question: "Will I receive a certificate upon completion of the program?",
      answer: "Yes, participants who successfully complete the program will receive a certificate of completion. This can be a valuable addition to your professional credentials and demonstrates your commitment to cybersecurity."
    },
    {
      question: "How often should I renew my security awareness training?",
      answer: "We recommend refreshing your security awareness training annually. Cyber threats evolve rapidly, and staying up-to-date is crucial. We offer updated content each year to keep you informed about the latest security trends and threats."
    },
    {
      question: "Can the program be customized for my organization's specific needs?",
      answer: "We offer customization options for organizations to tailor the program to their specific industry, compliance requirements, and internal policies. Contact our team to discuss your unique needs."
    }
  ]
  
  export default function FAQ() {
    return (
      <section id="faq" className="py-24 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-black dark:text-primary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    )
  }