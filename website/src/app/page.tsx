"use client";

import { Button, Card, Table, Tabs, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

type State = {
  letters: {
    [key: string]: string;
  };
  final_state: string | null;
};

type Automaton = {
  [key: string]: State;
};

type AutomatonStateResult = {
  cadena: string;
  estado: string[];
  final_state: string | null;
  index: number;
  status: boolean;
};

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [playGroundInput, setPlayGroundInput] = useState("");
  const [jsonDataInput, setJsonDataInput] = useState({} as Automaton);
  const [result, setResult] = useState<AutomatonStateResult[]>([]);
  const [errors, setErrors] = useState({
    textInput: "",
  });

  useEffect(() => {
    try {
      setErrors({
        textInput: "",
      });

      const arrayText = textInput
        .split("\n")
        .map((line) => line.split(". ")[1]);

      let jsonDataFinal = {} as any;
      let indiceFinal = 0;

      arrayText.forEach((textPerLine) => {
        const cadenas = Array.from(textPerLine);

        let cadena1 = "";
        let cadena2 = "";
        let first = true;

        cadenas.forEach((cadena) => {
          if (cadena !== " " && cadena !== "-") {
            if (first) {
              cadena1 += cadena;
            } else {
              cadena2 += cadena;
            }
          } else {
            first = false;
          }
        });

        const { indiceContador, jsonData } = funcionConvert(
          cadena1,
          cadena2,
          indiceFinal,
          jsonDataFinal
        );
        jsonDataFinal = {
          ...jsonData,
        };
        indiceFinal = indiceContador;
      });

      setJsonDataInput(jsonDataFinal);
    } catch (error) {
      if (textInput !== "") {
        setErrors({
          textInput:
            "Error al procesar el texto, por favor verifique la sintaxis.",
        });
      }
    }
  }, [textInput]);

  useEffect(() => {
    procesar();
  }, [playGroundInput]);

  const procesar = () => {
    const data = jsonDataInput;

    const cadena_array = playGroundInput.split(" ");

    let resultadoFinal = [] as any;

    cadena_array.forEach((element) => {
      const estado = ["q0"];
      const resultado = procesarCadena(element, data, estado);

      resultadoFinal.push({
        ...resultado,
        cadena: element,
        estado: estado,
      });
    });

    setResult(resultadoFinal);
    console.log(resultadoFinal);
  };

  const rows = result.map((element, index) => {
    const cadenaSplit = element.cadena.split("");

    const filas = [];

    for (let i = 0; i <= element.index; i++) {
      filas.push(
        <Table.Tr key={element.cadena + i + index}>
          <Table.Td>{element.estado[i]}</Table.Td>
          <Table.Td>{cadenaSplit[i]}</Table.Td>
          <Table.Td>{element.estado[i + 1]}</Table.Td>
          <Table.Td
            className={
              i === element.index
                ? element.status
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }
          >
            {i === element.index ? element.final_state || "No aceptado" : ""}
          </Table.Td>
        </Table.Tr>
      );
    }

    return filas;
  });

  const rowsExtra = playGroundInput.split(" ").map((element, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{element}</Table.Td>
        <Table.Td>{element.length}</Table.Td>
        <Table.Td>{result[index].index + 1}</Table.Td>
        <Table.Td
          className={result[index].status ? "text-green-500" : "text-red-500"}
        >
          {result[index].status ? "Aceptado" : "No aceptado"}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto flex justify-between items-start">
        <div className="w-1/2 p-4">
          <Tabs defaultValue="text" className="w-full">
            <Tabs.List>
              <Tabs.Tab value="text">Texto</Tabs.Tab>
              <Tabs.Tab value="json">JSON</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="text">
              <Textarea
                label=""
                description="Sintaxis: 1. düri - Persona"
                placeholder="Input placeholder"
                autosize
                className="mt-5"
                minRows={35}
                maxRows={35}
                onChange={(e) => setTextInput(e.currentTarget.value)}
                value={textInput}
                error={errors.textInput}
              />
            </Tabs.Panel>

            <Tabs.Panel value="json">
              <Textarea
                label=""
                description=""
                placeholder=""
                autosize
                className="mt-5"
                minRows={36}
                maxRows={36}
                value={JSON.stringify(jsonDataInput, null, 2)}
                contentEditable={false}
              />
            </Tabs.Panel>
          </Tabs>
        </div>

        <div className="w-1/2 p-4">
          <Card
            shadow="xs"
            padding="lg"
            className="flex flex-col items-start justify-start w-full "
            style={{
              minHeight: "calc(100vh - 6rem)",
            }}
          >
            <h1 className="text-2xl font-semibold text-center">Playground</h1>
            <div className="flex flex-col justify-between items-start gap-3 w-full">
              <div className="w-full">
                <Textarea
                  label="Escriba un texto"
                  description=""
                  placeholder="Input placeholder"
                  autosize
                  className="mt-3"
                  classNames={{
                    input: "w-full",
                  }}
                  minRows={7}
                  maxRows={7}
                  onChange={(e) => setPlayGroundInput(e.currentTarget.value)}
                  value={playGroundInput}
                />
                <div className="flex justify-between items-center mt-3 gap-3">
                  <Button variant="outline" color="red" size="md" fullWidth>
                    Limpiar
                  </Button>
                  <Button
                    variant="outline"
                    color="blue"
                    size="md"
                    fullWidth
                    onClick={procesar}
                  >
                    Procesar
                  </Button>
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-2xl font-semibold text-start mb-4">
                  Resultado
                </h4>

                <div className="border border-gray-200 rounded-lg p-4 w-full mb-4 max-h-32 min-h-32 overflow-y-auto">
                  <div className="flex justify-start items-start gap-1 flex-wrap">
                    {result &&
                      result.map((item, index) => (
                        <span
                          key={index}
                          className={
                            item.status ? "text-black" : "text-gray-500"
                          }
                        >
                          {item.status
                            ? item.final_state
                            : item.cadena.split("").map((letra, index) => (
                                <span
                                  key={index}
                                  className={
                                    item.index === index ? "text-red-500" : ""
                                  }
                                >
                                  {letra}
                                </span>
                              ))}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex justify-between items-start w-full gap-3">
                  <div>
                    <h5>
                      <span className="text-xl font-semibold text-gray-500">
                        Tabla
                      </span>
                    </h5>
                    <div className="max-h-72 overflow-y-auto">
                      <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        stickyHeader
                      >
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Actual</Table.Th>
                            <Table.Th>Letra</Table.Th>
                            <Table.Th>Siguiente</Table.Th>
                            <Table.Th>Resultado</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h5>
                      <span className="text-xl font-semibold text-gray-500">
                        Extra data
                      </span>
                    </h5>
                    <div className="max-h-72 overflow-y-auto">
                      <Table
                        striped
                        highlightOnHover
                        withTableBorder
                        withColumnBorders
                        stickyHeader
                      >
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Palabra</Table.Th>
                            <Table.Th>Cantidad</Table.Th>
                            <Table.Th>Recorrido</Table.Th>
                            <Table.Th>Aceptado</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rowsExtra}</Table.Tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="bg-slate-100 border-gray-200">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">
            JFLAP killer Automata
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-slate-100">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
                aria-current="page"
              >
                Translate
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

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
