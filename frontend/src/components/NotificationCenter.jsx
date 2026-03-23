import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

export default function NotificationCenter({ notifications = [], onDismiss, onClearAll }) {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => n.unread).length);
    }, [notifications]);

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'success': return <FaCheck style={{ color: "var(--accent-success)" }} />;
            case 'warning': return <FaExclamationTriangle style={{ color: "var(--accent-warning)" }} />;
            case 'error': return <FaExclamationTriangle style={{ color: "var(--accent-danger)" }} />;
            default: return <FaInfoCircle style={{ color: "var(--accent-primary)" }} />;
        }
    };

    const getNotificationStyles = (type) => {
        switch(type) {
            case 'success': return { borderLeft: "4px solid var(--accent-success)" };
            case 'warning': return { borderLeft: "4px solid var(--accent-warning)" };
            case 'error': return { borderLeft: "4px solid var(--accent-danger)" };
            default: return { borderLeft: "4px solid var(--accent-primary)" };
        }
    };

    return (
        <div style={{ position: "relative" }}>
            {/* Bell Icon with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-secondary"
                style={{ 
                    position: "relative",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "var(--accent-danger)",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: "bold"
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    width: "350px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    boxShadow: "var(--shadow-xl)",
                    zIndex: 1000,
                    maxHeight: "500px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Notifications</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => {/* Mark all as read */}}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: "4px 8px" }}
                                >
                                    Mark All Read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={onClearAll}
                                    className="btn btn-danger btn-sm"
                                    style={{ padding: "4px 8px" }}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div style={{ 
                        overflowY: "auto", 
                        flex: 1,
                        maxHeight: "400px"
                    }}>
                        {notifications.length === 0 ? (
                            <div style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                color: "var(--text-secondary)"
                            }}>
                                <FaBell size={32} style={{ marginBottom: "15px", opacity: 0.5 }} />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className="card"
                                    style={{
                                        margin: "8px 12px",
                                        padding: "16px",
                                        cursor: "pointer",
                                        background: notification.unread ? "rgba(29, 155, 240, 0.05)" : "var(--card-bg)",
                                        ...getNotificationStyles(notification.type),
                                        transition: "all var(--transition-fast)"
                                    }}
                                    onClick={() => {
                                        if (onDismiss) onDismiss(notification.id);
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                    onMouseOut={e => e.currentTarget.style.background = notification.unread ? "rgba(29, 155, 240, 0.05)" : "var(--card-bg)"}
                                >
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <div style={{ 
                                            width: "24px", 
                                            height: "24px", 
                                            borderRadius: "50%", 
                                            background: "rgba(255,255,255,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0
                                        }}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ 
                                                margin: "0 0 8px 0", 
                                                fontSize: "0.95rem",
                                                color: "var(--text-primary)",
                                                lineHeight: "1.4"
                                            }}>
                                                {notification.message}
                                            </p>
                                            <div style={{ 
                                                display: "flex", 
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <span style={{ 
                                                    fontSize: "0.75rem", 
                                                    color: "var(--text-tertiary)" 
                                                }}>
                                                    {notification.time}
                                                </span>
                                                {notification.unread && (
                                                    <span style={{
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: "var(--accent-primary)"
                                                    }} />
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onDismiss) onDismiss(notification.id);
                                            }}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: "var(--text-secondary)",
                                                cursor: "pointer",
                                                padding: "4px",
                                                borderRadius: "4px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            onMouseOver={e => e.target.style.color = "var(--text-primary)"}
                                            onMouseOut={e => e.target.style.color = "var(--text-secondary)"}
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div style={{
                            padding: "12px 20px",
                            borderTop: "1px solid var(--border-color)",
                            textAlign: "center"
                        }}>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-secondary btn-sm"
                                style={{ width: "100%" }}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
}

// Hook for managing notifications
export function useNotifications() {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            message,
            type,
            time: 'Just now',
            unread: true
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                dismissNotification(id);
            }, duration);
        }

        return id;
    };

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => 
            prev.map(n => 
                n.id === id ? { ...n, unread: false } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, unread: false }))
        );
    };

    return {
        notifications,
        addNotification,
        dismissNotification,
        clearAllNotifications,
        markAsRead,
        markAllAsRead
    };
}