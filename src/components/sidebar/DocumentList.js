import DocumentListEditor from "./DocumentListEditor.js";
import store from "../../util/Store.js";
import { setItem, getItem } from "../../util/index.js";
import { documentImg, arrowImg } from "../../../public/index.js";
export default class DocumentList {
  constructor({ $target }) {
    this.$list = document.createElement("div");
    this.$list.classList.add("document-list");
    this.state = store.state.documentsTree;
    $target.appendChild(this.$list);

    store.subscribeSidebar(() => {
      this.setState(store.state.documentsTree);
    });

    this.initEvent();
    this.render();
  }

  initEvent() {
    this.$list.addEventListener("click", (event) => {
      const targetDocument = event.target;

      if (
        targetDocument.classList.contains("select-document") ||
        targetDocument.classList.contains("document-list-title")
      ) {
        history.pushState(null, null, `/documents/${targetDocument.id}`);
        store.documentGet(targetDocument.id);
        store.notifySidebar();
      }

      if (targetDocument.classList.contains("toggle-folder")) {
        const $targetParent = targetDocument.parentNode;
        const $subfolder = $targetParent.nextElementSibling;
        const folded = $subfolder.dataset.toggle;

        if (folded === "true") {
          const foldedList = getItem("folded", []);
          if (!foldedList.includes($targetParent.id)) {
            setItem("folded", [...foldedList, $targetParent.id]);
          }

          $subfolder.style.display = "none";
          $subfolder.dataset.toggle = "false";
          targetDocument.style.transform = "rotate(-90deg)";
        } else if (folded === "false") {
          const foldedList = getItem("folded", []);
          foldedList.splice(foldedList.indexOf($targetParent.id), 1);
          setItem("folded", [...foldedList]);

          $subfolder.style.display = "";
          $subfolder.dataset.toggle = "true";
          targetDocument.style.transform = "rotate(0deg)";
        }
      }
    });

    this.$list.addEventListener("mouseover", (event) => {
      const targetDocument = event.target;

      if (targetDocument.documentListEditor) {
        targetDocument.documentListEditor.show();
        return;
      }

      if (targetDocument.matches(".select-document")) {
        const documentListEditor = new DocumentListEditor({
          $target: targetDocument,
        });

        targetDocument.documentListEditor = documentListEditor;

        targetDocument.addEventListener("mouseleave", () => {
          targetDocument.documentListEditor.hide();
        });
      }
    });
  }

  createCustomListString(document, string) {
    let ulStyle = "";
    let imgStyle = "";
    let selectStyle = "";
    const currentDocumentId = String(document.id);
    if (this.foldedList.includes(currentDocumentId)) {
      ulStyle = "style='display:none'";
      imgStyle = "style='transform: rotate(-90deg)'";
    }
    if (this.documentId === currentDocumentId) {
      selectStyle = "style='background-color:lightblue'";
    }

    const nextDocument = document.documents;
    string += `<span id=${currentDocumentId} class="select-document" ${selectStyle}>
      ${
        nextDocument.length
          ? `<img class="toggle-folder" ${imgStyle} src=${arrowImg} alt="arrow.svg"/>`
          : ""
      }
      <img src=${documentImg} alt="document.svg"/>
      <span  id=${currentDocumentId} class="document-list-title">
      ${document.title}
      </span>
      </span>`;
    string += `<ul data-toggle='true' ${ulStyle} class='document-group'>`;
    for (const documents of nextDocument) {
      string = this.createCustomListString(documents, string);
    }
    string += "</ul>";
    return string;
  }

  render() {
    this.foldedList = getItem("folded", []);
    const { pathname } = window.location;
    this.documentId = pathname.split("/")[2];

    const htmlString = this.state.reduce((acc, doc) => {
      return this.createCustomListString(doc, acc);
    }, "");
    this.$list.innerHTML = htmlString;
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }
}

// const post = await request("/documents");
// console.log(post);
