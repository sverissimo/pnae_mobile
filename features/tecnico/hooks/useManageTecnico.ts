import { useCallback, useEffect, useState } from "react";
import { RelatorioModel } from "@features/relatorio/types";
import { UsuarioAPI } from "@infrastructure/api";
import { Usuario } from "@shared/types";
import { debounce } from "@shared/utils";

export function useManageTecnico(relatorio: RelatorioModel) {
  const [extensionistas, setExtensionistas] = useState<Usuario[]>([]);
  const { matriculaOutroExtensionista } = relatorio || {};
  //   const prevValidMatriculasRef = useRef<string[]>([]);
  useEffect(() => {
    if (matriculaOutroExtensionista)
      getExtensionistas(matriculaOutroExtensionista);
  }, [matriculaOutroExtensionista]);

  const getExtensionistas = useCallback(
    debounce(async (matricula: string) => {
      const cleanedMatricula = matricula.replace(/\s/g, "");
      const matriculas = cleanedMatricula
        .split(",")
        .filter((m) => m.length === 5);
      const isValid =
        matriculas.length > 0 &&
        !cleanedMatricula.split(",").some((m) => m.length > 0 && m.length < 5);

      if (!isValid) {
        setExtensionistas((prev) =>
          prev.filter((ext) => matriculas.includes(ext.matricula_usuario))
        );
        return;
      }
      const last = cleanedMatricula.split(",");

      if (
        last[last.length - 1]?.length !== 5 &&
        last[last.length - 1]?.length !== 4
      )
        return;
      //   prevValidMatriculasRef.current = matriculas;
      try {
        const newExtensionistas = await UsuarioAPI.getUsuariosByMatricula(
          matriculas.join(",")
        );
        const sortedExtensionistas = matriculas
          .map((matricula) =>
            newExtensionistas.find((ext) => ext.matricula_usuario === matricula)
          )
          .filter((ext): ext is Usuario => Boolean(ext));

        setExtensionistas(sortedExtensionistas);
      } catch (error) {
        console.error("Failed to fetch extensionistas", error);
      }
    }, 300),
    []
  );

  return {
    extensionistas,
    getExtensionistas,
  };
}
