async function addWatermark(file, canvas) {
  if (file.type === "application/pdf") {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText("I.S.S. ARCHIMEDE (BG)      I.S.S. ARCHIMEDE (BG)", {
          x: width / 2 - 250,
          y: height / 2 + 260,
          size: 60,
          color: PDFLib.rgb(0, 0, 1),
          opacity: 0.1,
          rotate: PDFLib.degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: "application/pdf" });
    } catch (error) {
      console.error("Errore durante l'elaborazione del PDF:", error);
      throw error;
    }
  } else if (file.type === "image/png" || file.type === "image/jpeg") {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          ctx.save();

          const K = 40;
          const fontValue = `${
            (img.width * img.height * 250) / 9000000 + K
          }px Arial`;
          ctx.font = fontValue;

          const angleInRadians = -40 * (Math.PI / 180);

          ctx.translate(canvas.width / 2, canvas.height / 2);

          ctx.rotate(angleInRadians);

          ctx.fillStyle = "rgba(0, 0, 139, 0.2)";
          ctx.textAlign = "center";

          ctx.fillText(
            "I.S.S. ARCHIMEDE (BG)      I.S.S. ARCHIMEDE (BG)",
            0,
            0
          );

          ctx.restore();

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(
                new Error("Errore nella creazione del blob dell'immagine")
              );
            }
          }, file.type);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () =>
        reject(new Error("Errore nel caricamento dell'immagine"));
      img.src = URL.createObjectURL(file);
    });
  } else {
    return file;
  }
}