import SidebarPage from "./sidebar/SidebarPage";
import EditorPage from "./editor/EditorPage";
import store from "../util/Store.js";
import { popRouter } from "../util/router.js";

export default class App {
  constructor({ $target }) {
    this.$target = $target;
    this.init();
    popRouter();
  }

  async init() {
    await store.documentsGet();
    this.render();
  }

  render() {
    const { $target } = this;

    new SidebarPage({
      $target,
    });

    new EditorPage({
      $target,
    });
  }
}
