import { useEffect, useState } from "react";
import "../../styles/UserStatsScreen.css";
import { Users, Activity } from "lucide-react";
import { RefreshCw, Loader2 } from "lucide-react";

/* =====================
   TYPES – định nghĩa kiểu dữ liệu trả về từ API
===================== */

// API đếm user online
interface OnlineUserResponse {
    online_users: number;
}

// API tổng số user
interface TotalUserResponse {
    total_users: number;
}

// API user đăng ký mới hôm nay
interface NewUserTodayResponse {
    new_users_today: number;
}

// API online theo từng giờ
interface HourlyOnline {
    hour: string;
    count: number;
}

/* =====================
   MAIN SCREEN – component chính
===================== */
export default function UserStatsScreen() {

    // Số user đang online
    const [onlineUsers, setOnlineUsers] = useState(0);

    // Tổng số user
    const [totalUsers, setTotalUsers] = useState(0);

    // Số user đăng ký mới hôm nay
    const [newUsersToday, setNewUsersToday] = useState(0);

    // Danh sách user online theo từng giờ
    const [hourlyOnline, setHourlyOnline] = useState<HourlyOnline[]>([]);

    // Trạng thái loading khi gọi API
    const [loading, setLoading] = useState(true);

    // Lấy token đăng nhập admin
    const token = localStorage.getItem("userToken");

    // Header Authorization dùng chung cho tất cả request
    const authHeader = {
        Authorization: `Bearer ${token}`,
    };

    /* =====================
       CÁC HÀM GỌI API
    ===================== */

    // Gọi API lấy số user đang online
    const fetchOnlineUsers = async () => {
        const res = await fetch(
            "http://localhost:8080/api/admin/users/online",
            { headers: authHeader }
        );
        const data: OnlineUserResponse = await res.json();
        setOnlineUsers(data.online_users); // lưu số user online vào state
    };

    // Gọi API lấy tổng số user
    const fetchTotalUsers = async () => {
        const res = await fetch(
            "http://localhost:8080/api/admin/users/total",
            { headers: authHeader }
        );
        const data: TotalUserResponse = await res.json();
        setTotalUsers(data.total_users); // lưu tổng user vào state
    };

    // Gọi API lấy số user đăng ký mới hôm nay
    const fetchNewUsersToday = async () => {
        const res = await fetch(
            "http://localhost:8080/api/admin/users/new-today",
            { headers: authHeader }
        );
        const data: NewUserTodayResponse = await res.json();
        setNewUsersToday(data.new_users_today);
    };

    // Gọi API lấy thống kê online theo từng giờ (để vẽ biểu đồ)
    const fetchHourlyOnline = async () => {
        const res = await fetch(
            "http://localhost:8080/api/admin/users/online/hourly",
            { headers: authHeader }
        );
        const data: HourlyOnline[] = await res.json();
        setHourlyOnline(data);
    };

    /**
     * Hàm gọi TẤT CẢ API cùng lúc
     * Promise.all giúp chạy song song → load nhanh hơn
     */
    const fetchAllStats = async () => {
        try {
            setLoading(true); // bật loading trước khi gọi API
            await Promise.all([
                fetchOnlineUsers(),
                fetchTotalUsers(),
                fetchNewUsersToday(),
                fetchHourlyOnline(),
            ]);
        } catch (e) {
            console.error("Lỗi load stats", e);
        } finally {
            setLoading(false); // tắt loading sau khi load xong
        }
    };

    /**
     * useEffect chạy 1 lần khi component mount
     * → tự động load toàn bộ thống kê ban đầu
     */
    useEffect(() => {
        fetchAllStats();
    }, []);

    /* =====================
       TÍNH ENGAGEMENT TRỰC TIẾP TỪ STATE
    ===================== */

    // engagement % = (số user online / tổng user) * 100
    const engagementPercent =
        totalUsers === 0 ? 0 : Math.round((onlineUsers / totalUsers) * 100);

    // Trạng thái chữ hiển thị theo % engagement
    const engagementStatus =
        engagementPercent >= 70
            ? "Rất cao 🔥"
            : engagementPercent >= 40
                ? "Khá tốt 👍"
                : engagementPercent >= 20
                    ? "Trung bình 🙂"
                    : "Thấp 😴";

    // Mô tả chi tiết theo % engagement
    const engagementDesc =
        engagementPercent >= 70
            ? "Người dùng đang hoạt động rất mạnh"
            : engagementPercent >= 40
                ? "Mức độ tương tác khá ổn định"
                : engagementPercent >= 20
                    ? "Người dùng hoạt động ở mức trung bình"
                    : "Tương tác thấp, nên xem lại chiến lược";

    /* =====================
       UI RENDER
    ===================== */
    return (
        <div className="container">
            <div className="content">

                {/* Header tiêu đề */}
                <StatsHeader />

                {/* Thống kê chính: online + tổng user */}
                <MainStats
                    onlineUsers={onlineUsers}
                    totalUsers={totalUsers}
                    loading={loading}
                />

                {/* Thống kê phụ: user mới hôm nay */}
                <SecondaryStats newUsersToday={newUsersToday} />

                {/* Biểu đồ online theo giờ */}
                <OnlineChart data={hourlyOnline} />

                {/* Card đánh giá mức độ tương tác */}
                <EngagementCard
                    percent={engagementPercent}
                    status={engagementStatus}
                    desc={engagementDesc}
                />

                {/* Nút refresh dữ liệu */}
                <RefreshAction onRefresh={fetchAllStats} loading={loading} />

            </div>
        </div>
    );
}

/* =====================
   SUB COMPONENTS
===================== */

/**
 * Header hiển thị tiêu đề + thời gian cập nhật
 */
function StatsHeader() {
    return (
        <>
            <h1 className="title">Thống kê người dùng</h1>
            <p className="updatedAt">
                Cập nhật lần cuối: {new Date().toLocaleTimeString()} • Hôm nay
            </p>
        </>
    );
}

/**
 * Thống kê chính: số user online + tổng user
 */
function MainStats({
                       onlineUsers,
                       totalUsers,
                       loading,
                   }: {
    onlineUsers: number;
    totalUsers: number;
    loading: boolean;
}) {
    return (
        <div className="cardRow">

            {/* Card user đang online */}
            <div className="card">
                <div className="icon online">
                    <Activity size={28} strokeWidth={2.5} />
                </div>
                <div className="number">
                    {loading ? "..." : onlineUsers}
                </div>
                <div className="label">Đang online</div>
            </div>

            {/* Card tổng số user */}
            <div className="card">
                <div className="icon user">
                    <Users size={32} strokeWidth={2.2} />
                </div>
                <div className="number">
                    {loading ? "..." : totalUsers}
                </div>
                <div className="label">Tổng người dùng</div>
            </div>

        </div>
    );
}

/**
 * Thống kê phụ: số user mới hôm nay
 */
function SecondaryStats({ newUsersToday }: { newUsersToday: number }) {
    return (
        <div className="smallCard">
            <div className="smallTitle">User mới hôm nay</div>
            <div className="smallNumber">{newUsersToday}</div>
        </div>
    );
}

/**
 * Biểu đồ cột hiển thị số user online theo từng giờ
 */
function OnlineChart({ data }: { data: HourlyOnline[] }) {
    return (
        <div className="chart">
            <div className="chartTitle">Online trong 6 giờ gần nhất</div>

            <div className="barRow">
                {data.map((item, i) => (
                    <div key={i} className="barContainer">

                        {/* Số user tại giờ đó */}
                        <div className="barValue">{item.count}</div>

                        {/* Chiều cao cột = count * 4 để nhìn rõ hơn */}
                        <div
                            className="bar"
                            style={{ height: item.count * 4 || 4 }}
                        />

                        {/* Nhãn giờ */}
                        <div className="barLabel">{item.hour}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Card đánh giá mức độ tương tác
 * percent đã được tính sẵn ở component cha
 */
function EngagementCard({
                            percent,
                            status,
                            desc,
                        }: {
    percent: number;
    status: string;
    desc: string;
}) {
    return (
        <div className="engagementCard">
            <div className="engagementTitle">Mức độ tương tác hôm nay</div>
            <div className="engagementPercent">{percent}%</div>
            <div className="engagementStatus">{status}</div>

            {/* Thanh progress hiển thị % */}
            <div className="progressBg">
                <div className="progressFill" style={{ width: `${percent}%` }} />
            </div>

            {/* Mô tả thay đổi theo % */}
            <div className="engagementDesc">{desc}</div>
        </div>
    );
}

/**
 * Nút refresh – gọi lại toàn bộ API thống kê
 */
function RefreshAction({
                           onRefresh,
                           loading,
                       }: {
    onRefresh: () => void;
    loading: boolean;
}) {
    return (
        <div className="actionRow">
            <button
                className="refreshBtn"
                onClick={onRefresh}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="spin" />
                        <span>Đang tải...</span>
                    </>
                ) : (
                    <>
                        <RefreshCw size={18} />
                        <span>Làm mới</span>
                    </>
                )}
            </button>
        </div>
    );
}
