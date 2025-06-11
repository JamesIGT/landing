"use strict";

import { fetchFakerData } from './functions.js';
import { saveVote, getVotes } from './firebase.js';

(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

const renderCards = (data) => {
  const container = document.getElementById('skeleton-container');
  container.innerHTML = ''; // Limpiar contenido previo

  // Iterar sobre los primeros 3 elementos del arreglo
  data.slice(0, 3).forEach(item => {
    const card = `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">${item.title}</h2>
        <p class="text-gray-700 dark:text-gray-300">by ${item.author}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">${item.genre}</p>
        <p class="mt-4 text-gray-800 dark:text-gray-200">${item.content}</p>
      </div>
    `;
    container.innerHTML += card;
  });
};

const enableForm = () => {
    const form = document.getElementById('form_voting');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const select = document.getElementById('select_product');
        if (!select || !select.value) {
            alert('Por favor, selecciona un producto antes de votar.');
            return;
        }

        const productID = select.value;

        const result = await saveVote(productID);

        if (result.success) {
            alert(result.message);
            await displayVotes(); // 🔁 Mostrar resultados actualizados
        } else {
            alert(result.message + '\n' + result.error);
        }

        form.reset();
    });
};

const loadData = async () => {

    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
        } else {
            console.error('Error al obtener los datos:', result.error);
        }
        renderCards(result.body.data);
    } catch (error) {

        console.error('Ocurrió un error inesperado:', error);

    }

};

const displayVotes = async () => {
  const container = document.getElementById('results');
  container.innerHTML = ''; // Limpiar resultados anteriores

  const response = await getVotes();

  if (!response.success || !response.data) {
    container.innerHTML = '<p class="text-red-500">No se pudieron cargar los votos.</p>';
    return;
  }

  // Contar votos por productID
  const voteCounts = {};
  Object.values(response.data).forEach(vote => {
    const product = vote.productID;
    voteCounts[product] = (voteCounts[product] || 0) + 1;
  });

  // Crear tabla HTML
  const table = document.createElement('table');
  table.className = 'min-w-full border-collapse border border-gray-300';

  // Encabezado
  table.innerHTML = `
    <thead>
      <tr class="bg-gray-200">
        <th class="border p-2">Producto</th>
        <th class="border p-2">Total de Votos</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(voteCounts).map(([product, count]) => `
        <tr>
          <td class="border p-2">${product}</td>
          <td class="border p-2 text-center">${count}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  container.appendChild(table);
};

(() => {
    showToast();
    showVideo();
    enableForm();
    loadData();
    displayVotes();
})();