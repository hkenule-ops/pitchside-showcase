import { useEffect, useRef } from "react";
import {
  createChart, CandlestickSeries, HistogramSeries, ColorType, IChartApi, ISeriesApi, UTCTimestamp,
} from "lightweight-charts";
import { Candle } from "@/lib/types";

interface Props {
  data: Candle[];
  height?: number;
  showVolume?: boolean;
}

const CandlestickChart = ({ data, height = 420, showVolume = true }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(200,200,210,0.7)",
        fontFamily: "JetBrains Mono, monospace",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: { borderColor: "rgba(255,255,255,0.08)", timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 },
    });
    chartRef.current = chart;

    const candle = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981", downColor: "#EF4444",
      wickUpColor: "#10B981", wickDownColor: "#EF4444",
      borderVisible: false,
    });
    candleRef.current = candle;

    if (showVolume) {
      const vol = chart.addSeries(HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "",
        color: "rgba(212,175,55,0.4)",
      });
      vol.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      volRef.current = vol;
    }

    const ro = new ResizeObserver(() => chart.applyOptions({ width: ref.current!.clientWidth }));
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.remove(); };
  }, [height, showVolume]);

  useEffect(() => {
    if (!candleRef.current || !data.length) return;
    candleRef.current.setData(data.map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open, high: c.high, low: c.low, close: c.close,
    })));
    if (volRef.current) {
      volRef.current.setData(data.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
      })));
    }
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return <div ref={ref} className="w-full" style={{ height }} />;
};

export default CandlestickChart;
