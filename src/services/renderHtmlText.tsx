import React from "react";

// Удаляет <p>, </p>, <br> и превращает текст в <br />-разделённые строки
export const renderHtmlText = (html: string): React.ReactNode =>
  html
    .replace(/<\/p>/g, "</p>\n")         // перенос после </p>
    .replace(/<br\s*\/?>/gi, "\n")       // заменяем <br> на \n
    .replace(/<\/?p>/g, "")              // удаляем <p> и </p>
    .split("\n")                         // разбиваем на строки
    .map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ));