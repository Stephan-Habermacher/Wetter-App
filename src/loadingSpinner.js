const loadingSpinner = `
<div class="loading-spinner">
  <div class="loading-spinner__message"></div>
  <div class="lds-ripple">
    <div></div>
     <div></div>
  </div>
</div>`;

export function showLoadingSpinner(container, message = "Lade Wetterdaten...") {
  container.insertAdjacentHTML("afterbegin", loadingSpinner);

  const messageEl = container.querySelector(".loading-spinner__message");
  messageEl.textContent = message;
}

export function hideLoadingSpinner(container) {
  const spinner = container.querySelector(".loading-spinner");
  if (spinner) {
    spinner.remove();
  }
}
