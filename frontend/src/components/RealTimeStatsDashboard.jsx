import { useState, useEffect } from "react";
import { FaChartLine, FaChartBar, FaChartPie, FaUsers, FaVoteYea, FaClock, FaSync } from "react-icons/fa";

export default function RealTimeStatsDashboard({ initialData = {} }) {
    const [stats, setStats] = useState({
        totalVotes: initialData.totalVotes || 0,
        activePolls: initialData.activePolls || 0,
        totalVoters: initialData.totalVoters || 0,
        participationRate: initialData.participationRate || 0,
        hourlyVotes: initialData.hourlyVotes || [],
        pollResults: initialData.pollResults || [],
        recentVotes: initialData.recentVotes || []
    });
    
    const [isLoading, setIsLoading] = useState(false);

    // Simulate real-time updates (in a real app, this would use WebSocket or polling)
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate new votes coming in
            setStats(prev => ({
                ...prev,
                totalVotes: prev.totalVotes + Math.floor(Math.random() * 3),
                hourlyVotes: [...prev.hourlyVotes.slice(-23), {
                    hour: new Date().getHours(),
                    votes: Math.floor(Math.random() * 50) + 10
                }]
            }));
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const refreshData = async () => {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would fetch fresh data from the backend
        setStats(prev => ({
            ...prev,
            totalVotes: prev.totalVotes + Math.floor(Math.random() * 10),
            activePolls: prev.activePolls + (Math.random() > 0.8 ? 1 : 0),
            totalVoters: prev.totalVoters + Math.floor(Math.random() * 5)
        }));
        
        setIsLoading(false);
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "30px" 
            }}>
                <div>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: "2.5rem", 
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "12px",
                            background: "var(--gradient-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 5px 15px rgba(29, 155, 240, 0.3)"
                        }}>
                            <FaChartLine size={24} color="white" />
                        </div>
                        Real-Time Voting Dashboard
                    </h1>
                    <p style={{ 
                        color: "var(--text-secondary)", 
                        marginTop: "10px", 
                        fontSize: "1.1rem" 
                    }}>
                        Live statistics and voting analytics
                    </p>
                </div>
                
                <button 
                    onClick={refreshData}
                    disabled={isLoading}
                    className={`btn btn-primary ${isLoading ? 'pulse' : ''}`}
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "10px",
                        padding: "12px 24px"
                    }}
                >
                    <FaSync className={isLoading ? 'spin' : ''} /> 
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {/* Key Metrics */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(4, 1fr)", 
                gap: "20px", 
                marginBottom: "30px" 
            }}>
                <MetricCard 
                    title="Total Votes Cast" 
                    value={stats.totalVotes.toLocaleString()}
                    icon={<FaVoteYea size={28} />}
                    color="var(--accent-primary)"
                    trend="+12%"
                />
                <MetricCard 
                    title="Active Polls" 
                    value={stats.activePolls}
                    icon={<FaChartBar size={28} />}
                    color="var(--accent-success)"
                    trend="+2"
                />
                <MetricCard 
                    title="Registered Voters" 
                    value={stats.totalVoters.toLocaleString()}
                    icon={<FaUsers size={28} />}
                    color="var(--accent-warning)"
                    trend="+45"
                />
                <MetricCard 
                    title="Participation Rate" 
                    value={`${stats.participationRate}%`}
                    icon={<FaChartPie size={28} />}
                    color="var(--accent-danger)"
                    trend="+3.2%"
                />
            </div>

            {/* Charts Section */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "2fr 1fr", 
                gap: "25px", 
                marginBottom: "30px" 
            }}>
                {/* Hourly Vote Chart */}
                <div className="card">
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        marginBottom: "20px" 
                    }}>
                        <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaClock /> Hourly Voting Activity
                        </h3>
                        <div className="badge badge-primary">Last 24 Hours</div>
                    </div>
                    <HourlyChart data={stats.hourlyVotes} />
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h3 style={{ margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaUsers /> Recent Votes
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {stats.recentVotes.slice(0, 5).map((vote, index) => (
                            <RecentVoteItem key={index} vote={vote} />
                        ))}
                        {stats.recentVotes.length === 0 && (
                            <div style={{ 
                                textAlign: "center", 
                                padding: "30px", 
                                color: "var(--text-secondary)" 
                            }}>
                                <FaVoteYea size={32} style={{ marginBottom: "15px", opacity: 0.5 }} />
                                <p>No recent votes</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Poll Results */}
            <div className="card">
                <h3 style={{ margin: "0 0 25px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaChartBar /> Current Poll Results
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                    {stats.pollResults.map((poll, index) => (
                        <PollResultCard key={index} poll={poll} />
                    ))}
                    {stats.pollResults.length === 0 && (
                        <div style={{ 
                            gridColumn: "1 / -1", 
                            textAlign: "center", 
                            padding: "40px", 
                            color: "var(--text-secondary)" 
                        }}>
                            <FaChartBar size={48} style={{ marginBottom: "15px", opacity: 0.5 }} />
                            <p>No active polls with results</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, color, trend }) {
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
                </div>
                {trend && (
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "4px", 
                        fontSize: "0.8rem",
                        color: "var(--accent-success)"
                    }}>
                        <span>↗</span>
                        <span>{trend}</span>
                        <span style={{ color: "var(--text-tertiary)" }}>vs last period</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function HourlyChart({ data }) {
    // Generate mock data if none provided
    const chartData = data.length > 0 ? data : Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        votes: Math.floor(Math.random() * 100) + 20
    }));

    const maxValue = Math.max(...chartData.map(d => d.votes));

    return (
        <div style={{ 
            display: "flex", 
            alignItems: "flex-end", 
            justifyContent: "space-between", 
            height: "250px", 
            gap: "4px",
            padding: "20px 0"
        }}>
            {chartData.map((item, index) => {
                const heightPercent = maxValue > 0 ? (item.votes / maxValue) * 100 : 0;
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
                            minWidth: "15px",
                            transition: "height 0.5s ease",
                            position: "relative"
                        }}>
                            <div style={{
                                position: "absolute",
                                top: "-25px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: "var(--card-bg)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-color)"
                            }}>
                                {item.votes}
                            </div>
                        </div>
                        <div style={{
                            fontSize: "0.7rem",
                            color: "var(--text-secondary)",
                            marginTop: "8px",
                            textAlign: "center"
                        }}>
                            {item.hour}:00
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function RecentVoteItem({ vote }) {
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
                borderRadius: "50%",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold"
            }}>
                {vote.voter?.charAt(0) || 'V'}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>
                    {vote.voter || 'Anonymous Voter'}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Voted in {vote.poll || 'Unknown Poll'}
                </div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                {vote.time || 'Just now'}
            </div>
        </div>
    );
}

function PollResultCard({ poll }) {
    const totalVotes = poll.candidates?.reduce((sum, candidate) => sum + (candidate.votes || 0), 0) || 1;
    
    return (
        <div className="card" style={{ padding: "20px" }}>
            <h4 style={{ margin: "0 0 15px 0", color: "var(--text-primary)" }}>
                {poll.title || 'Untitled Poll'}
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {poll.candidates?.map((candidate, index) => {
                    const percentage = Math.round(((candidate.votes || 0) / totalVotes) * 100);
                    return (
                        <div key={index}>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                marginBottom: "5px" 
                            }}>
                                <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                                    {candidate.name || 'Candidate'}
                                </span>
                                <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>
                                    {percentage}% ({candidate.votes || 0})
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ 
                                        width: `${percentage}%`,
                                        background: `var(--gradient-primary)`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div style={{ 
                marginTop: "15px", 
                paddingTop: "15px", 
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "var(--text-secondary)"
            }}>
                <span>Total Votes: {totalVotes}</span>
                <span>Status: {poll.status || 'Active'}</span>
            </div>
        </div>
    );
}