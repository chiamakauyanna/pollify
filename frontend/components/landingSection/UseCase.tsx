const UseCase = () => {
  return (
     <section className="py-20 px-8 md:px-16 lg:px-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Ideal For</h2>
          <p className="mt-4 text-gray-600">Pollify is perfect for many scenarios.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            "School Elections",
            "Team Decisions",
            "Community Groups",
            "WhatsApp Group Voting",
            "Event Planning",
            "Student Associations",
          ].map((use, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md text-center font-medium"
            >
              {use}
            </div>
          ))}
        </div>
      </section>
  )
}

export default UseCase