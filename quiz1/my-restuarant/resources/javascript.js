fetch("data/dishes.json")
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById("menuBody");
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}"></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.description}</td>
        <td>${item.category}</td>
        <td>${item.cuisine}</td>
        <td>${item.ingredients}</td>
        <td class="price">${item.price}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error loading menu:", error);
    document.getElementById("menuBody").innerHTML =
      "<tr><td colspan='7'>Could not load menu. Make sure you are using a local server.</td></tr>";
  });
