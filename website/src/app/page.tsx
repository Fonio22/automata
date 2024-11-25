"use client";

import { funcionConvert, procesarCadena } from "@/functions/allFunctions";
import { Alert, Button, Card, Table, Tabs, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";
import token_simbolo from "@/utils/tokens_simbolo.json";
import data from "@/utils/data.json";
import { AnalizadorSintactico } from "@/functions/analizadorSintactico";
import data_analizador from "@/utils/data_analizador.json";
import table_token from "@/utils/tabla_token.json";

type State = {
  letters: {
    [key: string]: string;
  };
  final_state: string | null;
};

export type Automaton = {
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
  const [playGroundInput, setPlayGroundInput] = useState("");
  const jsonDataInput = data as Automaton;
  const [result, setResult] = useState<AutomatonStateResult[]>([]);
  const [errors, setErrors] = useState({
    errorPrimero: false,
    errorSegundo: {
      error: false,
      mensaje: "",
    },
  });

  useEffect(() => {
    procesar();
  }, [playGroundInput, jsonDataInput]);

  const procesar = () => {
    if (Object.keys(jsonDataInput).length === 0) return;
    const data = jsonDataInput;

    const cadena_array = playGroundInput
      .toLowerCase()
      .replace("?", "")
      .split(" ");

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

    //Validar si la cadena hay errores
    let errores = false;
    resultadoFinal.forEach((element: any) => {
      console.log("element", element);
      if (element.status !== undefined && !element.status) {
        errores = true;
      }
    });

    if (playGroundInput.trim() !== "") {
      if (errores) {
        setErrors({
          ...errors,
          errorPrimero: true,
          errorSegundo: {
            error: false,
            mensaje: "",
          },
        });
      } else {
        const analizador = new AnalizadorSintactico(
          playGroundInput.toLowerCase().trim().replace("?", "") as string,
          data_analizador as any
        );

        const resultado = analizador.analizar();

        setErrors({
          ...errors,
          errorPrimero: false,
          errorSegundo: {
            error: resultado.valido ? false : true,
            mensaje: resultado.mensaje,
          },
        });
      }
    }

    setResult(resultadoFinal);
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
    const currentResult = result[index]; // Almacena el valor de result[index]

    return (
      <Table.Tr key={index}>
        <Table.Td>{element}</Table.Td>
        <Table.Td>{element.replace("?", "").length}</Table.Td>
        <Table.Td>{currentResult ? currentResult.index + 1 : "N/A"}</Table.Td>
        <Table.Td
          className={currentResult?.status ? "text-green-500" : "text-red-500"}
        >
          {currentResult?.status ? "Aceptado" : "No aceptado"}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div>
      <Navbar />
      <div className="container mx-auto flex justify-between items-start">
        <div className="w-1/2 p-4">
          <Tabs defaultValue="token" className="w-full">
            <Tabs.List>
              <Tabs.Tab value="token">Tabla de Tokens</Tabs.Tab>
              <Tabs.Tab value="simbolos">Tabla de simbolos</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel
              value="token"
              className="max-h-[calc(100vh-8.3rem)] overflow-y-auto"
            >
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                stickyHeader
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Token</Table.Th>
                    <Table.Th>Tipo</Table.Th>
                    <Table.Th>Descripcion</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {table_token.Tokens.map((element, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{element.Token}</Table.Td>
                      <Table.Td>{element.tipo}</Table.Td>
                      <Table.Td>{element.descripcion}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Tabs.Panel>

            <Tabs.Panel
              value="simbolos"
              className="max-h-[calc(100vh-8.3rem)] overflow-y-auto"
            >
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                stickyHeader
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Tipo</Table.Th>
                    <Table.Th>Palabra</Table.Th>
                    <Table.Th>Traduccion</Table.Th>
                    <Table.Th>Descripcion</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {token_simbolo.map((element, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{element.Tipo}</Table.Td>
                      <Table.Td>{element.Palabra}</Table.Td>
                      <Table.Td>{element.Traduccion}</Table.Td>
                      <Table.Td>{element.Descripcion}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
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
            <h1 className="text-2xl font-semibold text-center">Traductor</h1>
            <div className="flex flex-col justify-between items-start gap-3 w-full">
              <div className="w-full">
                <Textarea
                  label="Escriba un texto"
                  description=""
                  placeholder="Escriba un texto para procesar"
                  autosize
                  className="mt-3"
                  classNames={{
                    input: "w-full",
                  }}
                  minRows={7}
                  maxRows={7}
                  onChange={(e) => setPlayGroundInput(e.currentTarget.value)}
                  value={playGroundInput}
                  disabled={Object.keys(jsonDataInput).length === 0}
                />
                <div className="flex justify-between items-center mt-3 gap-3">
                  <Button
                    variant="outline"
                    color="red"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setPlayGroundInput("");
                      setErrors({
                        errorPrimero: false,
                        errorSegundo: { error: false, mensaje: "" },
                      });
                    }}
                  >
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

                {errors.errorSegundo.error ? (
                  <Alert
                    variant="light"
                    color="red"
                    title="Error de sintasis!!"
                    className="w-full mb-4"
                  >
                    {errors.errorSegundo.mensaje}
                  </Alert>
                ) : errors.errorPrimero ? (
                  <Alert
                    variant="light"
                    color="red"
                    title="Error de Lexema!!"
                    className="w-full mb-4"
                  >
                    {result.map((element, index) => {
                      if (element.status === false) {
                        return (
                          <div key={index}>
                            <span className="font-bold">{element.cadena}</span>{" "}
                            - letra: {element.cadena[element.estado.length - 1]}{" "}
                            - posición: {element.estado.length}
                          </div>
                        );
                      }
                    })}
                  </Alert>
                ) : (
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
                )}

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
            Analizador Lexico y Sintactico - Lenguajes Ngäbe
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
