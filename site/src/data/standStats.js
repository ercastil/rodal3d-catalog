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

export function standFieldStats(standId) {
  const trees = fieldTrees.features.filter((f) => f.properties.standId === standId);
  const daps = trees.map((f) => finiteNum(f.properties.dap)).filter((v) => v != null);
  const hts = trees.map((f) => finiteNum(f.properties.ht)).filter((v) => v != null);
  const feat = standsGeo.features.find((f) => f.properties.standId === standId);
  return {
    n: trees.length,
    meanDap: mean(daps),
    meanHt: mean(hts),
    areaHa: feat?.properties.areaHa ?? null,
  };
}

export function standPolygon(standId) {
  return standsGeo.features.find((f) => f.properties.standId === standId) ?? null;
}
