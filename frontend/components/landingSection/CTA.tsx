import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-32 text-center bg-primary text-white">
      <p className="text-3xl md:text-4xl font-bold">
        Start Creating Polls Today
      </p>
      <p className="mt-4 text-lg">
        Fast, simple, and reliable polling — at no cost.
      </p>

      <Link
        href="/auth/login"
        className="inline-block mt-8 bg-white text-primary px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Create Free Poll
      </Link>
    </section>
  );
};

export default CTA;
