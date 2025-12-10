import { useEffect } from "react";

export const useDocumentHead = ({
    title = "",
    description = "",
    keywords = "",
}) => {
    useEffect(() => {
        //TITULO
        if (title) document.title = title;

        //DESCRIPCION
        if (description) {
            let meta = document.querySelector("meta[name='description']");
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("name", "description");
                document.head.appendChild(meta);
            }
            meta.setAttribute("content", description);
        }

        //KEYWORDS
        if (keywords) {
            let meta = document.querySelector("meta[name='keywords']");
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("name", "keywords");
                document.head.appendChild(meta);
            }
            meta.setAttribute("content", keywords);
        }
    }, [title, description, keywords]);
}