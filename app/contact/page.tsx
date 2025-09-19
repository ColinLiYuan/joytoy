
import './contact.css'

export default function Contact() {

    return (
        <section id="contact">
            <div className="container">
                <div className="hero">
                    <div className="hero-content">
                        <h1>Contact Us</h1>
                        <p>Get in touch with us for quotes and inquiries about our battery solutions</p>
                    </div>
                </div>

                <div className="contact-grid">
                    <div className="contact-info">
                        <h3>Get In Touch</h3>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <h4>Location</h4>
                                <p>HafenCity, Hamburg, Germany 20457</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <i className="fas fa-phone"></i>
                            </div>
                            <div>
                                <h4>Phone</h4>
                                <p>+49 40 12345678</p>
                                <p>+49 40 87654321</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>info@batterypower.com</p>
                                <p>support@batterypower.com</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div>
                                <h4>Business Hours</h4>
                                <p>Monday-Friday: 8:00 AM - 6:00 PM</p>
                                <p>Saturday: 9:00 AM - 1:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>

                        <div className="social-links">
                            <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>

                    <div className="contact-form">
                        <h3>Send Message</h3>
                        <form id="contactForm">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Your Name</label>
                                <input type="text" id="name" className="form-input" placeholder="Enter your full name"
                                       required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Your Email</label>
                                <input type="email" id="email" className="form-input"
                                       placeholder="Enter your email address" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="company" className="form-label">Company Name</label>
                                <input type="text" id="company" className="form-input"
                                       placeholder="Enter your company name" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">Subject</label>
                                <input type="text" id="subject" className="form-input"
                                       placeholder="What is this regarding?" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea id="message" className="form-input" placeholder="How can we help you?"
                                          required></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                <i className="fas fa-paper-plane"></i> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );

}