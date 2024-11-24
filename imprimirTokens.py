import json


with open(
    "/Users/antoniozhong/Downloads/Proyecto 2/Proyecto/tokens.json",
    "r",
    encoding="utf-8",
) as file:
    data = json.load(file)

print(f"{'Palabra':<10}{'Tipo':<15}{'Traduccion':<15}{'Descripcion'}")
print("-" * 50)

for item in data:
    palabra = item.get("Palabra", "")
    tipo = item.get("Tipo", "")
    traduccion = item.get("Traduccion", "")
    descripcion = item.get("Descripcion", "")

    print(f"{palabra:<10}{tipo:<15}{traduccion:<15}{descripcion}")
