import React, { useContext, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/homepage-pages.css";
import { WebSocketContext } from "../context/webSocketContext";

const Homepage = () => {
  const { connectionInfo } = useContext(WebSocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  const FAQRef = useRef(null);

  // Scroll to FAQ section
  useEffect(() => {
    if (location.state?.scrollToSection === "FAQ-section") {
      FAQRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [location.state]);

  //----------------------------------------------------------------------

  return (
    <main>
      {/* ------- Hero ------- */}
      <section className="hero text-center">
        <div className="container flex flex-col my-12 lg:gap-4">
          <h3 className="text-gray">Welcome to DeviceMate</h3>
          <h1 className="text-dark-cta text-xl md:text-3xl lg:text-5xl font-bold mb-4">
            Control Your Computer from Anywhere
          </h1>
          <p className="text-dark-gray text-lg mb-6">
            Securely access your desktop and manage tasks remotely with ease.
          </p>
          <div className="action flex flex-col sm:flex-row gap-5 justify-center items-center mt-12">
            <button
              className="primary-button w-[70%] sm:w-auto md-text-15px"
              onClick={() => navigate("/signup")}
            >
              Create Account as a Technnician
            </button>
            <button
              className="secondery-button w-[70%] sm:w-auto md-text-15px"
              onClick={() => navigate("/connect-device")}
            >
              {connectionInfo.client.state
                ? "Go To Your Current Session"
                : "Connect Your Device to a Session"}
            </button>
          </div>
        </div>
      </section>

      {/* ------- Features ------- */}
      <section className="mb-12 bg-dark" id="features">
        <div className="container my-12">
          <h2 className="text-3xl font-semibold mb-6 text-light-gray text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
            <div className="flex flex-col gap-8 text-center p-6 rounded border flex-1">
              <h3 className="text-light-cta text-xl font-bold mb-2">
                Easy Setup
              </h3>
              <p className="text-light-gray">
                Get started in minutes with our simple registering process.
              </p>
            </div>
            <div className="flex flex-col gap-8 text-center p-6 rounded border flex-1">
              <h3 className="text-light-cta text-xl font-bold mb-2">
                Secure Connection
              </h3>
              <p className="text-light-gray">
                Experience encrypted and secure connections to protect your
                data.
              </p>
            </div>
            <div className="flex flex-col gap-8 text-center p-6 rounded border flex-1">
              <h3 className="text-light-cta text-xl font-bold mb-2">
                File Transfer
              </h3>
              <p className="text-light-gray">
                Easily transfer files between devices with a secure and fast
                connection.
              </p>
            </div>
            <div className="flex flex-col gap-8 text-center p-6 rounded border flex-1">
              <h3 className="text-light-cta text-xl font-bold mb-2">
                Remote Printing
              </h3>
              <p className="text-light-gray">
                Print documents remotely to any connected printer without
                hassle.
              </p>
            </div>
            <div className="flex flex-col gap-8 text-center p-6 rounded border flex-1">
              <h3 className="text-light-cta text-xl font-bold mb-2">
                Custom Shortcuts
              </h3>
              <p className="text-light-gray">
                Create custom shortcuts to quickly access frequently used
                functions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------- How it works ------- */}
      <section className="my-12" id="how-it-works">
        <div className="container">
          <h2 className="text-3xl text-gray font-semibold mb-6">
            How It Works
          </h2>
          <p className="mb-8 text-dark-gray">
            Our application makes it simple to connect and control your computer
            remotely:
          </p>
          <ul className="list-disc text-xl text-gray list-inside space-y-4">
            <li>
              Create an account with your email in a very quick and easy
              process.
            </li>
            <li>Log in from any device with your credentials.</li>
            <li>
              Start managing your desktop and files with a seamless experience.
            </li>
          </ul>
        </div>
      </section>

      {/* ------- Testimonials ------- */}
      <section className="my-12" id="testimonials">
        <div className="container">
          <h2 className="text-3xl text-gray font-semibold mb-6">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-light p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <p className="text-dark-gray">
                "RemoteControl has revolutionized the way I work from home. It's
                fast, secure, and easy to use."
              </p>
              <p className="text-dark-cta mt-4 font-semibold">- Jane Doe</p>
            </div>
            <div className="bg-light p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <p className="text-dark-gray">
                "A lifesaver for managing my remote team. The cross-platform
                access is seamless."
              </p>
              <p className="text-dark-cta mt-4 font-semibold">- John Smith</p>
            </div>
            <div className="bg-light p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <p className="text-dark-gray">
                "Excellent support and reliable service. Highly recommend for
                businesses."
              </p>
              <p className="text-dark-cta mt-4 font-semibold">
                - Emily Johnson
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------- Case Studies ------- */}
      <section className="my-12 bg-dark" id="case-studies">
        <div className="container my-12">
          <h2 className="text-3xl text-white text-center font-semibold mb-6">
            Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
            <div className="bg-white p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <h3 className="text-dark-cta text-xl font-bold mb-2">Client A</h3>
              <p className="text-dark-gray my-4">
                How Client A improved their workflow efficiency by 30% using
                RemoteControl.
              </p>
              <button className="link-button text-blue-500 mt-4 inline-block">
                Read More
              </button>
            </div>
            <div className="bg-white p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <h3 className="text-dark-cta text-xl font-bold mb-2">Client B</h3>
              <p className="text-dark-gray my-4">
                Streamlining remote access for over 500 employees with
                RemoteControl.
              </p>
              <button className="link-button text-blue-500 mt-4 inline-block">
                Read More
              </button>
            </div>
            <div className="bg-white p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <h3 className="text-dark-cta text-xl font-bold mb-2">Client C</h3>
              <p className="text-dark-gray my-4">
                How Client C saved on IT costs and improved security.
              </p>
              <button className="link-button text-blue-500 mt-4 inline-block">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------- FAQ ------- */}
      <section className="my-12" ref={FAQRef}>
        <div className="container">
          <h2 className="text-3xl text-gray font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-light-gray-extra p-6 rounded flex-1">
              <h3 className="text-xl text-dark-gray font-bold">
                What is RemoteControl?
              </h3>
              <p className="text-gray pt-2">
                RemoteControl is a software application that allows you to
                access and control your computer from anywhere.
              </p>
            </div>
            <div className="bg-light-gray-extra p-6 rounded  flex-1">
              <h3 className="text-xl text-dark-gray font-bold">
                Is RemoteControl secure?
              </h3>
              <p className="text-gray pt-2">
                Yes, we use end-to-end encryption to ensure that your data is
                protected.
              </p>
            </div>
            <div className="bg-light-gray-extra p-6 rounded flex-1">
              <h3 className="text-xl text-dark-gray font-bold">
                Can I use RemoteControl on my smartphone?
              </h3>
              <p className="text-gray pt-2">
                Absolutely! RemoteControl is compatible with all major devices,
                including smartphones and tablets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------- Up Comming ------- */}
      <section className="my-12" id="blog">
        <div className="container">
          <h2 className="text-3xl text-gray text-center font-semibold mb-6">
            Up Comming Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
            <div className="p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <h3 className="text-xl text-dark-cta font-bold mb-2">
                New Feature: Dark Mode
              </h3>
              <p className="text-gray pt-2">
                Learn about the new dark mode feature and how it can enhance
                your experience.
              </p>
              <button className="link-button text-blue-500 mt-4 inline-block">
                Read More
              </button>
            </div>
            <div className="p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <h3 className="text-xl text-dark-cta font-bold mb-2">
                Improved Security Measures
              </h3>
              <p className="text-gray pt-2">
                We’ve enhanced our security protocols to keep your data safer
                than ever.
              </p>
              <button className="link-button text-blue-500 mt-4 inline-block">
                Read More
              </button>
            </div>
            <div className="p-6 rounded shadow flex-1 flex flex-col justify-between items-start">
              <h3 className="text-xl text-dark-cta font-bold mb-2">
                Upcoming Webinar
              </h3>
              <p className="text-gray pt-2">
                Join us for an upcoming webinar on the latest trends in remote
                work technology.
              </p>
              <button className="link-button text-blue-500 mt-4 inline-block">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
