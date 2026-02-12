import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, Clock, User, Shield, Search, FilterX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        username: '',
        role: 'ALL', // Added role filter
        action: 'ALL',
        startDate: '',
        endDate: ''
    });

    const navigate = useNavigate();

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.username) params.username = filters.username;
            if (filters.action && filters.action !== 'ALL') params.action = filters.action;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            // Note: Backend currently doesn't filter by role explicitly in query, 
            // but we are filtering the *Actions* available which indirectly filters by role context.
            // If strict role filtering is needed for the *list*, backend update is required.
            // For now, we follow the instruction: "Change the Action type according to the username" (Role).

            const res = await axios.get('/audit-logs', { params });
            // Client-side filtering for role if needed, or just rely on Action filter.
            // To strictly follow "if i select admin username it should only show admin action types",
            // we will let the user select the Action from the filtered list.
            // Optionally we can filter the displayed logs by the selected role's usual actions if 'action' is ALL.

            let data = res.data;
            if (filters.role === 'admin') {
                const adminActions = ['LOGIN', 'LOGOUT', 'ADMIN_REQUEST', 'ADMIN_APPROVE', 'ADMIN_REJECT', 'ADMIN_REMOVE', 'COORDINATOR_DELETE', 'BOOKING_APPROVE', 'BOOKING_REJECT', 'BOOKING_OVERRIDE', 'USER_REGISTER'];
                if (filters.action === 'ALL') {
                    data = data.filter(log => adminActions.includes(log.action));
                }
            } else if (filters.role === 'coordinator') {
                const coordinatorActions = ['LOGIN', 'LOGOUT', 'BOOKING_CREATE'];
                if (filters.action === 'ALL') {
                    data = data.filter(log => coordinatorActions.includes(log.action));
                }
            }

            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search or just fetch on filter change if not too frequent
        // For simplicity, we'll fetch when filters change (except text input which might need debounce, 
        // but here we can just use a "Apply" button or useEffect with debounce if needed. 
        // We will use a dedicated "Search" button to avoid too many requests or useEffect with debounce.)
        fetchLogs();
    }, []); // Initial load

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogs();
    };

    const clearFilters = () => {
        setFilters({
            username: '',
            role: 'ALL',
            action: 'ALL',
            startDate: '',
            endDate: ''
        });
        // Reload logs with empty filters
        (async () => {
            setLoading(true);
            try {
                const res = await axios.get('/audit-logs');
                setLogs(res.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    };

    const getActionColor = (action) => {
        if (action.includes('APPROVE') || action.includes('SUCCESS') || action.includes('LOGIN')) return 'text-green-600';
        if (action.includes('REJECT') || action.includes('DELETE') || action.includes('LOGOUT') || action.includes('REMOVE')) return 'text-red-600';
        if (action.includes('CREATE') || action.includes('REGISTER') || action.includes('REQUEST')) return 'text-blue-600';
        return 'text-amrita';
    };

    // Dynamic Action Options
    const getActionOptions = () => {
        if (filters.role === 'admin') {
            return [
                { value: 'ALL', label: 'All Admin Actions' },
                { value: 'LOGIN', label: 'Login' },
                { value: 'LOGOUT', label: 'Logout' },
                { value: 'ADMIN_REQUEST', label: 'Admin Request' }, // Admin can also trigger this if they register another admin? Or maybe system.
                // "admin cannot creating a booking" -> Exclude BOOKING_CREATE
                // "admin can add coordinator" -> USER_REGISTER (if admin does it, or is it a specific action?)
                // Checking authController: createLog for registerUser (admin role -> ADMIN_REQUEST, else USER_REGISTER).
                // Wait, "admin can add coordinator" -> Does admin have a UI to add coordinator? 
                // Currently CoordinatorList seems to handle it? Or maybe just approving?
                // For now, let's include the actions we saw in backend.
                { value: 'ADMIN_APPROVE', label: 'Approve Admin' },
                { value: 'ADMIN_REJECT', label: 'Reject Admin' },
                { value: 'ADMIN_REMOVE', label: 'Remove Admin' },
                { value: 'COORDINATOR_DELETE', label: 'Delete Coordinator' },
                { value: 'BOOKING_APPROVE', label: 'Approve Booking' },
                { value: 'BOOKING_REJECT', label: 'Reject Booking' },
                { value: 'BOOKING_OVERRIDE', label: 'Override Booking' },
                { value: 'USER_REGISTER', label: 'Register User' }
            ];
        } else if (filters.role === 'coordinator') {
            return [
                { value: 'ALL', label: 'All Coordinator Actions' },
                { value: 'LOGIN', label: 'Login' },
                { value: 'LOGOUT', label: 'Logout' },
                { value: 'BOOKING_CREATE', label: 'Create Booking' }
            ];
        } else {
            return [
                { value: 'ALL', label: 'All Actions' },
                { value: 'LOGIN', label: 'Login' },
                { value: 'LOGOUT', label: 'Logout' },
                { value: 'BOOKING_CREATE', label: 'Booking Create' },
                { value: 'BOOKING_APPROVE', label: 'Booking Approve' },
                { value: 'BOOKING_REJECT', label: 'Booking Reject' },
                { value: 'BOOKING_OVERRIDE', label: 'Booking Override' },
                { value: 'ADMIN_REQUEST', label: 'Admin Request' },
                { value: 'ADMIN_APPROVE', label: 'Admin Approve' },
                { value: 'ADMIN_REJECT', label: 'Admin Reject' },
                { value: 'ADMIN_REMOVE', label: 'Admin Remove' },
                { value: 'COORDINATOR_DELETE', label: 'Coordinator Delete' },
                { value: 'USER_REGISTER', label: 'User Register' }
            ];
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-6 py-8">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/admin-dashboard")}
                            className="mb-4 bg-amrita text-white flex items-center gap-1 hover:bg-amrita/95"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-foreground-90">Audit Logs</h1>
                        <p className="text-muted-foreground">Historical record of all system actions</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="text-sm font-medium mb-1 block">Username</label>
                                <Input
                                    placeholder="Search user..."
                                    value={filters.username}
                                    onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-sm font-medium mb-1 block">Role</label>
                                <Select
                                    value={filters.role}
                                    onValueChange={(val) => {
                                        setFilters({ ...filters, role: val, action: 'ALL' }); // Reset action when role changes
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Roles</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="coordinator">Coordinator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-sm font-medium mb-1 block">Action Type</label>
                                <Select
                                    value={filters.action}
                                    onValueChange={(val) => setFilters({ ...filters, action: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getActionOptions().map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Start Date</label>
                                <Input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">End Date</label>
                                <Input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="bg-amrita hover:bg-amrita/90 flex-1">
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                                <Button type="button" variant="outline" onClick={clearFilters} title="Clear Filters">
                                    <FilterX className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Activity</CardTitle>
                        <CardDescription>Recent actions performed by administrators and coordinators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-10 text-center text-muted-foreground animate-pulse">Loading logs...</div>
                        ) : logs.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">No audit logs found matching your criteria</div>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3">Timestamp</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Action</th>
                                            <th className="px-4 py-3">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 flex items-center gap-2 text-muted-foreground min-w-[180px]">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {log.user?.role === 'admin' ? (
                                                            <Shield className="w-3 h-3 text-amrita" />
                                                        ) : (
                                                            <User className="w-3 h-3 text-blue-600" />
                                                        )}
                                                        <span className="font-medium">{log.username || log.user?.username || 'System'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold">
                                                    <span className={getActionColor(log.action)}>
                                                        {log.action.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {log.details}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default AuditLogs;
