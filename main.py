import json

with open("data.json", encoding="utf-8") as file:
    data = json.load(file)


def procesar_cadena(cadena):
    palabras = cadena.split()
    resultados = []

    for num_palabra, palabra in enumerate(palabras, start=1):
        estado = ["q0"]
        trozos = list(palabra)
        for index, letra in enumerate(trozos):
            if letra not in data[estado[-1]]["letters"]:
                return {
                    "error": True,
                    "mensaje": f"LexemaError: error en la palabra {num_palabra}, en la letra '{letra}' (posición {index + 1}).",
                }
            estado.append(data[estado[-1]]["letters"][letra])

        if data[estado[-1]]["final_state"] is None:
            return {
                "error": True,
                "mensaje": f"LexemaError: error en la palabra {num_palabra}. No se llegó a un estado final.",
            }
        resultados.append(data[estado[-1]]["final_state"])

    return {"final_states": resultados}


# Prueba con una oracion
resultado = procesar_cadena("üri chuma")
print(resultado)
