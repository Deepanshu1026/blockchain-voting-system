import { useState, useEffect } from "react";
import { getPolls } from "../services/api";
import { ethers } from "ethers";
import { votingContractAddress, votingContractABI } from "../config/contracts";
import { useNavigate } from "react-router-dom";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState({}); // loading state per poll
    const [activeTab, setActiveTab] = useState("overview");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = [
        { id: 1, title: "University Election 2026", desc: "Shape the future of your campus. Vote for the best candidates.", color: "linear-gradient(to right, #833ab4, #fd1d1d)" },
        { id: 2, title: "Tech Innovation Award", desc: "Support the most innovative projects in the blockchain space.", color: "linear-gradient(to right, #00b09b, #96c93d)" },
        { id: 3, title: "Community Governance", desc: "Decide on the next major protocol upgrade.", color: "linear-gradient(to right, #00c6ff, #0072ff)" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

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

    // Reddit-style styling constants
    const theme = {
        bg: "#030303",
        cardBg: "#1A1A1B",
        border: "#343536",
        textMain: "#D7DADC",
        textSub: "#818384",
        accent: "#D7DADC", // Professional white/grey accent
        blue: "#0079D3", // Reddit Blue for links/buttons
        hover: "#272729"
    };

    // Icons
    const Icons = {
        ArrowUp: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>,
        ArrowDown: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>,
        Message: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
        Share: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>,
        Save: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2-2z" /></svg>,
        Home: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        Trending: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.27.57 2.025 1.5 5.235 5 5.5Z" /></svg>,
        Settings: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
        Search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
        Bell: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
        Plus: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>,
        Chat: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
        Coin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>,
        Logo: <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><circle cx="12" cy="12" r="10" /><path d="m14 10-4 4" stroke="black" strokeWidth="2" /><path d="m14 14-4-4" stroke="black" strokeWidth="2" /></svg>
    };

    // Reddit-like Sidebar
    const UserSidebar = () => {
        const menuItems = [
            { id: "overview", label: "Home", icon: Icons.Home },
            { id: "vote", label: "Elections", icon: Icons.Trending },
            { id: "profile", label: "Settings", icon: Icons.Settings },
        ];

        return (
            <div style={{
                width: "270px",
                height: "calc(100vh - 49px)",
                background: theme.bg,
                borderRight: `1px solid ${theme.border}`,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: "49px",
                zIndex: 90,
                overflowY: "auto"
            }}>
                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                background: activeTab === item.id ? theme.hover : "transparent",
                                color: theme.textMain,
                                border: "none",
                                textAlign: "left",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontFamily: "IBMPlexSans, Arial, sans-serif"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = theme.hover}
                            onMouseOut={(e) => e.currentTarget.style.background = activeTab === item.id ? theme.hover : "transparent"}
                        >
                            <span style={{ display: "flex", alignItems: "center", opacity: 0.8 }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ borderTop: `1px solid ${theme.border}`, margin: "16px 0" }}></div>

                <div style={{ padding: "0 12px" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.textSub, textTransform: "uppercase", marginBottom: "16px", letterSpacing: "0.5px" }}>Communities</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: theme.textMain, fontSize: "0.9rem", cursor: "pointer" }}>
                            <div style={{ borderRadius: "50%", width: "24px", height: "24px", background: "#0079D3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>r/</div>
                            r/Blockchain
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: theme.textMain, fontSize: "0.9rem", cursor: "pointer" }}>
                            <div style={{ borderRadius: "50%", width: "24px", height: "24px", background: "#FF4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>r/</div>
                            r/Voting
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: `1px solid ${theme.border}`, margin: "16px 0" }}></div>

                <div style={{ padding: "0 12px" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: theme.textSub, textTransform: "uppercase", marginBottom: "16px", letterSpacing: "0.5px" }}>Resources</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: theme.textMain, fontSize: "0.9rem", cursor: "pointer" }}>
                            {Icons.Coin}
                            VoteCoin
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: theme.textMain, fontSize: "0.9rem", cursor: "pointer" }}>
                            {Icons.Chat}
                            Discussion
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    // Reusable "Post" Component
    const RedditPost = ({ title, author, time, content, children, actions, flair }) => (
        <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "4px",
            marginBottom: "12px",
            display: "flex",
            cursor: "pointer",
            transition: "border 0.2s"
        }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "#818384"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = theme.border}
        >
            {/* Left Sidebar (Votes) */}
            <div style={{ width: "40px", background: "#161617", padding: "12px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }}>
                <div style={{ color: theme.textSub, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); alert("Upvoted!"); }}>{Icons.ArrowUp}</div>
                <div style={{ color: theme.textMain, fontSize: "0.85rem", fontWeight: "700", margin: "4px 0" }}>{(Math.random() * 100).toFixed(0)}</div>
                <div style={{ color: theme.textSub, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); alert("Downvoted!"); }}>{Icons.ArrowDown}</div>
            </div>

            {/* Main Content */}
            <div style={{ padding: "12px", flex: 1 }}>
                {/* Post Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: theme.textSub, marginBottom: "8px" }}>
                    {/* Tiny Icon */}
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: theme.textMain }}></div>
                    <span style={{ fontWeight: "700", color: theme.textMain, marginLeft: "4px" }}>r/BlockchainVoting</span>
                    <span style={{ margin: "0 2px" }}>•</span>
                    <span>Posted by u/{author}</span>
                    <span style={{ margin: "0 2px" }}>•</span>
                    <span>{time}</span>
                </div>

                {/* Post Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: "600", color: theme.textMain, margin: 0, lineHeight: "1.4" }}>{title}</h3>
                    {flair && <span style={{ background: flair.color || "#FF4500", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: "700", border: "1px solid rgba(0,0,0,0.1)" }}>{flair.text}</span>}
                </div>

                {/* Post Body/Content */}
                <div style={{ marginBottom: "12px" }}>{content}</div>

                {children}

                {/* Action Bar */}
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px", color: theme.textSub, fontSize: "0.85rem", fontWeight: "600", background: "rgba(255,255,255,0.05)", borderRadius: "20px" }}>
                        {Icons.Message} {Math.floor(Math.random() * 50)} Comments
                    </div>
                    <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px", color: theme.textSub, fontSize: "0.85rem", fontWeight: "600", background: "transparent", borderRadius: "20px" }}>
                        {Icons.Share} Share
                    </div>
                    <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px", color: theme.textSub, fontSize: "0.85rem", fontWeight: "600", background: "transparent", borderRadius: "20px" }}>
                        {Icons.Save} Save
                    </div>
                    {actions}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain, fontFamily: "IBMPlexSans, Arial, sans-serif" }}>

            {/* FIXED HEADER */}
            <div style={{
                height: "49px", background: theme.cardBg, borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center",
                padding: "0 20px", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100, justifyContent: "space-between"
            }}>
                {/* Logo Area */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "260px" }}>
                    {Icons.Logo}
                    <span style={{ fontSize: "1.2rem", fontWeight: "700", color: theme.textMain, letterSpacing: "-0.5px" }}>VoteChain</span>
                </div>

                {/* Search Bar */}
                <div style={{ flex: 1, maxWidth: "600px" }}>
                    <div style={{
                        display: "flex", alignItems: "center", background: "#272729",
                        padding: "0 16px", borderRadius: "20px",
                        border: `1px solid ${theme.border}`, height: "36px", width: "100%"
                    }}>
                        <span style={{ marginRight: "10px", opacity: 0.5, display: "flex", alignItems: "center" }}>{Icons.Search}</span>
                        <input type="text" placeholder="Search r/BlockchainVoting"
                            style={{ background: "transparent", border: "none", color: "white", width: "100%", outline: "none", fontSize: "0.9rem" }} />
                    </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "260px", justifyContent: "flex-end" }}>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.textMain, opacity: 0.9, padding: "8px" }} title="Popular">{Icons.Trending}</button>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.textMain, opacity: 0.9, padding: "8px" }} title="Chat">{Icons.Chat}</button>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.textMain, opacity: 0.9, padding: "8px" }} title="Notifications">{Icons.Bell}</button>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.textMain, opacity: 0.9, padding: "8px" }} title="Create Post">{Icons.Plus}</button>

                    <div style={{ marginLeft: "10px", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", border: `1px solid transparent`, transition: "0.2s" }}
                        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${theme.border}`}
                        onMouseOut={(e) => e.currentTarget.style.border = "1px solid transparent"}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "linear-gradient(45deg, #FF4500, #FF8700)" }}></div>
                        <div style={{ fontSize: "0.8rem", fontWeight: "700", color: theme.textMain }}>
                            {user ? user.name || "User" : "Voter"}
                        </div>
                        {Icons.ArrowDown}
                    </div>
                </div>
            </div>

            <UserSidebar />

            {/* Main Content Wrapper */}
            <div style={{ marginLeft: "270px", paddingTop: "50px" }}>
                <div style={{ padding: "20px 24px", maxWidth: "900px", margin: "0 auto" }}>

                    {/* CENTER FEED */}
                    <div>
                        {/* Sort Bar - Hidden on Profile */}
                        {activeTab !== 'profile' && (
                            <div style={{
                                marginBottom: "15px", display: "flex", gap: "12px", alignItems: "center"
                            }}>
                                <button style={{
                                    background: "#272729", border: `1px solid ${theme.border}`, color: theme.textMain,
                                    padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px"
                                }}>
                                    {Icons.Trending} Hot
                                </button>
                                <button style={{
                                    background: "transparent", border: "none", color: theme.textSub,
                                    padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px"
                                }}>
                                    ✨ New
                                </button>
                                <button style={{
                                    background: "transparent", border: "none", color: theme.textSub,
                                    padding: "8px 16px", borderRadius: "20px", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px"
                                }}>
                                    {Icons.ArrowUp} Top
                                </button>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div>
                                <RedditPost
                                    title="Welcome to VoteChain! Your voice matters."
                                    author="AutoModerator"
                                    time="Pinned"
                                    flair={{ text: "ANNOUNCEMENT", color: "#0079D3" }}
                                    content={
                                        <div style={{ fontSize: "0.9rem", lineHeight: "1.5", color: theme.textMain }}>
                                            <p>Welcome to the official decentralized voting platform. This feed is for campaign updates and community discussions.</p>
                                            <div style={{ background: "#272729", padding: "10px", borderRadius: "4px", margin: "10px 0", border: `1px solid ${theme.border}` }}>
                                                <strong>Ready to Vote?</strong>
                                                <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
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
                                        <div style={{ fontSize: "0.9rem", color: theme.textMain }}>
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
                                        <p style={{ fontSize: "0.9rem", color: theme.textMain }}>
                                            Quadratic voting could help express the intensity of preferences, not just the direction.
                                            I've drafted a proposal for the next governance cycle. Thoughts?
                                        </p>
                                    }
                                />
                            </div>
                        )}

                        {activeTab === 'vote' && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {polls.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "40px", color: theme.textSub, background: theme.cardBg, borderRadius: "8px", border: `1px solid ${theme.border}` }}>
                                        <h3>No Active Elections</h3>
                                        <p>Check back later for upcoming polls.</p>
                                    </div>
                                ) : (
                                    polls.map(poll => (
                                        <div key={poll.id} style={{
                                            background: theme.cardBg,
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: "8px",
                                            overflow: "hidden"
                                        }}>
                                            {/* Election Header */}
                                            <div style={{ padding: "16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.2rem", color: theme.textMain }}>{poll.title}</h3>
                                                    <div style={{ fontSize: "0.85rem", color: theme.textSub }}>
                                                        ID: #{poll.id} • Ends in 2 days
                                                    </div>
                                                </div>
                                                <div style={{ background: "#46D160", color: "black", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase" }}>
                                                    Live
                                                </div>
                                            </div>

                                            {/* Election Body */}
                                            <div style={{ padding: "20px" }}>
                                                <p style={{ fontSize: "0.95rem", color: theme.textMain, marginBottom: "20px", lineHeight: "1.5" }}>{poll.description}</p>

                                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                    {poll.candidates && poll.candidates.map(candidate => (
                                                        <div key={candidate.id} style={{
                                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                                            background: "rgba(255,255,255,0.03)", padding: "12px 16px",
                                                            borderRadius: "6px", border: `1px solid ${theme.border}`, cursor: "pointer",
                                                            transition: "all 0.2s"
                                                        }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                                                                e.currentTarget.style.borderColor = theme.textSub;
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                                                e.currentTarget.style.borderColor = theme.border;
                                                            }}
                                                            onClick={() => castVote(poll.id, candidate.id)}
                                                        >
                                                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                                <img src={candidate.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.name}`}
                                                                    style={{ width: "40px", height: "40px", borderRadius: "4px", background: "#333" }} alt="" />
                                                                <div>
                                                                    <div style={{ fontWeight: "700", color: theme.textMain, fontSize: "1rem" }}>{candidate.name}</div>
                                                                    <div style={{ fontSize: "0.8rem", color: theme.textSub }}>{candidate.party}</div>
                                                                </div>
                                                            </div>

                                                            <button style={{
                                                                background: theme.textMain, color: "black", border: "none",
                                                                padding: "8px 24px", borderRadius: "20px", fontWeight: "700",
                                                                cursor: "pointer", fontSize: "0.9rem"
                                                            }}>
                                                                {loading[poll.id] ? "..." : "Vote"}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Footer Info */}
                                            <div style={{ padding: "12px 20px", background: "rgba(255,255,255,0.02)", borderTop: `1px solid ${theme.border}`, fontSize: "0.8rem", color: theme.textSub, display: "flex", gap: "20px" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>🔒 Secure On-Chain</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>👤 Verified Only</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div style={{
                                background: theme.cardBg,
                                border: `1px solid ${theme.border}`,
                                borderRadius: "8px",
                                padding: "30px",
                                maxWidth: "700px",
                                margin: "0 auto"
                            }}>
                                <h1 style={{ marginBottom: "30px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>User Settings</h1>

                                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                                    <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: "linear-gradient(135deg, #FF4500, #FF8700)" }}></div>
                                    <div>
                                        <h2 style={{ margin: "0 0 5px 0", fontSize: "1.6rem" }}>{user && user.name ? user.name : "Verified Voter"}</h2>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ fontSize: "0.85rem", background: "rgba(70, 209, 96, 0.2)", color: "#46D160", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>✅ Identity Verified</span>
                                            <span style={{ fontSize: "0.85rem", color: theme.textSub }}>Citizen</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "30px" }}>
                                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: theme.textSub, display: "block", marginBottom: "8px" }}>Voter ID Number</label>
                                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontFamily: "monospace", fontSize: "1.1rem", border: `1px solid ${theme.border}` }}>
                                        {user && user.id_number}
                                    </div>
                                </div>

                                <div style={{ marginBottom: "30px" }}>
                                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: theme.textSub, display: "block", marginBottom: "8px" }}>Wallet Address</label>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.9rem", border: `1px solid ${theme.border}`, overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {user && user.wallet_address || "Not connected"}
                                        </div>
                                        <button onClick={connectWallet} style={{ background: theme.textMain, color: "black", border: "none", padding: "0 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>
                                            {user && user.wallet_address ? "Switch" : "Connect"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
