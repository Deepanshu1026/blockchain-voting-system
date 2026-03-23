import { useState } from "react";
import { FaCamera, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaIdCard, FaWallet, FaHistory } from "react-icons/fa";

export default function EnhancedProfile({ user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });
    const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewAvatar(event.target.result);
                setFormData(prev => ({ ...prev, avatar: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onUpdate) {
            onUpdate(formData);
        }
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            avatar: user?.avatar || ''
        });
        setPreviewAvatar(user?.avatar || '');
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="gradient-card" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                        <FaUser /> Edit Profile
                    </h2>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button 
                            onClick={cancelEdit}
                            className="btn btn-secondary"
                            style={{ padding: "8px 16px" }}
                        >
                            <FaTimes /> Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            style={{ padding: "8px 16px" }}
                        >
                            <FaSave /> Save
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Avatar Upload */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <div style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                background: previewAvatar ? `url(${previewAvatar})` : "var(--gradient-primary)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: "4px solid var(--border-color)",
                                overflow: "hidden",
                                margin: "0 auto 15px"
                            }}>
                                {!previewAvatar && (
                                    <div style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "2.5rem"
                                    }}>
                                        {formData.name ? formData.name.charAt(0).toUpperCase() : <FaUser />}
                                    </div>
                                )}
                            </div>
                            <label
                                style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "10px",
                                    background: "var(--accent-primary)",
                                    color: "white",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                    transition: "all var(--transition-fast)"
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <FaCamera size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "10px 0 0 0" }}>
                            Click camera icon to upload new avatar
                        </p>
                    </div>

                    {/* Name Field */}
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    {/* Bio Field */}
                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                            className="input-field"
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            rows="4"
                            style={{ resize: "vertical" }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                        <button type="button" onClick={cancelEdit} className="btn btn-secondary" style={{ flex: 1 }}>
                            <FaTimes /> Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            <FaSave /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // View Mode
    return (
        <div className="gradient-card" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
                    <FaUser /> Your Profile
                </h2>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                    style={{ padding: "10px 20px" }}
                >
                    <FaEdit /> Edit Profile
                </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: user?.avatar ? `url(${user.avatar})` : "var(--gradient-primary)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "4px solid var(--border-color)",
                    overflow: "hidden",
                    margin: "0 auto 20px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                }}>
                    {!user?.avatar && (
                        <div style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "2.5rem",
                            fontWeight: "bold"
                        }}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                        </div>
                    )}
                </div>
                <h3 style={{ margin: "0 0 10px 0", color: "white", fontSize: "1.5rem" }}>
                    {user?.name || 'Anonymous User'}
                </h3>
                {user?.bio && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "400px", margin: "0 auto" }}>
                        {user.bio}
                    </p>
                )}
            </div>

            {/* Profile Information */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <ProfileField 
                    icon={<FaEnvelope />} 
                    label="Email" 
                    value={user?.email || 'Not provided'} 
                />
                <ProfileField 
                    icon={<FaIdCard />} 
                    label="ID Number" 
                    value={user?.id_number ? `**** **** ${user.id_number.slice(-4)}` : 'Not verified'} 
                />
                <ProfileField 
                    icon={<FaWallet />} 
                    label="Wallet Address" 
                    value={user?.wallet_address ? `${user.wallet_address.slice(0, 8)}...${user.wallet_address.slice(-6)}` : 'Not connected'} 
                />
                <ProfileField 
                    icon={<FaHistory />} 
                    label="Member Since" 
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'} 
                />
            </div>

            {/* Voting Statistics */}
            {user?.vote_stats && (
                <div className="card" style={{ marginTop: "30px", background: "rgba(255,255,255,0.05)" }}>
                    <h3 style={{ margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaHistory /> Voting Statistics
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <StatBox 
                            label="Polls Participated" 
                            value={user.vote_stats.participated || 0} 
                            color="var(--accent-primary)"
                        />
                        <StatBox 
                            label="Total Votes Cast" 
                            value={user.vote_stats.cast || 0} 
                            color="var(--accent-success)"
                        />
                        <StatBox 
                            label="Verification Status" 
                            value={user.verified ? "Verified" : "Pending"} 
                            color={user.verified ? "var(--accent-success)" : "var(--accent-warning)"}
                        />
                        <StatBox 
                            label="Reputation Score" 
                            value={user.reputation || "N/A"} 
                            color="var(--accent-secondary)"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function ProfileField({ icon, label, value }) {
    return (
        <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            padding: "15px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)"
        }}>
            <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "10px", 
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-primary)"
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {label}
                </div>
                <div style={{ 
                    fontSize: "1rem", 
                    color: "var(--text-primary)", 
                    fontWeight: "500",
                    wordBreak: "break-all"
                }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, color }) {
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ 
                fontSize: "1.8rem", 
                fontWeight: "800", 
                color: color,
                marginBottom: "5px"
            }}>
                {value}
            </div>
            <div style={{ 
                fontSize: "0.85rem", 
                color: "var(--text-secondary)"
            }}>
                {label}
            </div>
        </div>
    );
}

// Hook for profile management
export function useProfile() {
    const [profile, setProfile] = useState(null);

    const updateProfile = async (profileData) => {
        try {
            // In a real app, this would make an API call
            const updatedProfile = { ...profile, ...profileData };
            setProfile(updatedProfile);
            localStorage.setItem('user', JSON.stringify(updatedProfile));
            return { success: true, profile: updatedProfile };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const loadProfile = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setProfile(JSON.parse(storedUser));
        }
    };

    return { profile, updateProfile, loadProfile };
}