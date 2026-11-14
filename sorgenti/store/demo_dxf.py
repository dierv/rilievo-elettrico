# Pianta d'esempio (inventata) per gli screenshot degli store: appartamento di circa 100 mq, unità in metri
import ezdxf, json, math
from shapely.geometry import box, Polygon
from shapely.ops import unary_union
ROOMS = { # nome: (x0,y0,x1,y1) filo interno dei muri
 'Soggiorno': (0.3, 4.0, 6.4, 8.7), 'Camera': (6.5, 4.9, 11.7, 8.7), 'Disimpegno': (6.5, 2.6, 8.1, 4.8),
 'Cameretta': (8.2, 0.3, 11.7, 4.8), 'Bagno': (4.5, 0.3, 8.1, 2.5), 'Cucina': (0.3, 0.3, 4.4, 3.9), 'Ingresso': (4.5, 2.6, 6.4, 3.9),
}
DOORS = [ # (x0,y0,x1,y1) aperture nei muri
 (6.38, 4.1, 6.52, 4.9), (6.8, 4.78, 7.7, 4.92), (8.08, 3.0, 8.22, 3.85), (6.7, 2.48, 7.5, 2.62), (4.38, 2.8, 4.52, 3.7),
 (5.0, 3.88, 6.2, 4.02), (5.3, 0.25, 6.2, 0.31), # ingresso: porta blindata sul muro sotto (a sud dell'ingresso? no: muro esterno sotto il bagno)
]
WINS = [(1.2, 8.68, 3.0, 9.0), (3.8, 8.68, 5.4, 9.0), (8.0, 8.68, 10.0, 9.0), (11.68, 1.5, 12.0, 3.2), (0.0, 1.2, 0.32, 2.8), (9.2, 0.0, 10.6, 0.32), (0.0, 5.5, 0.32, 7.3)]
outer = box(0, 0, 12.0, 9.0)
walls = outer.difference(unary_union([box(*r) for r in ROOMS.values()]))
walls = walls.difference(unary_union([box(*d) for d in DOORS] + [box(*w) for w in WINS]))
doc = ezdxf.new('R2010'); doc.header['$INSUNITS'] = 6; msp = doc.modelspace()
for n, c in [('MURI', 7), ('FINESTRE', 4), ('PORTE', 2), ('TESTI', 3), ('ARREDI', 8)]: doc.layers.add(n, color=c)
geoms = walls.geoms if hasattr(walls, 'geoms') else [walls]
for g in geoms:
    for ring in [g.exterior, *g.interiors]: msp.add_lwpolyline(list(ring.coords), close=True, dxfattribs={'layer': 'MURI'})
for x0, y0, x1, y1 in WINS: # finestre: due linee
    if x1 - x0 > y1 - y0: ym = (y0 + y1) / 2; msp.add_line((x0, ym - 0.05), (x1, ym - 0.05), dxfattribs={'layer': 'FINESTRE'}); msp.add_line((x0, ym + 0.05), (x1, ym + 0.05), dxfattribs={'layer': 'FINESTRE'})
    else: xm = (x0 + x1) / 2; msp.add_line((xm - 0.05, y0), (xm - 0.05, y1), dxfattribs={'layer': 'FINESTRE'}); msp.add_line((xm + 0.05, y0), (xm + 0.05, y1), dxfattribs={'layer': 'FINESTRE'})
def door(hx, hy, L, a0): # cerniera, larghezza, angolo di partenza (gradi): anta + arco
    msp.add_line((hx, hy), (hx + L * math.cos(math.radians(a0 + 90)), hy + L * math.sin(math.radians(a0 + 90))), dxfattribs={'layer': 'PORTE'})
    msp.add_arc((hx, hy), L, a0, a0 + 90, dxfattribs={'layer': 'PORTE'})
door(6.45, 4.1, 0.8, 90); door(6.8, 4.85, 0.9, -90); door(8.15, 3.0, 0.85, 90); door(6.7, 2.55, 0.8, 0); door(4.45, 2.8, 0.9, 0); door(5.0, 3.95, 1.2, 0)
for nm, (x0, y0, x1, y1) in ROOMS.items():
    mq = (x1 - x0) * (y1 - y0); t = msp.add_text(f'{nm.upper()}  {mq:.1f} mq'.replace('.', ','), dxfattribs={'layer': 'TESTI', 'height': 0.16})
    t.set_placement(((x0 + x1) / 2, (y0 + y1) / 2 - 0.9 if nm in ('Soggiorno', 'Camera', 'Cameretta', 'Cucina') else y0 + 0.25), align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
# arredi leggeri: cucina, letto, sanitari
for r in [(0.3, 0.3, 4.0, 0.9), (8.5, 6.6, 10.3, 8.7), (9.8, 0.3, 11.7, 1.2), (4.6, 0.35, 5.3, 1.1), (6.6, 0.35, 8.0, 1.05)]:
    msp.add_lwpolyline([(r[0], r[1]), (r[2], r[1]), (r[2], r[3]), (r[0], r[3])], close=True, dxfattribs={'layer': 'ARREDI'})
t = msp.add_text('PIANTA PIANO PRIMO – STATO DI FATTO', dxfattribs={'layer': 'TESTI', 'height': 0.25}); t.set_placement((6.0, 9.6), align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
doc.saveas('/home/claude/store/appartamento_demo.dxf')
json.dump(ROOMS, open('/home/claude/store/rooms.json', 'w'))
print('ok')
