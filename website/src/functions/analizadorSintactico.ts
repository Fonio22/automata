// Controla los mensajes de salida
class SintaxisError extends Error {
  palabra: string;
  tipoError: string;
  categoria: string;

  constructor(
    mensaje: string,
    palabra: string,
    tipoError: string,
    categoria: string
  ) {
    super(`${mensaje} Palabra: '${palabra}'. Tipo de error: ${tipoError}.`);
    this.palabra = palabra;
    this.tipoError = tipoError;
    this.categoria = categoria;
  }
}

// Analizador
class AnalizadorSintactico {
  oracion: string[];
  indice: number;
  ultimaPalabra: string | null;
  palabrasClave: {
    interrogativas: string[];
    verbos: string[];
    sustantivos: string[];
    pronombres: string[];
    adjetivos: string[];
    preposiciones: string[];
  };

  // Inicializa variables
  constructor(
    oracion: string,
    palabrasClave: {
      interrogativas: string[];
      verbos: string[];
      sustantivos: string[];
      pronombres: string[];
      adjetivos: string[];
      preposiciones: string[];
    }
  ) {
    this.oracion = oracion.toLowerCase().split(" ");
    this.indice = 0;
    this.ultimaPalabra = null;
    this.palabrasClave = palabrasClave;
  }

  analizar(): { valido: boolean; mensaje: string } {
    try {
      this.oracionValida();
      console.log("La oración es válida.");

      return { valido: true, mensaje: "La oración es válida." };
    } catch (e) {
      if (e instanceof SintaxisError) {
        console.log(`La oración no es válida. ${e.message}`);
        return {
          valido: false,
          mensaje: `La oración no es válida. ${e.message}`,
        };
      } else {
        throw e;
      }
    }
  }

  oracionValida(): void {
    if (this.indice < this.oracion.length) {
      let palabra = this.oracion[this.indice];

      if (this.palabrasClave.interrogativas.includes(palabra)) {
        this.pregunta();
      } else if (this.palabrasClave.verbos.includes(palabra)) {
        this.predicado();
      } else if (
        this.palabrasClave.sustantivos.includes(palabra) ||
        this.palabrasClave.pronombres.includes(palabra)
      ) {
        this.sujeto();

        if (this.indice >= this.oracion.length) return;

        this.predicado();
      } else if (this.palabrasClave.adjetivos.includes(palabra)) {
        this.adjetivo();
      } else {
        throw new SintaxisError(
          "Palabra inesperada en la oración",
          palabra,
          "posición incorrecta",
          "desconocida"
        );
      }
    }
  }

  sujeto(): void {
    let palabra = this.verificarPalabra("sujeto", [
      ...this.palabrasClave.sustantivos,
      ...this.palabrasClave.pronombres,
    ]);
    if (this.indice < this.oracion.length) {
      let siguiente = this.oracion[this.indice];
      if (this.palabrasClave.adjetivos.includes(siguiente)) {
        this.adjetivo();
      }
    }
  }

  predicado(): void {
    let palabra = this.verificarPalabra("predicado", this.palabrasClave.verbos);

    if (this.indice >= this.oracion.length) return;
    let siguiente = this.oracion[this.indice];

    if (
      [
        ...this.palabrasClave.sustantivos,
        ...this.palabrasClave.pronombres,
      ].includes(siguiente)
    ) {
      this.sujeto();
    } else if (this.palabrasClave.preposiciones.includes(siguiente)) {
      this.complemento();
    } else if (this.palabrasClave.verbos.includes(siguiente)) {
      throw new SintaxisError(
        `Se esperaba un sujeto o complemento después del verbo '${palabra}'.`,
        siguiente,
        "se colocó un segundo verbo",
        "verbo"
      );
    }
  }

  complemento(): void {
    let palabra = this.verificarPalabra(
      "complemento",
      this.palabrasClave.preposiciones
    );
    this.sujeto();
  }

  pregunta(): void {
    let palabra = this.verificarPalabra(
      "pregunta",
      this.palabrasClave.interrogativas
    );
    this.predicado();
  }

  adjetivo(): void {
    this.verificarPalabra("adjetivo", this.palabrasClave.adjetivos);
  }

  verificarPalabra(categoria: string, listaValidas: string[]): string {
    if (this.indice < this.oracion.length) {
      let palabra = this.oracion[this.indice];
      if (listaValidas.includes(palabra)) {
        this.indice++;
        return palabra;
      } else {
        throw new SintaxisError(
          `Se esperaba una palabra de tipo ${categoria}.`,
          palabra,
          "palabra no válida",
          categoria
        );
      }
    } else {
      throw new SintaxisError(
        `Se esperaba una palabra de tipo ${categoria}, pero no hay más palabras.`,
        "",
        "fin de la oración inesperado",
        categoria
      );
    }
  }
}

export { AnalizadorSintactico };
