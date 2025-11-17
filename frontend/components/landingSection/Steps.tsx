const Steps = () => {
  return (
    <div className="flex justify-center">
      <ul className="bg-primary grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-2 md:gap-2 gap-6 px-6 py-12 absolute lg:-bottom-15 md:-bottom-15 -bottom-40 lg:mx-32 md:mx-20 mx-16 lg:text-left md:text-left text-center items-center rounded-3xl">
        <div>
          <p className="lg:text-lg md:text-base text-sm uppercase text-black font-semibold">
            Create Poll
          </p>
          <p className="text-background lg:text-sm md:text-sm text-xs mt-2 pr-2">
            Set up a poll with options and settings.
          </p>
        </div>
        <div>
          <p className="lg:text-lg md:text-base text-sm ground uppercase text-black font-semibold">
            Cast Votes
          </p>
          <p className="text-background lg:text-sm md:text-sm text-xs mt-2 pr-2">
            Users vote securely from any device.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1 md:text-center lg:text-left text-center md:mt-4 mt-0 lg:mt-0">
          <p className="lg:text-lg md:text-base text-sm ground uppercase text-black font-semibold">
            View Results
          </p>
          <p className="text-background lg:text-sm md:text-sm text-xs mt-2 pr-2">
            Votes update instantly for transparency.
          </p>
        </div>
      </ul>
    </div>
  );
};

export default Steps;
