import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate();

    return (

        <section className="hero">

            <div className="hero-overlay">

                <div className="hero-content">

                    <h1>
                        BEUMER Airport Baggage Handling System
                    </h1>

                    <p>
                        Real-time baggage tracking.
                  Track every bag from Check-In to Check-Out with
                        live dashboard updates.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-btn"
                            onClick={() => navigate("/checkin")}
                        >
                            Check-In Bag
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/tracking")}
                        >
                            Track Bag
                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Hero;