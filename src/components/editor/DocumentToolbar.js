import store from "../../util/Store";
import {
  boldImg,
  underlineImg,
  italicImg,
  justifyLeftImg,
  justifyCenterImg,
  justifyRightImg,
  insertOrderedListImg,
  insertUnorderedListImg,
  strikeThroughImg,
  broomImg,
} from "../../../public/index.js";

export default class DocumentToolbar {
  constructor({ $target }) {
    this.$toolbar = document.createElement("div");
    this.$toolbar.classList.add("document-toolbar");

    this.$toolbar.innerHTML = `
    <button data-action="bold">
      <img src=${boldImg} class="icon"></img>
    </button>
    <button data-action="italic">
      <img src=${italicImg} class="icon"></img>
    </button>
    <button data-action="strikeThrough">
      <img src=${strikeThroughImg} class="icon"></img>
    </button>
    <button data-action="underline">
      <img src=${underlineImg} class="icon"></img>
    </button>
    <button data-action="justifyLeft">
      <img src=${justifyLeftImg} class="icon"></img>
    </button>
    <button data-action="justifyCenter">
      <img src=${justifyCenterImg} class="icon"></img>
    </button>
    <button data-action="justifyRight">
      <img src=${justifyRightImg} class="icon"></img>
    </button>
    
    <button data-action="insertOrderedList">
      <img src=${insertOrderedListImg} class="icon"></img>
    </button>
    <button data-action="insertUnorderedList">
      <img src=${insertUnorderedListImg} class="icon"></img>
    </button>
    <button data-action="insertImage">iI</button>
    <button data-action="removeFormat">
      <img src=${broomImg} class="icon"></img>
    </button>
  `;

    this.initEvent();
    $target.appendChild(this.$toolbar);
  }

  applyStyle(action) {
    document.execCommand(action);
    store.state.selectedStyles = action;
    this.wrapSelectedText();
  }

  getSelectedTextContent() {
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return range.cloneContents();
    }
    return null;
  }

  getSelectedTextStyle() {
    const selection = document.getSelection();
    const node = selection.anchorNode;
    if (node) {
      return getComputedStyle(node.parentElement);
    }
    return null;
  }

  wrapSelectedText() {
    const selection = document.getSelection();
    const range = selection.getRangeAt(0);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  initEvent() {
    this.$toolbar.addEventListener("click", (event) => {
      const { target } = event;
      const action = target.dataset.action;

      if (target.tagName === "BUTTON") {
        this.applyStyle(action);
      }
    });
  }
}
