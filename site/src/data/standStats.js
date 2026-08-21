import fieldTrees from "./field_trees.geojson";
import standsGeo from "./stands.geojson";

function finiteNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function mean(values) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdev(values) {
  if (values.length < 2) return null;
  const m = mean(values);
  const variance =
    values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function standFieldStats(standId) {
  const trees = fieldTrees.features.filter((f) => f.properties.standId === standId);
  const daps = trees.map((f) => finiteNum(f.properties.dap)).filter((v) => v != null);
  const hts = trees.map((f) => finiteNum(f.properties.ht)).filter((v) => v != null);
  const feat = standsGeo.features.find((f) => f.properties.standId === standId);
  return {
    n: trees.length,
    meanDap: mean(daps),
    sdDap: stdev(daps),
    meanHt: mean(hts),
    sdHt: stdev(hts),
    areaHa: feat?.properties.areaHa ?? null,
  };
}

export function standPolygon(standId) {
  return standsGeo.features.find((f) => f.properties.standId === standId) ?? null;
}

function histogram(values, step) {
  const nums = values.filter((v) => v != null && Number.isFinite(v));
  if (!nums.length) return { step, labels: [], counts: [] };
  const maxV = Math.max(...nums);
  const nBins = Math.max(1, Math.ceil((maxV + 0.0001) / step));
  const counts = Array(nBins).fill(0);
  nums.forEach((v) => {
    const i = Math.min(nBins - 1, Math.floor(v / step));
    counts[i] += 1;
  });
  return {
    step,
    labels: counts.map((_, i) => String(i * step)),
    counts,
  };
}

export function standDistributions(standId) {
  const trees = fieldTrees.features.filter((f) => f.properties.standId === standId);
  const daps = trees.map((f) => finiteNum(f.properties.dap));
  const hts = trees.map((f) => finiteNum(f.properties.ht));
  return {
    dap: histogram(daps, 5),
    ht: histogram(hts, 2),
  };
}
