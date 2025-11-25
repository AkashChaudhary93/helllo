"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [schedules, setSchedules] = useState([]);

    const [notifications, setNotifications] = useState([
        { id: 1, text: "Teacher Pease had amitifletor's Upcoming Classes.", time: "10:18 AM", isRead: false },
        { id: 2, text: "Laoeming Classs vr tivacated eizent in Chairia on school3.", time: "10:18 AM", isRead: false },
        { id: 3, text: "System update scheduled for tonight at 11:00 PM.", time: "10:17 AM", isRead: false },
        { id: 4, text: "Moronant Class was rempanted from velyslert.", time: "09:45 AM", isRead: false },
        { id: 5, text: "New Assignment uploaded for BCA-3A.", time: "09:30 AM", isRead: false },
        { id: 6, text: "Meeting scheduled with Principal.", time: "09:00 AM", isRead: false },
    ]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const storedData = localStorage.getItem("teacherData");
        if (!storedData) {
            router.push("/login");
        } else {
            const parsedData = JSON.parse(storedData);
            setData(parsedData);
            setLoading(false);

            if (parsedData?.teacher?.teacher_id) {
                fetchSchedule(parsedData.teacher.teacher_id);
            }
        }

        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleString('en-US', {
                weekday: 'short', day: 'numeric', month: 'short',
                hour: 'numeric', minute: 'numeric', hour12: true
            }));
        };
        updateTime();

        return () => { document.body.style.overflow = "auto"; };
    }, [router]);

    async function fetchSchedule(teacherId) {
        try {
            const res = await fetch(`https://edu-live-bcakend.vercel.app/teacher/schedule?teacherId=${teacherId}`);
            const apiData = await res.json();
            if (apiData.success) {
                setSchedules(apiData.schedules);
            }
        } catch (error) {
            console.error("Failed to fetch schedule:", error);
        }
    }

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleLogout = () => {
        const isConfirmed = window.confirm("Are you sure you want to log out?");
        if (isConfirmed) {
            localStorage.removeItem("teacherData");
            router.push("/teacher/login");
        }
    };

    const markRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isExiting: true } : n));
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 400);
    };

    const handleNavClick = () => setIsSidebarOpen(false);

    if (loading) return <div style={styles.loading}>Loading...</div>;

    return (
        <main style={styles.container}>
            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutRight {
          0% { opacity: 1; transform: translateX(0); max-height: 100px; margin-bottom: 12px; padding: 18px 24px; }
          50% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 0; transform: translateX(50px); max-height: 0; margin-bottom: 0; padding: 0 24px; border: none; }
        }
      `}</style>

            <div
                style={{ ...styles.overlay, opacity: isSidebarOpen ? 1 : 0, pointerEvents: isSidebarOpen ? "all" : "none" }}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            <aside style={{ ...styles.sidebar, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.sidebarLogoIcon}>🎓</div>
                    <span style={styles.sidebarTitle}>My Class</span>
                </div>
                <nav style={styles.navMenu}>
                    <div style={styles.navItemActive} onClick={handleNavClick}><span style={styles.navIcon}>📅</span> Dashboard</div>
                    <div style={styles.navItem} onClick={handleNavClick}><span style={styles.navIcon}>💬</span> Messages</div>
                    <div style={styles.navItem} onClick={handleNavClick}><span style={styles.navIcon}>📤</span> Upload Material</div>
                    <div style={styles.navItem} onClick={handleNavClick}><span style={styles.navIcon}>📢</span> Post Announcement</div>
                    <div style={styles.navItem} onClick={handleNavClick}><span style={styles.navIcon}>🗓️</span> Calendar</div>
                </nav>
                <div style={styles.sidebarFooter}>
                    <div style={styles.navItem} onClick={handleLogout}><span style={styles.navIcon}>↪️</span> Logout</div>
                    <div style={styles.navItem} onClick={handleNavClick}><span style={styles.navIcon}>🎧</span> Support</div>
                </div>
            </aside>

            {/* Glows Removed for cleaner high-contrast look */}

            <div style={styles.mainLayout}>

                <header style={styles.header}>
                    <div style={styles.hamburger} onClick={() => setIsSidebarOpen(true)}>
                        <div style={styles.bar}></div><div style={styles.bar}></div><div style={styles.bar}></div>
                    </div>
                    <div style={styles.headerRight}>
                        <div style={styles.welcomeInfo}>
                            <span style={styles.welcomeTitle}>Welcome, <span style={styles.accentText}>{data?.teacher?.teacher_name || "Teacher"}</span></span>
                            <span style={styles.dateText}>{currentTime}</span>
                        </div>
                        <div style={styles.profileIcon} onClick={handleLogout} title="Logout">👤</div>
                    </div>
                </header>

                <div style={styles.contentBody}>

                    <section style={styles.sectionFixed}>
                        <div style={styles.titleRow}>
                            <div style={styles.accentIndicator1}></div>
                            <h2 style={styles.sectionHeading}>Upcoming Classes</h2>
                        </div>

                        <div style={styles.horizontalScrollContainer} className="no-scrollbar">
                            {schedules.length > 0 ? (
                                schedules.map((cls, index) => (
                                    <div
                                        key={cls.class_id}
                                        style={{
                                            ...styles.classCard,
                                            animationName: "slideInRight",
                                            animationDuration: "0.5s",
                                            animationTimingFunction: "ease-out",
                                            animationFillMode: "forwards",
                                            animationDelay: `${index * 0.15}s`,
                                            opacity: 0
                                        }}
                                    >
                                        <div style={styles.cardHeader}>
                                            <div style={styles.iconCircle}>
                                                {index % 2 === 0 ? '📅' : '📚'}
                                            </div>
                                            <span style={styles.sectionBadge}>{cls.section_name}</span>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <div style={styles.timeText}>{formatTime(cls.class_start_time)}</div>
                                            <div style={styles.subjectText} title={cls.class_title}>
                                                {cls.class_title}
                                            </div>
                                        </div>
                                        <div style={styles.cardFooter}>
                                            <span style={styles.durationText}>⏳ {cls.class_duration} min</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.emptyCard}>
                                    <div style={styles.iconCircle}>💤</div>
                                    <div>No upcoming classes found.</div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section style={styles.sectionFill}>
                        <div style={styles.titleRow}>
                            <div style={styles.accentIndicator2}></div>
                            <h2 style={styles.sectionHeading}>Notifications</h2>
                        </div>

                        <div style={styles.verticalScrollList} className="no-scrollbar">
                            {notifications.map((n, index) => (
                                <div
                                    key={n.id}
                                    style={{
                                        ...styles.notifCard,
                                        animationName: n.isExiting ? "slideOutRight" : "slideInUp",
                                        animationDuration: n.isExiting ? "0.4s" : "0.5s",
                                        animationTimingFunction: n.isExiting ? "ease-in" : "ease-out",
                                        animationFillMode: "forwards",
                                        animationDelay: n.isExiting ? "0s" : `${index * 0.1}s`,

                                        opacity: n.isExiting ? 1 : 0,
                                        pointerEvents: n.isExiting ? "none" : "all"
                                    }}
                                >
                                    <div style={styles.notifLeft}>
                                        <div style={styles.bellCircle}>🔔</div>
                                        <div>
                                            <div style={styles.notifMsg}>{n.text}</div>
                                            <div style={styles.notifTime}>{n.time}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => markRead(n.id)} style={styles.actionBtn}>
                                        Mark Read
                                    </button>
                                </div>
                            ))}

                            {notifications.length === 0 && (
                                <div style={{ ...styles.emptyCard, padding: "20px" }}>
                                    <span>🎉 All caught up! No new notifications.</span>
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}

// --- MIDNIGHT & ORANGE PALETTE ---
const colors = {
    bgDark: "#0B192C",    // Deep Navy (Background)
    bgLight: "#1E3E62",   // Steel Blue (Sidebar/Cards)
    primary: "#ff8000ff",   // Bright Orange (Accent/Highlights)
    black: "#000000",     // Black (Overlays/Shadows)
    textWhite: "#FFFFFF", // Main Text
    textGrey: "#CBD5E1"   // Light Grey Text
};

const styles = {
    container: {
        height: "100vh", width: "100vw", backgroundColor: colors.bgDark, color: colors.textWhite, fontFamily: "'Inter', sans-serif", overflow: "hidden", position: "relative"
    },
    loading: { height: "100vh", background: colors.bgDark, color: colors.primary, display: "flex", alignItems: "center", justifyContent: "center" },

    // Layout
    mainLayout: { height: "100%", display: "flex", flexDirection: "column", padding: "20px 40px", position: "relative", zIndex: 10 },
    contentBody: { flex: 1, display: "flex", flexDirection: "column", gap: "30px", overflow: "hidden", minHeight: 0 },

    // Header
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexShrink: 0 },
    hamburger: { display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", padding: "5px" },
    bar: { width: "24px", height: "2px", background: colors.textGrey, borderRadius: "2px" },
    headerRight: { display: "flex", alignItems: "center", gap: "20px" },
    welcomeInfo: { textAlign: "right" },
    welcomeTitle: { fontSize: "16px", fontWeight: "600", letterSpacing: "0.3px" },
    accentText: { color: colors.primary },
    dateText: { display: "block", fontSize: "12px", color: colors.textGrey, marginTop: "4px", fontWeight: "500" },
    profileIcon: { width: "38px", height: "38px", borderRadius: "50%", border: `1px solid ${colors.primary}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: colors.bgLight },

    // Headings
    titleRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" },
    accentIndicator1: { width: "4px", height: "20px", background: colors.primary, borderRadius: "4px" },
    accentIndicator2: { width: "4px", height: "20px", background: colors.bgLight, borderRadius: "4px" },
    sectionHeading: { fontSize: "18px", fontWeight: "600", margin: 0, letterSpacing: "0.5px", color: colors.textWhite },

    // Cards Scroll Area
    sectionFixed: { flexShrink: 0 },
    horizontalScrollContainer: {
        display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "5px", scrollBehavior: "smooth"
    },

    // --- ORANGE GRADIENT CARD ---
    classCard: {
        flex: "0 0 340px",
        // Deep Focus Gradient: Blue to Indigo
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        borderRadius: "24px",
        padding: "28px",
        color: "#FFFFFF", // Pure white for best contrast
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "190px",
        // boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)", // Matching blue shadow
        transition: "transform 0.2s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        // border: `1px solid #5a6fd8` // Optional subtle border
    },

  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
    iconCircle: { width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: `1px solid rgba(255,255,255,0.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", backdropFilter: "blur(4px)" },
    sectionBadge: { background: "rgba(255,255,255,0.25)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" },
    cardBody: { marginBottom: "10px" },
    timeText: { fontWeight: "700", fontSize: "14px", marginBottom: "6px", opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.5px", color: "#FFE0CC" },
    subjectText: { fontWeight: "800", fontSize: "22px", lineHeight: "1.2" },
    cardFooter: { borderTop: `1px solid rgba(255,255,255,0.3)`, paddingTop: "14px", fontSize: "13px", fontWeight: "500", opacity: 0.9, display: "flex", alignItems: "center", gap: "6px", color: "#FFE0CC" },

    // Notifications
    sectionFill: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
    verticalScrollList: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "5px" },
    notifCard: {
        background: colors.bgLight,
        borderRadius: "16px",
        padding: "18px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: `1px solid ${colors.bgDark}`,
    },
    notifLeft: { display: "flex", alignItems: "center", gap: "18px" },
    bellCircle: { width: "40px", height: "40px", borderRadius: "50%", background: colors.bgDark, color: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" },
    notifMsg: { fontSize: "14px", color: colors.textWhite, fontWeight: "500" },
    notifTime: { fontSize: "12px", color: colors.textGrey, marginTop: "4px" },
    actionBtn: { backgroundColor: colors.primary, color: colors.textWhite, border: "none", padding: "8px 24px", borderRadius: "8px", fontWeight: "600", fontSize: "12px", cursor: "pointer" },

    // Empty State
    emptyCard: { minWidth: "300px", background: colors.bgLight, borderRadius: "20px", padding: "40px", textAlign: "center", color: colors.textGrey, border: `1px dashed ${colors.primary}40`, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },

    // Sidebar & Overlay
    overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)", zIndex: 40, transition: "opacity 0.3s ease" },
    sidebar: { position: "fixed", top: 0, left: 0, width: "280px", height: "100vh", backgroundColor: colors.bgLight, zIndex: 50, padding: "30px 0", display: "flex", flexDirection: "column", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "10px 0 30px rgba(0,0,0,0.5)", borderRight: `1px solid ${colors.bgDark}` },
    sidebarHeader: { display: "flex", alignItems: "center", gap: "14px", padding: "0 28px", marginBottom: "40px" },
    sidebarLogoIcon: { width: "42px", height: "42px", background: colors.primary, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: colors.textWhite },
    sidebarTitle: { fontSize: "22px", fontWeight: "700", color: colors.textWhite, letterSpacing: "-0.5px" },
    navMenu: { display: "flex", flexDirection: "column", gap: "10px", flex: 1, padding: "0 12px" },
    navItem: { padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px", color: colors.textGrey, fontSize: "15px", cursor: "pointer", transition: "0.2s", borderRadius: "12px", fontWeight: "500" },
    navItemActive: { padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px", color: colors.textWhite, fontSize: "15px", cursor: "pointer", background: colors.bgDark, borderRadius: "12px", fontWeight: "600", border: `1px solid ${colors.primary}` },
    navIcon: { fontSize: "18px" },
    sidebarFooter: { borderTop: `1px solid ${colors.bgDark}`, paddingTop: "20px", marginTop: "20px", paddingLeft: "12px", paddingRight: "12px" },
};