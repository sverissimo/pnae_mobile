import { useEffect, useContext, useMemo } from "react";
import { deleteFile, getSignatureFileURI, takePicture } from "@shared/utils";
import { ImageContext } from "@contexts/ImageContext";

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
    return Promise.all(picturesToDelete.map(deleteFile));
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
  };
}
