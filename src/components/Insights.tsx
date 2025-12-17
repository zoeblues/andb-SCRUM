// src/components/Insights.tsx

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Filter, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define Interfaces (Remain the same)
interface Service {
    id: number;
    name: string;
    category: string;
}

interface Appointment {
    id: number;
    service: string;
    date: string;
    price: number;
}

interface InsightsProps {
    appointments: Appointment[];
    services: Service[];
}

interface ChartData {
    name: string;
    count: number;
    revenue: number;
}

const INITIAL_CATEGORIES = [
    "Haircuts",
    "Color",
    "Nails",
    "Styling",
];

// --- Data Aggregation Logic (FIXED FOR ROBUST MATCHING) ---
const aggregateData = (
    appointments: Appointment[],
    services: Service[],
    timeframe: 'monthly' | 'yearly',
    selectedCategory: string
): ChartData[] => {

    // 1. Create a case-insensitive map of Service Name to Category
    const serviceToCategoryMap = services.reduce((acc, s) => {
        // ⚡️ FIX 1: Normalize key to lowercase for robust lookup ⚡️
        acc[s.name.toLowerCase()] = s.category || "Uncategorized";
        return acc;
    }, {} as Record<string, string>);

    // 2. Determine the current period for filtering
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 3. Filter appointments to the selected timeframe (Date Filtering)
    const filteredAppointments = appointments.filter(apt => {

        // Use the robust string parsing for date filtering (as in the previous solution)
        const parts = apt.date.split('-');
        if (parts.length !== 3) return false;

        const aptYear = parseInt(parts[0]);
        const aptMonth = parseInt(parts[1]);

        let match = false;

        if (timeframe === 'monthly') {
            match = aptYear === currentYear && aptMonth === (currentMonth + 1);
        } else { // yearly
            match = aptYear === currentYear;
        }

        return match;
    });

    // 4. Aggregate counts and revenue by category
    const categoryData: Record<string, { count: number, revenue: number }> = {};

    filteredAppointments.forEach(apt => {
        // ⚡️ FIX 2: Normalize appointment service name to lowercase
        // before looking it up in the map ⚡️
        const normalizedServiceName = apt.service.toLowerCase();

        // Get category from the normalized map. Default to "Uncategorized" if no match.
        const category = serviceToCategoryMap[normalizedServiceName] || "Uncategorized";

        // Apply category filter
        if (selectedCategory !== 'all' && category !== selectedCategory) {
            return;
        }

        // Aggregation
        if (!categoryData[category]) {
            categoryData[category] = { count: 0, revenue: 0 };
        }

        categoryData[category].count += 1;
        categoryData[category].revenue += apt.price;
    });

    // 5. Convert aggregated data to the format required by Recharts
    return Object.keys(categoryData).map(category => ({
        name: category,
        count: categoryData[category].count,
        revenue: parseFloat(categoryData[category].revenue.toFixed(2)),
    }));
};

export function Insights({ appointments, services }: InsightsProps) {
    const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>("monthly");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const chartData = useMemo(() => {
        // If services or appointments arrays are empty, return an empty array
        if (appointments.length === 0 || services.length === 0) {
            return [];
        }
        return aggregateData(appointments, services, timeframe, selectedCategory);
    }, [appointments, services, timeframe, selectedCategory]);

    const availableCategories = useMemo(() => {
        const categories = new Set<string>();
        INITIAL_CATEGORIES.forEach(cat => categories.add(cat));
        services.forEach(s => s.category && categories.add(s.category));
        return Array.from(categories);
    }, [services]);


    return (
        <div className="space-y-6">
            <div>
                <h2>Service Insights</h2>
                <p className="text-gray-600">Analyze appointment frequency to identify top-performing service categories in the current {timeframe} period.</p>
            </div>

            {/* --- Filters --- */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-700">Filters:</span>
                    </div>

                    {/* Timeframe Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Timeframe:</label>
                        <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'monthly' | 'yearly')}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select Timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">This Month</SelectItem>
                                <SelectItem value="yearly">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Category:</label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {availableCategories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* --- Charts Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Service Popularity Chart (Count) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Popularity by Appointment Count</CardTitle>
                        <Calendar className="h-5 w-5 text-gray-600" />
                    </CardHeader>
                    <CardContent className="h-[300px] p-2">
                        {/* ⚡️ RENDER CHECK: Charts only render if chartData has entries ⚡️ */}
                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No appointments found for the selected filter.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                                    <YAxis allowDecimals={false} label={{ value: 'Bookings', angle: -90, position: 'insideLeft', dx: -5 }} />
                                    <Tooltip formatter={(value, name) => [value, 'Bookings']} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="count" fill="#8884d8" name="Appointment Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* 2. Service Revenue Chart */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Revenue Distribution</CardTitle>
                        <DollarSign className="h-5 w-5 text-gray-600" />
                    </CardHeader>
                    <CardContent className="h-[300px] p-2">
                        {/* ⚡️ RENDER CHECK: Charts only render if chartData has entries ⚡️ */}
                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No revenue data for the selected filter.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                                    <YAxis tickFormatter={(value) => `$${value}`} label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', dx: -5 }}/>
                                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}