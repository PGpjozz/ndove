import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Learners from "../components/Learners";
import LearnershipsHero from "../components/LearnershipsHero";
import ClientsAndAccreditations from "../components/ClientsAndAccreditations";
import PopularCourses from "../components/PopularCourses";
import Footer from "../components/Footer";
import Team from "../components/Team";

const Home: React.FC = () => (
  <>
    <Navbar />
    <Hero />
    <About />
    <Learners />
    <ClientsAndAccreditations />
    <LearnershipsHero />
    <PopularCourses />
    <Team />
    <Footer />
  </>
);

export default Home;
