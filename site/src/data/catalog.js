/** Mock catalog: data as if already laid out under data/stands/<id>/ */

export const siteMeta = {
  place: "Frutillar, Los Lagos",
  crs: "EPSG:32718",
  clusterRoot: "data/",
  mockup: true,
};

/** Public R2 development URL (rate-limited; swap for a custom domain later). */
export const r2PublicBase =
  "https://pub-394184f1266c46d1b234a4b7f925fff2.r2.dev";

export function potreeViewerUrl(metadataPath, title) {
  const metadataUrl = `${r2PublicBase}${metadataPath}`;
  const q = new URLSearchParams({ metadata: metadataUrl });
  if (title) q.set("title", title);
  return `${r2PublicBase}/potree-app/index.html?${q.toString()}`;
}

export const stages = [
  { id: "raw", label: "raw", hint: "original sensor cloud" },
  { id: "normalized", label: "normalized", hint: "Z = height above ground" },
  { id: "segmented", label: "segmented", hint: "stems / instances" },
];

function sensors(flags) {
  return {
    TLS: Boolean(flags.TLS),
    MLS: Boolean(flags.MLS),
    ULS: Boolean(flags.ULS),
  };
}

export const stands = [
  {
    id: "ruil",
    number: "01",
    name: "Ruil",
    species: "Nothofagus alessandrii",
    group: "broadleaf",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    ulsNote: "ULS campaign shared with sequoia (250218_251020).",
    areaHa: 0.12,
    scan: { tls: "2025-02-17", mls: "2025-02", uls: "2025-02-18" },
    sizesGb: { tls: 8.8, mls: 0.76, uls: 0.1 },
    stages: { raw: "done", normalized: "done", segmented: "done" },
    files: {
      TLS: [
        "raw/2025-02-17_ruil_0005m_32718.laz",
        "derived/ruil_tls_simplified.laz",
      ],
      MLS: ["raw/ruil.laz"],
      ULS: ["raw/campaign_250218_ruil_sequoia/", "derived/ruil_uls_simplified.laz"],
    },
    products: ["DTM", "COPC", "3DFin stems", "TreeX stems", "field plot"],
    experiments: ["3dfin-vs-treex", "reconstruct"],
    potree: {
      label: "TLS curvature thinning 10%",
      metadataPath: "/stands/ruil/metadata.json",
    },
  },
  {
    id: "sequoia",
    number: "02",
    name: "Sequoia",
    species: "Sequoia sempervirens",
    group: "conifer",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    ulsNote: "Same ULS campaign as ruil.",
    areaHa: 0.11,
    scan: { tls: "2025-02-18", mls: "2025-02", uls: "2025-02-18" },
    sizesGb: { tls: 11, mls: 0.76, uls: 0.1 },
    stages: { raw: "done", normalized: "partial", segmented: "todo" },
    files: {
      TLS: ["raw/20250218_sequoia_0005m_32718.laz"],
      MLS: ["raw/Sequoia_Optimized.laz"],
      ULS: ["raw/campaign_250218_ruil_sequoia/"],
    },
    products: ["DTM"],
    experiments: [],
  },
  {
    id: "lawson_01",
    number: "03",
    name: "Lawson 01",
    species: "Chamaecyparis lawsoniana",
    group: "conifer",
    mapName: "lawson",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    ulsNote: "ULS campaign lawson_1_2 (with lawson_02).",
    areaHa: 0.18,
    scan: { tls: "2025-02-18", mls: "2025-02", uls: "2025-02-19" },
    sizesGb: { tls: 8.7, mls: 0.52, uls: 1.1 },
    stages: { raw: "done", normalized: "done", segmented: "done" },
    files: {
      TLS: ["raw/2025-02-18_lawson_01_0005m_32718.laz"],
      MLS: ["raw/lawson_01.laz"],
      ULS: ["raw/campaign_250219_lawson_1_2/", "derived/lawson_1_2_uls.laz"],
    },
    products: ["DTM", "COPC", "3DFin stems", "TreeX stems", "field plot"],
    experiments: ["3dfin-vs-treex"],
    potree: {
      label: "TLS curvature thinning 10%",
      metadataPath: "/stands/lawson_01/metadata.json",
    },
  },
  {
    id: "lawson_02",
    number: "04",
    name: "Lawson 02",
    species: "Chamaecyparis lawsoniana",
    group: "conifer",
    mapName: "lawson",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.09,
    scan: { tls: "2025-02-19", mls: "2025-02", uls: "2025-02-19" },
    sizesGb: { tls: 4.1, mls: 0.36, uls: 1.1 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-19_lawson_02_0005m_32718.laz"],
      MLS: ["raw/Lawson2_Optimized.laz"],
      ULS: ["raw/campaign_250219_lawson_1_2/"],
    },
    products: [],
    experiments: [],
  },
  {
    id: "oregon_01",
    number: "05",
    name: "Oregon 01",
    species: "Pseudotsuga menziesii",
    group: "conifer",
    mapName: "oregon",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.14,
    scan: { tls: "2025-02-20", mls: "2025-02", uls: "2025-02-20" },
    sizesGb: { tls: 7.8, mls: 0.66, uls: 38 },
    stages: { raw: "done", normalized: "partial", segmented: "done" },
    files: {
      TLS: ["raw/2025-02-20_oregon_01_0005m_32718.laz"],
      MLS: ["raw/oregon_01.laz"],
      ULS: ["raw/campaign_250220_oregon_1/"],
    },
    products: ["3DFin stems", "TreeX stems", "field plot"],
    experiments: ["3dfin-vs-treex"],
    potree: {
      label: "TLS curvature thinning 10%",
      metadataPath: "/stands/oregon_01/metadata.json",
    },
  },
  {
    id: "oregon_02",
    number: "06",
    name: "Oregon 02",
    species: "Pseudotsuga menziesii",
    group: "conifer",
    mapName: "oregon",
    sensors: sensors({ TLS: true, MLS: true, ULS: false }),
    areaHa: 0.13,
    scan: { tls: "2025-02-20", mls: "2025-02", uls: null },
    sizesGb: { tls: 8.7, mls: 0.09, uls: 0 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-20_oregon_02_0005m_32718.laz"],
      MLS: ["raw/Oregon2_Optimized.laz"],
      ULS: [],
    },
    products: [],
    experiments: [],
  },
  {
    id: "roble",
    number: "07",
    name: "Roble",
    species: "Nothofagus obliqua",
    group: "broadleaf",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.42,
    scan: { tls: "2025-02-21", mls: "2025-02", uls: "2025-02-21" },
    sizesGb: { tls: 17, mls: 0.77, uls: 2.0 },
    stages: { raw: "done", normalized: "done", segmented: "done" },
    files: {
      TLS: ["raw/2025-02-21_roble_0005m_32718.laz", "derived/roble_tls_simplified.laz"],
      MLS: ["raw/roble.laz"],
      ULS: ["raw/campaign_250221_roble/", "derived/roble_uls.laz"],
    },
    products: ["DTM", "COPC", "3DFin stems", "TreeX stems", "field plot", "thinning 30%"],
    experiments: ["3dfin-vs-treex"],
    potree: {
      label: "TLS curvature thinning 10%",
      metadataPath: "/stands/roble/metadata.json",
    },
  },
  {
    id: "rauli_01",
    number: "08",
    name: "Rauli 01",
    species: "Nothofagus alpina",
    group: "broadleaf",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.16,
    scan: { tls: "2025-02-21", mls: "2025-02", uls: "2025-02-21" },
    sizesGb: { tls: 7.2, mls: 0.38, uls: 8.6 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-21_rauli_01_0005m_32718.laz"],
      MLS: ["raw/Rauli1_Optimized.laz"],
      ULS: ["raw/campaign_250221_rauli_01/"],
    },
    products: [],
    experiments: [],
  },
  {
    id: "rauli_02",
    number: "09",
    name: "Rauli 02",
    species: "Nothofagus alpina",
    group: "broadleaf",
    sensors: sensors({ TLS: true, MLS: false, ULS: true }),
    areaHa: 0.2,
    scan: { tls: "2025-02-24", mls: null, uls: "2025-02-24" },
    sizesGb: { tls: 13, mls: 0, uls: 17 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-24_rauli_02_0005m_32718.laz"],
      MLS: [],
      ULS: ["raw/campaign_250221_rauli_02/"],
    },
    products: [],
    experiments: [],
  },
  {
    id: "tepa",
    number: "10",
    name: "Tepa",
    species: "Laureliopsis philippiana",
    group: "broadleaf",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.19,
    scan: { tls: "2025-02-24", mls: "2025-02", uls: "2025-02-24" },
    sizesGb: { tls: 13, mls: 0.77, uls: 1.1 },
    stages: { raw: "done", normalized: "done", segmented: "partial" },
    files: {
      TLS: ["raw/2025-02-24_tepa_0005m_32718.laz"],
      MLS: ["raw/09_Tepas_Optimized.laz"],
      ULS: ["raw/campaign_250224_tepa/", "derived/tepa_uls.laz"],
    },
    products: ["DTM", "thinning 30%", "field plot"],
    experiments: [],
  },
  {
    id: "alerce",
    number: "11",
    name: "Alerce",
    species: "Fitzroya cupressoides",
    group: "conifer",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.1,
    scan: { tls: "2025-02-25", mls: "2025-02", uls: "2025-02-25" },
    sizesGb: { tls: 9.6, mls: 0.52, uls: 3.2 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-25_alerce_0005m_32718.laz"],
      MLS: ["raw/Alerce_Optimized.laz"],
      ULS: ["raw/campaign_250225_alerce/"],
    },
    products: ["field plot"],
    experiments: [],
  },
  {
    id: "nativo_01",
    number: "12",
    name: "Native 01",
    species: "mixed native forest",
    group: "mixed",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.22,
    scan: { tls: "2025-02-25", mls: "2025-02", uls: "2025-02-26" },
    sizesGb: { tls: 9.6, mls: 0.53, uls: 1.4 },
    stages: { raw: "done", normalized: "done", segmented: "partial" },
    files: {
      TLS: ["raw/2025-02-25_nativo_01_0005m_32718.laz"],
      MLS: ["raw/Nativo1_Optimized.laz"],
      ULS: ["raw/campaign_250226_nativo01/", "derived/nativo_01_uls.laz"],
    },
    products: ["DTM", "thinning 30%"],
    experiments: [],
  },
  {
    id: "nativo_02",
    number: "13",
    name: "Native 02",
    species: "mixed native forest",
    group: "mixed",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.21,
    scan: { tls: "2025-02-26", mls: "2025-02", uls: "2025-02-26" },
    sizesGb: { tls: 13, mls: 0.57, uls: 13 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-26_nativo_02_0005m_32718.laz"],
      MLS: ["raw/Nativo2_Clean_Optimized.laz"],
      ULS: ["raw/campaign_250226_nativo_02/"],
    },
    products: [],
    experiments: [],
  },
  {
    id: "experimento",
    number: "14",
    name: "Trial plot",
    species: "trial plot",
    group: "trial",
    sensors: sensors({ TLS: true, MLS: true, ULS: true }),
    areaHa: 0.15,
    scan: { tls: "2025-02-26", mls: "2025-02", uls: "2025-02-26" },
    sizesGb: { tls: 11, mls: 5.5, uls: 8.6 },
    stages: { raw: "done", normalized: "todo", segmented: "todo" },
    files: {
      TLS: ["raw/2025-02-26_experimento_0005m_32718.laz"],
      MLS: ["raw/experiment/"],
      ULS: ["raw/campaign_250226_experiment/"],
    },
    products: [],
    experiments: [],
  },
];

export const experiments = [
  {
    id: "3dfin-vs-treex",
    title: "3DFin vs TreeX",
    kind: "detection comparison",
    stands: ["ruil", "roble", "lawson_01", "oregon_01"],
    path: "data/experiments/research/3dfin-vs-treex/",
    summary:
      "Hungarian matching against field inventory. Voxel / density / curvature thinning. 3DFin and TreeX runs by retention percentage.",
    artifacts: [
      { name: "field_plots/*.gpkg", note: "field ground truth" },
      { name: "runs/thinned/target05–50", note: "LASMASK masks" },
      { name: "runs/3dfin_runs/", note: "72 runs" },
      { name: "runs/treex_runs/", note: "instances + stem CSVs" },
    ],
    figure: "compare-dashboard",
    figureCaption: "3DFin on Ruil, curvature 30%: spatial match, DAP and height vs field.",
  },
  {
    id: "l-systems",
    title: "L-system induction",
    kind: "generative model",
    stands: [],
    path: "data/experiments/research/l-systems/",
    summary:
      "Parameters Θ from TreeQSM QSMs (BioDiv-3DTrees, Fagus sylvatica). Does not yet use Frutillar Reeb graphs.",
    artifacts: [
      { name: "splits/fagus_validqsm_120_30.json", note: "train / held-out" },
      { name: "output/phase2/", note: "empirical histograms" },
    ],
    figure: "lsystems",
    figureCaption: "Held-out Fagus QSM vs a synthetic tree grown from fitted Θ.",
  },
  {
    id: "reconstruct",
    title: "Reeb reconstruction",
    kind: "topology prototype",
    stands: ["ruil"],
    path: "data/experiments/research/reconstruct/",
    summary:
      "Per-tree Reeb-like graph from TLS: voxelize, knn, geodesic scalar, supernodes. One Ruil tree has a GraphML result. The cluster has no batch reconstruction yet — Ruil per-tree crops stopped as unfinished .laz.tmp.",
    artifacts: [
      { name: "ruil_tree_sample.graphml", note: "2267 nodes, 3056 edges" },
      { name: "ruil_tree_sample.json", note: "2.7M pts → 424k voxels · geodesic · 36 levels" },
      { name: "ruil_tree_sample_reeb_*.html", note: "Plotly: knn, trunk, Reeb" },
      { name: "shared/output/individual_tree_points/ruil/", note: "4 unfinished cluster_*.laz.tmp" },
    ],
    figure: "reconstruct",
    figureCaption: "Tilted view (XY stretched) and plan cuts at 7.5 m and 14.6 m. Color is geodesic scalar.",
  },
];

export function standById(id) {
  return stands.find((s) => s.id === id);
}

export function sensorCount(stand) {
  return ["TLS", "MLS", "ULS"].filter((k) => stand.sensors[k]).length;
}

export function totals() {
  const n = stands.length;
  const withAll = stands.filter((s) => sensorCount(s) === 3).length;
  const gb = stands.reduce(
    (acc, s) => acc + s.sizesGb.tls + s.sizesGb.mls + s.sizesGb.uls,
    0,
  );
  const ready = stands.filter((s) => s.stages.segmented === "done").length;
  return { n, withAll, gb: Math.round(gb), ready };
}
