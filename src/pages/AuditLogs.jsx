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

            const res = await axios.get('/audit-logs', { params });
            setLogs(res.data);
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
            action: 'ALL',
            startDate: '',
            endDate: ''
        });
        // We trigger fetch in next render cycle or manually call it after state update (which is tricky with closure),
        // better to just depend on a "trigger" or call fetchLogs with empty params.
        // Actually, let's just reset state and the user can click search, 
        // or we use a separate useEffect for `activeFilters`? 
        // Simple approach: set state and call fetch with cleared values.
        const emptyFilters = {
            username: '',
            action: 'ALL',
            startDate: '',
            endDate: ''
        };
        // We need to pass these explicitly because setFilters is async-ish
        // Recalling fetchLogs won't see the new state immediately.
        // So we will just duplicate logic or refactor fetchLogs to accept args.
        // Refactoring fetchLogs to use current state is fine if we wait for user to click Search.
        // But for "Clear", we want immediate action.

        // Let's just reload page or set state. 
        // Simplest: set state, then fetch with explicit empty object.
        setFilters(emptyFilters);

        // Manual fetch logic for clear
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
        if (action.includes('REJECT') || action.includes('DELETE') || action.includes('LOGOUT')) return 'text-red-600';
        if (action.includes('CREATE') || action.includes('REGISTER')) return 'text-blue-600';
        return 'text-amrita';
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
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Username</label>
                                <Input
                                    placeholder="Search by username..."
                                    value={filters.username}
                                    onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Action Type</label>
                                <Select
                                    value={filters.action}
                                    onValueChange={(val) => setFilters({ ...filters, action: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Actions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Actions</SelectItem>
                                        <SelectItem value="LOGIN">Login</SelectItem>
                                        <SelectItem value="LOGOUT">Logout</SelectItem>
                                        <SelectItem value="BOOKING_CREATE">Booking Create</SelectItem>
                                        <SelectItem value="BOOKING_APPROVE">Booking Approve</SelectItem>
                                        <SelectItem value="BOOKING_REJECT">Booking Reject</SelectItem>
                                        <SelectItem value="ADMIN_APPROVE">Admin Approve</SelectItem>
                                        <SelectItem value="ADMIN_REJECT">Admin Reject</SelectItem>
                                        <SelectItem value="USER_REGISTER">User Register</SelectItem>
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
