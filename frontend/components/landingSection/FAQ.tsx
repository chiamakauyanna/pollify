import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Do voters need to create an account?",
      a: "No. Voters simply click their unique secure link to vote—no sign-up required.",
    },
    {
      q: "Can a voter vote more than once?",
      a: "No. Each voting link works only once and becomes invalid after the vote is submitted.",
    },
    {
      q: "Can I edit my poll?",
      a: "Yes. Admins can update poll details and choices anytime before voters start submitting responses.",
    },
  ];

  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="py-20 px-8 md:px-16 lg:px-32">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-3 text-gray-600">Everything you need to know about Pollify.</p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="py-6 cursor-pointer transition-colors"
            onClick={() => toggleFAQ(idx)}
          >
            {/* Question Row */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{faq.q}</h3>

              <span
                className={`transform transition-transform duration-300 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === idx ? "max-h-40 mt-3" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
