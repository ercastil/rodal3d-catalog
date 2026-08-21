#!/usr/bin/env python3
"""Slim field-tree GPKGs to visor_copas attributes and export WGS84 GeoJSON.

Keeps: id, Name, DAP_cm, Field_ht, Field_rc_n, Field_rc_s, Field_rc_e, Field_rc_o, geometry.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import geopandas as gpd
import pandas as pd
from shapely.geometry import Point

KEEP = [
    "id",
    "Name",
    "DAP_cm",
    "Field_ht",
    "Field_rc_n",
    "Field_rc_s",
    "Field_rc_e",
    "Field_rc_o",
]
STANDS = {
    "ruil": ("ruil", "ruil03.gpkg"),
    "alerce": ("alerce", "alerce3.gpkg"),
    "lawson_01": ("lawson", "lawson3.gpkg"),
    "oregon_01": ("oregon", "oregon3.gpkg"),
    "roble": ("roble", "roble03.gpkg"),
    "tepa": ("tepa", "tepa3.gpkg"),
}


def to_float(value):
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    if pd.isna(value):
        return None
    text = str(value).strip()
    if text.upper() in {"", "NA", "NAN", "NONE", "NULL"}:
        return None
    try:
        number = float(text)
    except ValueError:
        return None
    if not math.isfinite(number):
        return None
    return number


def clamp_radius(value):
    number = to_float(value)
    if number is None:
        return None
    return max(0.0, number)


def as_point_2d(geom):
    if geom is None or geom.is_empty:
        return None
    return Point(geom.x, geom.y)


def slim_frame(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    src_id = gdf["id"] if "id" in gdf.columns else None
    src_name = gdf["Name"] if "Name" in gdf.columns else src_id
    ids = (src_id if src_id is not None else src_name).astype(str)
    names = (src_name if src_name is not None else ids).astype(str)
    data = {
        "id": ids,
        "Name": names,
        "DAP_cm": gdf["DAP_cm"].map(to_float) if "DAP_cm" in gdf.columns else None,
        "Field_ht": gdf["Field_ht"].map(to_float) if "Field_ht" in gdf.columns else None,
        "Field_rc_n": gdf["Field_rc_n"].map(clamp_radius) if "Field_rc_n" in gdf.columns else None,
        "Field_rc_s": gdf["Field_rc_s"].map(clamp_radius) if "Field_rc_s" in gdf.columns else None,
        "Field_rc_e": gdf["Field_rc_e"].map(clamp_radius) if "Field_rc_e" in gdf.columns else None,
        "Field_rc_o": gdf["Field_rc_o"].map(clamp_radius) if "Field_rc_o" in gdf.columns else None,
    }
    geom = gpd.GeoSeries(gdf.geometry.map(as_point_2d), index=gdf.index, crs=gdf.crs)
    out = gpd.GeoDataFrame(data, geometry=geom, crs=gdf.crs)
    return out.dropna(subset=["geometry"])


def write_gpkg(frame: gpd.GeoDataFrame, path: Path, layer: str) -> None:
    tmp = path.with_suffix(".slim.tmp.gpkg")
    if tmp.exists():
        tmp.unlink()
    frame.to_file(tmp, driver="GPKG", layer=layer)
    path.unlink(missing_ok=True)
    tmp.replace(path)


def json_num(value):
    number = to_float(value)
    return number


def feature_props(row, stand_id: str) -> dict:
    return {
        "standId": stand_id,
        "id": str(row["id"]),
        "dap": json_num(row["DAP_cm"]),
        "ht": json_num(row["Field_ht"]),
        "rc_n": json_num(row["Field_rc_n"]),
        "rc_s": json_num(row["Field_rc_s"]),
        "rc_e": json_num(row["Field_rc_e"]),
        "rc_o": json_num(row["Field_rc_o"]),
    }


def main() -> None:
    p = argparse.ArgumentParser(description="Slim field GPKGs and export catalog GeoJSON")
    p.add_argument(
        "--stands-root",
        type=Path,
        default=Path("/home/ecastillo/shared/data/stands"),
    )
    p.add_argument(
        "--geojson-out",
        type=Path,
        required=True,
        help="WGS84 FeatureCollection of field trees",
    )
    p.add_argument(
        "--write-gpkg",
        action="store_true",
        help="Overwrite field GPKGs with slimmed attributes",
    )
    args = p.parse_args()

    features = []
    for stand_id, (folder, filename) in STANDS.items():
        src = args.stands_root / folder / "polygons" / filename
        if not src.exists():
            print(f"missing {src}")
            continue
        layers = gpd.list_layers(src)
        names = layers["name"].tolist()
        layer = next((n for n in names if n != "hull"), names[0])
        gdf = gpd.read_file(src, layer=layer)
        slim = slim_frame(gdf)
        print(f"{stand_id}: {len(slim)} trees layer={layer!r} from {src.name}")
        if args.write_gpkg:
            write_gpkg(slim, src, layer)
            print(f"  wrote slim GPKG {src}")
        wgs = slim.to_crs("EPSG:4326")
        for _, row in wgs.iterrows():
            geom = row.geometry
            features.append(
                {
                    "type": "Feature",
                    "properties": feature_props(row, stand_id),
                    "geometry": {"type": "Point", "coordinates": [geom.x, geom.y]},
                }
            )

    args.geojson_out.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "type": "FeatureCollection",
        "name": "field_trees",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features,
    }
    args.geojson_out.write_text(
        json.dumps(payload, ensure_ascii=False, allow_nan=False) + "\n",
        encoding="utf-8",
    )
    print(f"geojson {len(features)} features -> {args.geojson_out}")


if __name__ == "__main__":
    main()
