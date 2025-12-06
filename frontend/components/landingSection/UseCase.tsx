import { CheckCircle } from "lucide-react";

const UseCase = () => {
  const useCases = [
    "School Elections",
    "Team Decisions",
    "Community Groups",
    "WhatsApp Group Voting",
    "Event Planning",
    "Student Associations",
  ];

  return (
    <section className="py-20 px-8 md:px-16 lg:px-32 bg-linear-to-b from-white to-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Ideal For</h2>
        <p className="mt-3 text-gray-600 text-sm md:text-base">
          Pollify fits perfectly into different real-world scenarios.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {useCases.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 
                       p-6 text-center transition-all duration-300 hover:shadow-xl 
                       hover:-translate-y-1"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-primary w-8 h-8" />
            </div>

            <p className="font-semibold text-gray-800">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UseCase;
