// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__section">
          <h3>About CoverMee</h3>
          <p>
            SaveCircle helps people team up and reach their financial goals faster
            through transparent savings groups and accountability.
          </p>
        </div>

        <div className="footer__section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/create">Create Group</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>Contact</h3>
          <p><HiOutlineMail /> support@covermee.app</p>
          <p><HiOutlinePhone /> +1 (800) 555-1234</p>
          <div className="footer__socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer__section">
          <h3>Newsletter</h3>
          <p>Get savings tips and updates.</p>
          <form className="footer__newsletter">
            <input type="email" placeholder="Your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} CoverMee. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
