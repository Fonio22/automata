import json

with open(
    "/Users/antoniozhong/Downloads/Proyecto 2/Proyecto/tokens.json",
    "r",
    encoding="utf-8",
) as f:
    palabras_clave = json.load(f)

# Inicializar las categorias
sustantivos = []
adjetivos = []
pronombres = []
verbos = []
preposiciones = []
interrogativas = []

# Recorrer las palabras y agregarlas a las categorias correspondientes
for item in palabras_clave:
    palabra = item["Palabra"]
    tipo = item["Tipo"].lower()

    if tipo == "sustantivo":
        sustantivos.append(palabra)
    elif tipo == "adjetivo":
        adjetivos.append(palabra)
    elif tipo == "pronombre":
        pronombres.append(palabra)
    elif tipo == "verbo":
        verbos.append(palabra)
    elif tipo == "preposicion":
        preposiciones.append(palabra)
    elif tipo == "interrogativa":
        interrogativas.append(palabra)

# Crear el diccionario PALABRAS_CLAVE
PALABRAS_CLAVE = {
    "sustantivos": sustantivos,
    "adjetivos": adjetivos,
    "pronombres": pronombres,
    "verbos": verbos,
    "preposiciones": preposiciones,
    "interrogativas": interrogativas,
}

print(PALABRAS_CLAVE)


# Controla los mensajes de salida
class SintaxisError(Exception):
    def __init__(self, mensaje, palabra, tipo_error, categoria):
        super().__init__(
            f"{mensaje}. Palabra: '{palabra}' ({categoria.capitalize()}). Tipo de error: {tipo_error}."
        )
        self.palabra = palabra
        self.tipo_error = tipo_error
        self.categoria = categoria
        self.palabras_clave = PALABRAS_CLAVE


# Analizador
class AnalizadorSintactico:
    # Inicializa variables
    def __init__(self, oracion, palabras_clave):
        self.oracion = oracion.lower().split()
        self.indice = 0
        self.ultima_palabra = None
        self.palabras_clave = palabras_clave

    def analizar(self):
        try:
            self.oracion_valida()
            print("La oración es válida.")
        except SintaxisError as e:
            print(f"La oración no es válida. {e}")

    # donde empieza la revicison de logica: oracion-> Sujeto | Verbo | adjetivo | Pregunta | Sujeto + Predicado
    def oracion_valida(self):
        if self.indice < len(self.oracion):
            palabra = self.oracion[self.indice]
            if palabra in self.palabras_clave["interrogativas"]:  # Corregido aquí
                self.pregunta()
            elif palabra in self.palabras_clave["verbos"]:
                self.predicado()
            elif (
                palabra in self.palabras_clave["sustantivos"]
                or palabra in self.palabras_clave["pronombres"]
            ):
                self.sujeto()
                self.predicado()
            elif palabra in self.palabras_clave["adjetivos"]:
                self.adjetivo()
            else:
                raise SintaxisError(
                    "Palabra inesperada en la oración",
                    palabra,
                    "posición incorrecta",
                    "desconocida",
                )

    # control del sujeto de la oracion: Sujeto-> Sustantivo| Pronombre | Sustantivo + Adjetivos
    def sujeto(self):
        palabra = self.verificar_palabra(
            "sujeto",
            self.palabras_clave["sustantivos"] + self.palabras_clave["pronombres"],
        )
        if self.indice < len(self.oracion):
            siguiente = self.oracion[self.indice]
            if siguiente in self.palabras_clave["adjetivos"]:
                self.adjetivo()

    # control de predicado: Predicado-> Verbo| Verbo + Sujeto | Verbo + Complemento
    def predicado(self):
        palabra = self.verificar_palabra("predicado", self.palabras_clave["verbos"])

        if self.indice >= len(self.oracion):
            return
        siguiente = self.oracion[self.indice]

        if (
            siguiente
            in self.palabras_clave["sustantivos"] + self.palabras_clave["pronombres"]
        ):
            self.sujeto()

        elif siguiente in self.palabras_clave["preposiciones"]:
            self.complemento()

        elif siguiente in self.palabras_clave["verbos"]:
            raise SintaxisError(
                f"Se esperaba un sujeto o complemento después del verbo '{palabra}'.",
                siguiente,
                "se colocó un segundo verbo",
                "verbo",
            )

    # control de complemento: Complemento-> <complemento> + Sujeto
    def complemento(self):
        palabra = self.verificar_palabra(
            "complemento", self.palabras_clave["preposiciones"]
        )
        self.sujeto()

    # control de pregunta: Pregunta-> <pregunta> + Predicado
    def pregunta(self):
        palabra = self.verificar_palabra(
            "pregunta", self.palabras_clave["interrogativa"]
        )
        self.predicado()

    # ccontrol de adjetivo: Adjetivo-> <adjetivo>
    def adjetivo(self):
        self.verificar_palabra("adjetivo", self.palabras_clave["adjetivos"])

    def verificar_palabra(self, categoria, lista_validas):
        # Verificar si hay palabras restantes en la oración
        if self.indice < len(self.oracion):
            palabra = self.oracion[self.indice]
            if palabra in lista_validas:
                self.indice += 1
                return palabra
            else:
                raise SintaxisError(
                    f"Se esperaba una palabra de tipo {categoria}.",
                    palabra,
                    "palabra no válida",
                    categoria,
                )
        else:
            raise SintaxisError(
                f"Se esperaba una palabra de tipo {categoria}, pero no hay más palabras.",
                None,
                "fin de la oración inesperado",
                categoria,
            )


# Prueba validas de diferentes estructuras validas
oraciones = [
    "bwä",
    "bwä dëre",
    "bwä tshöna",
    "tshöna",
    "tshöna dirä",
    "bwä tshöna tso chubi",
    "bwä dëre tshöna tso chubi",
    "bwä dëre",
]
# main
for oracion in oraciones:
    print(f"Analizando: '{oracion}'")
    analizador = AnalizadorSintactico(oracion, PALABRAS_CLAVE)
    analizador.analizar()
    print("-" * 40)
