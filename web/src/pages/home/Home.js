import React from "react";
import './Home.css'

import Grid from "@mui/material/Grid";
import MDBox from "../../components/MDBox";

import DashboardLayout from "./LayoutContainers/DashboardLayout";
import ReportsBarChart from "./Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "./Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "./Cards/StatisticsCards/ComplexStatisticsCard/index";

// Hard data import
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";
const Home = ({user}) => {
    const { sales, tasks } = reportsLineChartData

    return (
    <DashboardLayout>
        <MDBox py={3}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <MDBox mb={1.5}>
                        <ComplexStatisticsCard
                            color="dark"
                            icon="weekend"
                            title="Products"
                            count={281}
                            percentage={{
                                color: "success",
                                amount: "+3",
                                label: "Added lask week",
                            }}
                        />
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <MDBox mb={1.5}>
                        <ComplexStatisticsCard
                            icon="leaderboard"
                            title="Parts"
                            count="2,300"
                            percentage={{
                                color: "success",
                                amount: "+3 new",
                                label: "Added last month",
                            }}
                        />
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <MDBox mb={1.5}>
                        <ComplexStatisticsCard
                            color="success"
                            icon="store"
                            title="Low in Stock"
                            count="15"
                            percentage={{
                                color: "success",
                                amount: "+1%",
                                label: "Updated just now",
                            }}
                        />
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <MDBox mb={1.5}>
                        <ComplexStatisticsCard
                            color="primary"
                            icon="person_add"
                            title="Out of Stock"
                            count="+91"
                            percentage={{
                                color: "success",
                                amount: "",
                                label: "Just updated",
                            }}
                        />
                    </MDBox>
                </Grid>
            </Grid>
            <MDBox mt={4.5}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                        <MDBox mb={3}>
                            <ReportsBarChart
                                color="info"
                                title="website views"
                                description="Last Campaign Performance"
                                date="campaign sent 2 days ago"
                                chart={reportsBarChartData}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <MDBox mb={3}>
                            <ReportsLineChart
                            color="success"
                            title="daily sales"
                            description={
                                <>
                                (<strong>+15%</strong>) increase in today sales.
                                </>
                            }
                            date="updated 4 min ago"
                            chart={sales}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <MDBox mb={3}>
                            <ReportsLineChart
                                color="dark"
                                title="completed tasks"
                                description="Last Campaign Performance"
                                date="just updated"
                                chart={tasks}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
            <MDBox>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={8}>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                    </Grid>
                </Grid>
            </MDBox>
        </MDBox>
    </DashboardLayout>
    );
}

export default Home;