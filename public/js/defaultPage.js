function setDefaultPage() {
    var pageNumberInput = document.getElementById('pageNumber');
    if (pageNumberInput.value === '') {
        pageNumberInput.value = 1;
    }
}