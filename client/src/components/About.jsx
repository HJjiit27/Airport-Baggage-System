import "../styles/About.css";

function About() {
  return (
    <section className="about">

      <h2>About BEUMER Group</h2>

      <p>
        BEUMER Group is a global leader in airport baggage handling and
        intralogistics solutions. The company develops intelligent
        baggage handling, conveying, sorting and logistics systems
        used in airports across the world.
      </p>

      <div className="about-features">

        <div>✔ Airport Baggage Handling Systems</div>

        <div>✔ Intelligent Tracking Solutions</div>

        <div>✔ Reliable Automation Technology</div>

        <div>✔ Global Airport Operations</div>

      </div>

      <div className="stats">

        <div className="stat-card">
          <h3>90+</h3>
          <p>Years Experience</p>
        </div>

        <div className="stat-card">
          <h3>70+</h3>
          <p>Countries</p>
        </div>

        <div className="stat-card">
          <h3>6000+</h3>
          <p>Employees</p>
        </div>

        <div className="stat-card">
          <h3>1000+</h3>
          <p>Projects</p>
        </div>

      </div>

    </section>
  );
}

export default About;