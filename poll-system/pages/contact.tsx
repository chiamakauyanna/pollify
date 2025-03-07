import Button from "@/components/common/Button";

const contact = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="p-8 rounded-lg w-full lg:max-w-lg md:max-w-md max-w-md">
        <form className="space-y-5">
          <label htmlFor="name" className="text-sm font-semibold ">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Input full name"
            className="w-full p-2 mt-1 outline rounded outline-primary text-sm"
          />
          <label htmlFor="email" className="text-sm font-semibold ">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Input email address"
            className="w-full p-2 mt-1 outline rounded outline-primary text-sm"
          />
          <label htmlFor="message" className="text-sm font-semibold ">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="5"
            placeholder="Type your message here"
            className="w-full p-2 mt-1 outline rounded outline-primary text-sm"
          ></textarea>
          <div className="mx-auto mt-2 w-full">
            <Button text="Send" className="button-primary w-full" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default contact;
