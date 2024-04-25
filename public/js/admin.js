const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=id]').value
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value

  const productEl = btn.closest('article')

  fetch('/admin/product/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      console.log(data)
      productEl.parentNode.removeChild(productEl)
    })
    .catch((err) => console.log(err))
}
