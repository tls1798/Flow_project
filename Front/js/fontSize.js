// https://github.com/paerck25/tui-editor-plugin-font-size
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];

function createInput() {
  const form = document.createElement("form");
  form.innerHTML = "<input class='size-input' type='number' />";
  return form;
}

function creaetFontSizeDropDown() {
  const dropDownContainer = document.createElement("div");
  dropDownContainer.className = "drop-down";

  let item = "";

  FONT_SIZES.forEach((size) => {
    item += `<div class="drop-down-item">${size}px</div>`;
  });

  dropDownContainer.innerHTML = item;

  return dropDownContainer;
}

function createToolbarItemOption(dropDown) {
  return {
    name: "font-size",
    text: "F",
    tooltip: "Font Size",
    style: { background: "none", fontSize: "20px" },
    popup: {
      body: dropDown,
      style: { width: "100px", maxHeight: "200px", overflow: "auto" },
    },
  };
}

function createSelection(tr, selection, SelectionClass, openTag, closeTag) {
  const { mapping, doc } = tr;
  const { from, to, empty } = selection;
  const mappedFrom = mapping.map(from) + openTag.length;
  const mappedTo = mapping.map(to) - closeTag.length;

  return empty
    ? SelectionClass.create(doc, mappedTo, mappedTo)
    : SelectionClass.create(doc, mappedFrom, mappedTo);
}

const getSpanAttrs = (selection) => {
  const slice = selection.content();
  let attrs = {
    htmlAttrs: null,
    htmlInline: null,
    classNames: null,
  };
  slice.content.nodesBetween(0, slice.content.size, (node) => {
    if (node.marks.length > 0) {
      node.marks.forEach((mark) => {
        if (mark.type.name === "span") {
          attrs = mark.attrs;
        }
      });
    }
  });
  return attrs;
};

const assignFontSize = (prevStyle, fontSize) => {
  if (prevStyle.includes("font-size")) {
    const styles = prevStyle.split(";");
    const newStyle = styles.map((style) => {
      if (style.includes("font-size")) {
        return `font-size: ${fontSize}`;
      }
      return style;
    });

    return newStyle.join(";");
  }
  return `font-size: ${fontSize}; ${prevStyle}`;
};

function hasClass(element, className) {
  return element.classList.contains(className);
}

export function findParentByClassName(el, className) {
  let currentEl = el;

  while (currentEl && !hasClass(currentEl, className)) {
    currentEl = currentEl.parentElement;
  }

  return currentEl;
}

function getCurrentEditorEl(
  colorPickerEl,
  containerClassName
) {
  const editorDefaultEl = findParentByClassName(
    colorPickerEl,
    `toastui-editor-defaultUI`
  );

  return editorDefaultEl.querySelector<HTMLElement>(
    `.${containerClassName} .ProseMirror`
  );
}

let containerClassName;
let currentEditorEl;

export default function fontSizePlugin(context, options) {
  const { eventEmitter, pmState } = context;

  eventEmitter.listen("focus", (editType) => {
    containerClassName = `toastui-editor-${
      editType === "markdown" ? "md" : "ww"
    }-container`;
  });

  const container = document.createElement("div");

  const inputForm = createInput();

  inputForm.onsubmit = (ev) => {
    ev.preventDefault();
    const input = inputForm.querySelector(".size-input");
    currentEditorEl = getCurrentEditorEl(container, containerClassName);

    eventEmitter.emit("command", "fontSize", {
      fontSize: input.value + "px",
    });
    eventEmitter.emit("closePopup");

    currentEditorEl.focus();
  };

  container.appendChild(inputForm);

  function onClickDropDown(fontSize) {
    currentEditorEl = getCurrentEditorEl(container, containerClassName);

    eventEmitter.emit("command", "fontSize", { fontSize });
    eventEmitter.emit("closePopup");

    // currentEditorEl.focus();
  }

  const dropDown = creaetFontSizeDropDown();

  dropDown.querySelectorAll(".drop-down-item").forEach((el) => {
    el.addEventListener("click", (ev) => {
      const fontSize = (ev.target).innerText;
      onClickDropDown(fontSize);
    });
  });

  container.appendChild(dropDown);

  const toolbarItem = createToolbarItemOption(container);

  return {
    markdownCommands: {
      fontSize: ({ fontSize }, { tr, selection, schema }, dispatch) => {
        if (fontSize) {
          const slice = selection.content();
          const textContent = slice.content.textBetween(
            0,
            slice.content.size,
            "\n"
          );

          const openTag = `<span style="font-size: ${fontSize};">`;
          const closeTag = `</span>`;
          const fontSized = `${openTag}${textContent}${closeTag}`;

          tr.replaceSelectionWith(schema.text(fontSized)).setSelection(
            createSelection(
              tr,
              selection,
              pmState.TextSelection,
              openTag,
              closeTag
            )
          );

          dispatch(tr);

          return true;
        }
        return false;
      },
    },
    wysiwygCommands: {
      fontSize: ({ fontSize }, { tr, selection, schema }, dispatch) => {
        if (fontSize) {
          const { from, to } = selection;

          const prevAttrs = getSpanAttrs(selection);

          const style = assignFontSize(
            prevAttrs.htmlAttrs?.["style"] || "",
            fontSize
          );

          const attrs = prevAttrs
            ? {
                ...prevAttrs,
                htmlAttrs: {
                  ...prevAttrs.htmlAttrs,
                  style: style,
                },
              }
            : {
                htmlAttrs: {
                  style: `font-size: ${fontSize};`,
                },
              };

          const mark = schema.marks.span.create(attrs);

          tr.addMark(from, to, mark);
          dispatch(tr);

          return true;
        }
        return false;
      },
    },
    toolbarItems: [
      {
        groupIndex: 0,
        itemIndex: 4,
        item: toolbarItem,
      },
    ],
    toHTMLRenderers: {
      htmlInline: {
        span(node, { entering }) {
          return entering
            ? {
                type: "openTag",
                tagName: "span",
                attributes: node.attrs,
              }
            : { type: "closeTag", tagName: "span" };
        },
      },
    },
  };
}