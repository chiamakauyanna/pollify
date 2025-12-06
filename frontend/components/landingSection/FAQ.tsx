const FAQ = () => {
  return (
     <section className="py-20 px-8 md:px-16 lg:px-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {[
            {
              q: "Do voters need to create an account?",
              a: "No. Voters only need the secure link you provide.",
            },
            {
              q: "Can a voter vote more than once?",
              a: "No. Each secure link works only once and expires after voting.",
            },
            {
              q: "Can I edit my poll?",
              a: "Yes. Admins can update polls and choices before voting starts.",
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-lg">{faq.q}</h3>
              <p className="text-gray-600 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
  )
}

export default FAQ