import json
import re

texto_completo = """1. düri - Persona - Sustantivo
2. chuma - Casa - Sustantivo
3. chani - Agua - Sustantivo
4. kechi - Comida - Sustantivo
5. bwä - Niño - Sustantivo
6. kwö - Hombre - Sustantivo
7. tö - Mujer - Sustantivo
8. jopö - Sol - Sustantivo
9. jia - Luna - Sustantivo
10. rama - Tierra - Sustantivo
11. joni - Fuego - Sustantivo
12. soga - Cielo - Sustantivo
13. ködrö - Árbol - Sustantivo
14. džäbä - Montaña - Sustantivo
15. chäkä - Río - Sustantivo
16. dorä - Camino - Sustantivo
17. kura - Piedra - Sustantivo
18. ngä - Mano - Sustantivo
19. kä - Pie - Sustantivo
20. kuu - Cabeza - Sustantivo
21. döjö - Corazón - Sustantivo
22. sowo - Viento - Sustantivo
23. nibä - Noche - Sustantivo
24. dubä - Día - Sustantivo
25. tso - Pájaro - Sustantivo
26. dëre - Bueno - Adjetivo
27. kwä - Malo - Adjetivo
28. gwä - Frío - Adjetivo
29. kachi - Caliente - Adjetivo
30. duwi - Grande - Adjetivo
31. chubi - Pequeño - Adjetivo
32. doyi - Rápido - Adjetivo
33. bweñe - Felicidad - Adjetivo
34. kwäba - Tristeza - Adjetivo
35. jägü - Mañana - Adjetivo
36. togä - Mediodía - Adjetivo
37. tschö - Tarde - Adjetivo
38. näbä - Flor - Adjetivo
39. mäbä - Carretera - Adjetivo
40. kwinbä - Relámpago - Adjetivo
41. käkwira - Trueno - Adjetivo
42. tsoka - Camisa - Adjetivo
43. kunba - Fruta - Adjetivo
44. bure - Pescado - Adjetivo
45. däbi - Pan - Adjetivo
46. schüe - Frijol - Adjetivo
47. konä - Miel - Adjetivo
48. kõ - Madera - Adjetivo
49. tängä - Humo - Adjetivo
50. kurä - Roca - Adjetivo
51. winä - Comer - Verbo
52. dräkä - Dormir - Verbo
53. tshöna - Correr - Verbo
54. däni - Beber - Verbo
55. käna - Caminar - Verbo
56. jogä - Cantar - Verbo
57. bögä - Leer - Verbo
58. ngänä - Hablar - Verbo
59. shöna - Escribir - Verbo
60. kwaña - Pensar - Verbo
61. nwärä - Mirar - Verbo
62. bäkä - Escuchar - Verbo
63. dirä - Abrir - Verbo
64. tsära - Cerrar - Verbo
65. kwära - Gritar - Verbo
66. pänä - Cocinar - Verbo
67. chägä - Comprar - Verbo
68. dögä - Vender - Verbo
69. ngörä - Construir - Verbo
70. kädrä - Romper - Verbo
71. shägä - Ayudar - Verbo
72. mwära - Llorar - Verbo
73. jugä - Jugar - Verbo
74. tshägä - Cazar - Verbo
75. kwänä - Esperar - Verbo
76. mä - Madre - Sustantivo 
77. pa - Padre - Sustantivo 
78. dütä - Hermano - Sustantivo 
79. dötä - Hermana - Sustantivo 
80. ngibäre - Amigo - Sustantivo 
81. kächi - Hijo - Sustantivo 
82. töpÄ - Vecino - Sustantivo 
83. mumu - Abuela - Sustantivo 
84. pöpö - Abuelo - Sustantivo 
85. niä - Perro - Sustantivo 
86. mishi - Gato - Sustantivo 
87. bure - Pescado - Sustantivo 
88. jamö - Tortuga - Sustantivo 
89. drödrä - Ave - Sustantivo 
90. chämara - Playa - Sustantivo 
91. chorä - Mar - Sustantivo 
92. ngöbe - Pueblo - Sustantivo 
93. bwäkaba - Silla - Sustantivo 
94. dükaba - Mesa - Sustantivo 
95. näbä - Flor - Sustantivo 
96. jöna - Estrella - Sustantivo 
97. kuruma - Carro - Sustantivo 
98. jerö - Dinero - Sustantivo 
99. dümu - Trabajo - Sustantivo 
100. rama - Tierra - Sustantivo
101. Nö - Qué - Interrogativa
102. Kän - Cómo - Interrogativa
103. Mögö - Dónde - Interrogativa
104. Wö - Cuándo - Interrogativa"""

# Inicializar estructuras
json_data = {}
tokens_table = []
indice_final = 0


# crear datas.json
def funcion(cadena, resultado, indice_comienzo):
    indice_contador = indice_comienzo
    estado_actual = "q0"
    cadena_trozos = list(cadena)

    for index, letra in enumerate(cadena_trozos):
        if estado_actual not in json_data:
            estado_actual = "q" + str(indice_contador)
            json_data[estado_actual] = {
                "letters": {},
                "final_state": None,
            }
            indice_contador = indice_contador + 1

        if json_data[estado_actual]:
            if letra not in json_data[estado_actual]["letters"]:
                indice_contador_nuevo = "q" + str(indice_contador)
                json_data[estado_actual] = {
                    **json_data[estado_actual],
                    "letters": {
                        letra: indice_contador_nuevo,
                        **json_data[estado_actual]["letters"],
                    },
                    "final_state": (
                        None
                        if json_data[estado_actual]["final_state"] == None
                        else json_data[estado_actual]["final_state"]
                    ),
                }
                estado_actual = indice_contador_nuevo
            else:
                estado_actual = json_data[estado_actual]["letters"][letra]

        if index + 1 == len(cadena_trozos):
            if estado_actual is json_data:
                json_data[estado_actual] = {
                    **json_data[estado_actual],
                    "final_state": resultado,
                }
            else:
                json_data[estado_actual] = {
                    "letters": {},
                    "final_state": resultado,
                }
                indice_contador = indice_contador + 1

    return indice_contador


lineas = texto_completo.splitlines()
json_data = {}
indice_final = 0

# Separador de cada linea
for linea in lineas:

    linea = re.sub(r"^\d+\.\s*", "", linea).strip()
    partes = linea.split(" - ")

    if len(partes) == 3:
        palabra = partes[0].strip().lower()
        traduccion = partes[1].strip().lower()
        tipo = partes[2].strip()
        indice_final = funcion(palabra, traduccion, indice_final)

# guarda el  data.json
with open("data.json", "w", encoding="utf-8") as json_file:
    json.dump(json_data, json_file, indent=4, ensure_ascii=False)


# creador de tabla de tokens
def tabla_tokens(texto_completo):
    lineas = texto_completo.strip().split("\n")
    tokens = []

    for linea in lineas:
        linea = re.sub(
            r"^\d+\.\s*", "", linea
        ).strip()  # Esto elimina el número y el punto
        partes = linea.split(" - ")

        if len(partes) == 3:
            palabra = partes[0].strip().lower()
            traduccion = partes[1].strip().lower()
            tipo = partes[2].strip()
            descripcion = (
                f"{palabra} es la palabra utilizada para traducir {traduccion}."
            )

            token = {
                "Palabra": palabra,
                "Tipo": tipo,
                "Traduccion": traduccion,
                "Descripcion": descripcion,
            }
            tokens.append(token)
        else:
            print(f"Advertencia: Línea no procesada correctamente: {linea}")
    global tokens_table
    tokens_table = tokens


# Llamar a la función para crear la tabla de tokens
tabla_tokens(texto_completo)
# guarda el tokens.json
with open("tokens.json", "w", encoding="utf-8") as tokens_file:
    json.dump(tokens_table, tokens_file, indent=4, ensure_ascii=False)
