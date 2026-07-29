let menu = [
  {
    id: 1,
    title: "Attiéké poisson",
    category: "plat",
    price: 5000,
    img: "img/Attieké.png",
    desc: "Semoule de manioc servie avec poisson braisé et légumes frais."
  },
  {
    id: 2,
    title: "Garba",
    category: "plat",
    price: 1000,
    img: "img/Garba.png",
    desc: "Attiéké avec thon frit, oignons, tomate, et piment."
  },
  {
    id: 3,
    title: "Foutou banane sauce graine",
    category: "plat",
    price: 2000,
    img: "img/Foutou.png",
    desc: "Purée de banane plantain servie avec une sauce à la graine de palme."
  },
  {
    id: 4,
    title: "Alloco",
    category: "entree",
    price: 1000,
    img: "img/Alloco.png",
    desc: "Bananes plantain frites, souvent servies avec piment et poisson frit."
  },
  {
    id: 5,
    title: "Kedjenou de poulet",
    category: "plat",
    price: 3000,
    img: "img/Poulet.png",
    desc: "Ragoût épicé de poulet cuit à l’étouffée avec légumes."
  },
  {
    id: 7,
    title: "FANTA",
    category: "boisson",
    price: 500,
    img: "img/Fanta.png",
    desc: "Boisson gazeuse à l'orange, rafraîchissante."
  },
  {
    id: 8,
    title: "Cocktail de gingembre",
    category: "boisson",
    price: 500,
    img: "img/Cocktail.png",
    desc: "Jus de gingembre frais, relevé et désaltérant."
  },
  {
    id: 10,
    title: "Fromages sucrés",
    category: "dessert",
    price: 500,
    img: "img/Fromage.png",
    desc: "Dessert à base de mil et yaourt sucré, très populaire en Afrique de l’Ouest."
  },
  {
    id: 11,
    title: "Pizza",
    category: "plat",
    price: 4000,
    img:"img/Pizza.jpg",
    desc: "Pizza garnie de sauce tomate, fromage et divers ingrédients au choix."
  },
  {
    id: 12,
    title: "Salade ivoirienne",
    category: "entree",
    price: 1500,
    img: "img/Salade.png",
    desc: "Salade composée de crudités, œufs, thon et vinaigrette maison."
  },
  {
    id: 13,
    title: "Pastels au poisson",
    category: "entree",
    price: 1200,
    img: "img/Pastels.png",
    desc: "Beignets farcis au poisson épicé, servis avec sauce tomate."
  },
  {
    id: 14,
    title: "Brochettes de crevettes",
    category: "entree",
    price: 2000,
    img: "img/Brochette.png",
    desc: "Crevettes grillées marinées aux épices africaines."
  },
  {
    id: 15,
    title: "Bananes flambées",
    category: "dessert",
    price: 1000,
    img: "img/Bananes.png",
    desc: "Bananes plantain caramélisées au sucre et flambées au rhum."
  },
  {
    id: 16,
    title: "Tarte à la noix de coco",
    category: "dessert",
    price: 1200,
    img: "img/Tarte-Coco.png",
    desc: "Tarte sucrée garnie de crème à la noix de coco."
  },
  {
    id: 17,
    title: "Beignets sucrés",
    category: "dessert",
    price: 800,
    img: "img/Beignets.png",
    desc: "Petits beignets moelleux saupoudrés de sucre glace."
  },
  {
    id: 18,
    title: "Jus de bissap",
    category: "boisson",
    price: 500,
    img: "img/Bissap.png",
    desc: "Boisson à base de fleurs d’hibiscus, sucrée et rafraîchissante."
  },
  {
    id: 19,
    title: "Jus de tamarin",
    category: "boisson",
    price: 500,
    img: "img/Tamarin.png",
    desc: "Jus exotique à base de tamarin, acidulé et sucré."
  },
  {
    id: 20,
    title: "Eau minérale",
    category: "boisson",
    price: 300,
    img: "img/Eau.png",
    desc: "Eau minérale naturelle, fraîche."
  },
  {
    id: 21,
    title: "Coca-Cola",
    category: "boisson",
    price: 500,
    img: "img/Coca-Cola.png",
    desc: "Boisson gazeuse au cola, très populaire."
  },
  {
    id: 22,
    title: "Jus d'ananas",
    category: "boisson",
    price: 700,
    img: "img/Ananas.png",
    desc: "Jus d'ananas frais, doux et vitaminé."
  }
];

// Sélecteurs DOM
const sectionCenter = document.getElementById("menu");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const payWaveBtn = document.getElementById("payWaveBtn");
const paymentMessage = document.getElementById("paymentMessage");

// Panier
let cart = [];

// Init
window.addEventListener("DOMContentLoaded", () => {
  filterBtns[0].classList.add("active");
  applyFiltersAndSort();
});

// Filtres
filterBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    filterBtns.forEach(b => b.classList.remove("active"));
    e.currentTarget.classList.add("active");
    applyFiltersAndSort();
  });
});

searchInput.addEventListener("keyup", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);

function applyFiltersAndSort() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = document.querySelector(".filter-btn.active")?.dataset.category || "all";
  const selectedSort = sortSelect.value;

  let filtered = [...menu];

  if (selectedCategory !== "all") {
    filtered = filtered.filter(item => item.category === selectedCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(searchTerm));
  }

  if (selectedSort === "name") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSort === "price") {
    filtered.sort((a, b) => a.price - b.price);
  }

  displayMenuItems(filtered);
}

// Affichage
function displayMenuItems(menuItems) {
  sectionCenter.innerHTML = menuItems.map(item => `
    <article class="menu-item">
      <img src="${item.img}" alt="${item.title}">
      <div class="menu-info">
        <h4>${item.title} - <span>${item.price} FCFA</span></h4>
        <p>${item.desc}</p>
        <button class="add-cart-btn" onclick="addToCart(${item.id})">Ajouter au panier</button>
      </div>
    </article>
  `).join("");
}

// Panier
function addToCart(id) {
  const item = menu.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  displayCart();
}
function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    displayCart();
  }
}

cartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  displayCart();
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

function displayCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Le panier est vide.</p>";
    cartTotal.textContent = "0 FCFA";
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <li class="cart-item">
      <span>${item.title} x${item.quantity}</span>
      <span>${item.price * item.quantity} FCFA</span>
      <button class="remove-item" onclick="removeFromCart(${item.id})">Retirer</button>
    </li>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total + " FCFA";
}

// Paiement Wave
// ...vers la ligne 109...
payWaveBtn.addEventListener("click", () => {
  const phone = document.getElementById("wavePhone").value.trim();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  paymentMessage.textContent = "";

  if (!phone || !phone.startsWith("+225") || phone.length < 10) {
    paymentMessage.textContent = "Numéro Wave invalide.";
    paymentMessage.style.color = "red";
    return;
  }

  if (total <= 0) {
    paymentMessage.textContent = "Panier vide.";
    paymentMessage.style.color = "red";
    return;
  }

  fetch("wave-pay.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, amount: total })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        paymentMessage.textContent = "Paiement en cours. Vérifiez votre téléphone.";
        paymentMessage.style.color = "green";
      } else {
        paymentMessage.textContent = "Erreur : " + (data.error || "Inconnue");
        paymentMessage.style.color = "red";
      }
    })
    .catch(() => {
      paymentMessage.textContent = "Erreur réseau ou serveur.";
      paymentMessage.style.color = "red";
    });
});
document.getElementById('payWaveBtn').addEventListener('click', () => {
  const phone = document.getElementById('wavePhone').value.trim();
  const totalText = document.getElementById('cart-total').textContent;
  const amount = parseInt(totalText.replace(/\D/g, ''));

  const paymentMessage = document.getElementById('paymentMessage');
  paymentMessage.textContent = '';

  if (!phone || !phone.startsWith('+225') || phone.length !== 13) {
    paymentMessage.textContent = 'Veuillez saisir un numéro Wave valide au format +225XXXXXXXX';
    paymentMessage.style.color = 'red';
    return;
  }

  if (!amount || amount <= 0) {
    paymentMessage.textContent = 'Le panier est vide ou le montant est invalide.';
    paymentMessage.style.color = 'red';
    return;
  }

  if (cart.length === 0) {
    paymentMessage.textContent = 'Le panier est vide.';
    paymentMessage.style.color = 'red';
    return;
  }

  fetch('wave-pay.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone, amount, cart })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      paymentMessage.textContent = 'Demande de paiement envoyée avec succès. Vérifiez votre téléphone Wave.';
      paymentMessage.style.color = 'green';
      cart = []; // vider panier si besoin
      displayCart(); // mettre à jour l'affichage panier
    } else {
      paymentMessage.textContent = 'Erreur paiement : ' + (data.error || 'Erreur inconnue');
      paymentMessage.style.color = 'red';
    }
  })
  .catch(() => {
    paymentMessage.textContent = 'Erreur réseau ou serveur.';
    paymentMessage.style.color = 'red';
  });
});
