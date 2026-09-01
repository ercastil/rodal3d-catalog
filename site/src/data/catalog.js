/** Mock catalog: data as if already laid out under data/stands/<id>/ */

export const siteMeta = {
  place: "Frutillar, Los Lagos",
  crs: "EPSG:32718",
  clusterRoot: "data/",
  mockup: true,
  contactEmail: "ernesto.cast.nav@gmail.com",
};

/** TLS + polygon archive. Drive links require an already-shared Google account. */
export const tlsArchiveProducts = [
  { code: "RAW", path: "TLS/raw", hint: "original scan" },
  { code: "CLIP", path: "TLS/clip", hint: "clipped to plot" },
  { code: "L1", path: "TLS/l1", hint: "xyz + intensity" },
  { code: "L1n", path: "TLS/l1n", hint: "L1, height above ground" },
  { code: "L2A", path: "TLS/l2a", hint: "voxel thinning 20%" },
  { code: "L2An", path: "TLS/l2an", hint: "L2A normalized" },
  { code: "L2B", path: "TLS/l2b", hint: "density thinning 20%" },
  { code: "L2Bn", path: "TLS/l2bn", hint: "L2B normalized" },
  { code: "L2C", path: "TLS/l2c", hint: "curvature thinning 20%" },
  { code: "L2Cn", path: "TLS/l2cn", hint: "L2C normalized" },
  { code: "polygons", path: "polygons", hint: "field trees + clip hull" },
];

/** Catalog stand id → folder name under data/stands/. */
export const tlsArchiveDirByStandId = {
  ruil: "ruil",
  alerce: "alerce",
  lawson_01: "lawson",
  oregon_01: "oregon",
  roble: "roble",
  tepa: "tepa",
};

function driveFile(id) {
  return { kind: "file", id };
}
function driveFolder(id) {
  return { kind: "folder", id };
}

/** Google Drive IDs (restricted folder). File links for LAZ; folder for polygons. */
export const tlsArchiveDrive = {
  ruil: {
    RAW: driveFile("1yQckdZLi0xocpFxd-PMbzJTEe7oOCMjw"),
    CLIP: driveFile("10Fv1pzbsNXMvS2nQbnqS2R6UMAMVcJ0G"),
    L1: driveFile("1WiNPXMArcD1hGu30vVmeu5vf3um8wm-D"),
    L1n: driveFile("1gsZoAyXQCFIKmVFGoVl5ZRiyuXhA8GTf"),
    L2A: driveFile("1kMzhO1PCiCsL8L-T2b3QOfnT__WazNXT"),
    L2An: driveFile("1xpKNtR93zDJXvAofiuzndm_nQaX0GGFV"),
    L2B: driveFile("1AA4mnsedPVWpyOHFyiT2Arb_WXlP2DSH"),
    L2Bn: driveFile("1e1FD340g5SG3GaDWo_h7VBIZyDHmdCKv"),
    L2C: driveFile("1dmftJnRvBmp5M7X3f2QzqyF2PYij9tUC"),
    L2Cn: driveFile("16sc5coQBf-NuLznNm2qt2QoRdSr9bquf"),
    polygons: driveFolder("1ctDl44YxmbkO83A7KhbIbnbFm5sFtOPX"),
  },
  alerce: {
    RAW: driveFolder("1danRWFkXj_3azgAA0DLOVZc79SK-3Pl5"),
    CLIP: driveFile("1XSXqFbm5JC3I4BRxNVkuJWbR1aVRuqEU"),
    L1: driveFile("1xl1Jr8zrWBPSv0UEqakpEwwmrpW20hUa"),
    L1n: driveFile("1XV0kYvajQWzWnL3KbuDr3HuW3374wMkV"),
    L2A: driveFile("1W3pZsgq2ANXEWzTB0sF2eOCA91z8e0KS"),
    L2An: driveFile("1JbqDfMZzEUpOH9FO9Thg5PPXkaMV-JFy"),
    L2B: driveFile("1-zP90Xd30jlLvPZ4TDWlRHc5h4ZMb5Oj"),
    L2Bn: driveFile("11hnxUH9ldNC174FzfKuEeEx6FVYDbWuS"),
    L2C: driveFile("1XMboWvbulTYk_u5m7-nMxd_a_pykC6Jh"),
    L2Cn: driveFile("1fV6fXkxf3uusTHUn3iqtrI5L7I9TDlEF"),
    polygons: driveFolder("1gpMNgsxqb7aqmp-_77lMbFIIwPJPnA2k"),
  },
  lawson_01: {
    RAW: driveFile("12VlL4vuNWDpeZB_Cwo9kyv36HubRSF7u"),
    CLIP: driveFolder("1jOsa6iMWUJArsKY0nRNJI426t7ENDCdM"),
    L1: driveFile("1TbdMRLMdqnp01VwxtofH3RBFyzy_ez6i"),
    L1n: driveFile("1fNVH-B75xV1eZNJY1vg2vIIEQ48VEEfx"),
    L2A: driveFile("1dqQYQ9Y3WksyHSWZs7v3vbSQk75Htn4F"),
    L2An: driveFile("1YoBcpLOmItpNVWnNIuua1t9qfzNV7apd"),
    L2B: driveFile("1_QVuqNf-yvFboJI9e4Hjo9R9FRCz5q66"),
    L2Bn: driveFile("1VKei8EglaRxtW96S6VQnidVeu6SntCWt"),
    L2C: driveFile("1MyrgdsqJGWDMfX7Y1clJoKpPadqPQ4kX"),
    L2Cn: driveFile("1cu8quGMXZpYMyGaA4w-aSHsg68CTppEH"),
    polygons: driveFolder("1NKrNiYYK9HBYtNK0W5csZ3fSDGnup3-s"),
  },
  oregon_01: {
    RAW: driveFile("1rIusgwR6rL2QVRrmT9YuqmF6Tw3AR_qJ"),
    CLIP: driveFile("1ztB9Y1K0sGn4T7ucl8zmaf21lGXMNUZ_"),
    L1: driveFile("1Zbc5bIfZfz7rkyyfNdUIrGA-07BVEKT9"),
    L1n: driveFile("1EgcCe9Je80pf17BB1bZSXPzg8noBTKFv"),
    L2A: driveFile("1HS9DjNrRZvE_zYy35zOFgnCbqnq1XkiC"),
    L2An: driveFile("1B1Tn7Pvsdl2kA4Pz-XaNfR5YVshJhD49"),
    L2B: driveFile("1F5kLS6pP8kMAWQ-QW36JtAGoy-M-6TXp"),
    L2Bn: driveFile("1czChReUuUCyiC4vT_gTlCaTVmPEKjv27"),
    L2C: driveFile("1PyN54Z2UQybExgSkLzO_oDRWZj4eTTIl"),
    L2Cn: driveFile("10bPkDDKGQ0wVYaXjckylUAUjrDcLGDSs"),
    polygons: driveFolder("1BuQ3rIcuAK41nJEdTIFHToOsXcTReOUV"),
  },
  roble: {
    RAW: driveFolder("1pgvz7pEDuPb4P-a3PPYTPJGnC_mjDj5f"),
    CLIP: driveFile("1pHGkOsjUvdqP6pR_DQJ_biY_yNQFGr2z"),
    L1: driveFile("1Pl1oj9SAGWkdljNaioCe45T82_fcqzCq"),
    L1n: driveFile("1KD2_uAjCQ_gpEwAu5BfQ8d8I0jZQiFna"),
    L2A: driveFile("1rlV-2LW9VF7e8MyDmpSAHf4-AC9jIYGo"),
    L2An: driveFile("1pl9DuLx4cmtKOxmhMtYKODcACeRj7PyE"),
    L2B: driveFile("1OqpWxP_CvKbV_Py8HtLrYYZYwW0giiKw"),
    L2Bn: driveFile("1xDxBSx-QJ7MZZcvNfDQ4jZ68HoxsnfPY"),
    L2C: driveFile("1-w1i3OevFFpkOH2Ns4f5rD_9sS4SeVGF"),
    L2Cn: driveFile("1KtSZaNf5fsWSeKo6-03-Et9pzGY4s-P6"),
    polygons: driveFolder("1tQcbr_LCUyc_Ij2Mos89sHNuuNkYMAzA"),
  },
  tepa: {
    RAW: driveFolder("1lxriHEIZ254sFHo-3nidaB9BHjcFbLWx"),
    CLIP: driveFile("1-7_nkxssjQOA5_IhkWjz54rc4DciFeQT"),
    L1: driveFile("19r6OkjOVdlWJYtm9_jCnaQpfiCJWH-rw"),
    L1n: driveFile("1pkKEYk8SVBYs0WhtNo5XJBs1Vs9NgNbR"),
    L2A: driveFile("1fBE8bDWP-fdu4Vz2HI1UHPSE9nPR0aGF"),
    L2An: driveFile("1br_Ih3_xbzI5VLrZkVxeyQgpw3clX7Av"),
    L2B: driveFile("1qHZBAGaGNTZazYNEsmMOo87YJtMTi-cg"),
    L2Bn: driveFile("15JmJlLpS2-kJ9weNbtkCrqHPrzyL56ak"),
    L2C: driveFile("1-4yO6ahUyM6_pNsgpERua-VpjILqxCGB"),
    L2Cn: driveFile("13q-L1IOiPsBmvKSAMQCWMBSRq5HB6W9I"),
    polygons: driveFolder("1p66mj8pOZdYgxd5d2Q89tE5Jvq_246F4"),
  },
};

export function tlsArchiveHref(standId, code) {
  const entry = tlsArchiveDrive[standId]?.[code];
  if (!entry?.id) return null;
  if (entry.kind === "folder") {
    return `https://drive.google.com/drive/folders/${entry.id}`;
  }
  return `https://drive.google.com/file/d/${entry.id}/view`;
}

/** On-disk size of each published TLS product (cluster, binary GiB/MiB). */
export const tlsArchiveSizes = {
  ruil: {
    RAW: "8.7G", CLIP: "6.6G", L1: "894M", L1n: "906M",
    L2A: "214M", L2An: "216M", L2B: "199M", L2Bn: "201M",
    L2C: "196M", L2Cn: "199M", polygons: "212K",
  },
  alerce: {
    RAW: "9.6G", CLIP: "5.5G", L1: "724M", L1n: "733M",
    L2A: "175M", L2An: "176M", L2B: "161M", L2Bn: "163M",
    L2C: "165M", L2Cn: "167M", polygons: "212K",
  },
  lawson_01: {
    RAW: "8.7G", CLIP: "9.2G", L1: "1.2G", L1n: "1.2G",
    L2A: "297M", L2An: "301M", L2B: "274M", L2Bn: "278M",
    L2C: "279M", L2Cn: "283M", polygons: "212K",
  },
  oregon_01: {
    RAW: "7.8G", CLIP: "5.3G", L1: "725M", L1n: "734M",
    L2A: "177M", L2An: "179M", L2B: "166M", L2Bn: "168M",
    L2C: "165M", L2Cn: "167M", polygons: "208K",
  },
  roble: {
    RAW: "16G", CLIP: "12G", L1: "1.5G", L1n: "1.6G",
    L2A: "367M", L2An: "375M", L2B: "360M", L2Bn: "368M",
    L2C: "337M", L2Cn: "345M", polygons: "220K",
  },
  tepa: {
    RAW: "13G", CLIP: "7.4G", L1: "1.0G", L1n: "1.0G",
    L2A: "240M", L2An: "245M", L2B: "236M", L2Bn: "241M",
    L2C: "231M", L2Cn: "236M", polygons: "220K",
  },
};

export function tlsArchiveSize(standId, code) {
  return tlsArchiveSizes[standId]?.[code] ?? null;
}

/**
 * ULS RAW: one Terra campaign folder on Drive (unique copy).
 * Shared flights: ruil+sequoia, lawson_01+lawson_02. Oregon 02 has no ULS.
 */
export const ulsArchiveCampaigns = {
  "250218_251020_ruil_sequoia": {
    folderId: "1e2_j2tybUu7wqvFLN8RjOLnxbTgZ5GH6",
    size: "2.0G",
  },
  "250219_251210_lawson_1_2": {
    folderId: "1dnGynAvNdWTaiSQiKis_WXMvhy6pJXt2",
    size: "14G",
  },
  "250220_251210_oregon_1": {
    folderId: "1CzY-3yIYNCqIjFOw-Lo0KG9YemUiY0c-",
    size: "38G",
  },
  "250221_251211_rauli_01": {
    folderId: "1zvQffCjTHJ1aV6WuV3AORgZ0RYhcVYXS",
    size: "8.6G",
  },
  "250221_251217_rauli_02": {
    folderId: "1LwChtD7PbqaLZ0siw8Ah1UHwhnxCh6L1",
    size: "17G",
  },
  "250221_260105_roble": {
    folderId: "16R3bu8wQ6a_mDmbahIA2jbsy1z-7j_G9",
    size: "25G",
  },
  "250224_251217_tepa": {
    folderId: "1Dj8wHZDPdcQ_yB6WUhcWyzoIWk-b-KH8",
    size: "15G",
  },
  "250225_251218_alerce": {
    folderId: "1punTWs5b55nHboFuuZK7_KiIZzPxRHk6",
    size: "3.2G",
  },
  "250226_251218_experiment": {
    folderId: "1F7X47vavImnwga40ify2p7bOgx6lUnjl",
    size: "8.5G",
  },
  "250226_251218_nativo01": {
    folderId: "1hRExH49F-zAkQSmk5aJnTKk-vODp4E5Z",
    size: "17G",
  },
  "250226_260105_nativo_02": {
    folderId: "1jHsSkHQ-2p4CLJX_pZebW1nuzSXl0Sts",
    size: "13G",
  },
};

/** Catalog stand id → Terra campaign folder name. */
export const ulsArchiveByStandId = {
  ruil: "250218_251020_ruil_sequoia",
  sequoia: "250218_251020_ruil_sequoia",
  lawson_01: "250219_251210_lawson_1_2",
  lawson_02: "250219_251210_lawson_1_2",
  oregon_01: "250220_251210_oregon_1",
  rauli_01: "250221_251211_rauli_01",
  rauli_02: "250221_251217_rauli_02",
  roble: "250221_260105_roble",
  tepa: "250224_251217_tepa",
  alerce: "250225_251218_alerce",
  nativo_01: "250226_251218_nativo01",
  nativo_02: "250226_260105_nativo_02",
  experimento: "250226_251218_experiment",
};

export function ulsArchiveCampaign(standId) {
  return ulsArchiveByStandId[standId] ?? null;
}

/** Drive folder for ULS/{stand}/raw/ (Terra campaign lives inside). */
export const ulsArchiveRawFolderByStandId = {
  ruil: "1nTDMzw6MGeOhJqWfFvcQ95YlUOxvCKRd",
  sequoia: "1JHEWJkxNbUx_YiXz3HY_4V_TG01Xtf_n",
  lawson_01: "1sR27JhytNIPIIiXqCGZnqqDYT9QMMWQi",
  lawson_02: "1CT5Ch0IoZjVgrFDZcyJe5EbI3e1U3tqb",
  oregon_01: "1XG1Ea5if3ts2mjVdcHBZy1kYuHe9zpBH",
  rauli_01: "19aJ-ozrOhlvpewTRCYFT4JYqPhr4BCVM",
  rauli_02: "1V9QXLN6XGM5fYS5__4NL-xdZrtKfLlmv",
  roble: "1r22wjPHhqut5HqILoyoEXL0BHzZiSfqh",
  tepa: "1Euv_YAKEqP-2Bn75uKPLIpaO0yAfEKMe",
  alerce: "1r9St_cYtk-2IzYs1qOO9sGXc43sB3JgC",
  nativo_01: "1yWqgqgFvzIabZY9bLkqZsZp_xh8UGtwp",
  nativo_02: "1n0-gqBcid45bWn44Kc3-G6I5reAE27-g",
  experimento: "1VD0A8yxcRMbeDs2FZftlVKz7BHLLR6Qv",
};

export function ulsArchiveHref(standId) {
  const id = ulsArchiveRawFolderByStandId[standId];
  return id ? `https://drive.google.com/drive/folders/${id}` : null;
}

export function ulsArchivePath(standId) {
  const camp = ulsArchiveCampaign(standId);
  return camp ? `ULS/${standId}/raw/${camp}/` : null;
}

export function ulsArchiveSize(standId) {
  const camp = ulsArchiveCampaign(standId);
  return camp ? ulsArchiveCampaigns[camp]?.size ?? null : null;
}

/** Public R2 development URL (rate-limited; swap for a custom domain later). */
export const r2PublicBase =
  "https://pub-394184f1266c46d1b234a4b7f925fff2.r2.dev";

export function potreeViewerUrl(metadataPath, title, { gui = false } = {}) {
  const metadataUrl = `${r2PublicBase}${metadataPath}`;
  const q = new URLSearchParams({ metadata: metadataUrl });
  if (title) q.set("title", title);
  if (gui) q.set("gui", "1");
  return `${r2PublicBase}/potree-app/index.html?${q.toString()}`;
}

export function potreeClouds(stand) {
  const p = stand?.potree;
  if (!p) return [];
  const list = Array.isArray(p) ? p : [p];
  const ten = list.filter((c) => /10%/.test(c.label));
  return ten.length ? ten : list;
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
    products: ["RAW", "CLIP", "L1", "L2A", "L2B", "L2C", "field plot"],
    experiments: ["3dfin-vs-treex", "reconstruct"],
    potree: [
      {
        label: "TLS curvature thinning 5%",
        metadataPath: "/stands/ruil/curvature05/metadata.json",
      },
      {
        label: "TLS curvature thinning 10%",
        metadataPath: "/stands/ruil/metadata.json",
      },
    ],
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
    products: ["RAW", "CLIP", "L1", "L2A", "L2B", "L2C", "field plot"],
    experiments: ["3dfin-vs-treex"],
    potree: [
      {
        label: "TLS curvature thinning 5%",
        metadataPath: "/stands/lawson_01/curvature05/metadata.json",
      },
      {
        label: "TLS curvature thinning 10%",
        metadataPath: "/stands/lawson_01/metadata.json",
      },
    ],
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
    products: ["RAW", "CLIP", "L1", "L2A", "L2B", "L2C", "field plot"],
    experiments: ["3dfin-vs-treex"],
    potree: [
      {
        label: "TLS curvature thinning 5%",
        metadataPath: "/stands/oregon_01/curvature05/metadata.json",
      },
      {
        label: "TLS curvature thinning 10%",
        metadataPath: "/stands/oregon_01/metadata.json",
      },
    ],
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
    products: ["RAW", "CLIP", "L1", "L2A", "L2B", "L2C", "field plot"],
    experiments: ["3dfin-vs-treex"],
    potree: [
      {
        label: "TLS curvature thinning 5%",
        metadataPath: "/stands/roble/curvature05/metadata.json",
      },
      {
        label: "TLS curvature thinning 10%",
        metadataPath: "/stands/roble/metadata.json",
      },
    ],
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
    products: ["RAW", "CLIP", "L1", "L2A", "L2B", "L2C", "field plot"],
    experiments: [],
    potree: [
      {
        label: "TLS curvature thinning 10%",
        metadataPath: "/stands/tepa/metadata.json",
      },
    ],
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
    products: ["RAW", "CLIP", "L1", "L2A", "L2B", "L2C", "field plot"],
    experiments: [],
    potree: [
      {
        label: "TLS curvature thinning 10%",
        metadataPath: "/stands/alerce/metadata.json",
      },
    ],
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

export function isPublishedStand(id) {
  return Object.hasOwn(tlsArchiveDirByStandId, id);
}

export const publishedStands = stands.filter((s) => isPublishedStand(s.id));

export function sensorCount(stand) {
  return ["TLS", "MLS", "ULS"].filter((k) => stand.sensors[k]).length;
}

export function totals() {
  const list = publishedStands;
  const n = list.length;
  const withAll = list.filter((s) => sensorCount(s) === 3).length;
  const gb = list.reduce(
    (acc, s) => acc + s.sizesGb.tls + s.sizesGb.mls + s.sizesGb.uls,
    0,
  );
  const ready = list.filter((s) => s.stages.segmented === "done").length;
  return { n, withAll, gb: Math.round(gb), ready };
}
