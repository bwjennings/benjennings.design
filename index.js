const selectElement = document.getElementById("colorScheme");
  const body = document.body;

  selectElement.addEventListener("change", function() {
    const selectedValue = this.value;
    
    if (selectedValue === "system") {
      body.classList.remove("light", "dark");
    } else {
      body.classList.remove("light", "dark");
      body.classList.add(selectedValue);
    }
  });