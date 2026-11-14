// Ref-counted body scroll lock, so stacked overlays (e.g. a modal over the
// mobile nav) don't unlock the page when only one of them closes.
let locks = 0;
let previousOverflow = "";

export function lockScroll(): () => void {
  if (locks++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) document.body.style.overflow = previousOverflow;
  };
}
