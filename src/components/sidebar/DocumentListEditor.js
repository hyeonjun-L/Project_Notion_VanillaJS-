import store from "../../util/Store.js";
import DocumentInput from "./DocumentInput.js";
import { getItem, setItem } from "../../util/index.js";
export default class DocumentListEditor {
  constructor({ $target }) {
    this.$editor = document.createElement("span");
    this.$target = $target;
    $target.appendChild(this.$editor);

    this.initEvent();
    this.render();
  }

  async initEvent() {
    this.$editor.addEventListener("click", async (event) => {
      event.preventDefault();
      const action = event.target.dataset.action;
      if (action === "produce") {
        const foldedList = getItem("folded", []);

        if (foldedList.includes(this.$target.id)) {
          foldedList.splice(foldedList.indexOf(this.$target.id), 1);
          setItem("folded", [...foldedList]);
          const $subfolder = this.$target.nextElementSibling;
          const targetDocument = this.$target.firstElementChild;

          $subfolder.style.display = "";
          $subfolder.dataset.toggle = "true";
          targetDocument.style.transform = "rotate(0deg)";
        }

        new DocumentInput({
          $target: this.$target.nextElementSibling,
          targetId: this.$target.id,
        });
      } else if (action === "delete") {
        await store.documentDelete(this.$target.id);
        const currentPath = window.location.pathname;
        const currentId = currentPath.split("/")[2];
        if (currentId === this.$target.id) {
          history.pushState(null, null, "/");
          window.location.reload();
        }
      }
    });
  }

  render() {
    this.$editor.innerHTML = `
        <button data-action="produce">+</button>
        <form style="display: inline-block">
          <button data-action="delete">-</button>
        </form>
    `;
  }

  hide() {
    this.$editor.style.display = "none";
  }

  show() {
    this.$editor.style.display = "inline-block";
  }
}
