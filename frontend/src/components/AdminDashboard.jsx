import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getPolls, createPoll, getCandidates, addCandidate, addCandidateToPoll, deleteCandidate } from "../services/api";
import { 
    FaUserFriends, FaPoll, FaClipboardList, FaPlus, FaLink, FaCalendarAlt, 
    FaTrash, FaCheckCircle, FaChartBar, FaChartPie, FaChartLine, FaUsers,
    FaVoteYea, FaHistory, FaBell, FaSearch, FaFilter, FaDownload, FaSync
} from "react-icons/fa";

export default function AdminDashboard() {
    const [polls, setPolls] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'ended'

    // Form states
    const [newPollTitle, setNewPollTitle] = useState("");
    const [newPollDesc, setNewPollDesc] = useState("");
    const [newPollEndDate, setNewPollEndDate] = useState("");
    const [newCandidateName, setNewCandidateName] = useState("");
    const [newCandidateParty, setNewCandidateParty] = useState("");
    const [newCandidateImage, setNewCandidateImage] = useState("");

    // Selection states for linking
    const [selectedPollId, setSelectedPollId] = useState("");
    const [selectedCandidateId, setSelectedCandidateId] = useState("");

    // Tabs for management
    const [activeSection, setActiveSection] = useState("overview"); // 'overview', 'polls', 'candidates', 'analytics'
    
    // Analytics data
    const [analytics, setAnalytics] = useState({
        totalVotes: 0,
        dailyVotes: [],
        pollParticipation: [],
        voterEngagement: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [pollsData, candidatesData] = await Promise.all([
                getPolls(),
                getCandidates()
            ]);

            let pollsArray = [];
            if (pollsData.polls) pollsArray = pollsData.polls;
            else if (Array.isArray(pollsData)) pollsArray = pollsData;

            let candidatesArray = [];
            if (candidatesData.candidates) candidatesArray = candidatesData.candidates;
            else if (Array.isArray(candidatesData)) candidatesArray = candidatesData;

            setPolls(pollsArray);
            setCandidates(candidatesArray);
            
            // Calculate analytics
            calculateAnalytics(pollsArray, candidatesArray);

        } catch (error) {
            console.error("Failed to fetch admin data", error);
            showNotification("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    }
    
    function calculateAnalytics(pollsData, candidatesData) {
        const totalVotes = candidatesData.reduce((sum, candidate) => sum + (candidate.vote_count || 0), 0);
        
        // Mock daily votes data (in real app, this would come from backend)
        const dailyVotes = [
            { date: 'Mon', votes: 120 },
            { date: 'Tue', votes: 180 },
            { date: 'Wed', votes: 150 },
            { date: 'Thu', votes: 200 },
            { date: 'Fri', votes: 250 },
            { date: 'Sat', votes: 180 },
            { date: 'Sun', votes: 160 }
        ];
        
        // Poll participation rates
        const pollParticipation = pollsData.slice(0, 5).map(poll => ({
            title: poll.title.substring(0, 20) + (poll.title.length > 20 ? '...' : ''),
            participation: Math.floor(Math.random() * 100) + 1
        }));
        
        setAnalytics({
            totalVotes,
            dailyVotes,
            pollParticipation,
            voterEngagement: Math.min(100, Math.floor((totalVotes / 1000) * 100))
        });
    }
    
    const showNotification = (message, type = "info") => {
        // In a real app, this would integrate with a notification system
        alert(`${type.toUpperCase()}: ${message}`);
    };
    
    const filteredPolls = polls.filter(poll => {
        const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             poll.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || 
                             (filterStatus === "active" && new Date(poll.endDate) > new Date()) ||
                             (filterStatus === "ended" && new Date(poll.endDate) <= new Date());
        return matchesSearch && matchesFilter;
    });

    const handleDeleteCandidate = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete candidate "${name}"? This cannot be undone.`)) {
            try {
                const res = await deleteCandidate(id);
                if (res.success) {
                    showNotification("Candidate deleted successfully", "success");
                    fetchData();
                } else {
                    showNotification("Failed to delete candidate: " + res.error, "error");
                }
            } catch (error) {
                console.error("Error deleting candidate", error);
                showNotification("An error occurred while deleting candidate", "error");
            }
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        if (!newPollTitle.trim() || !newPollEndDate) {
            showNotification("Please fill in all required fields", "warning");
            return;
        }
        
        try {
            await createPoll({ title: newPollTitle, description: newPollDesc, endDate: newPollEndDate });
            showNotification("Poll created successfully!", "success");
            setNewPollTitle(""); setNewPollDesc(""); setNewPollEndDate("");
            fetchData();
        } catch (error) { 
            showNotification("Failed to create poll", "error");
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        if (!newCandidateName.trim()) {
            showNotification("Candidate name is required", "warning");
            return;
        }
        
        try {
            // Using a mock image service if none provided
            const imageUrl = newCandidateImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newCandidateName)}`;
            await addCandidate({ name: newCandidateName, party: newCandidateParty || "Independent", imageUrl });
            showNotification("Candidate added successfully!", "success");
            setNewCandidateName(""); setNewCandidateParty(""); setNewCandidateImage("");
            fetchData();
        } catch (error) { 
            showNotification("Failed to add candidate", "error");
        }
    };

    const handleAddCandidateToPoll = async (e) => {
        e.preventDefault();
        if (!selectedPollId || !selectedCandidateId) {
            showNotification("Please select both poll and candidate", "warning");
            return;
        }
        
        try {
            await addCandidateToPoll({ pollId: selectedPollId, candidateId: selectedCandidateId });
            showNotification("Candidate linked successfully!", "success");
            setSelectedPollId(""); setSelectedCandidateId("");
            fetchData();
        } catch (error) { 
            showNotification("Failed to link candidate", "error");
        }
    };

    // Calculate specific stats
    const totalVotes = analytics.totalVotes;
    const activePollsCount = polls.filter(p => new Date(p.endDate) > new Date()).length;
    const endedPollsCount = polls.length - activePollsCount;
    
    // Recent activity mock data
    const recentActivity = [
        { action: "New poll created", item: "Student Council 2024", time: "2 hours ago", type: "poll" },
        { action: "Candidate added", item: "John Smith", time: "5 hours ago", type: "candidate" },
        { action: "Vote recorded", item: "Poll #12345", time: "1 day ago", type: "vote" },
        { action: "Poll ended", item: "Budget Allocation", time: "2 days ago", type: "poll" }
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#e7e9ea", fontFamily: "Inter, sans-serif" }}>
            <Sidebar role="admin" />

            <div style={{ flex: 1, marginLeft: "275px", padding: "40px", maxWidth: "1200px" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0, color: "white" }}>Admin Dashboard</h1>
                        <p style={{ color: "#71767b", marginTop: "5px" }}>Manage your blockchain voting system</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", background: "#16181c", padding: "5px", borderRadius: "30px", border: "1px solid #2f3336" }}>
                        <TabButton active={activeSection === "overview"} onClick={() => setActiveSection("overview")} label="Overview" />
                        <TabButton active={activeSection === "polls"} onClick={() => setActiveSection("polls")} label="Polls" />
                        <TabButton active={activeSection === "candidates"} onClick={() => setActiveSection("candidates")} label="Candidates" />
                    </div>
                </header>

                {/* Overview Section */}
                {activeSection === "overview" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                        <StatCard title="Active Polls" value={activePollsCount} total={polls.length} icon={<FaPoll size={24} color="#1d9bf0" />} />
                        <StatCard title="Total Candidates" value={candidates.length} icon={<FaUserFriends size={24} color="#00ba7c" />} />
                        <StatCard title="Total Votes Cast" value={totalVotes} icon={<FaCheckCircle size={24} color="#f91880" />} />

                        <div style={{ gridColumn: "span 3", marginTop: "20px" }}>
                            <h3 style={{ borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>Quick Actions</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                                <QuickActionCard title="Create New Poll" onClick={() => setActiveSection("polls")} icon={<FaPlus />} desc="Launch a new election" color="#1d9bf0" />
                                <QuickActionCard title="Add Candidate" onClick={() => setActiveSection("candidates")} icon={<FaUserFriends />} desc="Register new profile" color="#00ba7c" />
                                <QuickActionCard title="Manage Voters" onClick={() => alert("Redirect to verification")} icon={<FaClipboardList />} desc="Verify IDs" color="#f91880" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Polls Management */}
                {activeSection === "polls" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                        {/* Create Poll Panel */}
                        <div className="glass-panel" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
                            <div>
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaPlus /> Create New Poll</h3>
                                <form onSubmit={handleCreatePoll} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <input className="admin-input" style={{ gridColumn: "span 2" }} placeholder="Poll Title" value={newPollTitle} onChange={e => setNewPollTitle(e.target.value)} required />
                                    <textarea className="admin-input" style={{ gridColumn: "span 2" }} placeholder="Description" rows="2" value={newPollDesc} onChange={e => setNewPollDesc(e.target.value)} />
                                    <div style={{ gridColumn: "span 2" }}>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", color: "#71767b" }}>End Date</label>
                                        <input className="admin-input" style={{ width: "100%" }} type="date" value={newPollEndDate} onChange={e => setNewPollEndDate(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="admin-btn-primary" style={{ gridColumn: "span 2" }}>Launch Poll</button>
                                </form>
                            </div>

                            <div style={{ borderLeft: "1px solid #2f3336", paddingLeft: "30px" }}>
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FaLink /> Link Candidate</h3>
                                <form onSubmit={handleAddCandidateToPoll} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <select className="admin-input" value={selectedPollId} onChange={e => setSelectedPollId(e.target.value)} required>
                                        <option value="">Select Poll</option>
                                        {polls.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>)}
                                    </select>
                                    <select className="admin-input" value={selectedCandidateId} onChange={e => setSelectedCandidateId(e.target.value)} required>
                                        <option value="">Select Candidate</option>
                                        {candidates.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                                    </select>
                                    <button type="submit" className="admin-btn-secondary">Link Candidate</button>
                                </form>
                            </div>
                        </div>

                        {/* Existing Polls List */}
                        <div>
                            <h3 style={{ marginBottom: "20px" }}>Existing Polls</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
                                {polls.map(poll => {
                                    const isActive = new Date(poll.endDate) > new Date();
                                    return (
                                        <div key={poll.id} className="glass-panel" style={{ position: "relative" }}>
                                            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                                                {isActive
                                                    ? <span style={{ background: "rgba(0, 186, 124, 0.1)", color: "#00ba7c", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>Running</span>
                                                    : <span style={{ background: "rgba(249, 24, 128, 0.1)", color: "#f91880", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>Ended</span>
                                                }
                                            </div>
                                            <h4 style={{ fontSize: "1.1rem", marginBottom: "5px" }}>{poll.title}</h4>
                                            <p style={{ color: "#71767b", fontSize: "0.9rem", marginBottom: "15px", height: "40px", overflow: "hidden" }}>{poll.description}</p>

                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#71767b", borderTop: "1px solid #2f3336", paddingTop: "15px" }}>
                                                <span><FaCalendarAlt /> Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                                                <span><FaUserFriends /> {poll.candidates?.length || 0} Candidates</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Dashboard */}
                {activeSection === "analytics" && (
                    <div>
                        <h2 style={{ marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <FaChartPie /> Voting Analytics Dashboard
                        </h2>
                        
                        {/* Analytics Overview Cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
                            <StatCard 
                                title="Total Participation" 
                                value={`${analytics.voterEngagement}%`} 
                                icon={<FaUsers size={28} />}
                                color="var(--accent-primary)"
                            />
                            <StatCard 
                                title="Avg. Votes/Poll" 
                                value={Math.round(totalVotes / Math.max(polls.length, 1))} 
                                icon={<FaPoll size={28} />}
                                color="var(--accent-success)"
                            />
                            <StatCard 
                                title="Peak Voting Day" 
                                value={analytics.dailyVotes.reduce((max, day) => day.votes > max.votes ? day : max, analytics.dailyVotes[0])?.date || 'N/A'} 
                                icon={<FaChartBar size={28} />}
                                color="var(--accent-warning)"
                            />
                            <StatCard 
                                title="Top Candidate" 
                                value={candidates.reduce((top, candidate) => (candidate.vote_count || 0) > (top.vote_count || 0) ? candidate : top, candidates[0])?.name?.substring(0, 15) + '...' || 'N/A'} 
                                icon={<FaUserFriends size={28} />}
                                color="var(--accent-danger)"
                            />
                        </div>
                        
                        {/* Detailed Charts */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "30px" }}>
                            <div className="card">
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <FaChartLine /> Weekly Voting Trends
                                </h3>
                                <SimpleChart data={analytics.dailyVotes} type="line" height="250px" />
                            </div>
                            
                            <div className="card">
                                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <FaChartBar /> Poll Participation Rates
                                </h3>
                                <SimpleChart data={analytics.pollParticipation} type="bar" height="250px" />
                            </div>
                        </div>
                        
                        {/* Detailed Statistics */}
                        <div className="card">
                            <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <FaClipboardList /> Detailed Statistics
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                                <DetailStat title="Total Registered Voters" value="1,247" change="+12%" />
                                <DetailStat title="Active Polls" value={activePollsCount} change="+2" />
                                <DetailStat title="Completed Polls" value={endedPollsCount} change="+1" />
                                <DetailStat title="Average Turnout" value="73%" change="+5%" />
                                <DetailStat title="Most Active Hour" value="2 PM" change="Peak time" />
                                <DetailStat title="Blockchain Confirmations" value="100%" change="✓ Secure" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Candidates Management */}
                {activeSection === "candidates" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" }}>
                        <div className="gradient-card" style={{ height: "fit-content" }}>
                            <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <FaUserFriends size={20} />
                                </div>
                                Register Candidate
                            </h3>
                            <form onSubmit={handleAddCandidate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input 
                                        className="input-field" 
                                        placeholder="Enter candidate's full name" 
                                        value={newCandidateName} 
                                        onChange={e => setNewCandidateName(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Party / Affiliation</label>
                                    <input 
                                        className="input-field" 
                                        placeholder="Political party or independent" 
                                        value={newCandidateParty} 
                                        onChange={e => setNewCandidateParty(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Profile Image URL (Optional)</label>
                                    <input 
                                        className="input-field" 
                                        placeholder="https://example.com/image.jpg" 
                                        value={newCandidateImage} 
                                        onChange={e => setNewCandidateImage(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }}>
                                    <FaPlus /> Add Candidate
                                </button>
                            </form>
                        </div>

                        <div className="card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                                <h3 style={{ margin: 0 }}>Candidate Directory</h3>
                                <div className="badge badge-primary">{candidates.length} candidates</div>
                            </div>
                            
                            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                                {loading ? (
                                    <div className="skeleton" style={{ height: "400px" }} />
                                ) : candidates.length === 0 ? (
                                    <EmptyState 
                                        icon={<FaUserFriends size={48} />} 
                                        title="No Candidates" 
                                        message="Add your first candidate to get started" 
                                    />
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                        {candidates.map(candidate => (
                                            <CandidateCard 
                                                key={candidate._id || candidate.id} 
                                                candidate={candidate} 
                                                onDelete={handleDeleteCandidate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* In-Line Styles for specific components */}
            <style>{`
                .glass-panel {
                    background: #16181c;
                    border: 1px solid #2f3336;
                    border-radius: 16px;
                    padding: 24px;
                }
                .admin-input {
                    background: #202327;
                    border: 1px solid #333;
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .admin-input:focus { border-color: #1d9bf0; }
                .admin-btn-primary {
                    background: #fff;
                    color: black;
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .admin-btn-primary:hover { opacity: 0.9; }
                .admin-btn-secondary {
                    background: transparent;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .admin-btn-secondary:hover { border-color: #fff; }
                
                /* Scrollbar */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #000; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>
        </div>
    );
}

// Enhanced Helper Components
function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "12px 24px",
                background: active ? "var(--gradient-primary)" : "transparent",
                color: active ? "white" : "var(--text-secondary)",
                border: "none",
                borderRadius: "20px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap"
            }}
            onMouseOver={e => {
                if (!active) e.target.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseOut={e => {
                if (!active) e.target.style.background = "transparent";
            }}
        >
            {icon}
            {label}
        </button>
    );
}

function MetricCard({ title, value, total, trend, icon, color }) {
    return (
        <div className="card" style={{
            padding: "24px",
            borderLeft: `4px solid ${color}`,
            transition: "all var(--transition-normal)",
            position: "relative",
            overflow: "hidden"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: `${color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.3
            }}>
                {icon}
            </div>
            
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "0.9rem" }}>
                    {title}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)" }}>
                        {value}
                    </div>
                    {total && (
                        <div style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                            / {total}
                        </div>
                    )}
                </div>
                {trend && (
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px", 
                        fontSize: "0.8rem",
                        color: trend > 0 ? "var(--accent-success)" : "var(--accent-danger)"
                    }}>
                        <span>{trend > 0 ? '↗' : '↘'}</span>
                        <span>{Math.abs(trend)}%</span>
                        <span style={{ color: "var(--text-tertiary)" }}>vs last period</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function SimpleChart({ data, type, height = "200px" }) {
    if (type === "bar") {
        const maxValue = Math.max(...data.map(d => d.votes || d.participation || 0));
        return (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height, gap: "8px" }}>
                {data.map((item, index) => {
                    const value = item.votes || item.participation || 0;
                    const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                        <div key={index} style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flex: 1
                        }}>
                            <div style={{
                                width: "100%",
                                height: `${heightPercent}%`,
                                background: "var(--gradient-primary)",
                                borderRadius: "4px 4px 0 0",
                                minWidth: "20px",
                                transition: "height 0.5s ease"
                            }} />
                            <div style={{
                                fontSize: "0.7rem",
                                color: "var(--text-secondary)",
                                marginTop: "8px",
                                textAlign: "center"
                            }}>
                                {item.date || item.title}
                            </div>
                            <div style={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                                marginTop: "4px"
                            }}>
                                {value}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    } else if (type === "line") {
        return (
            <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <div>Line chart visualization would appear here</div>
            </div>
        );
    }
    return null;
}

function ActivityItem({ activity }) {
    const getTypeIcon = (type) => {
        switch(type) {
            case 'poll': return <FaPoll size={16} style={{ color: "var(--accent-primary)" }} />;
            case 'candidate': return <FaUserFriends size={16} style={{ color: "var(--accent-success)" }} />;
            case 'vote': return <FaCheckCircle size={16} style={{ color: "var(--accent-danger)" }} />;
            default: return <FaHistory size={16} style={{ color: "var(--text-secondary)" }} />;
        }
    };
    
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "10px",
            transition: "all var(--transition-fast)"
        }}
        onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        >
            <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {getTypeIcon(activity.type)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>
                    {activity.action}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {activity.item}
                </div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                {activity.time}
            </div>
        </div>
    );
}

function ActionButton({ title, onClick, icon, color, desc }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${color}40`,
                borderRadius: "12px",
                color: "var(--text-primary)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                textAlign: "left",
                width: "100%"
            }}
            onMouseOver={e => {
                e.currentTarget.style.background = `${color}20`;
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseOut={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = `${color}40`;
                e.currentTarget.style.transform = "translateX(0)";
            }}
        >
            <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: color
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>{title}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{desc}</div>
            </div>
        </button>
    );
}

function PollCard({ poll, candidates }) {
    const isActive = new Date(poll.endDate) > new Date();
    const totalVotes = poll.candidates?.reduce((sum, candidate) => sum + (candidate.vote_count || 0), 0) || 0;
    const candidateCount = poll.candidates?.length || 0;
    
    return (
        <div className="card" style={{
            position: "relative",
            transition: "all var(--transition-normal)",
            border: isActive ? `1px solid var(--accent-primary)` : `1px solid var(--border-color)`
        }}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-5px)"}
        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                    {isActive ? 'ACTIVE' : 'ENDED'}
                </span>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
                <h4 style={{ 
                    fontSize: "1.2rem", 
                    marginBottom: "10px", 
                    color: "var(--text-primary)" 
                }}>
                    {poll.title}
                </h4>
                <p style={{ 
                    color: "var(--text-secondary)", 
                    fontSize: "0.95rem", 
                    marginBottom: "15px", 
                    lineHeight: "1.5" 
                }}>
                    {poll.description}
                </p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <StatItem label="Candidates" value={candidateCount} icon={<FaUserFriends />} />
                <StatItem label="Total Votes" value={totalVotes} icon={<FaCheckCircle />} />
                <StatItem label="Ends" value={new Date(poll.endDate).toLocaleDateString()} icon={<FaCalendarAlt />} />
                <StatItem label="Status" value={isActive ? 'Running' : 'Completed'} icon={<FaHistory />} />
            </div>
            
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                paddingTop: "15px",
                borderTop: "1px solid var(--border-color)"
            }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    {poll.candidates?.slice(0, 3).map((candidate, idx) => (
                        <div key={idx} style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "var(--accent-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            color: "white"
                        }}>
                            {candidate.name?.charAt(0) || 'C'}
                        </div>
                    ))}
                    {candidateCount > 3 && (
                        <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "var(--text-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: "var(--text-primary)"
                        }}>
                            +{candidateCount - 3}
                        </div>
                    )}
                </div>
                <button className="btn btn-secondary btn-sm">
                    View Details
                </button>
            </div>
        </div>
    );
}

function StatItem({ label, value, icon }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ color: "var(--text-secondary)" }}>{icon}</div>
            <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{label}</div>
                <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{value}</div>
            </div>
        </div>
    );
}

function DetailStat({ title, value, change }) {
    return (
        <div style={{
            padding: "20px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)"
        }}>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>
                {title}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    {value}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--accent-success)", marginBottom: "2px" }}>
                    {change}
                </div>
            </div>
        </div>
    );
}

function CandidateCard({ candidate, onDelete }) {
    return (
        <div className="card" style={{
            padding: "20px",
            textAlign: "center",
            transition: "all var(--transition-normal)"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"}
        onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
        >
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
                boxShadow: "0 5px 15px rgba(29, 155, 240, 0.3)"
            }}>
                {candidate.image_url ? (
                    <img 
                        src={candidate.image_url} 
                        alt={candidate.name}
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                ) : (
                    candidate.name?.charAt(0) || 'C'
                )}
            </div>
            
            <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                {candidate.name}
            </h4>
            <div style={{ 
                color: "var(--accent-primary)", 
                fontWeight: "600", 
                marginBottom: "15px" 
            }}>
                {candidate.party || 'Independent'}
            </div>
            
            <div style={{
                padding: "10px",
                background: "rgba(29, 155, 240, 0.1)",
                borderRadius: "8px",
                marginBottom: "15px"
            }}>
                <div style={{ fontWeight: "700", color: "var(--accent-primary)", fontSize: "1.2rem" }}>
                    {candidate.vote_count || 0}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Votes Received</div>
            </div>
            
            <button
                onClick={() => onDelete(candidate._id || candidate.id, candidate.name)}
                className="btn btn-danger btn-sm w-full"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
                <FaTrash size={14} /> Remove
            </button>
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



function StatCard({ title, value, icon, color }) {
    return (
        <div className="card" style={{
            padding: "24px",
            borderLeft: `4px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <div>
                <div style={{ color: "var(--text-secondary)", marginBottom: "8px", fontSize: "0.9rem" }}>
                    {title}
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)" }}>
                    {value}
                </div>
            </div>
            <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: `${color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: color
            }}>
                {icon}
            </div>
        </div>
    );
}


