import { Automaton } from "@/app/page";

function funcionConvert(
  cadena: string,
  resultado: string,
  indiceComienzo: number,
  jsonData: any
) {
  let indiceContador = indiceComienzo;
  let estadoActual = "q0";
  const cadenaTrozo = cadena.split("");

  cadenaTrozo.forEach((letra, index) => {
    if (!jsonData[estadoActual]) {
      estadoActual = "q" + indiceContador;
      jsonData[estadoActual] = {
        letters: {},
        final_state: null,
      };
      indiceContador++;
    }

    if (jsonData[estadoActual]) {
      if (!jsonData[estadoActual].letters[letra]) {
        const indiceContadorNuevo = "q" + indiceContador;
        jsonData[estadoActual] = {
          ...jsonData[estadoActual],
          letters: {
            [letra]: indiceContadorNuevo,
            ...jsonData[estadoActual].letters,
          },
          final_state: jsonData[estadoActual].final_state || null,
        };
        estadoActual = indiceContadorNuevo;
      } else {
        estadoActual = jsonData[estadoActual].letters[letra];
      }
    }

    if (index + 1 === cadenaTrozo.length) {
      if (estadoActual === jsonData) {
        jsonData[estadoActual] = {
          ...jsonData[estadoActual],
          final_state: resultado,
        };
      } else {
        jsonData[estadoActual] = {
          letters: {},
          final_state: resultado,
        };
        indiceContador++;
      }
    }
  });

  return {
    jsonData,
    indiceContador,
  };
}

function procesarCadena(cadena: string, data: Automaton, estado: string[]) {
  const trozos = cadena.split("");

  for (let index = 0; index < trozos.length; index++) {
    const letra = trozos[index];
    if (!data[estado[estado.length - 1]].letters.hasOwnProperty(letra)) {
      return {
        status: false,
        final_state: data[estado[estado.length - 1]].final_state,
        index: index,
      };
    }

    estado.push(data[estado[estado.length - 1]].letters[letra]);

    if (index === trozos.length - 1) {
      return {
        status: data[estado[estado.length - 1]].final_state !== null,
        final_state: data[estado[estado.length - 1]].final_state,
        index: index,
      };
    }
  }
}

export { funcionConvert, procesarCadena };
