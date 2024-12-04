import React from "react";
import "../styles/homepage-pages.css";
import image1 from "../img/team_1.jpg";
import image2 from "../img/team_2.jpg";
import image3 from "../img/team_3.jpg";

const AboutUsPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Salem Amjad",
      role: "CEO & Founder",
      bio: "Salem has over 20 years of experience in the tech industry and leads the company with a vision for innovation.",
      image: image1,
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "COO",
      bio: "Emily oversees the company’s operations and ensures everything runs smoothly and efficiently.",
      image: image3,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "CTO",
      bio: "Jane is the technical genius behind our product, with expertise in software development and cybersecurity.",
      image: image2,
    },
  ];

  const values = [
    {
      id: 1,
      title: "Innovation",
      description:
        "We constantly strive to innovate and improve our products to meet the evolving needs of our customers.",
    },
    {
      id: 2,
      title: "Customer Focus",
      description:
        "Our customers are at the heart of everything we do, and we are committed to providing exceptional service.",
    },
    {
      id: 3,
      title: "Integrity",
      description:
        "We operate with honesty and integrity, always striving to do the right thing for our customers and our team.",
    },
  ];

  return (
    <main>
      <div className="container about py-8">
        {/* Our Story Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-gray font-semibold mt-8 mb-4">
            Our Story
          </h2>
          <p className="text-dark-gray mb-6">
            Founded in 2024, RemoteControl was born out of a need for reliable
            and secure remote desktop solutions. Our team of dedicated
            professionals has worked tirelessly to create a product that
            simplifies remote work and connects people across the globe.
          </p>
        </section>

        {/* ------- Our Mession ------- */}
        <section className="mb-16">
          <h2 className="text-3xl text-gray font-semibold mt-8 mb-4">
            Our Mission
          </h2>
          <p className="text-dark-gray mb-6">
            Our mission is to empower individuals and organizations to work
            remotely with ease and efficiency. We aim to bridge the gap between
            physical distance and virtual connectivity through innovative
            technology.
          </p>
        </section>
        {/* ------- Our Team ------- */}
        <section className="mb-16">
          <h2 className="text-3xl text-gray font-semibold my-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="bg-dark w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-1xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-dark-cta mb-4">{member.role}</p>
                  <p className="text-dark-gray">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* ------- Our Value ------- */}
        <section className="my-12">
          <h2 className="text-3xl text-gray font-semibold my-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.id} className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl text-dark-cta font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUsPage;
