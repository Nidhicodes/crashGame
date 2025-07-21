"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDailyStats, getWeeklyStats } from '@/lib/api'; // Assuming these functions exist in your API lib

interface StatData {
    period: string;
    date: string;
    totalGames: number;
    totalPlayers: number;
    totalBets: number;
    totalWinnings: number;
    netProfit: number;
    highestMultiplier: number;
    averageMultiplier: number;
}

export function StatsView() {
    const [dailyStats, setDailyStats] = useState<StatData[]>([]);
    const [weeklyStats, setWeeklyStats] = useState<StatData[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const daily = await getDailyStats();
                const weekly = await getWeeklyStats();
                setDailyStats(daily);
                setWeeklyStats(weekly);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        }
        fetchStats();
    }, []);

    const renderStatsTable = (stats: StatData[], title: string) => (
        <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <CardHeader>
                <CardTitle className="text-purple-200">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-purple-900/20">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Total Games</th>
                                <th scope="col" className="px-6 py-3">Total Players</th>
                                <th scope="col" className="px-6 py-3">Total Bets</th>
                                <th scope="col" className="px-6 py-3">Net Profit</th>
                                <th scope="col" className="px-6 py-3">Highest Multiplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat, index) => (
                                <tr key={index} className="border-b border-purple-500/20">
                                    <td className="px-6 py-4">{new Date(stat.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{stat.totalGames}</td>
                                    <td className="px-6 py-4">{stat.totalPlayers}</td>
                                    <td className="px-6 py-4">{stat.totalBets.toFixed(2)}</td>
                                    <td className="px-6 py-4">{stat.netProfit.toFixed(2)}</td>
                                    <td className="px-6 py-4">{stat.highestMultiplier.toFixed(2)}x</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-sm border border-purple-500/20">
                <TabsTrigger value="daily">Daily Stats</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
                {renderStatsTable(dailyStats, "Daily Statistics")}
            </TabsContent>
            <TabsContent value="weekly">
                {renderStatsTable(weeklyStats, "Weekly Statistics")}
            </TabsContent>
        </Tabs>
    );
}
