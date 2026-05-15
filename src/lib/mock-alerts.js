const now = Date.now();
const m = (min) => new Date(now - min * 60000).toISOString();

export const ALERTS = [
  {
    id: "ALT-2041",
    title: "Turbine bearing temperature exceeded threshold",
    device: "Turbine-07",
    system: "Power Generation",
    timestamp: m(2),
    priority: "critical",
    status: "pending",
    aiScore: 97,
    probableCauses: ["Lubrication failure", "Sensor drift", "Excessive load"],
    metric: { label: "Temp", value: 142, unit: "°C" },
  },
  {
    id: "ALT-2040",
    title: "Pressure spike detected in cooling loop",
    device: "Pump-12B",
    system: "Cooling",
    timestamp: m(6),
    priority: "critical",
    status: "in_progress",
    aiScore: 93,
    probableCauses: ["Valve stuck closed", "Blocked filter"],
    metric: { label: "Pressure", value: 8.4, unit: "bar" },
  },
  {
    id: "ALT-2039",
    title: "Vibration anomaly on conveyor motor",
    device: "Conv-Motor-3",
    system: "Logistics Line A",
    timestamp: m(14),
    priority: "medium",
    status: "pending",
    aiScore: 71,
    probableCauses: ["Bearing wear", "Misalignment"],
    metric: { label: "Vibration", value: 6.2, unit: "mm/s" },
  },
  {
    id: "ALT-2038",
    title: "Network latency between PLC nodes",
    device: "PLC-Cluster-01",
    system: "Control Network",
    timestamp: m(22),
    priority: "medium",
    status: "in_progress",
    aiScore: 64,
    probableCauses: ["Switch congestion", "Cable degradation"],
    metric: { label: "Latency", value: 184, unit: "ms" },
  },
  {
    id: "ALT-2037",
    title: "Filter saturation approaching limit",
    device: "Air-Filter-9",
    system: "HVAC",
    timestamp: m(45),
    priority: "low",
    status: "pending",
    aiScore: 38,
    probableCauses: ["Routine fouling"],
    metric: { label: "Load", value: 78, unit: "%" },
  },
  {
    id: "ALT-2036",
    title: "Battery backup self-test passed with warning",
    device: "UPS-Rack-2",
    system: "Power",
    timestamp: m(70),
    priority: "low",
    status: "resolved",
    aiScore: 22,
    probableCauses: ["Aging cell"],
    metric: { label: "Capacity", value: 86, unit: "%" },
  },
  {
    id: "ALT-2035",
    title: "Coolant flow below nominal",
    device: "Reactor-A",
    system: "Cooling",
    timestamp: m(110),
    priority: "critical",
    status: "resolved",
    aiScore: 90,
    probableCauses: ["Pump cavitation", "Air pocket"],
    metric: { label: "Flow", value: 41, unit: "L/min" },
  },
  {
    id: "ALT-2034",
    title: "Door access anomaly — substation B",
    device: "Door-SB-2",
    system: "Security",
    timestamp: m(180),
    priority: "medium",
    status: "resolved",
    aiScore: 55,
    probableCauses: ["Badge misread", "Sensor latency"],
  },
];

export const PRIORITY_ORDER = {
  critical: 0,
  medium: 1,
  low: 2,
};

export function sortByPriority(alerts) {
  return [...alerts].sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return b.aiScore - a.aiScore;
  });
}

// Time series for charts
export const ALERT_TREND = Array.from({ length: 12 }, (_, i) => ({
  hour: `${String(i * 2).padStart(2, "0")}:00`,
  critical: Math.round(2 + Math.sin(i / 2) * 2 + Math.random() * 2),
  medium: Math.round(4 + Math.cos(i / 3) * 3 + Math.random() * 2),
  low: Math.round(6 + Math.sin(i / 4) * 2 + Math.random() * 3),
}));

export const SYSTEM_HEALTH = [
  { system: "Power", health: 92 },
  { system: "Cooling", health: 74 },
  { system: "HVAC", health: 88 },
  { system: "Network", health: 81 },
  { system: "Logistics", health: 96 },
];

export const PERF_METRICS = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}h`,
  cpu: 30 + Math.round(Math.sin(i / 3) * 12 + Math.random() * 8),
  load: 40 + Math.round(Math.cos(i / 4) * 15 + Math.random() * 8),
  temp: 55 + Math.round(Math.sin(i / 5) * 8 + Math.random() * 5),
}));
