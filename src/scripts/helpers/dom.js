export const $ = ({ context = document, selector }) => {
  // console.log(selector, context);
  if (selector === null) return

  return context.querySelector(selector)
}

export const $$ = ({ context = document, selector }) => {
  if (selector === null) return

  return context.querySelectorAll(selector)
}