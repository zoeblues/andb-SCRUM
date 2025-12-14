// src/components/Insights.tsx

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Filter } from "lucide-react";
import { Button } from "./ui/button";

// Placeholder component for the chart area
const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border border-dashed text-gray-500">
        <BarChart className="h-6 w-6 mr-2" />
        {title} Chart Placeholder
    </div>
);

// Define the categories, as used in Services.tsx
const INITIAL_CATEGORIES = [
    "Haircuts",
    "Color",
    "Nails",
    "Styling",
];

export function Insights() {
    const [timeframe, setTimeframe] = useState("monthly");
    // ⚡️ CHANGED STATE VARIABLE TO selectedCategory ⚡️
    const [selectedCategory, setSelectedCategory] = useState("all");

    return (
        <div className="space-y-6">
            <div>
                <h2>Service Insights</h2>
                <p className="text-gray-600">Analyze appointment frequency to identify top-performing service categories.</p>
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
                        <Select value={timeframe} onValueChange={setTimeframe}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select Timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ⚡️ UPDATED: Category Filter ⚡️ */}
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
                                {/* Dynamically map available categories */}
                                {INITIAL_CATEGORIES.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* --- Charts Section (No change needed here) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Service Popularity by Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartPlaceholder title="Service Count" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Revenue Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartPlaceholder title="Service Revenue" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}