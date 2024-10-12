import json

with open("data2.json", "r") as file:
    data = json.load(file)


estado = ["q0"]


def procesar_cadena(cadena):
    trozos = list(cadena)

    for index, letra in enumerate(trozos):
        if letra not in data[estado[-1]]["letters"]:
            return {
                "status": False,
                "final_state": data[estado[-1]]["final_state"],
                "index": index,
            }

        estado.append(data[estado[-1]]["letters"][letra])

        if index == len(trozos) - 1:
            return {
                "status": data[estado[-1]]["final_state"] is not None,
                "final_state": data[estado[-1]]["final_state"],
                "index": index,
            }


print(procesar_cadena("düri"))

print(estado)
