import json

texto_completo = """1. düri - Persona
2. chuma - Casa
3. chani - Agua
4. kechi - Comida
5. bwä - Niño
6. kwö - Hombre
7. tö - Mujer
8. jopö - Sol
9. jia - Luna
10. rama - Tierra
11. joni - Fuego
12. soga - Cielo
13. dümu - Trabajo
14. ködrö - Árbol
15. džäbä - Montaña
16. chäkä - Río
17. dorä - Camino
18. kura - Piedra
19. ngä - Mano
20. kä - Pie
21. moa - Boca
22. tshä - Ojo
23. shua - Oreja
24. kuu - Cabeza
25. döjö - Corazón
26. sowo - Viento
27. junga - Nube
28. nibä - Noche
29. dubä - Día
30. niä - Perro
31. mishi - Gato
32. tso - Pájaro
33. bura - Pez
34. sädrä - Serpiente
35. düi - Camino
36. win - Año
37. ngibäre - Amigo
38. dütä - Hermano
39. mä - Madre
40. pa - Padre
41. dötä - Hermana
42. kechi - Comida
43. nai - Amor
44. dëre - Bueno
45. kwä - Malo
46. gwä - Frío
47. kachi - Caliente
48. duwi- Grande
49. chubi - Pequeño
50. doyi - Rápido
51. khara - Agua salada
52. khari - Sal
53. dükaba - Mesa
54. bwäkaba - Silla
55. ngöbe - Pueblo
56. drä - Cuerpo
57. böchi - Sangre
58. chämara - Playa
59. chorä - Mar
60. dütä - Hermano
61. dötä - Hermana
62. näbä - Flor
63. jöna - Estrella
64. mäbä - Carretera
65. tskä - Mesa
66. ja - Maíz
67. schüe - Frijol
68. däbi - Pan
69. kunba - Fruta
70. bure - Pescado
71. jamö - Tortuga
72. drödrä - Ave
73. kurä - Roca
74. kõ - Madera
75. tängä - Humo
76. konä - Miel
77. kiki - Llave
78. chi- Camino
79. kwä- Frío
80. kachiri - Calor
81. ngibäro - Amigos
82. düchi- Mano derecha
83. marro - Mano izquierda
84. jägü- Mañana
85. togä- Mediodía
86. tschö - Tarde
87. mumu - Abuela
88. pöpö - Abuelo
89. kädi - Pie derecho
90. marri - Pie izquierdo
91. bweñe - Felicidad
92. kwäba - Tristeza
93. tsawe - Sombra
94. kwinbä - Relámpago
95. käkwira - Trueno
96. tsoka - Camisa
97. kuruma - Carro
98. kächi - Hijo/a
99. töpÄ - Vecino
100. jerö - Dinero"""


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
                    "final_state": None if json_data[estado_actual]['final_state'] == None else json_data[estado_actual]['final_state'],
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


array_text = [line.split(". ", 1)[1] for line in texto_completo.splitlines()]

json_data = {}

indice_final = 0

for text_per_line in array_text:
    cadenas = list(text_per_line)

    cadena1 = ""
    cadena2 = ""
    first = True

    for cadena in cadenas:
        if cadena != " " and cadena != "-":
            if first:
                cadena1 = cadena1 + cadena
            else:
                cadena2 = cadena2 + cadena
        else:
            first = False

    indice_final = funcion(cadena1, cadena2, indice_final)

with open("data.json", "w", encoding="utf-8") as json_file:
    json.dump(json_data, json_file, indent=4, ensure_ascii=False)
