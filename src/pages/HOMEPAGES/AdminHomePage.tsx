

import React from "react";
import {
  useGetSales,
  useGetSalesByPeriod,
  useGetSalesByRecipeAndPeriod,
  useGetTopRecipes,
} from "@/api/MySalesApi";

import DashboardKpis from "@/components/home-components/DashboardKpis";
import Dashboardheader from "@/components/home-components/Dashboardheader";
import SalesByRecipeTable from "@/components/home-components/SalesByRecipeTable";
import SalesChart from "@/components/home-components/SalesChart";
import TopRecipesChart from "@/components/home-components/TopRecipesChart";
import RecipesPieChart from "@/components/home-components/RecipesPieChart";
import type { Sale } from "@/types";

// const getISODate = (d: Date) => d.toISOString();

const toISO = (d: Date) => d.toISOString();

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};
type ChartPeriod = "week" | "month" | "year";

const getChartRangeAndGroupBy = (
  today: Date,
  period: ChartPeriod
): { startISO: string; endISO: string; groupBy: "day" | "week" | "month" | "year" } => {
  let start: Date;
  let end: Date;
  let groupBy: "day" | "week" | "month" | "year" = "day";

  const endDay = endOfDay(today);

  if (period === "week") {
    // últimos 7 días
    start = startOfDay(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000));
    end = endDay;
    groupBy = "day";
  } else if (period === "month") {
    // últimos 30 días
    start = startOfDay(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000));
    end = endDay;
    groupBy = "day";
  } else {
    // año actual: agrupado por mes
    start = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
    end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
    groupBy = "month";
  }

  return { startISO: toISO(start), endISO: toISO(end), groupBy };
};



const AdminHomePage = () => {
  const today = React.useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = React.useState<Date>(today);

  const [chartPeriod, setChartPeriod] = React.useState<ChartPeriod>("week");

  // 🔹 Rango SOLO para KPIs + tabla (día seleccionado)
  const dayStartISO = React.useMemo(
    () => toISO(startOfDay(selectedDate)),
    [selectedDate]
  );
  const dayEndISO = React.useMemo(
    () => toISO(endOfDay(selectedDate)),
    [selectedDate]
  );

  // 🔹 Rango para las gráficas (según selector semana/mes/año) – NO depende del día seleccionado
  const chartRange = React.useMemo(
    () => getChartRangeAndGroupBy(today, chartPeriod),
    [today, chartPeriod]
  );

  // ======================
  //   DATOS DEL DÍA (KPIs + TABLA)
  // ======================
  const { sales, isLoading: isLoadingSales } = useGetSales(dayStartISO, dayEndISO);

  const {
    salesByRecipeAndPeriod,
    isLoading: isLoadingByRecipePeriod,
  } = useGetSalesByRecipeAndPeriod("day", dayStartISO, dayEndISO);

  // KPIs calculados SOLO con las ventas del día seleccionado
  const kpis = React.useMemo(() => {
    if (!sales || sales.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, avgTicket: 0 };
    }

    const totalRevenue = (sales as Sale[]).reduce(
      (acc, curr) => acc + (curr.price ?? 0),
      0
    );
    const totalOrders = sales.length;
    const avgTicket =
      totalOrders === 0 ? 0 : Math.round(totalRevenue / totalOrders);

    return { totalRevenue, totalOrders, avgTicket };
  }, [sales]);

  // ======================
  //   DATOS DEL PERIODO (GRÁFICAS)
  // ======================
  const {
    salesByPeriod,
    isLoading: isLoadingByPeriod,
  } = useGetSalesByPeriod(
    chartRange.groupBy,
    chartRange.startISO,
    chartRange.endISO
  );

  const {
    topRecipes,
    isLoading: isLoadingTopRecipes,
  } = useGetTopRecipes(5, chartRange.startISO, chartRange.endISO);

  return (
    <div className="w-full p-7 space-y-6">
      {/* 🔹 Header con selección de fecha */}
      <Dashboardheader
        today={today}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 🔹 Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda (ocupa más espacio) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          <DashboardKpis
            kpis={kpis}
            sales={sales}
            isLoadingSales={isLoadingSales}
          />

        <SalesChart
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
            isLoading={isLoadingByPeriod}
            data={salesByPeriod}
          />
  
        </div>

        <div className="space-y-6">
          <TopRecipesChart
            isLoading={isLoadingTopRecipes}
            data={topRecipes}
          />
          <RecipesPieChart
            isLoading={isLoadingTopRecipes}
            data={topRecipes}
          />
        </div>
      </div>

    <div className="space-y-6"> 

      <SalesByRecipeTable
        isLoading={isLoadingByRecipePeriod}
        data={salesByRecipeAndPeriod}
      />
      </div>
    </div>


  );
};

export default AdminHomePage;
