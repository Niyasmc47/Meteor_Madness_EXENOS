import React, { useEffect, useState } from 'react';

/**
 * METEOR MADNESS LANDING PAGE
 * 
 * IMAGE SETUP:
 * Place the following images in your project's /public/images/ folder:
 * - chicxulub.jpg (Chicxulub impact site)
 * - tunguska.jpg (Tunguska forest destruction)
 * - sudbury.jpg (Sudbury crater geological formation)
 * - barringer.jpg (Barringer/Meteor Crater aerial view)
 * - dart.jpg (DART mission or impact image)
 * 
 * If using a different path, update the imagePath variable below.
 */

const MeteorMadness = () => {
  const [stars, setStars] = useState([]);
  const imagePath = '/images/'; // Update this if your images are in a different location

  // Generate random stars for background effect
  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
      }));
    };
    setStars(generateStars());
  }, []);

  const notableImpacts = [
    {
      name: 'Chicxulub Impact',
      location: 'Mexico',
      date: '~65 Million Years Ago',
      description: 'A 10–15 km wide asteroid struck the Yucatán Peninsula, triggering the mass extinction of dinosaurs and 75% of Earth\'s species.',
      image: `${imagePath}chicxulub.jpg`,
    },
    {
      name: 'Tunguska Event',
      location: 'Siberia',
      date: '1908',
      description: 'A 50–100 meter asteroid exploded in the atmosphere, flattening 2,000 km² of forest with the force of 1,000 Hiroshima bombs.',
      image: `${imagePath}tunguska.jpg`,
    },
    {
      name: 'Sudbury Impact',
      location: 'Canada',
      date: '~1.8 Billion Years Ago',
      description: 'A massive impact created one of the largest and oldest impact craters on Earth, now rich in valuable minerals like nickel and copper.',
      image: `${imagePath}sudbury.jpg`,
    },
    {
      name: 'Barringer Crater',
      location: 'Arizona',
      date: '~50,000 Years Ago',
      description: 'A 50-meter meteorite created a 1.2 km wide crater in the Arizona desert, one of the best-preserved impact sites on Earth.',
      image: `${imagePath}barringer.jpg`,
    },
  ];

  const mitigationStrategies = [
    {
      name: 'Kinetic Impactor',
      primary: true,
      description: 'A proven method where a spacecraft collides with an asteroid to alter its trajectory. NASA\'s DART mission successfully demonstrated this technique in 2022 by impacting the asteroid Dimorphos.',
      image: `${imagePath}dart.jpg`,
    },
    {
      name: 'Gravity Tractor',
      description: 'A spacecraft hovers near an asteroid, using gravitational attraction to slowly pull it off course over time.',
      color: '#4a9eff',
    },
    {
      name: 'Nuclear Deflection',
      description: 'A nuclear device detonates near (not on) an asteroid to vaporize surface material and create thrust.',
      color: '#ff6b6b',
    },
    {
      name: 'Laser Ablation',
      description: 'Concentrated laser beams vaporize asteroid surface material, creating propulsion to alter its path.',
      color: '#ffd93d',
    },
    {
      name: 'Ion Beam Shepherd',
      description: 'A spacecraft uses ion beams to push against an asteroid, gradually changing its trajectory.',
      color: '#6bcf7f',
    },
  ];

  return (
    <div style={styles.container}>
      {/* Animated Star Field Background */}
      <div style={styles.starField}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              ...styles.star,
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>
            <span style={styles.titleGlow}>METEOR</span>
            <br />
            <span style={styles.titleMadness}>MADNESS</span>
          </h1>
          <p style={styles.tagline}>
            Experience the cosmic threat. Understand the impact. Explore the solutions.
          </p>
          <a href="/simulator" style={styles.launchButton}>
            <span style={styles.buttonText}>Launch Meteor</span>
            <div style={styles.buttonGlow} />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>About the Project</h2>
          <div style={styles.aboutCard}>
            <p style={styles.aboutText}>
              <strong>Meteor Madness</strong> is a cutting-edge 3D, real-time, interactive web application 
              designed to educate and engage users about asteroid impact threats facing our planet. 
              Through immersive visualization and interactive simulations, explore the devastating 
              potential of asteroid impacts and discover the scientific strategies humanity is developing 
              to protect Earth from these cosmic hazards.
            </p>
            <p style={styles.aboutText}>
              Learn about historical impacts that shaped our world, understand the science behind 
              planetary defense, and experience firsthand how we can detect, track, and mitigate 
              potentially hazardous asteroids before they reach Earth.
            </p>
          </div>
        </div>
      </section>

      {/* Notable Impacts Section */}
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Notable Asteroid Impacts</h2>
          <p style={styles.sectionSubtitle}>
            Throughout Earth's history, asteroid impacts have shaped our planet's evolution
          </p>
          <div style={styles.impactGrid}>
            {notableImpacts.map((impact, index) => (
              <div key={index} style={styles.impactCard} className="impact-card">
                <div style={styles.impactImageContainer}>
                  <img
                    src={impact.image}
                    alt={impact.name}
                    style={styles.impactImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={styles.imagePlaceholder}>
                    <span style={styles.placeholderText}>🌑</span>
                    <span style={styles.placeholderSubtext}>Image: {impact.image.split('/').pop()}</span>
                  </div>
                </div>
                <div style={styles.impactContent}>
                  <h3 style={styles.impactName}>{impact.name}</h3>
                  <div style={styles.impactMeta}>
                    <span style={styles.impactLocation}>📍 {impact.location}</span>
                    <span style={styles.impactDate}>🕐 {impact.date}</span>
                  </div>
                  <p style={styles.impactDescription}>{impact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mitigation Strategies Section */}
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Meteor Impact Mitigation Strategies</h2>
          <p style={styles.sectionSubtitle}>
            How humanity is preparing to defend our planet from asteroid threats
          </p>

          {/* Primary Strategy - Kinetic Impactor */}
          <div style={styles.primaryStrategy}>
            <div style={styles.primaryStrategyContent}>
              <h3 style={styles.primaryStrategyTitle}>
                <span style={styles.checkmark}>✓</span> Kinetic Impactor (Proven Method)
              </h3>
              <p style={styles.primaryStrategyText}>
                The kinetic impactor technique involves deliberately crashing a spacecraft into an 
                asteroid at high speed to change its velocity and trajectory. This method doesn't 
                destroy the asteroid but nudges it onto a different path, preventing Earth collision.
              </p>
              <div style={styles.dartInfo}>
                <h4 style={styles.dartTitle}>🎯 DART Mission Success (2022)</h4>
                <p style={styles.dartText}>
                  NASA's Double Asteroid Redirection Test (DART) successfully demonstrated this 
                  technique by impacting the asteroid Dimorphos, changing its orbital period by 
                  32 minutes. This historic mission proved that humanity can actively defend 
                  against asteroid threats.
                </p>
              </div>
            </div>
            <div style={styles.primaryStrategyImage}>
              <img
                src={mitigationStrategies[0].image}
                alt="DART Mission"
                style={styles.dartImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{...styles.imagePlaceholder, display: 'none'}}>
                <span style={styles.placeholderText}>🛰️</span>
                <span style={styles.placeholderSubtext}>Image: dart.jpg</span>
              </div>
            </div>
          </div>

          {/* Other Strategies */}
          <div style={styles.otherStrategies}>
            <h3 style={styles.otherStrategiesTitle}>Other Deflection Techniques</h3>
            <div style={styles.strategiesList}>
              {mitigationStrategies.slice(1).map((strategy, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.strategyItem,
                    borderLeftColor: strategy.color,
                  }}
                >
                  <div style={{...styles.strategyDot, backgroundColor: strategy.color}} />
                  <div style={styles.strategyContent}>
                    <h4 style={styles.strategyItemName}>{strategy.name}</h4>
                    <p style={styles.strategyItemDescription}>{strategy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Meteor Madness © 2025 • Protecting Earth, One Simulation at a Time
        </p>
      </footer>

      {/* Embedded Styles for Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }



        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(200, 200, 200, 0.2); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(200, 200, 200, 0.3); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .impact-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .impact-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 60px rgba(255, 255, 255, 0.2) !important;
        }

        a[href="/simulator"]:hover span {
          transform: scale(1.05);
        }

        a[href="/simulator"]:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .impact-card:hover {
            transform: translateY(-5px) scale(1.01);
          }
        }

        @media (max-width: 768px) {
          .strategiesList {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// Inline Styles Object
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
    color: '#ffffff',
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },

  starField: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },

  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    opacity: 0.8,
  },

  // Hero Section
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    zIndex: 1,
  },

  heroContent: {
    textAlign: 'center',
    zIndex: 10,
    maxWidth: '800px',
    position: 'relative',
  },

  title: {
    fontSize: 'clamp(3rem, 10vw, 7rem)',
    fontWeight: '900',
    margin: '0 0 1rem 0',
    lineHeight: '1',
    letterSpacing: '0.05em',
  },

  titleGlow: {
    background: 'linear-gradient(45deg, #ffffff, #cccccc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))',
  },

  titleMadness: {
    color: '#ffffff',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(200, 200, 200, 0.3)',
  },

  tagline: {
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    color: '#b8b8d1',
    marginBottom: '3rem',
    fontWeight: '300',
    letterSpacing: '0.1em',
  },

  launchButton: {
    position: 'relative',
    display: 'inline-block',
    padding: '1.2rem 3rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #333333, #1a1a1a)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'glow-pulse 2s infinite',
    overflow: 'hidden',
    zIndex: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
  },

  buttonText: {
    position: 'relative',
    zIndex: 2,
    display: 'inline-block',
    transition: 'transform 0.3s ease',
  },

  buttonGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },



  // Sections
  section: {
    position: 'relative',
    padding: '5rem 2rem',
    zIndex: 1,
  },

  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },

  sectionTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #ffffff, #b8b8d1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  sectionSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    textAlign: 'center',
    color: '#8888aa',
    marginBottom: '3rem',
    fontWeight: '300',
  },

  // About Section
  aboutCard: {
    background: 'rgba(20, 20, 20, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '3rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },

  aboutText: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    lineHeight: '1.8',
    color: '#d1d1e0',
    marginBottom: '1.5rem',
  },

  // Impact Cards
  impactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },

  impactCard: {
    background: 'rgba(20, 20, 20, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
  },

  impactImageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#1a0a2e',
  },

  impactImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  imagePlaceholder: {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#1a0a2e',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  placeholderText: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },

  placeholderSubtext: {
    fontSize: '0.9rem',
    color: '#8888aa',
    fontFamily: 'monospace',
  },

  impactContent: {
    padding: '1.5rem',
  },

  impactName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#ffffff',
  },

  impactMeta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#8888aa',
  },

  impactLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },

  impactDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },

  impactDescription: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#d1d1e0',
  },

  // Mitigation Strategies
  primaryStrategy: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    background: 'rgba(30, 30, 30, 0.6)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '3rem',
    backdropFilter: 'blur(10px)',
  },

  primaryStrategyContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  primaryStrategyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  checkmark: {
    color: '#00ff88',
    fontSize: '2rem',
  },

  primaryStrategyText: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#d1d1e0',
    marginBottom: '1.5rem',
  },

  dartInfo: {
    background: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '10px',
    padding: '1.5rem',
  },

  dartTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#00ff88',
  },

  dartText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#d1d1e0',
  },

  primaryStrategyImage: {
    position: 'relative',
    borderRadius: '15px',
    overflow: 'hidden',
    minHeight: '300px',
    backgroundColor: '#1a0a2e',
  },

  dartImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  otherStrategies: {
    marginTop: '3rem',
  },

  otherStrategiesTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#ffffff',
  },

  strategiesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },

  strategyItem: {
    background: 'rgba(20, 20, 20, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    borderLeft: '4px solid',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },

  strategyDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginTop: '0.4rem',
    flexShrink: 0,
    boxShadow: '0 0 10px currentColor',
  },

  strategyContent: {
    flex: 1,
  },

  strategyItemName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },

  strategyItemDescription: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#b8b8d1',
    margin: 0,
  },

  // Footer
  footer: {
    position: 'relative',
    padding: '2rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },

  footerText: {
    color: '#8888aa',
    fontSize: '0.9rem',
  },
};

export default MeteorMadness;
