import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls, castVote } from "../services/api";
import { FaRegComment, FaRetweet, FaRegHeart, FaShare, FaSearch, FaEllipsisH, FaWallet, FaChartBar, FaBell, FaCog, FaUser, FaVoteYea, FaHistory, FaStar } from "react-icons/fa";
import { ethers } from "ethers";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("feed"); // 'feed', 'elections', 'analytics'
    const [walletAddress, setWalletAddress] = useState("");
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New election started: Student Council 2024", time: "2 hours ago", unread: true },
        { id: 2, message: "Your vote has been recorded successfully", time: "1 day ago", unread: false }
    ]);

    useEffect(() => {
        async function fetchPolls() {
            try {
                const data = await getPolls();
                if (data.polls) {
                    setPolls(data.polls);
                } else if (Array.isArray(data)) {
                    setPolls(data);
                }
            } catch (error) {
                console.error("Failed to fetch polls", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPolls();
        checkWalletConnection();
    }, []);

    const checkWalletConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                }
            } catch (error) {
                console.error("Error checking wallet connection", error);
            }
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setWalletAddress(accounts[0]);
            } catch (error) {
                console.error("Error connecting wallet", error);
                alert("Failed to connect wallet.");
            }
        } else {
            alert("Please install MetaMask to use this feature!");
        }
    };

    const handleVote = async (pollId, candidateId, candidateName) => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            showNotification("Please Login to Vote!", "error");
            return;
        }

        const user = JSON.parse(storedUser);
        const voterId = user.id_number || user.id;

        if (!voterId) {
            showNotification("Invalid User Session. Please Login Again.", "error");
            return;
        }

        if (window.confirm(`Are you sure you want to vote for ${candidateName}?`)) {
            try {
                const res = await castVote({ pollId, candidateId, voterId });
                if (res.success) {
                    showNotification("Vote Cast Successfully! Thank you for voting.", "success");
                    // Refresh polls to show updated vote counts
                    fetchData();
                } else {
                    showNotification(res.error || "Failed to cast vote.", "error");
                }
            } catch (error) {
                console.error("Voting Error", error);
                showNotification("An error occurred while voting.", "error");
            }
        }
    };

    const showNotification = (message, type = "info") => {
        // In a real app, this would integrate with a notification system
        alert(`${type.toUpperCase()}: ${message}`);
    };

    const fetchData = async () => {
        try {
            const data = await getPolls();
            if (data.polls) {
                setPolls(data.polls);
            } else if (Array.isArray(data)) {
                setPolls(data);
            }
        } catch (error) {
            console.error("Failed to fetch polls", error);
            showNotification("Failed to load elections", "error");
        } finally {
            setLoading(false);
        }
    };

    // Enhanced Feed Data with Voting Context
    const feedPosts = [
        {
            id: 1,
            user: "Election Commission",
            handle: "@EC_Official",
            time: "2h",
            content: "🗳️ Voting for the upcoming student council elections begins tomorrow! Make sure your ID is verified on the blockchain for secure participation.",
            likes: "1.2K",
            retweets: "450",
            comments: "32",
            type: "announcement"
        },
        {
            id: 2,
            user: "Blockchain News",
            handle: "@BlockNews",
            time: "4h",
            content: "📊 New study shows 99% reduction in voter fraud using decentralized voting systems like BlockVote. #FutureOfVoting #Blockchain",
            likes: "890",
            retweets: "210",
            comments: "15",
            type: "news"
        },
        {
            id: 3,
            user: "Voting Analytics",
            handle: "@VoteAnalytics",
            time: "6h",
            content: "🔥 Real-time update: 5,234 votes cast so far today. Participation rate up 40% compared to last week! #ActiveDemocracy",
            likes: "2.1K",
            retweets: "650",
            comments: "89",
            type: "stats"
        },
        {
            id: 4,
            user: "Security Team",
            handle: "@BlockVote_Sec",
            time: "8h",
            content: "✅ All voting transactions confirmed on Ethereum blockchain. Zero tampering detected. Your vote is secure and immutable.",
            likes: "3.4K",
            retweets: "1.2K",
            comments: "156",
            type: "security"
        }
    ];

    // Analytics Data
    const analyticsData = {
        totalVotes: 15420,
        activePolls: 8,
        participationRate: 73.5,
        recentVotes: [
            { time: "Just now", poll: "Student Council", voter: "Voter #4567" },
            { time: "5 min ago", poll: "Budget Allocation", voter: "Voter #1234" },
            { time: "12 min ago", poll: "Campus Facilities", voter: "Voter #7890" }
        ]
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-color)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
            <Sidebar role="user" />

            {/* Middle Section - Feed */}
            <div style={{
                marginLeft: "275px",
                width: "600px",
                borderRight: "1px solid var(--border-color)",
                minHeight: "100vh",
                position: "relative"
            }}>
                {/* Notification Badge */}
                <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "12px",
                    height: "12px",
                    background: "var(--accent-danger)",
                    borderRadius: "50%",
                    zIndex: 100
                }} />
                {/* Enhanced Header with More Tabs */}
                <div style={{
                    position: "sticky",
                    top: 0,
                    background: "rgba(15, 20, 25, 0.8)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid var(--border-color)",
                    zIndex: 10
                }}>
                    <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaVoteYea style={{ color: "var(--accent-primary)" }} />
                            Dashboard
                        </h2>

                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            {/* Notifications Bell */}
                            <button 
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "8px 12px" }}
                                onClick={() => alert('Notifications panel would open here')}
                            >
                                <FaBell />
                            </button>
                            
                            {/* Settings */}
                            <button 
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "8px 12px" }}
                                onClick={() => alert('Settings panel would open here')}
                            >
                                <FaCog />
                            </button>
                            
                            {/* Wallet Connection */}
                            {walletAddress ? (
                                <div style={{
                                    padding: "8px 16px",
                                    background: "rgba(29, 155, 240, 0.1)",
                                    border: "1px solid var(--accent-primary)",
                                    borderRadius: "20px",
                                    color: "var(--accent-primary)",
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}>
                                    <FaWallet />
                                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                </div>
                            ) : (
                                <button
                                    onClick={connectWallet}
                                    className="btn btn-primary btn-sm"
                                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    <FaWallet /> Connect Wallet
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", width: "100%" }}>
                        <TabButton 
                            active={activeTab === "feed"} 
                            onClick={() => setActiveTab("feed")} 
                            label="Feed" 
                            icon={<FaUser />}
                        />
                        <TabButton 
                            active={activeTab === "elections"} 
                            onClick={() => setActiveTab("elections")} 
                            label="Elections" 
                            icon={<FaVoteYea />}
                        />
                        <TabButton 
                            active={activeTab === "analytics"} 
                            onClick={() => setActiveTab("analytics")} 
                            label="Analytics" 
                            icon={<FaChartBar />}
                        />
                    </div>
                </div>

                {/* Enhanced Content Area */}
                <div>
                    {activeTab === "feed" && (
                        /* Enhanced Feed Tab */
                        <div>
                            {feedPosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                    
                    {activeTab === "elections" && (
                        /* Enhanced Elections Tab */
                        <div>
                            {loading ? (
                                <div className="skeleton" style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
                                    Loading elections...
                                </div>
                            ) : polls.length === 0 ? (
                                <EmptyState 
                                    icon={<FaVoteYea size={48} />} 
                                    title="No Active Elections" 
                                    message="There are currently no elections running. Check back soon!" 
                                />
                            ) : (
                                polls.map(poll => (
                                    <ElectionCard 
                                        key={poll.id || poll._id} 
                                        poll={poll} 
                                        onVote={handleVote}
                                        walletConnected={!!walletAddress}
                                    />
                                ))
                            )}
                        </div>
                    )}
                    
                    {activeTab === "analytics" && (
                        /* Analytics Tab */
                        <div style={{ padding: "20px" }}>
                            <h2 style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <FaChartBar /> Voting Analytics
                            </h2>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                                <StatCard 
                                    title="Total Votes" 
                                    value={analyticsData.totalVotes.toLocaleString()} 
                                    color="var(--accent-primary)" 
                                />
                                <StatCard 
                                    title="Active Polls" 
                                    value={analyticsData.activePolls} 
                                    color="var(--accent-success)" 
                                />
                                <StatCard 
                                    title="Participation" 
                                    value={`${analyticsData.participationRate}%`} 
                                    color="var(--accent-warning)" 
                                />
                            </div>
                            
                            <div className="card">
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <FaHistory /> Recent Activity
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    {analyticsData.recentVotes.map((vote, index) => (
                                        <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                                            <div>
                                                <div style={{ fontWeight: "600" }}>{vote.voter}</div>
                                                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Voted in {vote.poll}</div>
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)" }}>{vote.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section - Search & Trends */}
            <div style={{
                width: "350px",
                marginLeft: "30px",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                paddingRight: "20px"
            }}>
                {/* Search Bar */}
                <div style={{
                    position: "relative",
                    background: "#202327",
                    borderRadius: "24px",
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <FaSearch color="#71767b" />
                    <input
                        type="text"
                        placeholder="Search BlockVote"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            width: "100%",
                            outline: "none",
                            fontSize: "0.95rem"
                        }}
                    />
                </div>

                {/* Trending Box */}
                <div style={{
                    background: "#16181c",
                    borderRadius: "16px",
                    padding: "20px"
                }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "15px", color: "white" }}>Trends for you</h2>

                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>Politics · Trending</div>
                        <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "white" }}>#DecentralizedVoting</div>
                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>12.5K Posts</div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>Technology · Trending</div>
                        <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "white" }}>Ethereum</div>
                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>240K Posts</div>
                    </div>

                    <div style={{ marginBottom: "0px" }}>
                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>India · Trending</div>
                        <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "white" }}>Digital ID</div>
                        <div style={{ fontSize: "0.8rem", color: "#71767b" }}>5K Posts</div>
                    </div>
                </div>

                {/* Who to follow */}
                <div style={{
                    background: "#16181c",
                    borderRadius: "16px",
                    padding: "20px"
                }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "15px", color: "white" }}>Who to follow</h2>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#555" }}></div>
                            <div>
                                <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "white" }}>Election Dept</div>
                                <div style={{ fontSize: "0.85rem", color: "#71767b" }}>@OfficialGov</div>
                            </div>
                        </div>
                        <button style={{ background: "#fff", color: "#000", padding: "6px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "bold" }}>Follow</button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#555" }}></div>
                            <div>
                                <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "white" }}>TechCrunch</div>
                                <div style={{ fontSize: "0.85rem", color: "#71767b" }}>@TechCrunc...</div>
                            </div>
                        </div>
                        <button style={{ background: "#fff", color: "#000", padding: "6px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "bold" }}>Follow</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Helper Components
function TabButton({ active, onClick, label, icon }) {
    return (
        <div
            onClick={onClick}
            style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                background: active ? "rgba(29, 155, 240, 0.1)" : "transparent",
                borderBottom: active ? `3px solid var(--accent-primary)` : "3px solid transparent"
            }}
            onMouseOver={e => {
                if (!active) e.target.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseOut={e => {
                if (!active) e.target.style.background = "transparent";
            }}
        >
            <span style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                fontWeight: active ? "700" : "500"
            }}>
                {icon}
                {label}
            </span>
        </div>
    );
}

function PostCard({ post }) {
    const getTypeColor = (type) => {
        switch(type) {
            case 'announcement': return 'var(--accent-primary)';
            case 'news': return 'var(--accent-success)';
            case 'stats': return 'var(--accent-warning)';
            case 'security': return 'var(--accent-danger)';
            default: return 'var(--text-secondary)';
        }
    };
    
    return (
        <div className="card" style={{
            padding: "16px",
            borderBottom: "1px solid var(--border-color)",
            cursor: "pointer",
            display: "flex",
            gap: "12px",
            transition: "all var(--transition-fast)"
        }}
        onMouseOver={e => e.currentTarget.style.background = "var(--card-hover)"}
        onMouseOut={e => e.currentTarget.style.background = "var(--card-bg)"}
        >
            <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${getTypeColor(post.type)}, ${getTypeColor(post.type)}cc)`,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold"
            }}>
                {post.user.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", color: "var(--text-primary)" }}>{post.user}</span>
                        <span style={{ color: "var(--text-secondary)" }}>{post.handle}</span>
                        <span style={{ color: "var(--text-secondary)" }}>·</span>
                        <span style={{ color: "var(--text-secondary)" }}>{post.time}</span>
                        <span style={{
                            background: getTypeColor(post.type),
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: "600"
                        }}>
                            {post.type.toUpperCase()}
                        </span>
                    </div>
                    <FaEllipsisH color="var(--text-secondary)" />
                </div>
                <div style={{ color: "var(--text-primary)", lineHeight: "1.5", fontSize: "0.95rem", marginBottom: "12px" }}>
                    {post.content}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "425px", color: "var(--text-secondary)" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaRegComment size={18} /> <span style={{ fontSize: "13px" }}>{post.comments}</span></div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaRetweet size={18} /> <span style={{ fontSize: "13px" }}>{post.retweets}</span></div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaRegHeart size={18} /> <span style={{ fontSize: "13px" }}>{post.likes}</span></div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaShare size={18} /></div>
                </div>
            </div>
        </div>
    );
}

function ElectionCard({ poll, onVote, walletConnected }) {
    const isActive = new Date(poll.endDate) > new Date();
    const totalVotes = poll.candidates?.reduce((sum, candidate) => sum + (candidate.vote_count || 0), 0) || 0;
    
    return (
        <div className="card" style={{
            padding: "20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            gap: "16px",
            transition: "all var(--transition-normal)"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: isActive ? "var(--gradient-primary)" : "var(--border-color)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                boxShadow: isActive ? "0 5px 15px rgba(29, 155, 240, 0.3)" : "none"
            }}>
                <FaVoteYea size={24} />
            </div>
            
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                        <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>{poll.title}</h3>
                        <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            <span><FaCalendarAlt /> Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                            <span><FaUsers /> {poll.candidates?.length || 0} Candidates</span>
                            <span><FaChartBar /> {totalVotes} Votes</span>
                        </div>
                    </div>
                    <div>
                        <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                            {isActive ? 'ACTIVE' : 'ENDED'}
                        </span>
                    </div>
                </div>
                
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
                    {poll.description}
                </p>

                {/* Enhanced Candidates Section */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "15px" }}>
                        {poll.candidates && poll.candidates.map((candidate) => {
                            const percentage = totalVotes > 0 ? Math.round((candidate.vote_count || 0) / totalVotes * 100) : 0;
                            return (
                                <div key={candidate.id || candidate._id} style={{
                                    flex: "1 1 200px",
                                    minWidth: "180px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "15px",
                                    transition: "all var(--transition-fast)"
                                }}
                                onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent-primary)"}
                                onMouseOut={e => e.currentTarget.style.borderColor = "var(--border-color)"}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                        <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                                            {candidate.name}
                                        </div>
                                        <div style={{ fontSize: "0.9rem", color: "var(--accent-primary)", fontWeight: "bold" }}>
                                            {percentage}%
                                        </div>
                                    </div>
                                    
                                    <div className="progress-bar" style={{ marginBottom: "10px" }}>
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                        <span>{candidate.vote_count || 0} votes</span>
                                        <span>{candidate.party || 'Independent'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {isActive && walletConnected ? (
                        poll.candidates && poll.candidates.map((candidate) => (
                            <button
                                key={candidate.id || candidate._id}
                                onClick={() => onVote(poll.id || poll._id, candidate.id || candidate._id, candidate.name)}
                                className="btn btn-primary btn-sm"
                                disabled={!isActive}
                            >
                                <FaStar /> Vote for {candidate.name}
                            </button>
                        ))
                    ) : isActive && !walletConnected ? (
                        <button className="btn btn-warning" onClick={() => alert('Please connect your wallet first')}>
                            Connect Wallet to Vote
                        </button>
                    ) : (
                        <button className="btn btn-secondary" disabled>
                            Voting Ended
                        </button>
                    )}
                </div>
                
                <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginTop: "15px" }}>
                    Only verified ID holders can vote • Secured by Ethereum blockchain
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }) {
    return (
        <div className="card" style={{
            padding: "24px",
            textAlign: "center",
            borderLeft: `4px solid ${color}`
        }}>
            <div style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "0.9rem" }}>
                {title}
            </div>
            <div style={{ 
                fontSize: "2rem", 
                fontWeight: "800", 
                color: color,
                marginBottom: "5px"
            }}>
                {value}
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                    height: "100%",
                    width: "70%",
                    background: color,
                    borderRadius: "2px"
                }} />
            </div>
        </div>
    );
}

function EmptyState({ icon, title, message }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            textAlign: "center",
            color: "var(--text-secondary)"
        }}>
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                color: "var(--text-tertiary)"
            }}>
                {icon}
            </div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "12px" }}>{title}</h3>
            <p style={{ maxWidth: "400px", lineHeight: "1.6" }}>{message}</p>
        </div>
    );
}
