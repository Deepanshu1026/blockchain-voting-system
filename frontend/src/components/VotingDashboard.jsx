import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls, castVote } from "../services/api";
import { FaRegComment, FaRetweet, FaRegHeart, FaShare, FaSearch, FaEllipsisH } from "react-icons/fa";

export default function VotingDashboard() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("feed"); // 'feed' or 'elections'

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
    }, []);

    const handleVote = async (pollId, candidateId, candidateName) => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            alert("Please Login to Vote!");
            return;
        }

        const user = JSON.parse(storedUser);
        const voterId = user.id_number || user.id; // handle different user object structures

        if (!voterId) {
            alert("Invalid User Session. Please Login Again.");
            return;
        }

        if (window.confirm(`Are you sure you want to vote for ${candidateName}?`)) {
            try {
                const res = await castVote({ pollId, candidateId, voterId });
                if (res.success) {
                    alert("Vote Cast Successfully! Thank you for voting.");
                    // Optionally refresh polls or update UI locally
                } else {
                    alert(res.error || "Failed to cast vote.");
                }
            } catch (error) {
                console.error("Voting Error", error);
                alert("An error occurred while voting.");
            }
        }
    };

    // Mock Feed Data
    const feedPosts = [
        {
            id: 1,
            user: "Election Commission",
            handle: "@EC_Official",
            time: "2h",
            content: "Voting for the upcoming student council elections begins tomorrow! Make sure your ID is verified on the blockchain.",
            likes: "1.2K",
            retweets: "450",
            comments: "32"
        },
        {
            id: 2,
            user: "Blockchain News",
            handle: "@BlockNews",
            time: "4h",
            content: "New study shows 99% reduction in voter fraud using decentralized voting systems like BlockVote. #FutureOfVoting",
            likes: "890",
            retweets: "210",
            comments: "15"
        },
        {
            id: 3,
            user: "Vitalik Buterin",
            handle: "@VitalikButerin",
            time: "6h",
            content: "Transparent governance is key to a thriving community. Happy to see more projects adopting on-chain voting.",
            likes: "5.4K",
            retweets: "1.1K",
            comments: "400"
        }
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#e7e9ea", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
            <Sidebar role="user" />

            {/* Middle Section - Feed */}
            <div style={{
                marginLeft: "275px",
                width: "600px",
                borderRight: "1px solid #2f3336",
                minHeight: "100vh"
            }}>
                {/* Header (Tabs) */}
                <div style={{
                    position: "sticky",
                    top: 0,
                    background: "rgba(0, 0, 0, 0.65)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #2f3336",
                    zIndex: 10
                }}>
                    <h2 style={{ padding: "16px", margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>Home</h2>
                    <div style={{ display: "flex", width: "100%" }}>
                        <div
                            onClick={() => setActiveTab("feed")}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                padding: "16px 0",
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                            className="hover-bg"
                        >
                            <span style={{
                                padding: "14px 0",
                                borderBottom: activeTab === "feed" ? "4px solid #1d9bf0" : "4px solid transparent",
                                color: activeTab === "feed" ? "#fff" : "#71767b",
                                fontWeight: activeTab === "feed" ? "bold" : "500"
                            }}>
                                For You
                            </span>
                        </div>
                        <div
                            onClick={() => setActiveTab("elections")}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                padding: "16px 0",
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                            className="hover-bg"
                        >
                            <span style={{
                                padding: "14px 0",
                                borderBottom: activeTab === "elections" ? "4px solid #1d9bf0" : "4px solid transparent",
                                color: activeTab === "elections" ? "#fff" : "#71767b",
                                fontWeight: activeTab === "elections" ? "bold" : "500"
                            }}>
                                Active Elections
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div>
                    {activeTab === "feed" ? (
                        /* Feed Tab */
                        <div>
                            {feedPosts.map(post => (
                                <div key={post.id} style={{
                                    padding: "16px",
                                    borderBottom: "1px solid #2f3336",
                                    cursor: "pointer",
                                    display: "flex",
                                    gap: "12px"
                                }}>
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "50%",
                                        background: "#333",
                                        flexShrink: 0
                                    }}></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                                <span style={{ fontWeight: "bold", color: "#fff" }}>{post.user}</span>
                                                <span style={{ color: "#71767b" }}>{post.handle}</span>
                                                <span style={{ color: "#71767b" }}>·</span>
                                                <span style={{ color: "#71767b" }}>{post.time}</span>
                                            </div>
                                            <FaEllipsisH color="#71767b" />
                                        </div>
                                        <div style={{ color: "#e7e9ea", lineHeight: "1.5", fontSize: "0.95rem", marginBottom: "12px" }}>
                                            {post.content}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "425px", color: "#71767b" }}>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaRegComment size={18} /> <span style={{ fontSize: "13px" }}>{post.comments}</span></div>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaRetweet size={18} /> <span style={{ fontSize: "13px" }}>{post.retweets}</span></div>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaRegHeart size={18} /> <span style={{ fontSize: "13px" }}>{post.likes}</span></div>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}><FaShare size={18} /></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Elections Tab */
                        <div>
                            {loading ? (
                                <div style={{ padding: "20px", textAlign: "center", color: "#71767b" }}>Loading elections...</div>
                            ) : polls.length === 0 ? (
                                <div style={{ padding: "20px", textAlign: "center", color: "#71767b" }}>No active elections found.</div>
                            ) : (
                                polls.map(poll => (
                                    <div key={poll.id || poll._id} style={{
                                        padding: "16px",
                                        borderBottom: "1px solid #2f3336",
                                        display: "flex",
                                        gap: "12px",
                                    }}>
                                        <div style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "50%",
                                            background: "#1d9bf0", // Blue for official polls
                                            flexShrink: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontWeight: "bold"
                                        }}>
                                            BV
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                                                    <span style={{ fontWeight: "bold", color: "#fff" }}>BlockVote Official</span>
                                                    <span style={{ color: "#71767b" }}>@BlockVote_App</span>
                                                </div>
                                            </div>
                                            <div style={{ color: "#e7e9ea", lineHeight: "1.5", fontSize: "0.95rem", marginBottom: "12px" }}>
                                                <strong>{poll.title}</strong>
                                                <br />
                                                {poll.description}
                                            </div>

                                            {/* Candidates as Options */}
                                            <div style={{ marginBottom: "12px" }}>
                                                {poll.candidates && poll.candidates.map((candidate, idx) => (
                                                    <div key={idx} style={{
                                                        padding: "10px",
                                                        border: "1px solid #1d9bf0",
                                                        borderRadius: "20px",
                                                        marginBottom: "8px",
                                                        textAlign: "center",
                                                        color: "#1d9bf0",
                                                        fontWeight: "bold",
                                                        cursor: "pointer",
                                                        transition: "background 0.2s"
                                                    }}
                                                        onClick={() => handleVote(poll.id || poll._id, candidate.id || candidate._id, candidate.name)}
                                                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(29, 155, 240, 0.1)"}
                                                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                                    >
                                                        Vote for {candidate.name}
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ fontSize: "0.85rem", color: "#71767b" }}>
                                                Only verified ID holders can vote • Ends {new Date(poll.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
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
