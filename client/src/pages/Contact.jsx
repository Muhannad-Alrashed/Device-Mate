import React from "react";

const ContactPage = () => {
  return (
    <main>
      <div className="container py-8">
        {/* Contact Information Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-gray font-semibold my-8">
            Our Contact Information
          </h2>
          <p className="text-gray-700 mb-6">
            We're here to help! Get in touch with us through any of the methods
            below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-2xl text-light-cta font-semibold mb-2">
                Email
              </h3>
              <p className="text-gray-700">support@device.mate.com</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-2xl text-light-cta font-semibold mb-2">
                Phone
              </h3>
              <p className="text-gray-700">+1 (800) 123-4567</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-2xl text-light-cta font-semibold mb-2">
                Address
              </h3>
              <p className="text-gray-700">
                123 Remote Street, Suite 100, Workville, USA
              </p>
            </div>
          </div>
        </section>
        {/* Contact Form Section */}
        <section className="mb-16 contact max-w-2xl p-0 md:p-0 md:pb-10">
          <h2 className="text-2xl text-gray font-semibold mb-4">
            Send Us a Message
          </h2>
          <form className="md:ms-16">
            <div className="form-group mb-6">
              <label htmlFor="name" className="block mb-2 text-gray-700">
                Name:
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#40bf95]"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="email" className="block mb-2 text-gray-700">
                Email:
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#40bf95]"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="message" className="block mb-2 text-gray-700">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#40bf95] h-40 resize-vertical"
              />
            </div>
            <div className="button-wrap text-right">
              <button type="submit" className="primary-button w-2/5">
                Send
              </button>
            </div>
          </form>
        </section>
        {/* Additional Contact Options Section */}
        <section>
          <h2 className="text-2xl text-dark-gray text-center font-semibold mb-4">
            Connect With Us
          </h2>
          <div className="flex justify-center space-x-6">
            <a
              target="blank"
              href="https:\\www.facebook.com"
              className="link-button hover:underline"
            >
              Facebook
            </a>
            <a
              target="blank"
              href="https:\\www.twitter.com"
              className="link-button hover:underline"
            >
              Twitter
            </a>
            <a
              target="blank"
              href="https:\\www.linkedin.com"
              className="link-button hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactPage;
