import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaVoteYea, FaShieldAlt, FaChartLine, FaUsers, FaLock, FaRocket, FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";

export default function LandingPage() {
    const [user, setUser] = useState(null);
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                
                // Auto-redirect based on role (optional)
                // Uncomment if you want auto-redirect behavior
                /*
                if (userData.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/vote');
                }
                */
            } catch (e) { 
                console.error(e); 
            }
        }
        
        // Auto-rotate features
        const interval = setInterval(() => {
            setCurrentFeatureIndex(prev => (prev + 1) % features.length);
        }, 4000);
        
        return () => clearInterval(interval);
    }, [navigate]);

    const features = [
        {
            icon: <FaShieldAlt size={32} />,
            title: "Military-Grade Security",
            description: "Powered by Ethereum blockchain for tamper-proof voting records"
        },
        {
            icon: <FaChartLine size={32} />,
            title: "Real-Time Results",
            description: "Instant vote counting with transparent, auditable outcomes"
        },
        {
            icon: <FaUsers size={32} />,
            title: "Democratized Process",
            description: "Every vote matters with decentralized verification"
        }
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-color)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
            {/* Animated Background Elements */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "radial-gradient(circle at 10% 20%, rgba(29, 155, 240, 0.1) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(120, 86, 255, 0.1) 0%, transparent 20%)",
                pointerEvents: "none",
                zIndex: -1
            }} />
            
            {/* Navigation */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 50px",
                borderBottom: "1px solid var(--border-color)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(15, 20, 25, 0.8)",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <FaVoteYea size={32} style={{ color: "var(--accent-primary)" }} />
                    <div style={{ fontSize: "1.8rem", fontWeight: "900", letterSpacing: "1px", background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        BLOCKVOTE
                    </div>
                </div>
                
                <div style={{ display: "flex", gap: "30px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <NavItem href="#features">Features</NavItem>
                    <NavItem href="#technology">Technology</NavItem>
                    <NavItem href="#security">Security</NavItem>
                    <NavItem href="#contact">Contact</NavItem>
                </div>
                
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    {/* Social Links */}
                    <SocialIcon href="https://github.com" icon={<FaGithub />} />
                    <SocialIcon href="https://twitter.com" icon={<FaTwitter />} />
                    <SocialIcon href="https://discord.com" icon={<FaDiscord />} />
                    
                    {/* Admin Login */}
                    {user?.role !== 'admin' && (
                        <Link to="/admin-login">
                            <button className="btn btn-outline">
                                Admin Login
                            </button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "80vh",
                padding: "80px 50px 50px",
                flexWrap: "wrap",
                gap: "60px"
            }}>
                {/* Left Content */}
                <div style={{ flex: 1, minWidth: "400px", maxWidth: "600px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px", background: "rgba(29, 155, 240, 0.1)", borderRadius: "20px", marginBottom: "20px" }}>
                        <FaRocket style={{ color: "var(--accent-primary)" }} />
                        <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>Revolutionary Voting Platform</span>
                    </div>
                    
                    <h1 style={{ 
                        fontSize: "clamp(2.5rem, 5vw, 4rem)", 
                        fontWeight: "900", 
                        lineHeight: "1.1", 
                        marginBottom: "25px",
                        background: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Secure Blockchain Voting for Everyone
                    </h1>
                    
                    <p style={{ 
                        fontSize: "1.25rem", 
                        color: "var(--text-secondary)", 
                        marginBottom: "40px", 
                        lineHeight: "1.7",
                        maxWidth: "550px"
                    }}>
                        Transparent, tamper-proof elections powered by Ethereum. Your voice, secured forever on the blockchain.
                    </p>
                    
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
                        <Link to="/login">
                            <button className="btn btn-primary btn-lg">
                                Get Started
                                <FaRocket />
                            </button>
                        </Link>
                        <button className="btn btn-secondary btn-lg">
                            Watch Demo
                        </button>
                    </div>
                    
                    {/* Stats */}
                    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                        <StatItem number="10K+" label="Votes Secured" />
                        <StatItem number="50+" label="Active Polls" />
                        <StatItem number="99.9%" label="Uptime" />
                    </div>
                </div>

                {/* Right Interactive Card */}
                <div className="gradient-card" style={{
                    flex: 1,
                    minWidth: "350px",
                    maxWidth: "450px",
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                }}>
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "var(--gradient-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            boxShadow: "0 10px 25px rgba(29, 155, 240, 0.3)"
                        }}>
                            <FaLock size={32} color="white" />
                        </div>
                        <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
                            {user ? `Welcome back, ${user.name || "Voter"}` : "Join the Future"}
                        </h2>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>
                            {user ? "Continue your secure voting journey" : "Start voting with blockchain security"}
                        </p>
                    </div>

                    {user ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Link to={user.role === 'admin' ? "/admin" : "/vote"}>
                                <button className="btn btn-primary w-full">
                                    Go to Dashboard
                                </button>
                            </Link>
                            <button
                                onClick={() => { localStorage.removeItem("user"); setUser(null); }}
                                className="btn btn-danger w-full"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Link to="/login">
                                <button className="btn btn-primary w-full">
                                    Voter Login
                                </button>
                            </Link>
                            <Link to="/admin-login">
                                <button className="btn btn-secondary w-full">
                                    Admin Access
                                </button>
                            </Link>
                            <p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: "0.9rem", marginTop: "15px" }}>
                                New to BlockVote? <Link to="/login" style={{ color: "var(--accent-primary)" }}>Create an account</Link>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: "100px 50px", background: "var(--bg-secondary)" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: "70px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}>
                            Why Choose BlockVote?
                        </h2>
                        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
                            Revolutionary features that make voting transparent, secure, and accessible to everyone
                        </p>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
                        {features.map((feature, index) => (
                            <FeatureCard 
                                key={index}
                                {...feature}
                                isActive={index === currentFeatureIndex}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section id="technology" style={{ padding: "100px 50px" }}>
                <div className="container">
                    <div style={{ display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "300px" }}>
                            <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "25px" }}>
                                Powered by Cutting-Edge Technology
                            </h2>
                            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "30px", lineHeight: "1.7" }}>
                                Our platform combines the security of blockchain with the accessibility of modern web technology to create the most secure voting system ever built.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <TechBadge>Ethereum Smart Contracts</TechBadge>
                                <TechBadge>React Frontend</TechBadge>
                                <TechBadge>Node.js Backend</TechBadge>
                                <TechBadge>Supabase Database</TechBadge>
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
                            <div style={{
                                width: "300px",
                                height: "300px",
                                margin: "0 auto",
                                borderRadius: "20px",
                                background: "var(--gradient-primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 25px 50px rgba(29, 155, 240, 0.3)"
                            }}>
                                <FaChartLine size={100} color="white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: "60px 50px 30px",
                background: "var(--card-bg)",
                borderTop: "1px solid var(--border-color)"
            }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", marginBottom: "40px" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                <FaVoteYea size={28} style={{ color: "var(--accent-primary)" }} />
                                <span style={{ fontSize: "1.5rem", fontWeight: "800" }}>BLOCKVOTE</span>
                            </div>
                            <p style={{ color: "var(--text-secondary)", maxWidth: "300px" }}>
                                The future of democratic voting is here. Secure, transparent, and accessible to everyone.
                            </p>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
                            <FooterColumn title="Platform">
                                <FooterLink href="#features">Features</FooterLink>
                                <FooterLink href="#technology">Technology</FooterLink>
                                <FooterLink href="#security">Security</FooterLink>
                            </FooterColumn>
                            
                            <FooterColumn title="Resources">
                                <FooterLink href="#">Documentation</FooterLink>
                                <FooterLink href="#">API Reference</FooterLink>
                                <FooterLink href="#">Support</FooterLink>
                            </FooterColumn>
                            
                            <FooterColumn title="Company">
                                <FooterLink href="#">About Us</FooterLink>
                                <FooterLink href="#">Careers</FooterLink>
                                <FooterLink href="#">Contact</FooterLink>
                            </FooterColumn>
                        </div>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "30px",
                        borderTop: "1px solid var(--border-color)",
                        color: "var(--text-tertiary)",
                        fontSize: "0.9rem"
                    }}>
                        <div>© 2024 BlockVote. All rights reserved.</div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper Components
function NavItem({ href, children }) {
    return (
        <a 
            href={href} 
            style={{ 
                color: "inherit", 
                textDecoration: "none", 
                transition: "color var(--transition-fast)",
                position: "relative"
            }}
            onMouseOver={e => e.target.style.color = "var(--accent-primary)"}
            onMouseOut={e => e.target.style.color = "var(--text-secondary)"}
        >
            {children}
        </a>
    );
}

function SocialIcon({ href, icon }) {
    return (
        <a 
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-secondary)",
                transition: "all var(--transition-fast)",
                border: "1px solid transparent"
            }}
            onMouseOver={e => {
                e.target.style.background = "rgba(29, 155, 240, 0.1)";
                e.target.style.borderColor = "var(--accent-primary)";
                e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={e => {
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                e.target.style.borderColor = "transparent";
                e.target.style.transform = "translateY(0)";
            }}
        >
            {icon}
        </a>
    );
}

function StatItem({ number, label }) {
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--accent-primary)", marginBottom: "5px" }}>
                {number}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {label}
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, isActive }) {
    return (
        <div className={`card ${isActive ? 'pulse' : ''}`} style={{
            padding: "30px",
            textAlign: "center",
            border: isActive ? `2px solid var(--accent-primary)` : "1px solid var(--border-color)",
            transform: isActive ? "scale(1.05)" : "scale(1)",
            transition: "all var(--transition-normal)"
        }}>
            <div style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: isActive ? "var(--gradient-primary)" : "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px",
                color: isActive ? "white" : "var(--accent-primary)"
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--text-primary)" }}>
                {title}
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                {description}
            </p>
        </div>
    );
}

function TechBadge({ children }) {
    return (
        <div style={{
            padding: "12px 20px",
            background: "rgba(29, 155, 240, 0.1)",
            border: "1px solid var(--accent-primary)",
            borderRadius: "30px",
            color: "var(--accent-primary)",
            fontWeight: "600",
            textAlign: "center",
            transition: "all var(--transition-fast)"
        }}
        onMouseOver={e => e.target.style.background = "rgba(29, 155, 240, 0.2)"}
        onMouseOut={e => e.target.style.background = "rgba(29, 155, 240, 0.1)"}
        >
            {children}
        </div>
    );
}

function FooterColumn({ title, children }) {
    return (
        <div>
            <h4 style={{ color: "var(--text-primary)", marginBottom: "20px", fontWeight: "600" }}>
                {title}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {children}
            </div>
        </div>
    );
}

function FooterLink({ href, children }) {
    return (
        <a 
            href={href}
            style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color var(--transition-fast)",
                fontSize: "0.95rem"
            }}
            onMouseOver={e => e.target.style.color = "var(--accent-primary)"}
            onMouseOut={e => e.target.style.color = "var(--text-secondary)"}
        >
            {children}
        </a>
    );
}