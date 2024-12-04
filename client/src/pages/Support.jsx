import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/homepage-pages.css";

const SupportPage = () => {
  const navigate = useNavigate();

  const navigateToFAQ = () => {
    navigate("/", { state: { scrollToSection: "FAQ-section" } });
  };

  //-------------------------------------------------------------------

  return (
    <main>
      <div className="container support">
        <section className="info">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
            <div className="bg-white p-6 rounded shadow flex-1 flex flex-col justify-between items-center">
              <h2 className="text-xl text-dark-cta text-center font-semibold mb-4">
                Knowledge Base
              </h2>
              <p className="text-dark-gray text-center mb-4">
                Find detailed articles and guides to help you get the most out
                of RemoteControl.
              </p>
              <Link to="/blog-news" className="link-button hover:underline">
                Explore Articles
              </Link>
            </div>
            <div className="bg-white p-6 rounded shadow flex-1 flex flex-col justify-between items-center">
              <h2 className="text-xl text-dark-cta text-center font-semibold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-dark-gray text-center mb-4">
                Get quick answers to common questions about our services and
                features.
              </p>
              <button
                onClick={navigateToFAQ}
                className="link-button hover:underline"
              >
                View FAQs
              </button>
            </div>
            <div className="bg-white p-6 rounded shadow flex-1 flex flex-col justify-between items-center">
              <h2 className="text-xl text-dark-cta text-center font-semibold mb-4">
                Contact Support
              </h2>
              <p className="text-dark-gray text-center mb-4">
                Need more help? Reach out to our support team for assistance.
              </p>
              <Link to="/contact" className="link-button hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
        {/* --------- Form --------- */}
        <section className="mb-12 max-w-2xl ">
          <div className="mt-12">
            <h2 className="text-3xl text-gray font-semibold my-8">
              Send Email
            </h2>
            <form className="md:ms-16">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Your Name
                  <input
                    required
                    className="w-full p-2 border focus:outline-none focus:border-[#40bf95] rounded"
                    type="text"
                    name="username"
                    autoComplete="name"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Your Email
                  <input
                    required
                    className="w-full p-2 border focus:outline-none focus:border-[#40bf95] rounded"
                    type="email"
                    name="email"
                    autoComplete="email"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Issue Description
                  <textarea
                    className="w-full p-2 border focus:outline-none focus:border-green-500 rounded h-40 resize-vertical"
                    name="text"
                    autoComplete="text"
                  ></textarea>
                </label>
              </div>
              <div className="button-wrap text-right">
                <button type="submit" className="primary-button w-2/5">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SupportPage;
