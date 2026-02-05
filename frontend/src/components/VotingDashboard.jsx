import { useState, useEffect } from "react";
import { getPolls } from "../services/api";
import { ethers } from "ethers";
import { votingContractAddress, votingContractABI } from "../config/contracts";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaArrowUp, FaArrowDown, FaRegCommentAlt, FaShare, FaRegBookmark, FaSearch, FaBell, FaPlus } from "react-icons/fa";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState({}); // loading state per poll
    const [activeTab, setActiveTab] = useState("overview"); // 'overview' (Feed) or 'vote' (Elections)
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
        loadPolls();
    }, []);

    const loadPolls = async () => {
        const data = await getPolls();
        setPolls(data);
    };

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert("MetaMask is not detected!\n\n1. If you just installed it, please REFRESH the page.\n2. Ensure the extension is enabled.");
            return;
        }
        try {
            const output = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (output.length > 0) alert("Wallet Connected: " + output[0]);
        } catch (error) {
            console.error(error);
            alert("Connection failed: " + error.message);
        }
    };

    const castVote = async (pollId, candidateId) => {
        if (typeof window.ethereum === 'undefined') {
            return alert("MetaMask not detected!\n\nPlease REFRESH the page if you just installed it.");
        }

        if (votingContractAddress === "0xYourContractAddressHere") {
            // MOCK MODE: Simulate voting for UI demonstration
            setLoading(prev => ({ ...prev, [pollId]: true }));
            console.log("MOCK VOTE: Voting for candidate", candidateId, "in poll", pollId);

            setTimeout(() => {
                alert("Vote Cast Successfully! (Mock Mode)");
                setLoading(prev => ({ ...prev, [pollId]: false }));
            }, 2000);
            return;
        }

        try {
            setLoading(prev => ({ ...prev, [pollId]: true }));
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(votingContractAddress, votingContractABI, signer);

            console.log(`Voting for candidate ${candidateId} in poll ${pollId}`);
            const tx = await contract.vote(pollId, candidateId);
            await tx.wait();

            alert("Vote Cast Successfully!");
        } catch (err) {
            console.error(err);
            alert("Voting Failed: " + (err.reason || err.message));
        }
        setLoading(prev => ({ ...prev, [pollId]: false }));
    };

    // Styling constants matching the new global theme
    const theme = {
        bg: "#121212",
        cardBg: "#1e1e1e",
        border: "#333",
        textMain: "#fff",
        textSub: "#aaa",
        accent: "#4f46e5",
        hover: "#2a2a2a"
    };

    // Reusable "Post" Component
    const RedditPost = ({ title, author, time, content, children, actions, flair }) => (
        <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            marginBottom: "16px",
            display: "flex",
            cursor: "pointer",
            transition: "all 0.2s ease",
            overflow: "hidden"
        }}
            onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Left Sidebar (Votes) */}
            <div style={{ width: "48px", background: "rgba(255,255,255,0.02)", padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", borderRight: `1px solid ${theme.border}` }}>
                <div style={{ color: theme.textSub, cursor: "pointer", padding: "4px" }} onClick={(e) => { e.stopPropagation(); alert("Upvoted!"); }}><FaArrowUp /></div>
                <div style={{ color: theme.textMain, fontSize: "0.9rem", fontWeight: "700" }}>{(Math.random() * 100).toFixed(0)}</div>
                <div style={{ color: theme.textSub, cursor: "pointer", padding: "4px" }} onClick={(e) => { e.stopPropagation(); alert("Downvoted!"); }}><FaArrowDown /></div>
            </div>

            {/* Main Content */}
            <div style={{ padding: "16px 24px", flex: 1 }}>
                {/* Post Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: theme.textSub, marginBottom: "12px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: theme.accent }}></div>
                    <span style={{ fontWeight: "700", color: theme.textMain }}>r/BlockchainVoting</span>
                    <span>•</span>
                    <span>Posted by u/{author}</span>
                    <span>•</span>
                    <span>{time}</span>
                </div>

                {/* Post Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: theme.textMain, margin: 0, lineHeight: "1.4" }}>{title}</h3>
                    {flair && <span style={{ background: flair.color || "#FF4500", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: "700" }}>{flair.text}</span>}
                </div>

                {/* Post Body/Content */}
                <div style={{ marginBottom: "16px", lineHeight: "1.6", color: "#e5e5e5" }}>{content}</div>

                {children}

                {/* Action Bar */}
                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", color: theme.textSub, fontSize: "0.85rem", fontWeight: "600", background: "rgba(255,255,255,0.05)", borderRadius: "20px" }}>
                        <FaRegCommentAlt /> {Math.floor(Math.random() * 50)} Comments
                    </div>
                    <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", color: theme.textSub, fontSize: "0.85rem", fontWeight: "600", background: "transparent", borderRadius: "20px" }}>
                        <FaShare /> Share
                    </div>
                    <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", color: theme.textSub, fontSize: "0.85rem", fontWeight: "600", background: "transparent", borderRadius: "20px" }}>
                        <FaRegBookmark /> Save
                    </div>
                    {actions}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, color: theme.textMain }}>
            {/* Global Sidebar - Replaces internal sidebar */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div style={{ marginLeft: "260px", width: "100%", transition: "all 0.3s ease" }}>

                {/* Fixed Header */}
                <div style={{
                    height: "70px",
                    background: "rgba(18, 18, 18, 0.8)",
                    backdropFilter: "blur(20px)",
                    borderBottom: `1px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 40px",
                    position: "sticky",
                    top: 0,
                    zIndex: 90,
                    justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", letterSpacing: "-0.5px" }}>Voting Dashboard</h2>

                        {/* Tab Switcher for Content */}
                        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "4px" }}>
                            <button
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    background: activeTab === 'overview' ? theme.accent : 'transparent',
                                    border: "none", color: "white", padding: "8px 20px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "600",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                Feed
                            </button>
                            <button
                                onClick={() => setActiveTab('vote')}
                                style={{
                                    background: activeTab === 'vote' ? theme.accent : 'transparent',
                                    border: "none", color: "white", padding: "8px 20px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "600",
                                    cursor: "pointer", transition: "all 0.2s"
                                }}
                            >
                                Elections
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{
                            display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)",
                            padding: "0 16px", borderRadius: "12px",
                            border: `1px solid ${theme.border}`, height: "40px", width: "260px"
                        }}>
                            <FaSearch style={{ color: "#aaa", marginRight: "10px" }} />
                            <input type="text" placeholder="Search..."
                                style={{ background: "transparent", border: "none", color: "white", width: "100%", outline: "none", fontSize: "0.95rem" }} />
                        </div>

                        <button className="icon-btn" style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", width: "40px", height: "40px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaBell /></button>
                        <button className="icon-btn" style={{ background: theme.accent, border: "none", color: "white", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)" }}><FaPlus /></button>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>

                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <RedditPost
                                title="Welcome to VoteChain! Your voice matters."
                                author="AutoModerator"
                                time="Pinned"
                                flair={{ text: "ANNOUNCEMENT", color: "#4f46e5" }}
                                content={
                                    <div style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#e5e5e5" }}>
                                        <p>Welcome to the official decentralized voting platform. This feed is for campaign updates and community discussions.</p>
                                        <div style={{ background: "rgba(79, 70, 229, 0.1)", padding: "16px", borderRadius: "8px", margin: "16px 0", border: "1px solid rgba(79, 70, 229, 0.2)" }}>
                                            <strong style={{ color: "#818cf8" }}>Ready to Vote?</strong>
                                            <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
                                                <li>Go to the <strong>Elections</strong> tab to see active voting lines.</li>
                                                <li>Select your candidate and sign with MetaMask.</li>
                                            </ul>
                                        </div>
                                    </div>
                                }
                            />

                            <RedditPost
                                title="Campaign Update: My Vision for the 2026 University Roadmap"
                                author="Candidate_Alex"
                                time="2 hours ago"
                                flair={{ text: "CAMPAIGN", color: "#833ab4" }}
                                content={
                                    <div style={{ fontSize: "0.95rem", color: "#e5e5e5" }}>
                                        <p>Hi everyone, I am running for University President. My main focus will be on:</p>
                                        <ul style={{ paddingLeft: "20px" }}>
                                            <li>Increasing library hours.</li>
                                            <li>Better cafeteria options with vegan choices.</li>
                                            <li>Transparency in student budget allocation.</li>
                                        </ul>
                                        <p>Check out my full manifesto in the comments! #VoteAlex2026</p>
                                    </div>
                                }
                            />

                            <RedditPost
                                title="[Discussion] Should we implement Quadratic Voting for future elections?"
                                author="GovernanceDAO"
                                time="5 hours ago"
                                flair={{ text: "DISCUSSION", color: "#FF8700" }}
                                content={
                                    <p style={{ fontSize: "0.95rem", color: "#e5e5e5" }}>
                                        Quadratic voting could help express the intensity of preferences, not just the direction.
                                        I've drafted a proposal for the next governance cycle. Thoughts?
                                    </p>
                                }
                            />
                        </div>
                    )}

                    {activeTab === 'vote' && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="animate-fade-in">
                            {polls.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "60px", color: theme.textSub, background: theme.cardBg, borderRadius: "16px", border: `1px solid ${theme.border}` }}>
                                    <h3>No Active Elections</h3>
                                    <p>Check back later for upcoming polls.</p>
                                </div>
                            ) : (
                                polls.map(poll => (
                                    <div key={poll.id} style={{
                                        background: theme.cardBg,
                                        border: `1px solid ${theme.border}`,
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease"
                                    }}
                                        className="hover:border-accent"
                                    >
                                        {/* Election Header */}
                                        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
                                            <div>
                                                <h3 style={{ margin: "0 0 6px 0", fontSize: "1.4rem", color: theme.textMain }}>{poll.title}</h3>
                                                <div style={{ fontSize: "0.9rem", color: theme.textSub, display: "flex", gap: "12px" }}>
                                                    <span>ID: #{poll.id}</span>
                                                    <span>•</span>
                                                    <span>Ends in 2 days</span>
                                                </div>
                                            </div>
                                            <div style={{ background: "rgba(70, 209, 96, 0.1)", color: "#46D160", border: "1px solid rgba(70, 209, 96, 0.3)", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ width: "8px", height: "8px", background: "#46D160", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px #46D160" }}></span>
                                                Live
                                            </div>
                                        </div>

                                        {/* Election Body */}
                                        <div style={{ padding: "24px" }}>
                                            <p style={{ fontSize: "1rem", color: "#ccc", marginBottom: "24px", lineHeight: "1.6" }}>{poll.description}</p>

                                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                                                {poll.candidates && poll.candidates.map(candidate => (
                                                    <div key={candidate.id} style={{
                                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                                        background: "rgba(255,255,255,0.03)", padding: "16px 20px",
                                                        borderRadius: "12px", border: `1px solid ${theme.border}`, cursor: "pointer",
                                                        transition: "all 0.2s"
                                                    }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                                            e.currentTarget.style.borderColor = "#666";
                                                            e.currentTarget.style.transform = "translateX(4px)";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                                            e.currentTarget.style.borderColor = theme.border;
                                                            e.currentTarget.style.transform = "translateX(0)";
                                                        }}
                                                        onClick={() => castVote(poll.id, candidate.id)}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                                            <img src={candidate.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.name}`}
                                                                style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#2a2a2a", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} alt="" />
                                                            <div>
                                                                <div style={{ fontWeight: "600", color: theme.textMain, fontSize: "1.1rem", marginBottom: "4px" }}>{candidate.name}</div>
                                                                <div style={{ fontSize: "0.9rem", color: theme.textSub, background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "6px", display: "inline-block" }}>{candidate.party}</div>
                                                            </div>
                                                        </div>

                                                        <button style={{
                                                            background: theme.textMain, color: "black", border: "none",
                                                            padding: "10px 28px", borderRadius: "30px", fontWeight: "700",
                                                            cursor: "pointer", fontSize: "0.95rem",
                                                            boxShadow: "0 4px 12px rgba(255,255,255,0.2)",
                                                            transition: "transform 0.1s"
                                                        }}
                                                            onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
                                                            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                                                        >
                                                            {loading[poll.id] ? "..." : "Vote"}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Footer Info */}
                                        <div style={{ padding: "12px 24px", background: "rgba(0,0,0,0.2)", borderTop: `1px solid ${theme.border}`, fontSize: "0.85rem", color: theme.textSub, display: "flex", gap: "24px" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>🔒 Secure On-Chain</span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>👤 Verified Only</span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>✅ Anti-Tamper</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* We removed the profile tab here since it's now in /settings */}
                </div>
            </div>
        </div>
    );
}
