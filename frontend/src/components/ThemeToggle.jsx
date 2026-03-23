import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const applyTheme = (themeName) => {
        const root = document.documentElement;
        
        if (themeName === 'dark') {
            // Dark theme variables
            root.style.setProperty('--bg-color', '#0f1419');
            root.style.setProperty('--bg-secondary', '#15202b');
            root.style.setProperty('--card-bg', '#192734');
            root.style.setProperty('--card-hover', '#1c2732');
            root.style.setProperty('--border-color', '#38444d');
            root.style.setProperty('--border-light', '#2f3b49');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#8899a6');
            root.style.setProperty('--text-tertiary', '#657786');
            root.style.setProperty('--accent-primary', '#1d9bf0');
            root.style.setProperty('--accent-secondary', '#7856ff');
            root.style.setProperty('--accent-success', '#00ba7c');
            root.style.setProperty('--accent-warning', '#ffd400');
            root.style.setProperty('--accent-danger', '#f91880');
        } else {
            // Light theme variables
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f7f9fa');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--card-hover', '#f0f5f9');
            root.style.setProperty('--border-color', '#e1e8ed');
            root.style.setProperty('--border-light', '#ccd6dd');
            root.style.setProperty('--text-primary', '#0f1419');
            root.style.setProperty('--text-secondary', '#536471');
            root.style.setProperty('--text-tertiary', '#657786');
            root.style.setProperty('--accent-primary', '#1d9bf0');
            root.style.setProperty('--accent-secondary', '#7856ff');
            root.style.setProperty('--accent-success', '#00ba7c');
            root.style.setProperty('--accent-warning', '#ffd400');
            root.style.setProperty('--accent-danger', '#f91880');
        }
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "var(--gradient-primary)",
                border: "none",
                cursor: "pointer",
                boxShadow: "var(--shadow-lg)",
                position: "fixed",
                bottom: "30px",
                right: "30px",
                zIndex: 1000,
                transition: "all var(--transition-normal)",
                color: "white"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.1) rotate(15deg)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
        >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
    );
}

// Hook for theme management
export function useTheme() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Apply theme immediately
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.style.setProperty('--bg-color', '#0f1419');
            root.style.setProperty('--text-primary', '#ffffff');
            // ... other dark theme properties
        } else {
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-primary', '#0f1419');
            // ... other light theme properties
        }
    };

    return { theme, toggleTheme };
}