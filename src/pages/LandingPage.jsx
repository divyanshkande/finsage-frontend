// src/pages/LandingPage.jsx
import React, { useRef } from 'react';
import BlurText from '../components/BlurText';
import LoginRegisterSection from '../components/LoginRegisterSection';

export default function LandingPage() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const loginRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50 flex justify-between px-8 py-4">
        <div className="text-2xl font-bold text-blue-600">Finsage</div>
        <div className="space-x-6">
          <button onClick={() => scrollTo(homeRef)} className="text-gray-700 hover:text-blue-600">Home</button>
          <button onClick={() => scrollTo(aboutRef)} className="text-gray-700 hover:text-blue-600">About</button>
          <button onClick={() => scrollTo(loginRef)} className="text-gray-700 hover:text-blue-600">Login/Register</button>
        </div>
      </nav>

      {/* HOME SECTION with BG + BlurText */}
      <div
        ref={homeRef}
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('/home-bg.jpg')`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

        {/* Text Content */}
        <div className="z-10 text-white text-center px-4">
          <BlurText
  text="Welcome to Finsage"
  delay={300} // longer delay between words
  stepDuration={0.6} // slower step transitions
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-4xl md:text-6xl font-bold"
/>

          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Track. Budget. Grow. Your personal finance assistant.
          </p>
        </div>
      </div>

      {/* ABOUT SECTION */}
     <div
  ref={aboutRef}
  className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center py-16"
  style={{
    backgroundImage: `url('/about-bg.jpg')`,
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-white bg-opacity-85 z-0" />

  <div className="z-10 text-center px-4 max-w-5xl">
    {/* Animated Heading */}
    <BlurText
      text="About Finsage"
      delay={150}
      stepDuration={0.5}
      animateBy="words"
      direction="top"
      className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
    />

    <p className="text-lg text-gray-700 leading-relaxed mb-8">
      Finsage is an intelligent personal finance assistant built to simplify and empower your
      financial journey. Whether you’re a student trying to manage your budget or a professional
      aiming for savings goals, Finsage has the tools to help you make smarter decisions.
    </p>

    {/* Why Choose Us */}
    <BlurText
      text="Why Choose Us"
      delay={180}
      stepDuration={0.6}
      animateBy="words"
      direction="top"
      className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
    />

    <ul className="text-gray-700 text-left list-disc list-inside mx-auto max-w-2xl text-base leading-relaxed mb-10">
      <li>📊 Real-time dashboard with income and expense visualization.</li>
      <li>🎯 Set, track, and achieve your financial goals easily.</li>
      <li>📅 Auto-categorization of transactions for simplicity.</li>
      <li>🔐 Secure access with token-based login and user sessions.</li>
      <li>📈 Monthly reports, charts, and AI-generated insights.</li>
    </ul>

    {/* Extra Content: Vision */}
    <BlurText
      text="Our Vision"
      delay={200}
      stepDuration={0.7}
      animateBy="words"
      direction="top"
      className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
    />

    <p className="text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
      At Finsage, our mission is to make financial wellness accessible and easy for everyone.
      We envision a world where managing money feels empowering, not overwhelming — with automation,
      intelligence, and personalized tools that help users succeed financially.
    </p>
  </div>
</div>



      {/* LOGIN SECTION */}
      <div ref={loginRef}>
        <LoginRegisterSection />
      </div>
    </div>
  );
}
