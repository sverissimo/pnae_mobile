import { useEffect, useContext, useMemo } from "react";
import { deleteFile, getSignatureFileURI, takePicture } from "@shared/utils";
import { ImageContext } from "@contexts/ImageContext";
import { FileService } from "@services/FileService";
import { RelatorioModel } from "@features/relatorio/types";

export function useManagePictures() {
  const {
    pictureURI,
    setPictureURI,
    pictureURIList,
    setPictureURIList,
    assinaturaURI,
    setAssinaturaURI,
    assinaturaURIList,
    setAssinaturaURIList,
  } = useContext(ImageContext);

  const lastPictureURI = useMemo(
    () => pictureURIList[pictureURIList.length - 1],
    [pictureURIList]
  );
  const lastAssinaturaURI = useMemo(
    () => assinaturaURIList[assinaturaURIList.length - 1],
    [assinaturaURIList]
  );

  useEffect(() => {
    if (lastPictureURI) {
      setPictureURI(lastPictureURI);
    }
    if (lastAssinaturaURI) {
      setAssinaturaURI(lastAssinaturaURI);
    }
  }, [lastAssinaturaURI, lastPictureURI]);

  const handleTakePicture = async () => {
    const pictureURI = await takePicture();
    if (!pictureURI) return;
    setPictureURIList((pictureURIList) => [...pictureURIList, pictureURI]);
  };

  const handleGetSignature = async (signature: string) => {
    const fileURI = await getSignatureFileURI(signature);
    if (!fileURI) return;
    setAssinaturaURIList((assinaturaURIList) => [
      ...assinaturaURIList,
      fileURI,
    ]);
  };

  const downloadPictureAndSignature = async (relatorio: RelatorioModel) => {
    try {
      const updatedURIs = await new FileService().getMissingFilesFromServer(
        relatorio
      );
      const { pictureURI: picURI, assinaturaURI: assURI } = updatedURIs || {};
      const pictureURI = picURI || relatorio.pictureURI;
      const assinaturaURI = assURI || relatorio.assinaturaURI;

      setPicture(pictureURI);
      setAssinatura(assinaturaURI);
    } catch (error) {
      console.log("🚀 useManageRelatorios.ts:234 ~ error:", error);
      throw new Error("Erro ao baixar as imagens do servidor.");
    }
  };

  const clearDiscardedPictures = async (onlyKeepOriginal = false) => {
    const picturesToDelete = [];
    for (const list of [pictureURIList, assinaturaURIList]) {
      if (list.length) {
        const picturesToKeep = onlyKeepOriginal
          ? [list[0]]
          : [list[list.length - 1]];
        const picturesToDeleteInList = list.filter(
          (picture) => !picturesToKeep.includes(picture)
        );
        picturesToDelete.push(...picturesToDeleteInList);
      }
    }
    await Promise.all(picturesToDelete.map(deleteFile));
    return;
  };

  const clearURIs = () => {
    setAssinaturaURI("");
    setPictureURI("");
    setAssinaturaURIList([]);
    setPictureURIList([]);
  };

  const setPicture = (pictureURI: string) => {
    setPictureURIList([pictureURI]);
  };

  const setAssinatura = (assinaturaURI: string) => {
    setAssinaturaURIList([assinaturaURI]);
  };

  return {
    pictureURI,
    pictureURIList,
    setPicture,
    clearDiscardedPictures,
    assinaturaURI,
    setAssinatura,
    assinaturaURIList,
    setAssinaturaURIList,
    handleTakePicture,
    handleGetSignature,
    clearURIs,
    downloadPictureAndSignature,
  };
}
