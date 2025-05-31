// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.scss";
import CoverMee from "../../assets/covermee_no_bg.png"

const testimonials = [
  {
    name: "Alice",
    feedback: "I reached my savings goal faster by joining groups. It’s so motivating!",
  },
  {
    name: "Bob",
    feedback: "Managing money with friends is easier than I thought. Great concept!",
  },
  {
    name: "Sophia",
    feedback: "Love the design and how it tracks my contributions month by month.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ groups: 0, active: 0, users: 0 });

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const stored = localStorage.getItem("savingsGroups");
    if (stored) {
      const groups = JSON.parse(stored);
      const usersSet = new Set();

      groups.forEach((group) => {
        group.members.forEach((m) => usersSet.add(m.name));
      });

      const active = groups.filter((g) => g.isActive).length;
      setStats({
        groups: groups.length,
        active,
        users: usersSet.size,
      });
    }
  }, []);

  return (
    <div className="home">
      <header className="home__hero">
        <div className="home__text" data-aos="fade-right">
          <h1>Save Smarter. Together.</h1>
          <p>Join saving groups and reach your financial goals faster with the power of community.</p>
          <button onClick={() => navigate("/dashboard")}>Get Started</button>
        </div>
        <div className="home__image" data-aos="fade-left">
          <img src={CoverMee} alt="Hero Illustration" />
        </div>
      </header>

      <section className="home__stats" data-aos="zoom-in">
        <h2>Real-Time Stats</h2>
        <div className="home__stats-grid">
          <div className="stat-card" onClick={() => navigate("/dashboard")}>
            <div className="stat-icon">📊</div>
            <strong>{stats.groups}</strong>
            <p>Total Groups</p>
          </div>
          <div className="stat-card" onClick={() => navigate("/dashboard")}>
            <div className="stat-icon">✅</div>
            <strong>{stats.active}</strong>
            <p>Active Groups</p>
          </div>
          <div className="stat-card" onClick={() => navigate("/users")}>
            <div className="stat-icon">🧑‍🤝‍🧑</div>
            <strong>{stats.users}</strong>
            <p>Users Participating</p>
          </div>
        </div>
      </section>

      <section className="home__testimonials" data-aos="fade-up">
        <h2>What Our Users Say</h2>
        <div className="home__testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <p>"{t.feedback}"</p>
              <strong>- {t.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
