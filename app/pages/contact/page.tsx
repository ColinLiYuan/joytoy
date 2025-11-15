import './contact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone,
    faMapMarkerAlt,
    faEnvelope,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import {
    faWhatsapp,
    faFacebookF,
    faInstagram
} from '@fortawesome/free-brands-svg-icons';

export default function Contact() {
    return (
        <section id="contact">
            <div className="container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h3>Get In Touch</h3>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </div>
                            <div>
                                <h4>Location</h4>
                                <p>Dongguan, Guangdong Province China</p>
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d148995.4549202448!2d113.69192822167967!3d23.020536900000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3402f895f56b3beb%3A0x3160a10d59e42b1c!2sDongguan%2C%20Guangdong%20Province%2C%20China!5e0!3m2!1sen!2s!4v1698765432100!5m2!1sen!2s"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    >
                                    </iframe>
                                </div>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <div>
                                <h4>WhatsApp</h4>
                                <p>+86 17620189025</p>
                                <div className="social-links" style={{marginTop: '15px'}}>
                                    <a
                                        href="https://wa.me/17620189025"
                                        className="social-link whatsapp-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>colinliyuan@gmail.com</p>
                            </div>
                        </div>

                        <div className="social-links">
                            {/*<a href="#" className="social-link">*/}
                            {/*    <FontAwesomeIcon icon={faLinkedinIn} />*/}
                            {/*</a>*/}
                            {/*<a href="#" className="social-link">*/}
                            {/*    <FontAwesomeIcon icon={faTwitter} />*/}
                            {/*</a>*/}
                            <a href="#" className="social-link">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="#" className="social-link">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a
                                href="https://wa.me/17620189025"
                                className="social-link whatsapp-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faWhatsapp} />
                            </a>
                        </div>
                    </div>

                    <div className="contact-form">
                        <h3>Send Message</h3>
                        <form id="contactForm">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Your Name</label>
                                <input type="text" id="name" className="form-input" placeholder="Enter your full name" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Your Email</label>
                                <input type="email" id="email" className="form-input" placeholder="Enter your email address" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="company" className="form-label">Company Name</label>
                                <input type="text" id="company" className="form-input" placeholder="Enter your company name" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">Subject</label>
                                <input type="text" id="subject" className="form-input" placeholder="What is this regarding?" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea id="message" className="form-input" placeholder="How can we help you?" required></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                <FontAwesomeIcon icon={faPaperPlane} size="sm" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}