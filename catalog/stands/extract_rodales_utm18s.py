#!/usr/bin/env python3
"""
Lee un FeatureCollection GeoJSON en WGS84/CRS84 (lon, lat) y exporta polígonos
seleccionados por el campo properties['Nombre'], reproyectados a EPSG:32718 (UTM 18S).

Uso:
  python extract_rodales_utm18s.py
  python extract_rodales_utm18s.py --input limites_rodales.geojson --out-dir ./out
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from pyproj import Transformer
except ImportError as e:  # pragma: no cover
    raise SystemExit(
        "Falta pyproj. Instala con: pip install pyproj"
    ) from e

# Entrada: lon/lat (CRS84 / EPSG:4326 con orden x=lon, y=lat)
SRC_CRS = "EPSG:4326"
DST_CRS = "EPSG:32718"

TARGET_NAMES = frozenset({"lawson", "ruil", "roble", "sequoia"})


def _transform_coords(coords, transformer: Transformer):
    """Recorre anillos GeoJSON (lista anidada de [lon, lat]) y devuelve [easting, northing]."""
    if not coords:
        return coords
    if isinstance(coords[0], (int, float)):
        x, y = float(coords[0]), float(coords[1])
        ex, ny = transformer.transform(x, y)
        return [ex, ny]
    return [_transform_coords(c, transformer) for c in coords]


def reproject_geometry(geom: dict, transformer: Transformer) -> dict:
    gtype = geom["type"]
    if gtype == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": _transform_coords(geom["coordinates"], transformer),
        }
    if gtype == "Polygon":
        return {
            "type": "Polygon",
            "coordinates": _transform_coords(geom["coordinates"], transformer),
        }
    raise ValueError(f"Tipo de geometría no soportado: {gtype}")


def main() -> None:
    default_dir = Path(__file__).resolve().parent
    p = argparse.ArgumentParser(description="Extrae rodales y guarda GeoJSON en EPSG:32718")
    p.add_argument(
        "--input",
        type=Path,
        default=default_dir / "limites_rodales.geojson",
        help="Ruta al GeoJSON de entrada (CRS84 / WGS84)",
    )
    p.add_argument(
        "--out-dir",
        type=Path,
        default=default_dir / "rodales_utm18s",
        help="Directorio de salida para un .geojson por nombre",
    )
    args = p.parse_args()

    data = json.loads(args.input.read_text(encoding="utf-8"))
    if data.get("type") != "FeatureCollection":
        raise SystemExit("Se esperaba type=FeatureCollection")

    transformer = Transformer.from_crs(SRC_CRS, DST_CRS, always_xy=True)
    args.out_dir.mkdir(parents=True, exist_ok=True)

    found: set[str] = set()
    for feat in data.get("features", []):
        props = feat.get("properties") or {}
        nombre = props.get("Nombre")
        if nombre is None:
            continue
        key = str(nombre).strip().lower()
        if key not in TARGET_NAMES:
            continue

        geom = feat.get("geometry")
        if not geom:
            continue

        out_geom = reproject_geometry(geom, transformer)
        out_fc = {
            "type": "FeatureCollection",
            "name": key,
            "crs": {
                "type": "name",
                "properties": {"name": "urn:ogc:def:crs:EPSG::32718"},
            },
            "features": [
                {
                    "type": "Feature",
                    "properties": dict(props),
                    "geometry": out_geom,
                }
            ],
        }
        out_path = args.out_dir / f"{key}.geojson"
        out_path.write_text(
            json.dumps(out_fc, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        found.add(key)

    missing = TARGET_NAMES - found
    if missing:
        print(f"Advertencia: no se encontraron polígonos para: {sorted(missing)}")
    print(f"Escritos en {args.out_dir}: {sorted(found)}")


if __name__ == "__main__":
    main()
